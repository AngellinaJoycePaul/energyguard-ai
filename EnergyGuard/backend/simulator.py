import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from datetime import datetime, timedelta
import random

DEVICES = {
    "AC Unit Floor 1":     {"normal_mean": 120, "normal_std": 10},
    "AC Unit Floor 2":     {"normal_mean": 115, "normal_std": 10},
    "Server Room":         {"normal_mean": 200, "normal_std": 15},
    "Factory Machine A":   {"normal_mean": 320, "normal_std": 20},
    "Office Lights":       {"normal_mean": 30,  "normal_std": 5},
    "HVAC System":         {"normal_mean": 180, "normal_std": 12},
}

def generate_reading(device, hour, inject_anomaly=False):
    config = DEVICES[device]
    mean = config["normal_mean"]
    std = config["normal_std"]
    consumption = round(random.gauss(mean, std), 2)

    is_anomaly = 0
    anomaly_type = None
    severity = None

    if inject_anomaly:
        anomaly_choice = random.choice(["spike", "gradual", "overnight"])

        if anomaly_choice == "spike":
            consumption = round(mean * random.uniform(2.5, 3.5), 2)
            is_anomaly = 1
            anomaly_type = "spike"
            severity = "critical"

        elif anomaly_choice == "gradual":
            consumption = round(mean * random.uniform(1.4, 1.8), 2)
            is_anomaly = 1
            anomaly_type = "gradual"
            severity = "medium"

        elif anomaly_choice == "overnight" and (hour >= 22 or hour <= 5):
            consumption = round(mean * random.uniform(1.3, 1.6), 2)
            is_anomaly = 1
            anomaly_type = "overnight"
            severity = "medium"
        else:
            consumption = round(mean * random.uniform(2.5, 3.5), 2)
            is_anomaly = 1
            anomaly_type = "spike"
            severity = "critical"

    return {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "device": device,
        "consumption": consumption,
        "is_anomaly": is_anomaly,
        "anomaly_type": anomaly_type,
        "severity": severity,
    }

def run_ml_detection(readings):
    df = pd.DataFrame(readings)
    values = df["consumption"].values.reshape(-1, 1)

    model = IsolationForest(contamination=0.15, random_state=42)
    model.fit(values)
    predictions = model.predict(values)

    for i, pred in enumerate(predictions):
        if pred == -1 and readings[i]["is_anomaly"] == 0:
            readings[i]["is_anomaly"] = 1
            readings[i]["anomaly_type"] = "ml_detected"
            config = DEVICES.get(readings[i]["device"], {"normal_mean": 100})
            ratio = readings[i]["consumption"] / config["normal_mean"]
            readings[i]["severity"] = "critical" if ratio > 2 else "medium"

    return readings

def generate_batch(n=20):
    readings = []
    hour = datetime.now().hour

    for _ in range(n):
        device = random.choice(list(DEVICES.keys()))
        inject = random.random() < 0.2
        reading = generate_reading(device, hour, inject_anomaly=inject)
        readings.append(reading)

    readings = run_ml_detection(readings)
    return readings

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from db_utils import insert_reading, get_readings, get_anomalies, clear_readings
from email_service import send_email_alert, get_alert_log
from simulator import generate_batch

app = FastAPI(title="EnergyGuard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize DB on startup
init_db()

def row_to_dict(r):
    return {
        "id":           r[0],
        "timestamp":    r[1],
        "device":       r[2],
        "consumption":  r[3],
        "is_anomaly":   r[4],
        "anomaly_type": r[5],
        "severity":     r[6],
    }

@app.get("/")
def root():
    return {"message": "EnergyGuard API is running ✅"}

@app.get("/simulate")
def simulate():
    readings = generate_batch(n=20)
    for r in readings:
        data = (
            r["timestamp"], r["device"], r["consumption"],
            r["is_anomaly"], r["anomaly_type"], r["severity"]
        )
        insert_reading(data)
        if r["is_anomaly"] == 1:
            send_email_alert(r["device"], r["anomaly_type"], r["severity"], r["consumption"])

    anomaly_count = sum(1 for r in readings if r["is_anomaly"] == 1)
    return {
        "message": f"Simulated {len(readings)} readings",
        "anomalies_found": anomaly_count,
        "readings": readings
    }

@app.get("/data")
def get_data():
    rows = get_readings(limit=50)
    return [row_to_dict(r) for r in rows]

@app.get("/anomalies")
def get_anomaly_data():
    rows = get_anomalies()
    return [row_to_dict(r) for r in rows]

@app.get("/alerts")
def get_alerts():
    rows = get_anomalies()
    alerts = []
    for r in rows:
        d = row_to_dict(r)
        severity = d["severity"] or "low"
        anomaly_type = d["anomaly_type"] or "unknown"
        alerts.append({
            **d,
            "message": f"⚠️ {d['device']} — {anomaly_type.replace('_', ' ').title()} detected ({d['consumption']} kWh)",
            "color": "red" if severity == "critical" else "orange"
        })
    return alerts

@app.get("/email-log")
def email_log():
    return get_alert_log()

@app.get("/stats")
def get_stats():
    rows = get_readings(limit=100)
    data = [row_to_dict(r) for r in rows]
    total = len(data)
    anomalies = sum(1 for r in data if r["is_anomaly"] == 1)
    avg_consumption = round(sum(r["consumption"] for r in data) / total, 2) if total > 0 else 0
    return {
        "total_readings": total,
        "total_anomalies": anomalies,
        "avg_consumption": avg_consumption,
        "devices_monitored": 6,
    }

@app.delete("/clear")
def clear():
    clear_readings()
    return {"message": "All readings cleared"}

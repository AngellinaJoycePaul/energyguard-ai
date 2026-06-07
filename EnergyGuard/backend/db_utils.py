import sqlite3

DB_PATH = "energy.db"

def insert_reading(data):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO energy_readings 
        (timestamp, device, consumption, is_anomaly, anomaly_type, severity)
        VALUES (?, ?, ?, ?, ?, ?)
    """, data)
    conn.commit()
    conn.close()

def get_readings(limit=50):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM energy_readings ORDER BY id DESC LIMIT ?", (limit,))
    data = cursor.fetchall()
    conn.close()
    return data

def get_anomalies():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM energy_readings WHERE is_anomaly = 1 ORDER BY id DESC")
    data = cursor.fetchall()
    conn.close()
    return data

def clear_readings():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM energy_readings")
    conn.commit()
    conn.close()

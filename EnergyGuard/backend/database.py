import sqlite3

def init_db():
    conn = sqlite3.connect("energy.db")
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS energy_readings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT,
        device TEXT,
        consumption REAL,
        is_anomaly INTEGER,
        anomaly_type TEXT,
        severity TEXT
    )
    """)
    conn.commit()
    conn.close()
    print("✅ Database created successfully!")

if __name__ == "__main__":
    init_db()

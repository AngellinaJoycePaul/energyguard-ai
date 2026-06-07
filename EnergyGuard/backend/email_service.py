from datetime import datetime

alert_log = []

def send_email_alert(device, anomaly_type, severity, consumption):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    message = {
        "timestamp": timestamp,
        "to": "energyguard@company.com",
        "subject": f"⚠️ [{severity.upper()}] Anomaly Detected — {device}",
        "body": f"""
ENERGY GUARD ALERT
==================
Device     : {device}
Anomaly    : {anomaly_type.upper()}
Severity   : {severity.upper()}
Consumption: {consumption} kWh
Time       : {timestamp}

Immediate action required!
        """.strip()
    }

    alert_log.append(message)

    print("\n" + "="*50)
    print("📧 EMAIL ALERT SENT")
    print(f"   To      : {message['to']}")
    print(f"   Subject : {message['subject']}")
    print(f"   Device  : {device}")
    print(f"   Type    : {anomaly_type}")
    print(f"   Severity: {severity}")
    print("="*50 + "\n")

    return message

def get_alert_log():
    return alert_log

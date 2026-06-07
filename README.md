# ⚡ EnergyGuard AI
### AI-Powered Real-Time Energy Monitoring & Anomaly Detection System

![Live](https://img.shields.io/badge/Status-Live-brightgreen)
![Python](https://img.shields.io/badge/Python-3.10+-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🎯 Problem Statement

Buildings and industries in Tamil Nadu waste an estimated 20% of electricity to undetected anomalies — AC units left on overnight, motors degrading gradually, servers overheating. Nobody notices until the bill arrives.

For a mid-sized facility consuming 50,000 units monthly, this waste costs **Rs.40,000 to Rs.60,000 every month**.

EnergyGuard finds these leaks automatically, in real time, and tells you exactly what to fix.

---

## 🚀 Live Demo

> Start all 3 services and open `http://localhost:5173`

| Service | Command | Port |
|---|---|---|
| Backend | `uvicorn main:app --reload` | 8000 |
| Bridge | `python bridge.py` | — |
| Frontend | `npm run dev` | 5173 |

---

## 🧠 How It Works
Real UCI Dataset (50,000 readings)
↓
IsolationForest Training (per device model)
↓
Data Simulator → readings every 5 seconds
↓
Two-Layer Anomaly Detection Engine
↓
FastAPI Backend → SQLite Database
↓
React Dashboard → 5 pages, live refresh every 5s
↓
Alert System + Cascade Intelligence + TANGEDCO Report

---

## 🔍 Three Types of Anomalies Detected

| Type | Description | Detection Method |
|---|---|---|
| Sudden Spike | Device consumes 60%+ above normal instantly | IsolationForest (UCI trained) |
| Gradual Overuse | Device slowly creeps above normal over time | Rolling average comparison |
| Overnight Usage | Device running between 10PM and 6AM | Time-based rule engine |

---

## 💡 Key Features

### ⚡ Real-Time Dashboard
- 4 device cards with live kWh and WARNING/NORMAL status
- Live consumption chart with red anomaly markers
- Financial impact forecast — hourly, daily, monthly, yearly loss in ₹
- 24-hour anomaly heatmap

### 🚨 Alert Center
- Complete anomaly audit trail
- Severity badges — CRITICAL / MEDIUM
- Device, type, consumption, timestamp for every alert

### 🔗 Cascade Failure Intelligence *(Never built before)*
- Detects when multiple devices fail simultaneously
- Failure chain visualization — TRIGGER → SPREADING → AT RISK
- Time to critical estimation
- Recommended shutdown sequence to stop cascade propagation
- TANGEDCO maximum demand monitoring

### 🤖 AI Energy Analyst
- Natural language chat interface
- Answers questions using live database data
- "Which device is worst?" / "How much money are we losing?" / "What should I inspect first?"

### ☀️ TANGEDCO Smart Grid Report
- Tariff impact calculator — July 2026 3.16% hike effect in ₹
- Smart meter readiness score — Grade A/B/C/D
- Solar ROI recommender — capacity, cost, payback period, 10-year saving
- 4 TANGEDCO compliance recommendations

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| ML Engine | Python, Scikit-learn, IsolationForest, Pandas, NumPy |
| Dataset | UCI Household Power Consumption — 50,000 real readings |
| Backend | FastAPI, SQLite, Uvicorn |
| Frontend | React 18, Recharts, Axios, Vite |
| Bridge | Python requests, live data loop every 5 seconds |

---

## 📁 Project Structure

energyguard/
├── backend/
│   ├── main.py          # FastAPI server — 5 endpoints
│   ├── database.py      # SQLite schema setup
│   └── energy.db        # Auto-created on first run
├── ml/
│   ├── ml_engine.py     # IsolationForest + rule-based detection
│   ├── simulator.py     # Data generator — 4 devices
│   └── ml_output.json   # Auto-created on run
├── bridge/
│   └── bridge.py        # Live loop — ML → DB → API
└── frontend/
└── src/
├── App.jsx              # Main app — 5 page navigation
├── ChatAssistant.jsx    # AI chat analyst
├── CascadeIntelligence.jsx  # Cascade detection
├── TangedcoReport.jsx   # TANGEDCO policy report
└── HeatMap.jsx          # 24-hour anomaly heatmap

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### Backend Setup
```bash
cd backend
pip install fastapi uvicorn
python database.py
uvicorn main:app --reload
```

### ML Setup
```bash
cd ml
pip install numpy scikit-learn pandas
# Add household_power_consumption.txt from UCI dataset
python simulator.py
```

### Bridge Setup
```bash
cd bridge
pip install requests
python bridge.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm install axios recharts
npm run dev
```

---

## 📊 Dataset

**UCI Individual Household Electric Power Consumption Dataset**
- 2 million readings over 4 years
- Real household electricity data from France
- We use 50,000 readings to train per-device IsolationForest models
- Download from: https://www.kaggle.com/datasets/uciml/electric-power-consumption-data-set

---

## 🏆 What Makes This Innovative

1. **Real data training** — IsolationForest trained on 50,000 real UCI readings. Thresholds are learned, not hardcoded.

2. **Cascade failure intelligence** — No existing open-source energy monitoring system detects device relationship failures and provides shutdown sequences.

3. **TANGEDCO policy integration** — Real July 2026 tariff data, smart meter readiness grading, and solar ROI specific to Tamil Nadu's regulatory environment.

4. **Equipment failure prediction** — 4 consecutive spikes = equipment failure declaration. Real industrial SCADA logic.

---

## 💰 Business Impact

- **Immediate:** Identify and fix Rs.40,000-60,000/month in energy waste
- **Medium-term:** Smart meter readiness before TANGEDCO mandatory rollout
- **Long-term:** Contribution to Tamil Nadu's 2030 demand reduction targets

---

## 👥 Team

Built at **Hackintym'26** — Tamil Nadu, April 2026

| Member | Role |
|---|---|
| Angellina Joyce Paul | ML Engine + Full Stack |
| Aswini | Frontend |
| Preethi | Backend |
| Aparajitha | Integration + Demo |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

> *"EnergyGuard finds electricity leaks in real time, tells you exactly which machine is failing, calculates the rupee loss, and connects your data to Tamil Nadu's 2026 TANGEDCO policy — so you can act before the bill arrives."*

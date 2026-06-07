# ⚡ EnergyGuard — Smart Energy Monitoring & Anomaly Detection

## Overview
AI-powered system that monitors energy consumption across devices and automatically detects anomalies using Machine Learning (IsolationForest) + Rule-based detection.

## Tech Stack
- **Frontend**: React, Recharts, CSS
- **Backend**: Python, FastAPI
- **ML**: Scikit-learn (IsolationForest)
- **Database**: SQLite

## Features
- Real-time energy consumption dashboard
- 3 anomaly types: Spike, Gradual overuse, Overnight usage
- 2-layer detection: ML + Rule-based
- Email alert simulation
- Live charts per device
- Severity classification (Critical / Medium)

---

## How to Run

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python database.py
uvicorn main:app --reload
```
Backend runs at: http://127.0.0.1:8000

### Frontend
```bash
cd frontend
npm install
npm start
```
Frontend runs at: http://localhost:3000

---

## API Endpoints
| Endpoint | Description |
|---|---|
| GET /simulate | Generate 20 readings with anomaly detection |
| GET /data | Get last 50 readings |
| GET /anomalies | Get all anomalies |
| GET /alerts | Get formatted alerts |
| GET /email-log | Get simulated email log |
| GET /stats | Get summary statistics |
| DELETE /clear | Clear all data |

---

## Team
- Member 1: Frontend (React Dashboard)
- Member 2: Backend (FastAPI)
- Member 3: ML & Data Simulation
- Member 4: Integration, Database, Email, Demo

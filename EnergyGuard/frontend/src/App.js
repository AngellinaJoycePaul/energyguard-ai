import React, { useState, useEffect, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceDot
} from "recharts";

const API = "http://127.0.0.1:8000";

const COLORS = {
  bg:       "#0a0f1e",
  card:     "#111827",
  border:   "#1f2937",
  accent:   "#00e5ff",
  danger:   "#ff4444",
  warning:  "#ff9800",
  success:  "#00e676",
  text:     "#e2e8f0",
  muted:    "#64748b",
};

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${COLORS.bg}; font-family: 'DM Sans', sans-serif; color: ${COLORS.text}; }
  
  .app { min-height: 100vh; padding: 24px; }
  
  .header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 32px; padding-bottom: 20px;
    border-bottom: 1px solid ${COLORS.border};
  }
  .logo { font-family: 'Space Mono', monospace; font-size: 22px; color: ${COLORS.accent}; letter-spacing: 2px; }
  .logo span { color: ${COLORS.text}; }
  .status-dot { width: 10px; height: 10px; border-radius: 50%; background: ${COLORS.success}; display: inline-block; margin-right: 8px; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .status-text { font-size: 13px; color: ${COLORS.muted}; }

  .btn {
    padding: 10px 24px; border-radius: 8px; border: none; cursor: pointer;
    font-family: 'Space Mono', monospace; font-size: 13px; font-weight: 700;
    letter-spacing: 1px; transition: all 0.2s;
  }
  .btn-primary { background: ${COLORS.accent}; color: #000; }
  .btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }
  .btn-danger { background: transparent; color: ${COLORS.danger}; border: 1px solid ${COLORS.danger}; margin-left: 10px; }
  .btn-danger:hover { background: ${COLORS.danger}; color: #fff; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .stat-card {
    background: ${COLORS.card}; border: 1px solid ${COLORS.border};
    border-radius: 12px; padding: 20px;
  }
  .stat-label { font-size: 11px; color: ${COLORS.muted}; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
  .stat-value { font-family: 'Space Mono', monospace; font-size: 28px; font-weight: 700; }
  .stat-value.cyan { color: ${COLORS.accent}; }
  .stat-value.red { color: ${COLORS.danger}; }
  .stat-value.green { color: ${COLORS.success}; }
  .stat-value.orange { color: ${COLORS.warning}; }

  .grid-2 { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 16px; }
  
  .card {
    background: ${COLORS.card}; border: 1px solid ${COLORS.border};
    border-radius: 12px; padding: 20px;
  }
  .card-title {
    font-family: 'Space Mono', monospace; font-size: 12px;
    color: ${COLORS.muted}; text-transform: uppercase; letter-spacing: 1.5px;
    margin-bottom: 16px;
  }

  .alert-item {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 12px; border-radius: 8px; margin-bottom: 8px;
    border-left: 3px solid;
  }
  .alert-item.critical { background: rgba(255,68,68,0.08); border-color: ${COLORS.danger}; }
  .alert-item.medium { background: rgba(255,152,0,0.08); border-color: ${COLORS.warning}; }
  .alert-device { font-size: 13px; font-weight: 600; color: ${COLORS.text}; }
  .alert-meta { font-size: 11px; color: ${COLORS.muted}; margin-top: 3px; font-family: 'Space Mono', monospace; }
  .badge {
    font-size: 10px; padding: 2px 8px; border-radius: 4px;
    font-family: 'Space Mono', monospace; font-weight: 700; white-space: nowrap;
  }
  .badge.critical { background: rgba(255,68,68,0.2); color: ${COLORS.danger}; }
  .badge.medium { background: rgba(255,152,0,0.2); color: ${COLORS.warning}; }
  .badge.spike { background: rgba(0,229,255,0.1); color: ${COLORS.accent}; }
  .badge.gradual { background: rgba(255,152,0,0.1); color: ${COLORS.warning}; }
  .badge.overnight { background: rgba(103,58,183,0.2); color: #b39ddb; }
  .badge.ml_detected { background: rgba(0,230,118,0.1); color: ${COLORS.success}; }

  .email-item {
    padding: 10px 12px; border-radius: 8px; margin-bottom: 8px;
    background: rgba(0,229,255,0.04); border: 1px solid rgba(0,229,255,0.1);
    font-size: 12px; font-family: 'Space Mono', monospace; color: ${COLORS.muted};
  }
  .email-subject { color: ${COLORS.text}; font-size: 12px; margin-bottom: 4px; }

  .device-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .device-card {
    padding: 12px; border-radius: 8px;
    background: rgba(255,255,255,0.03); border: 1px solid ${COLORS.border};
  }
  .device-name { font-size: 12px; color: ${COLORS.muted}; margin-bottom: 4px; }
  .device-val { font-family: 'Space Mono', monospace; font-size: 16px; font-weight: 700; color: ${COLORS.accent}; }
  .device-status { font-size: 10px; margin-top: 4px; }
  .device-status.normal { color: ${COLORS.success}; }
  .device-status.anomaly { color: ${COLORS.danger}; }

  .no-data { text-align: center; color: ${COLORS.muted}; font-size: 13px; padding: 40px 0; }
  .loading { color: ${COLORS.accent}; font-family: 'Space Mono', monospace; font-size: 12px; }

  .toast {
    position: fixed; bottom: 24px; right: 24px;
    background: ${COLORS.danger}; color: #fff; padding: 12px 20px;
    border-radius: 8px; font-size: 13px; font-weight: 600;
    animation: slideIn 0.3s ease; z-index: 1000;
  }
  @keyframes slideIn { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }

  .tabs { display: flex; gap: 8px; margin-bottom: 16px; }
  .tab {
    padding: 6px 16px; border-radius: 6px; font-size: 12px; cursor: pointer;
    border: 1px solid ${COLORS.border}; background: transparent; color: ${COLORS.muted};
    font-family: 'Space Mono', monospace; transition: all 0.2s;
  }
  .tab.active { background: ${COLORS.accent}; color: #000; border-color: ${COLORS.accent}; }

  @media (max-width: 768px) {
    .stats-grid { grid-template-columns: 1fr 1fr; }
    .grid-2 { grid-template-columns: 1fr; }
    .device-grid { grid-template-columns: 1fr; }
  }
`;

const DEVICE_LIST = [
  "AC Unit Floor 1", "AC Unit Floor 2",
  "Server Room", "Factory Machine A",
  "Office Lights", "HVAC System"
];

export default function App() {
  const [data, setData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [emails, setEmails] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [tab, setTab] = useState("alerts");
  const [autoRefresh, setAutoRefresh] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = useCallback(async () => {
    try {
      const [d, a, e, s] = await Promise.all([
        fetch(`${API}/data`).then(r => r.json()),
        fetch(`${API}/alerts`).then(r => r.json()),
        fetch(`${API}/email-log`).then(r => r.json()),
        fetch(`${API}/stats`).then(r => r.json()),
      ]);
      setData(d.reverse());
      setAlerts(a);
      setEmails(e);
      setStats(s);
    } catch {
      showToast("❌ Cannot connect to backend!");
    }
  }, []);

  const simulate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/simulate`).then(r => r.json());
      showToast(`⚡ ${res.anomalies_found} anomalies detected!`);
      await fetchAll();
    } catch {
      showToast("❌ Simulation failed!");
    }
    setLoading(false);
  };

  const clearData = async () => {
    await fetch(`${API}/clear`, { method: "DELETE" });
    setData([]); setAlerts([]); setEmails([]);
    setStats({});
    showToast("🗑️ Data cleared");
  };

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => { simulate(); }, 5000);
    return () => clearInterval(id);
  }, [autoRefresh]);

  // Chart data — last 30 readings per device
  const chartData = (() => {
    const byTime = {};
    data.slice(-30).forEach(r => {
      const t = r.timestamp?.slice(11, 16) || "";
      if (!byTime[t]) byTime[t] = { time: t };
      byTime[t][r.device] = r.consumption;
    });
    return Object.values(byTime).slice(-15);
  })();

  // Latest reading per device
  const latestPerDevice = {};
  data.forEach(r => {
    if (!latestPerDevice[r.device]) latestPerDevice[r.device] = r;
  });

  const DEVICE_COLORS = [
    "#00e5ff", "#ff4444", "#00e676", "#ff9800", "#b39ddb", "#f48fb1"
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">

        {/* Header */}
        <div className="header">
          <div>
            <div className="logo">ENERGY<span>GUARD</span></div>
            <div className="status-text" style={{ marginTop: 4 }}>
              <span className="status-dot" />
              AI-Powered Anomaly Detection System
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <label style={{ fontSize: 12, color: COLORS.muted, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} />
              Auto (5s)
            </label>
            <button className="btn btn-primary" onClick={simulate} disabled={loading}>
              {loading ? "SIMULATING..." : "⚡ SIMULATE"}
            </button>
            <button className="btn btn-danger" onClick={clearData}>CLEAR</button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Devices Monitored</div>
            <div className="stat-value cyan">{stats.devices_monitored || 6}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Readings</div>
            <div className="stat-value cyan">{stats.total_readings || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Anomalies Found</div>
            <div className="stat-value red">{stats.total_anomalies || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Avg Consumption</div>
            <div className="stat-value orange">{stats.avg_consumption || 0} <span style={{ fontSize: 14 }}>kWh</span></div>
          </div>
        </div>

        {/* Chart + Devices */}
        <div className="grid-2">
          <div className="card">
            <div className="card-title">⚡ Live Energy Consumption</div>
            {chartData.length === 0 ? (
              <div className="no-data">Click SIMULATE to generate data</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="time" stroke={COLORS.muted} tick={{ fontSize: 11 }} />
                  <YAxis stroke={COLORS.muted} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8 }}
                    labelStyle={{ color: COLORS.muted }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {DEVICE_LIST.map((dev, i) => (
                    <Line
                      key={dev} type="monotone" dataKey={dev}
                      stroke={DEVICE_COLORS[i]} strokeWidth={2}
                      dot={false} connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="card">
            <div className="card-title">📡 Device Status</div>
            <div className="device-grid">
              {DEVICE_LIST.map((dev, i) => {
                const r = latestPerDevice[dev];
                return (
                  <div className="device-card" key={dev}>
                    <div className="device-name">{dev}</div>
                    <div className="device-val" style={{ color: DEVICE_COLORS[i] }}>
                      {r ? `${r.consumption} kWh` : "— kWh"}
                    </div>
                    <div className={`device-status ${r?.is_anomaly ? "anomaly" : "normal"}`}>
                      {r ? (r.is_anomaly ? "⚠ ANOMALY" : "✓ Normal") : "No data"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Alerts + Email Log */}
        <div className="grid-2">
          <div className="card">
            <div className="tabs">
              <button className={`tab ${tab === "alerts" ? "active" : ""}`} onClick={() => setTab("alerts")}>
                ⚠ Alerts ({alerts.length})
              </button>
              <button className={`tab ${tab === "emails" ? "active" : ""}`} onClick={() => setTab("emails")}>
                📧 Email Log ({emails.length})
              </button>
            </div>

            {tab === "alerts" && (
              alerts.length === 0 ? <div className="no-data">No anomalies detected yet</div> :
              alerts.slice(0, 10).map((a, i) => (
                <div className={`alert-item ${a.severity}`} key={i}>
                  <div style={{ flex: 1 }}>
                    <div className="alert-device">{a.device}</div>
                    <div className="alert-meta">{a.timestamp} — {a.consumption} kWh</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                    <span className={`badge ${a.severity}`}>{a.severity?.toUpperCase()}</span>
                    <span className={`badge ${a.anomaly_type}`}>{a.anomaly_type?.replace("_", " ")}</span>
                  </div>
                </div>
              ))
            )}

            {tab === "emails" && (
              emails.length === 0 ? <div className="no-data">No emails sent yet</div> :
              emails.slice(0, 8).map((e, i) => (
                <div className="email-item" key={i}>
                  <div className="email-subject">{e.subject}</div>
                  <div style={{ color: COLORS.muted, fontSize: 11 }}>{e.timestamp} → {e.to}</div>
                </div>
              ))
            )}
          </div>

          <div className="card">
            <div className="card-title">📊 Anomaly Breakdown</div>
            {alerts.length === 0 ? (
              <div className="no-data">Run simulation first</div>
            ) : (
              <>
                {["spike", "gradual", "overnight", "ml_detected"].map(type => {
                  const count = alerts.filter(a => a.anomaly_type === type).length;
                  const pct = alerts.length ? Math.round((count / alerts.length) * 100) : 0;
                  const colors = { spike: COLORS.danger, gradual: COLORS.warning, overnight: "#b39ddb", ml_detected: COLORS.success };
                  return (
                    <div key={type} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span className={`badge ${type}`}>{type.replace("_", " ").toUpperCase()}</span>
                        <span style={{ fontFamily: "Space Mono", fontSize: 12, color: COLORS.muted }}>{count} ({pct}%)</span>
                      </div>
                      <div style={{ background: COLORS.border, borderRadius: 4, height: 6 }}>
                        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: colors[type], transition: "width 0.5s" }} />
                      </div>
                    </div>
                  );
                })}
                <div style={{ marginTop: 20, padding: "12px", background: "rgba(0,229,255,0.04)", borderRadius: 8, border: `1px solid rgba(0,229,255,0.1)` }}>
                  <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4 }}>Detection Method</div>
                  <div style={{ fontSize: 12, color: COLORS.text }}>IsolationForest ML + Rule-Based (2-layer)</div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

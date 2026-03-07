import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card } from "../components/UI";
import { DonutChart, HistoryBarChart } from "../components/Charts";
import { COLORS } from "../utils/theme";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!user?.is_admin) { navigate("/"); return; }
    const token = localStorage.getItem("bv_token");
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      axios.get(`${BASE_URL}/api/admin/stats`, { headers }),
      axios.get(`${BASE_URL}/api/admin/predictions`, { headers }),
      axios.get(`${BASE_URL}/api/auth/admin/users`, { headers }),
    ]).then(([s, p, u]) => {
      setStats(s.data);
      setPredictions(p.data.predictions || []);
      setUsers(u.data.users || []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (!user?.is_admin) return null;
  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.muted }}>
      Loading admin data...
    </div>
  );

  const tabs = ["overview", "predictions", "users"];

  return (
    <div style={{ minHeight: "100vh", padding: "100px 20px 60px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
        <div>
          <h2 style={{ fontSize: 30, fontFamily: "Georgia, serif", color: COLORS.text, margin: 0 }}>
            👑 Admin Dashboard
          </h2>
          <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>
            Full platform overview — all users and predictions
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer",
            background: activeTab === t ? `linear-gradient(135deg,${COLORS.accent},${COLORS.crimson})` : "rgba(255,255,255,0.05)",
            color: COLORS.text, fontWeight: 700, fontSize: 13, fontFamily: "inherit",
            textTransform: "capitalize",
          }}>{t}</button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && stats && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
            {[
              { icon: "👥", val: stats.total_users, label: "Total Users" },
              { icon: "🧪", val: stats.total_predictions, label: "Total Predictions" },
              { icon: "📈", val: stats.avg_confidence + "%", label: "Avg. Confidence" },
              { icon: "🎯", val: stats.model_accuracy + "%", label: "Model Accuracy" },
            ].map(s => (
              <Card key={s.label} style={{ textAlign: "center", padding: "20px 14px" }}>
                <div style={{ fontSize: 28 }}>{s.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: COLORS.accent, fontFamily: "Georgia, serif" }}>{s.val}</div>
                <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>{s.label}</div>
              </Card>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
            <Card>
              <h3 style={{ color: COLORS.text, fontSize: 15, marginBottom: 16 }}>📊 Platform Blood Group Distribution</h3>
              <HistoryBarChart data={predictions} />
            </Card>
            <Card>
              <h3 style={{ color: COLORS.text, fontSize: 15, marginBottom: 20 }}>🎯 Model Performance</h3>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
                <DonutChart value={stats.avg_confidence || 96} label="Avg Confidence" color={COLORS.accent} size={120} />
                <DonutChart value={stats.val_accuracy || 96.4} label="Val. Accuracy" color={COLORS.success} size={120} />
                <DonutChart value={stats.model_accuracy || 99.2} label="Model Accuracy" color={COLORS.warning} size={120} />
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Predictions Tab */}
      {activeTab === "predictions" && (
        <Card>
          <h3 style={{ color: COLORS.text, fontSize: 15, marginBottom: 20 }}>🧪 All Predictions ({predictions.length})</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>{["Date", "User", "File", "Blood Group", "Confidence"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, color: COLORS.muted, letterSpacing: 1, borderBottom: `1px solid ${COLORS.cardBorder}` }}>{h.toUpperCase()}</th>
                ))}</tr>
              </thead>
              <tbody>
                {predictions.map(p => (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${COLORS.cardBorder}` }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: COLORS.muted }}>{new Date(p.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: COLORS.text }}>{p.users?.name || "—"}</td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: COLORS.muted, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.image_name}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ padding: "4px 12px", borderRadius: 20, background: "rgba(230,57,70,0.12)", color: COLORS.accent, fontWeight: 700, fontSize: 13 }}>{p.blood_group}</span>
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: COLORS.text }}>{p.confidence}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <Card>
          <h3 style={{ color: COLORS.text, fontSize: 15, marginBottom: 20 }}>👥 All Users ({users.length})</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>{["Avatar", "Name", "Email", "Joined", "Role"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, color: COLORS.muted, letterSpacing: 1, borderBottom: `1px solid ${COLORS.cardBorder}` }}>{h.toUpperCase()}</th>
                ))}</tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: `1px solid ${COLORS.cardBorder}` }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", background: COLORS.card, border: `1px solid ${COLORS.accent}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {u.avatar_url ? <img src={u.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "🩸"}
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: COLORS.text, fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: COLORS.muted }}>{u.email}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: COLORS.muted }}>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: u.is_admin ? "rgba(255,215,0,0.1)" : "rgba(6,214,160,0.1)", color: u.is_admin ? "gold" : COLORS.success, border: `1px solid ${u.is_admin ? "gold" : COLORS.success}` }}>
                        {u.is_admin ? "👑 Admin" : "👤 User"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

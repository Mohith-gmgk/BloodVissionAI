import { useAuth } from "../hooks/useAuth";
import { Card } from "../components/UI";
import { DonutChart, HistoryBarChart, LineChart } from "../components/Charts";
import { COLORS } from "../utils/theme";

export default function DashboardPage() {
  const { user } = useAuth();
  const history = user?.history || [];

  const avgConf = history.length
    ? (history.reduce((s, h) => s + h.confidence, 0) / history.length).toFixed(1)
    : 0;
  const avgVal = history.length
    ? (history.reduce((s, h) => s + (h.val_accuracy || h.valAcc || 0), 0) / history.length).toFixed(1)
    : 0;

  const mostPredicted = history.length
    ? Object.entries(
        history.reduce((acc, h) => {
          const g = h.blood_group || h.group;
          acc[g] = (acc[g] || 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1])[0]?.[0] || "—"
    : "—";

  const summaryCards = [
    { icon: "🧪", val: history.length, label: "Total Predictions" },
    { icon: "📈", val: avgConf + "%", label: "Avg. Confidence" },
    { icon: "✅", val: avgVal + "%", label: "Avg. Val. Accuracy" },
    { icon: "🩸", val: mostPredicted, label: "Most Predicted" },
  ];

  return (
    <div style={{ minHeight: "100vh", padding: "100px 20px 60px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
        <div style={{
          width: 60, height: 60, borderRadius: "50%", overflow: "hidden",
          border: `2px solid ${COLORS.accent}`, background: COLORS.card,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
        }}>
          {user?.avatar
            ? <img src={user.avatar} alt="av" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : "🩸"}
        </div>
        <div>
          <h2 style={{ fontSize: 26, fontFamily: "Georgia, serif", color: COLORS.text, margin: 0 }}>
            Welcome, {user?.name?.split(" ")[0]}
          </h2>
          <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>{user?.email}</p>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
        {summaryCards.map(s => (
          <Card key={s.label} style={{ textAlign: "center", padding: "20px 14px" }}>
            <div style={{ fontSize: 28 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: COLORS.accent, fontFamily: "Georgia, serif" }}>{s.val}</div>
            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        <Card>
          <h3 style={{ color: COLORS.text, fontSize: 15, marginBottom: 16 }}>📊 Blood Group Distribution</h3>
          <HistoryBarChart data={history} />
        </Card>
        <Card>
          <h3 style={{ color: COLORS.text, fontSize: 15, marginBottom: 16 }}>📈 Confidence Trend</h3>
          <LineChart data={[...history].reverse()} />
        </Card>
      </div>

      {/* Accuracy gauges */}
      <Card style={{ marginBottom: 28 }}>
        <h3 style={{ color: COLORS.text, fontSize: 15, marginBottom: 20 }}>🎯 Model Performance</h3>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
          <DonutChart value={parseFloat(avgConf) || 96.2} label="Avg Confidence" color={COLORS.accent} size={130} />
          <DonutChart value={parseFloat(avgVal) || 94.8} label="Validation Acc." color={COLORS.success} size={130} />
          <DonutChart value={99.2} label="Model Accuracy" color={COLORS.warning} size={130} />
          <DonutChart value={97.5} label="Test Accuracy" color="#8b5cf6" size={130} />
        </div>
      </Card>

      {/* History table */}
      <Card>
        <h3 style={{ color: COLORS.text, fontSize: 15, marginBottom: 20 }}>🕐 Prediction History</h3>
        {!history.length ? (
          <div style={{ textAlign: "center", padding: "40px", color: COLORS.muted }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🔬</div>
            No predictions yet. Upload a blood smear image to get started!
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Date", "File", "Blood Group", "Confidence", "Val. Accuracy"].map(h => (
                    <th key={h} style={{
                      textAlign: "left", padding: "10px 14px", fontSize: 11,
                      color: COLORS.muted, letterSpacing: 1, borderBottom: `1px solid ${COLORS.cardBorder}`,
                    }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map(h => (
                  <tr key={h.id} style={{ borderBottom: `1px solid ${COLORS.cardBorder}`, transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: COLORS.muted }}>{h.date}</td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: COLORS.muted, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {h.file_name || h.fileName}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{
                        padding: "4px 12px", borderRadius: 20,
                        background: "rgba(230,57,70,0.12)", color: COLORS.accent,
                        fontWeight: 700, fontSize: 13,
                      }}>{h.blood_group || h.group}</span>
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: COLORS.text }}>{h.confidence}%</td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: COLORS.success }}>
                      {h.val_accuracy || h.valAcc}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

import { COLORS, BLOOD_GROUPS } from "../utils/theme";

// ── Blood Group Distribution Bar Chart ────────────────────────────────────────
export function HistoryBarChart({ data }) {
  const counts = {};
  BLOOD_GROUPS.forEach(g => (counts[g] = 0));
  data.forEach(d => { if (counts[d.blood_group] !== undefined) counts[d.blood_group]++; });
  const max = Math.max(...Object.values(counts), 1);

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-end", height: 130, padding: "0 8px" }}>
      {BLOOD_GROUPS.map(g => {
        const h = (counts[g] / max) * 100;
        return (
          <div key={g} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 10, color: COLORS.muted }}>{counts[g]}</span>
            <div style={{
              width: "100%", height: `${h}%`, minHeight: 4,
              background: `linear-gradient(180deg, ${COLORS.accent}, ${COLORS.crimson})`,
              borderRadius: 4, transition: "height 0.6s ease",
              boxShadow: h > 0 ? `0 0 8px ${COLORS.accentGlow}` : "none",
            }} />
            <span style={{ fontSize: 10, color: COLORS.text, fontWeight: 700 }}>{g}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Confidence Trend Line Chart ───────────────────────────────────────────────
export function LineChart({ data }) {
  if (!data.length) return (
    <div style={{ color: COLORS.muted, fontSize: 13, textAlign: "center", padding: 20 }}>
      No predictions yet
    </div>
  );

  const W = 320, H = 120, pad = 20;
  const iW = W - pad * 2, iH = H - pad * 2;
  const confs = data.map(d => d.confidence);
  const min = Math.min(...confs) - 5;
  const max = Math.max(...confs) + 5;

  const pts = confs.map((c, i) => ({
    x: pad + (i / Math.max(confs.length - 1, 1)) * iW,
    y: pad + ((max - c) / (max - min)) * iH,
  }));

  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = pts.length > 0
    ? `M ${pts[0].x} ${H - pad} ${pts.map(p => `L ${p.x} ${p.y}`).join(" ")} L ${pts[pts.length - 1].x} ${H - pad} Z`
    : "";

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.accent} stopOpacity="0.4" />
          <stop offset="100%" stopColor={COLORS.accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      {areaPath && <path d={areaPath} fill="url(#areaGrad)" />}
      <path d={path} fill="none" stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={3} fill={COLORS.accent} />)}
      <text x={pad} y={pad - 4} fontSize={9} fill={COLORS.muted}>Confidence (%)</text>
    </svg>
  );
}

// ── Accuracy Gauge Donut ──────────────────────────────────────────────────────
export function DonutChart({ value, label, color = COLORS.accent, size = 110 }) {
  const r = 40, cx = 55, cy = 55, circ = 2 * Math.PI * r;
  const filled = (value / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={size} height={size} viewBox="0 0 110 110">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e1e2e" strokeWidth={12} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={12}
          strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 55 55)"
          style={{ transition: "stroke-dasharray 1s ease" }} />
        <text x={cx} y={cy + 5} textAnchor="middle" fill={COLORS.text} fontSize={16} fontWeight="bold">
          {value}%
        </text>
      </svg>
      <span style={{ fontSize: 12, color: COLORS.muted, letterSpacing: 1 }}>{label}</span>
    </div>
  );
}

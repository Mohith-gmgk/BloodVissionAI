import { useState } from "react";
import { COLORS } from "../utils/theme";

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, style = {}, glow = false, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: "rgba(18,18,26,0.85)",
      backdropFilter: "blur(20px)",
      border: `1px solid ${glow ? COLORS.accent : COLORS.cardBorder}`,
      borderRadius: 20,
      padding: "28px 32px",
      boxShadow: glow
        ? `0 0 30px ${COLORS.accentGlow}, 0 8px 40px rgba(0,0,0,0.5)`
        : "0 8px 40px rgba(0,0,0,0.4)",
      ...style,
    }}>{children}</div>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
export function Btn({ children, onClick, variant = "primary", style = {}, disabled = false, type = "button" }) {
  const base = {
    padding: "12px 28px", borderRadius: 12, border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 700, fontSize: 14, letterSpacing: 0.5,
    transition: "all 0.2s", fontFamily: "inherit", opacity: disabled ? 0.5 : 1,
  };
  const variants = {
    primary: {
      background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.crimson})`,
      color: "#fff", boxShadow: `0 4px 20px ${COLORS.accentGlow}`,
    },
    ghost: {
      background: "transparent", color: COLORS.text,
      border: `1px solid ${COLORS.cardBorder}`,
    },
    success: {
      background: "linear-gradient(135deg, #06d6a0, #04a87e)", color: "#fff",
    },
    danger: {
      background: "linear-gradient(135deg, #e63946, #9d0208)", color: "#fff",
    },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
      {children}
    </button>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────
export function Input({ label, type = "text", value, onChange, error, icon, placeholder, ...rest }) {
  const [show, setShow] = useState(false);
  const inputType = type === "password" ? (show ? "text" : "password") : type;

  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{
          display: "block", fontSize: 12, color: COLORS.muted,
          marginBottom: 6, letterSpacing: 1, textTransform: "uppercase",
        }}>{label}</label>
      )}
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{
            position: "absolute", left: 14, top: "50%",
            transform: "translateY(-50%)", fontSize: 16,
          }}>{icon}</span>
        )}
        <input
          type={inputType} value={value} onChange={onChange}
          placeholder={placeholder} {...rest}
          style={{
            width: "100%", boxSizing: "border-box",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${error ? COLORS.accent : "#2a2a3e"}`,
            borderRadius: 12,
            padding: `12px ${type === "password" ? "44px" : "14px"} 12px ${icon ? "44px" : "14px"}`,
            color: COLORS.text, fontSize: 14, outline: "none",
            transition: "border 0.2s", fontFamily: "inherit",
          }}
          onFocus={e => e.target.style.border = `1px solid ${COLORS.accent}`}
          onBlur={e => e.target.style.border = `1px solid ${error ? COLORS.accent : "#2a2a3e"}`}
        />
        {type === "password" && (
          <button
            type="button" onClick={() => setShow(s => !s)}
            style={{
              position: "absolute", right: 14, top: "50%",
              transform: "translateY(-50%)", background: "none",
              border: "none", cursor: "pointer", color: COLORS.muted, fontSize: 16,
            }}>{show ? "🙈" : "👁️"}</button>
        )}
      </div>
      {error && <p style={{ color: COLORS.accent, fontSize: 11, marginTop: 4 }}>{error}</p>}
    </div>
  );
}

// ── Password Strength ─────────────────────────────────────────────────────────
export function PwStrength({ password }) {
  if (!password) return null;
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    digit: /\d/.test(password),
    special: /[@$!%*?&#^()_\-+=]/.test(password),
  };
  const labels = { length: "8+ chars", upper: "Uppercase", lower: "Lowercase", digit: "Number", special: "@Special" };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6, marginBottom: 8 }}>
      {Object.entries(checks).map(([k, ok]) => (
        <span key={k} style={{
          fontSize: 10, padding: "2px 8px", borderRadius: 20,
          background: ok ? "rgba(6,214,160,0.15)" : "rgba(255,77,109,0.1)",
          color: ok ? COLORS.success : COLORS.muted,
          border: `1px solid ${ok ? COLORS.success : "#2a2a3e"}`,
        }}>{ok ? "✓" : "✗"} {labels[k]}</span>
      ))}
    </div>
  );
}

// ── Avatar Upload ─────────────────────────────────────────────────────────────
export function AvatarUpload({ value, onChange }) {
  const ref = typeof window !== "undefined" ? require("react").useRef() : null;
  const inputRef = ref || { current: null };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <div
        onClick={() => inputRef.current?.click()}
        style={{
          width: 90, height: 90, borderRadius: "50%", overflow: "hidden",
          cursor: "pointer", border: `3px solid ${COLORS.accent}`,
          boxShadow: `0 0 20px ${COLORS.accentGlow}`, background: COLORS.card,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36,
        }}>
        {value
          ? <img src={value} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : "🩸"}
      </div>
      <span style={{ fontSize: 11, color: COLORS.muted, cursor: "pointer" }}
        onClick={() => inputRef.current?.click()}>Upload Photo</span>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={e => {
          const f = e.target.files[0]; if (!f) return;
          const reader = new FileReader();
          reader.onload = ev => onChange(ev.target.result);
          reader.readAsDataURL(f);
        }} />
    </div>
  );
}

// ── Donut Chart ───────────────────────────────────────────────────────────────
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

// ── Alert ─────────────────────────────────────────────────────────────────────
export function Alert({ type = "error", message }) {
  if (!message) return null;
  const styles = {
    error: { bg: "rgba(230,57,70,0.1)", border: COLORS.accent, color: COLORS.accent, icon: "⚠" },
    success: { bg: "rgba(6,214,160,0.1)", border: COLORS.success, color: COLORS.success, icon: "✓" },
  };
  const s = styles[type];
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 10, padding: "10px 14px", marginBottom: 16,
      color: s.color, fontSize: 13,
    }}>{s.icon} {message}</div>
  );
}

// ── Loading Spinner ───────────────────────────────────────────────────────────
export function Spinner({ size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      border: `3px solid ${COLORS.cardBorder}`,
      borderTopColor: COLORS.accent,
      animation: "spin 0.8s linear infinite",
    }} />
  );
}

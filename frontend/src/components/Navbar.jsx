import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { COLORS } from "../utils/theme";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate("/"); };

  const navItems = user
    ? [
        { path: "/", label: "Home" },
        { path: "/predict", label: "🔬 Predict" },
        { path: "/dashboard", label: "📊 Dashboard" },
        { path: "/profile", label: "⚙️ Profile" },
      ]
    : [
        { path: "/", label: "Home" },
        { path: "/login", label: "Sign In" },
        { path: "/signup", label: "Get Started" },
      ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
      background: "rgba(10,10,15,0.9)", backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${COLORS.cardBorder}`,
      display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 32px", height: 64,
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 26 }}>🩸</span>
        <span style={{ fontWeight: 900, fontSize: 18, fontFamily: "Georgia, serif", color: COLORS.text }}>
          Blood<span style={{ color: COLORS.accent }}>Vision</span>
        </span>
      </Link>

      {/* Nav links */}
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {navItems.map(n => {
          const active = location.pathname === n.path;
          return (
            <Link key={n.path} to={n.path} style={{ textDecoration: "none" }}>
              <button style={{
                background: active ? "rgba(230,57,70,0.12)" : "transparent",
                border: active ? `1px solid ${COLORS.accent}` : "1px solid transparent",
                color: active ? COLORS.accent : COLORS.muted,
                padding: "8px 16px", borderRadius: 10, cursor: "pointer",
                fontSize: 13, fontWeight: 600, fontFamily: "inherit", transition: "all 0.2s",
              }}>{n.label}</button>
            </Link>
          );
        })}

        {/* User avatar + logout */}
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 8 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", overflow: "hidden",
              border: `2px solid ${COLORS.accent}`, background: COLORS.card,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
            }}>
              {user.avatar
                ? <img src={user.avatar} alt="av" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : "🩸"}
            </div>
            <button onClick={handleLogout} style={{
              background: "transparent", border: `1px solid #2a2a3e`,
              color: COLORS.muted, padding: "8px 14px", borderRadius: 10,
              cursor: "pointer", fontSize: 12, fontFamily: "inherit", transition: "all 0.2s",
            }}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}

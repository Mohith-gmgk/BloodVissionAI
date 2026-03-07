import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import { Particles } from "./components/Animations";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PredictPage from "./pages/PredictPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import { COLORS } from "./utils/theme";

// Protected route wrapper
function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AppContent() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div style={{ background: COLORS.dark, minHeight: "100vh", color: COLORS.text, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: #e63946; border-radius: 3px; }
      `}</style>

      <Particles />
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/predict" element={<Protected><PredictPage /></Protected>} />
        <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
        <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Chatbot toggle */}
      <button
        onClick={() => setChatOpen(o => !o)}
        style={{
          position: "fixed", bottom: 24, right: 24,
          width: 58, height: 58, borderRadius: "50%",
          background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.crimson})`,
          border: "none", cursor: "pointer", fontSize: 24, zIndex: 999,
          boxShadow: `0 4px 20px ${COLORS.accentGlow}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >{chatOpen ? "✕" : "🤖"}</button>

      {chatOpen && <Chatbot onClose={() => setChatOpen(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

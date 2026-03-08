import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { loginUser } from "../utils/api";
import { Card, Input, Btn, Alert } from "../components/UI";
import { COLORS } from "../utils/theme";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password) { setError("Please fill in all fields"); return; }
    setError(""); setLoading(true);
    try {
      const res = await loginUser(form.email, form.password);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 20px 40px" }}>
      <Card style={{ width: "100%", maxWidth: 420 }} glow>
        <div style={{ textAlign: "center", fontSize: 52, marginBottom: 12 }}>🩸</div>
        <h2 style={{ textAlign: "center", fontSize: 28, fontFamily: "Georgia, serif", color: COLORS.text, marginBottom: 4 }}>
          Welcome Back
        </h2>
        <p style={{ textAlign: "center", color: COLORS.muted, fontSize: 13, marginBottom: 28 }}>
          Sign in to your BloodVision account
        </p>

        <Alert type="error" message={error} />

        <Input label="Email Address" type="email" value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          icon="✉️" placeholder="your@email.com" />
        <Input label="Password" type="password" value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          icon="🔒" placeholder="Your password"
          onKeyDown={e => e.key === "Enter" && submit()} />

        <Btn onClick={submit} disabled={loading} style={{ width: "100%", padding: "14px", marginTop: 8 }}>
          {loading ? "Signing In…" : "Sign In →"}
        </Btn>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: COLORS.muted }}>
          No account?{" "}
          <Link to="/signup" style={{ color: COLORS.accent, textDecoration: "none", fontWeight: 700 }}>Create one free</Link>
        </p>
      </Card>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { registerUser } from "../utils/api";
import { validatePassword, validateEmail } from "../utils/auth";
import { Card, Input, Btn, PwStrength, AvatarUpload, Alert } from "../components/UI";
import { COLORS } from "../utils/theme";

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", phone: "" });
  const [avatar, setAvatar] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!validateEmail(form.email)) e.email = "Valid email required";
    const pwChecks = validatePassword(form.password);
    if (!Object.values(pwChecks).every(Boolean))
      e.password = "Password doesn't meet all requirements";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    if (form.phone && !/^\+?[\d\s\-]{7,15}$/.test(form.phone))
      e.phone = "Invalid phone number";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setServerError(""); setLoading(true);

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("password", form.password);
      fd.append("phone", form.phone);
      if (avatar) fd.append("avatar", avatar); // base64 string

      const res = await registerUser(fd);
      login(res.data.user, res.data.token);
      navigate("/predict");
    } catch (err) {
      setServerError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 20px 40px" }}>
      <Card style={{ width: "100%", maxWidth: 480 }} glow>
        <h2 style={{ textAlign: "center", fontSize: 28, fontFamily: "Georgia, serif", color: COLORS.text, marginBottom: 4 }}>
          Create Account
        </h2>
        <p style={{ textAlign: "center", color: COLORS.muted, fontSize: 13, marginBottom: 24 }}>
          Join BloodVision AI — free forever
        </p>

        <AvatarUpload value={avatar} onChange={setAvatar} />
        <Alert type="error" message={serverError} />

        <Input label="Full Name" value={form.name} onChange={e => set("name", e.target.value)}
          error={errors.name} icon="👤" placeholder="Dr. Jane Smith" />
        <Input label="Email Address" type="email" value={form.email}
          onChange={e => set("email", e.target.value)} error={errors.email}
          icon="✉️" placeholder="jane@hospital.com" />
        <Input label="Phone (optional)" value={form.phone}
          onChange={e => set("phone", e.target.value)} error={errors.phone}
          icon="📞" placeholder="+91 9876543210" />

        <div>
          <Input label="Password" type="password" value={form.password}
            onChange={e => set("password", e.target.value)} error={errors.password}
            icon="🔒" placeholder="Min 8 chars, A-Z, 0-9, @…" />
          <PwStrength password={form.password} />
        </div>

        <Input label="Confirm Password" type="password" value={form.confirm}
          onChange={e => set("confirm", e.target.value)} error={errors.confirm}
          icon="🔒" placeholder="Repeat password" />

        <Btn onClick={submit} disabled={loading} style={{ width: "100%", marginTop: 8, padding: "14px" }}>
          {loading ? "Creating Account…" : "🩸 Create Account"}
        </Btn>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: COLORS.muted }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: COLORS.accent, textDecoration: "none", fontWeight: 700 }}>Sign In</Link>
        </p>
      </Card>
    </div>
  );
}

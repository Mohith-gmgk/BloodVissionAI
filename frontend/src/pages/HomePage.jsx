import { useNavigate } from "react-router-dom";
import { COLORS } from "../utils/theme";
import { Card, Btn } from "../components/UI";
import { DNAHelix } from "../components/Animations";

const stats = [
  { val: "99.2%", label: "Model Accuracy" },
  { val: "8", label: "Blood Groups" },
  { val: "<2s", label: "Prediction Time" },
  { val: "50K+", label: "Samples Trained" },
];

const features = [
  { icon: "🧬", title: "Deep Learning AI", desc: "Convolutional neural networks trained on 50,000+ blood smear samples." },
  { icon: "⚡", title: "Instant Results", desc: "Get blood group predictions in under 2 seconds with confidence scores." },
  { icon: "📊", title: "Visual Analytics", desc: "Track history with interactive charts and accuracy dashboards." },
  { icon: "🔒", title: "Secure & Private", desc: "End-to-end encrypted data handling. Your images stay private." },
  { icon: "🤖", title: "AI Chatbot", desc: "Built-in intelligent assistant answers your questions 24/7." },
  { icon: "📱", title: "Multi-format", desc: "Supports JPG, PNG, TIFF blood smear image formats." },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* HERO */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "40px 20px", position: "relative",
      }}>
        <div style={{ position: "absolute", top: "10%", left: "5%", opacity: 0.6 }}><DNAHelix /></div>
        <div style={{ position: "absolute", top: "10%", right: "5%", opacity: 0.6, transform: "scaleX(-1)" }}><DNAHelix /></div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 800 }}>
          <div style={{
            display: "inline-block", padding: "6px 18px", borderRadius: 30,
            background: "rgba(230,57,70,0.1)", border: `1px solid ${COLORS.accent}`,
            color: COLORS.accent, fontSize: 12, letterSpacing: 2, fontWeight: 700, marginBottom: 24,
          }}>⬡ AI-POWERED HEMATOLOGY</div>

          <h1 style={{
            fontSize: "clamp(42px, 8vw, 86px)", fontWeight: 900, lineHeight: 1.05,
            fontFamily: "Georgia, serif", marginBottom: 24,
            background: `linear-gradient(135deg, #fff 0%, ${COLORS.accent} 50%, #ff9999 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Blood·Vision<br />
            <span style={{ fontSize: "0.6em", fontStyle: "italic", fontWeight: 400 }}>Intelligence</span>
          </h1>

          <p style={{
            fontSize: 18, color: COLORS.muted, lineHeight: 1.8,
            maxWidth: 560, margin: "0 auto 40px",
          }}>
            Upload a blood smear image. Our deep learning model identifies your
            blood group with clinical-grade precision — in seconds.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn onClick={() => navigate("/signup")} style={{ fontSize: 16, padding: "16px 36px" }}>
              🩸 Get Started Free
            </Btn>
            <Btn onClick={() => navigate("/login")} variant="ghost"
              style={{ fontSize: 16, padding: "16px 36px", border: `1px solid ${COLORS.accent}` }}>
              Sign In →
            </Btn>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          color: COLORS.muted, fontSize: 12,
        }}>
          <div style={{ width: 1, height: 50, background: `linear-gradient(${COLORS.accent}, transparent)` }} />
          SCROLL
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: "60px 20px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 20 }}>
          {stats.map(s => (
            <Card key={s.label} style={{ textAlign: "center", padding: "28px 16px" }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: COLORS.accent, fontFamily: "Georgia, serif" }}>{s.val}</div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4, letterSpacing: 1 }}>{s.label}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "60px 20px", maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 36, fontFamily: "Georgia, serif", marginBottom: 48, color: COLORS.text }}>
          Why <span style={{ color: COLORS.accent }}>BloodVision</span>?
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {features.map(f => (
            <Card key={f.title}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ color: COLORS.text, fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "60px 20px", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: 36, fontFamily: "Georgia, serif", marginBottom: 48, color: COLORS.text }}>
          How It <span style={{ color: COLORS.accent }}>Works</span>
        </h2>
        <div style={{ display: "flex", justifyContent: "center", gap: 0, flexWrap: "wrap" }}>
          {[
            ["📸", "Upload Image", "Select your blood smear microscopy image"],
            ["🧠", "AI Analysis", "Neural network processes the image"],
            ["🩸", "Get Result", "Receive blood group with confidence %"],
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ textAlign: "center", padding: "0 24px", maxWidth: 200 }}>
                <div style={{
                  width: 70, height: 70, borderRadius: "50%",
                  background: "rgba(230,57,70,0.12)", border: `2px solid ${COLORS.accent}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, margin: "0 auto 14px",
                }}>{s[0]}</div>
                <div style={{ fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>{s[1]}</div>
                <div style={{ fontSize: 12, color: COLORS.muted }}>{s[2]}</div>
              </div>
              {i < 2 && <div style={{ width: 40, height: 2, background: `linear-gradient(90deg,${COLORS.accent},${COLORS.crimson})`, flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 20px", textAlign: "center" }}>
        <Card glow style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontFamily: "Georgia, serif", color: COLORS.text, marginBottom: 12 }}>Ready to Detect?</h2>
          <p style={{ color: COLORS.muted, marginBottom: 28 }}>Join thousands of medical professionals using AI-powered blood group detection.</p>
          <Btn onClick={() => navigate("/signup")} style={{ fontSize: 16, padding: "16px 40px" }}>🩸 Start for Free</Btn>
        </Card>
      </section>
    </div>
  );
}

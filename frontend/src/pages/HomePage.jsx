import { useNavigate } from "react-router-dom";
import { COLORS } from "../utils/theme";
import { Card, Btn } from "../components/UI";
import { DNAHelix } from "../components/Animations";

const stats = [
  { val: "97.6%", label: "Model Accuracy" },
  { val: "4",     label: "Blood Groups" },
  { val: "<20s",  label: "Prediction Time" },
  { val: "10K+",  label: "Samples Trained" },
];

const features = [
  { icon: "🧬", title: "Deep Learning AI", desc: "Convolutional neural networks trained on 10,000+ blood smear samples for high precision detection." },
  { icon: "⚡", title: "Fast Results", desc: "Get blood group predictions in under 20 seconds with real confidence scores." },
  { icon: "📊", title: "Visual Analytics", desc: "Track history with interactive charts and accuracy dashboards." },
  { icon: "🔒", title: "Secure & Private", desc: "End-to-end encrypted data handling. Your images stay private." },
  { icon: "🤖", title: "AI Chatbot", desc: "Built-in intelligent assistant answers your questions 24/7." },
  { icon: "📱", title: "Multi-format", desc: "Supports JPG, PNG, TIFF, BMP blood smear image formats." },
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

      {/* TRANSFER LEARNING SECTION */}
      <section style={{ padding: "60px 20px", maxWidth: 1000, margin: "0 auto" }}>
        <Card glow style={{ padding: "40px 36px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
            {/* Left - Text */}
            <div>
              <div style={{
                display: "inline-block", padding: "4px 14px", borderRadius: 20,
                background: "rgba(230,57,70,0.1)", border: `1px solid ${COLORS.accent}`,
                color: COLORS.accent, fontSize: 11, letterSpacing: 2, fontWeight: 700, marginBottom: 16,
              }}>🔬 TRANSFER LEARNING</div>

              <h2 style={{ fontSize: 28, fontFamily: "Georgia, serif", color: COLORS.text, marginBottom: 16, lineHeight: 1.3 }}>
                Powered by <span style={{ color: COLORS.accent }}>MobileNet</span> Architecture
              </h2>

              <p style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}>
                BloodVision uses <strong style={{ color: COLORS.text }}>Transfer Learning</strong> with
                the pre-trained MobileNet model — originally trained on over 1 million images —
                and fine-tuned specifically on blood smear microscopy images to achieve superior accuracy.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { icon: "🧠", text: "MobileNet pretrained on ImageNet (1M+ images)" },
                  { icon: "🩸", text: "Fine-tuned on 10K+ blood smear samples" },
                  { icon: "🎯", text: "97.6% accuracy on test dataset" },
                  { icon: "⚡", text: "Lightweight — optimized for fast inference" },
                ].map(item => (
                  <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <span style={{ fontSize: 13, color: COLORS.muted }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Architecture diagram */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
              {[
                { label: "📸 Input Image", sub: "224 × 224 × 3", color: "#2a2a3e", border: "#3a3a5e" },
                { label: "🧠 MobileNet Base", sub: "Pre-trained on ImageNet", color: "rgba(230,57,70,0.08)", border: COLORS.accent },
                { label: "🔗 Fine-tuned Layers", sub: "Blood smear specific", color: "rgba(6,214,160,0.08)", border: COLORS.success },
                { label: "📊 Dense Layer", sub: "128 neurons → ReLU", color: "rgba(139,92,246,0.08)", border: "#8b5cf6" },
                { label: "🩸 Output", sub: "A  |  AB  |  B  |  O", color: "rgba(230,57,70,0.12)", border: COLORS.accent },
              ].map((layer, i) => (
                <div key={i} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: "100%", padding: "12px 16px", borderRadius: 10,
                    background: layer.color, border: `1px solid ${layer.border}`,
                    textAlign: "center",
                  }}>
                    <div style={{ color: COLORS.text, fontSize: 13, fontWeight: 700 }}>{layer.label}</div>
                    <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>{layer.sub}</div>
                  </div>
                  {i < 4 && (
                    <div style={{ width: 2, height: 16, background: `linear-gradient(${COLORS.accent}, ${COLORS.crimson})` }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "60px 20px", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: 36, fontFamily: "Georgia, serif", marginBottom: 48, color: COLORS.text }}>
          How It <span style={{ color: COLORS.accent }}>Works</span>
        </h2>
        <div style={{ display: "flex", justifyContent: "center", gap: 0, flexWrap: "wrap" }}>
          {[
            ["📸", "Upload Image", "Select your blood smear microscopy image"],
            ["🧠", "AI Analysis", "MobileNet neural network processes the image"],
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

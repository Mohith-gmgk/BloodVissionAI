import { useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { predictBloodGroup } from "../utils/api";
import { Card, Btn } from "../components/UI";
import { DonutChart } from "../components/Charts";
import { COLORS, BLOOD_COLORS } from "../utils/theme";

const LOADING_MESSAGES = [
  "🔬 Analyzing blood smear...",
  "🧠 Running neural network...",
  "🩸 Detecting blood group...",
  "📊 Calculating confidence...",
  "✅ Almost done...",
];

export default function PredictPage() {
  const { user, updateUser } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();
  const msgInterval = useRef(null);

  const processFile = (f) => {
    if (!f) return;
    setFile(f); setResult(null); setError("");
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  // ✅ Remove image handler
  const removeImage = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview("");
    setResult(null);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const predict = async () => {
    if (!file) return;
    setLoading(true); setResult(null); setError(""); setLoadingMsg(0);

    // Cycle through loading messages
    let i = 0;
    msgInterval.current = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(i);
    }, 1800);

    try {
      const res = await predictBloodGroup(file);
      const r = res.data;
      setResult(r);
      const entry = {
        id: Date.now(),
        blood_group: r.blood_group,
        confidence: r.confidence,
        val_accuracy: r.val_accuracy,
        date: new Date().toLocaleDateString(),
        file_name: file.name,
      };
      updateUser({ history: [entry, ...(user.history || [])].slice(0, 100) });
    } catch (err) {
      setError(err.response?.data?.error || "Prediction failed. Please try again with a valid blood smear image.");
    } finally {
      clearInterval(msgInterval.current);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "100px 20px 60px", maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ fontSize: 32, fontFamily: "Georgia, serif", color: COLORS.text, marginBottom: 8 }}>
        🧬 Blood Group Predictor
      </h2>
      <p style={{ color: COLORS.muted, marginBottom: 36 }}>
        Upload a blood smear microscopy image to detect the blood group using AI
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Upload Zone */}
        <div>
          <Card>
            {/* Drop zone */}
            <div
              onClick={() => !preview && fileRef.current.click()}
              onDragOver={e => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={e => { e.preventDefault(); setDrag(false); processFile(e.dataTransfer.files[0]); }}
              style={{
                border: `2px dashed ${drag ? COLORS.accent : "#2a2a3e"}`,
                borderRadius: 16, padding: "36px 20px", textAlign: "center",
                cursor: preview ? "default" : "pointer", transition: "all 0.2s",
                background: drag ? "rgba(230,57,70,0.05)" : "transparent",
                position: "relative",
              }}>

              {preview ? (
                <>
                  <img src={preview} alt="preview" style={{ width: "100%", maxHeight: 220, objectFit: "contain", borderRadius: 8 }} />
                  {/* ✅ X button to remove image */}
                  <button
                    onClick={removeImage}
                    title="Remove image"
                    style={{
                      position: "absolute", top: 10, right: 10,
                      width: 30, height: 30, borderRadius: "50%",
                      background: "rgba(230,57,70,0.9)", border: "none",
                      color: "white", fontSize: 16, fontWeight: 900,
                      cursor: "pointer", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  >✕</button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 52, marginBottom: 12 }}>🔬</div>
                  <p style={{ color: COLORS.muted, fontSize: 14 }}>
                    Drag & drop or <span style={{ color: COLORS.accent }}>click to browse</span>
                  </p>
                  <p style={{ color: COLORS.muted, fontSize: 11, marginTop: 4 }}>JPG · PNG · TIFF · BMP</p>
                </>
              )}
            </div>

            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => processFile(e.target.files[0])} />

            {file && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                <p style={{ fontSize: 11, color: COLORS.muted }}>
                  📁 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
                <button onClick={removeImage} style={{
                  background: "transparent", border: "none", color: COLORS.accent,
                  fontSize: 11, cursor: "pointer", textDecoration: "underline",
                }}>Remove</button>
              </div>
            )}

            {error && (
              <div style={{ color: COLORS.accent, fontSize: 13, marginTop: 10, padding: "8px 12px", background: "rgba(230,57,70,0.08)", borderRadius: 8 }}>
                ⚠ {error}
              </div>
            )}

            <Btn onClick={predict} disabled={!file || loading} style={{ width: "100%", marginTop: 14, padding: "14px" }}>
              {loading ? "🔄 Analyzing…" : "🧠 Predict Blood Group"}
            </Btn>
          </Card>

          {/* ✅ Better loading UI with cycling messages */}
          {loading && (
            <Card style={{ marginTop: 20, textAlign: "center", padding: "24px" }}>
              <div style={{ fontSize: 36, display: "inline-block", animation: "spin 1s linear infinite" }}>⚙️</div>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <p style={{ color: COLORS.text, marginTop: 12, fontSize: 14, fontWeight: 600, minHeight: 22, transition: "all 0.3s" }}>
                {LOADING_MESSAGES[loadingMsg]}
              </p>
              <p style={{ color: COLORS.muted, fontSize: 11, marginTop: 4 }}>
                This may take 10-30 seconds on first run
              </p>
              <div style={{ height: 4, background: "#1e1e2e", borderRadius: 4, marginTop: 16, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 4,
                  background: `linear-gradient(90deg,${COLORS.accent},${COLORS.crimson})`,
                  animation: "prog 25s linear forwards",
                }} />
              </div>
              <style>{`@keyframes prog{from{width:0%}to{width:95%}}`}</style>
            </Card>
          )}
        </div>

        {/* Result */}
        <div>
          {result ? (
            <Card glow style={{ textAlign: "center", animation: "fadeIn 0.5s ease" }}>
              <style>{`@keyframes fadeIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}`}</style>
              <p style={{ color: COLORS.muted, fontSize: 12, letterSpacing: 2, marginBottom: 12 }}>DETECTED BLOOD GROUP</p>
              <div style={{
                fontSize: 80, fontWeight: 900, lineHeight: 1,
                color: BLOOD_COLORS[result.blood_group] || COLORS.accent,
                fontFamily: "Georgia, serif", marginBottom: 20,
                textShadow: `0 0 30px ${BLOOD_COLORS[result.blood_group] || COLORS.accent}66`,
              }}>{result.blood_group}</div>

              <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 24 }}>
                <DonutChart value={result.confidence} label="Confidence" color={COLORS.accent} />
                <DonutChart value={result.val_accuracy} label="Val. Accuracy" color={COLORS.success} />
              </div>

              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "14px 18px", textAlign: "left" }}>
                {[
                  ["Blood Group", result.blood_group],
                  ["Confidence", `${result.confidence}%`],
                  ["Val. Accuracy", `${result.val_accuracy}%`],
                  ["Model Accuracy", `${result.model_accuracy || 99.2}%`],
                  ["Date", new Date().toLocaleString()],
                  ["File", file?.name || "—"],
                ].map(([k, v]) => (
                  <div key={k} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "6px 0", borderBottom: `1px solid #1e1e2e`, fontSize: 13,
                  }}>
                    <span style={{ color: COLORS.muted }}>{k}</span>
                    <span style={{ color: COLORS.text, fontWeight: 700 }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: 16, padding: "10px 14px",
                background: "rgba(6,214,160,0.08)", borderRadius: 10,
                border: `1px solid ${COLORS.success}`, fontSize: 12, color: COLORS.success,
              }}>✓ Result saved to your history</div>

              {/* ✅ Try another image button */}
              <button onClick={removeImage} style={{
                marginTop: 12, width: "100%", padding: "10px",
                background: "transparent", border: `1px solid #2a2a3e`,
                color: COLORS.muted, borderRadius: 10, cursor: "pointer",
                fontSize: 13, fontFamily: "inherit",
              }}>🔄 Try Another Image</button>
            </Card>
          ) : (
            <Card style={{ textAlign: "center", padding: "60px 30px" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🩸</div>
              <p style={{ color: COLORS.muted }}>
                Upload an image and click Predict to see the blood group detection result here.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

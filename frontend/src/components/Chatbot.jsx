import { useState, useRef, useEffect, useCallback } from "react";
import { COLORS } from "../utils/theme";
import { Btn } from "./UI";

const FAQ = [
  { q: /blood group|blood type/i, a: "BloodVision AI detects A+, A−, B+, B−, AB+, AB−, O+, and O− blood groups from microscopic blood smear images." },
  { q: /accuracy|precise|how accurate/i, a: "Our model achieves >96% validation accuracy on benchmark datasets. Each prediction shows a live confidence score." },
  { q: /upload|image|photo|file/i, a: "Go to the Predict page, upload a blood smear image (JPG/PNG/TIFF), and our AI returns the predicted blood group instantly." },
  { q: /login|sign in|account/i, a: "Click 'Sign In' in the navbar. Enter your registered email and password to access your dashboard." },
  { q: /signup|register|create account/i, a: "Click 'Get Started' to create an account. Fill in your details, upload a profile photo, and you're ready!" },
  { q: /history|past|previous/i, a: "Your prediction history is saved on the Dashboard with charts showing distribution and confidence over time." },
  { q: /how|work|process/i, a: "We use a deep convolutional neural network trained on thousands of blood smear samples to classify blood groups." },
  { q: /safe|security|data|private/i, a: "Your images and data are processed securely. We never share your data with third parties." },
  { q: /cost|free|price|paid/i, a: "BloodVision AI is currently free to use during our beta phase." },
  { q: /format|file type|tiff|jpg|png/i, a: "We support JPG, PNG, TIFF and BMP formats. Make sure the image is a clear blood smear microscopy photo." },
  { q: /model|cnn|neural|ai/i, a: "Our backend uses a ResNet-based Convolutional Neural Network fine-tuned on 50,000+ labeled blood smear images." },
  { q: /./, a: "I'm BloodBot 🤖 — your AI assistant for BloodVision. Ask me about blood group detection, how to upload images, account setup, or model accuracy!" },
];

export default function Chatbot({ onClose }) {
  const [msgs, setMsgs] = useState([
    { from: "bot", text: "Hi! I'm BloodBot 🩸 How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef();

  const send = useCallback(() => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    const match = FAQ.find(f => f.q.test(input));
    const botMsg = { from: "bot", text: match ? match.a : "I'm not sure about that. Try asking about blood groups, image upload, account setup, or model accuracy!" };
    setMsgs(m => [...m, userMsg, botMsg]);
    setInput("");
  }, [input]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  return (
    <div style={{
      position: "fixed", bottom: 90, right: 24, width: 340, zIndex: 1000,
      background: "rgba(10,10,15,0.97)", backdropFilter: "blur(20px)",
      border: `1px solid ${COLORS.accent}`, borderRadius: 20,
      boxShadow: `0 0 40px ${COLORS.accentGlow}`, overflow: "hidden",
      animation: "slideUp 0.3s ease",
    }}>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.crimson})`,
        padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🩸</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>BloodBot AI</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>● Online</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 18 }}>✕</button>
      </div>

      {/* Messages */}
      <div style={{ height: 260, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "80%", padding: "10px 14px",
              borderRadius: m.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: m.from === "user"
                ? `linear-gradient(135deg,${COLORS.accent},${COLORS.crimson})`
                : "rgba(255,255,255,0.06)",
              color: COLORS.text, fontSize: 13, lineHeight: 1.5,
            }}>{m.text}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 8, padding: 12, borderTop: `1px solid ${COLORS.cardBorder}` }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask me anything…"
          style={{
            flex: 1, background: "rgba(255,255,255,0.05)",
            border: `1px solid ${COLORS.cardBorder}`, borderRadius: 10,
            padding: "10px 14px", color: COLORS.text, fontSize: 13,
            outline: "none", fontFamily: "inherit",
          }} />
        <Btn onClick={send} style={{ padding: "10px 16px", borderRadius: 10 }}>➤</Btn>
      </div>
    </div>
  );
}

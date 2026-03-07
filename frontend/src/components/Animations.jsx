import { useEffect, useRef } from "react";

export function Particles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
    }));

    let raf;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(230,57,70,0.4)";
        ctx.fill();
      });
      pts.forEach((a, i) =>
        pts.slice(i + 1).forEach(b => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(230,57,70,${0.12 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        })
      );
      raf = requestAnimationFrame(draw);
    }
    draw();

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}

export function DNAHelix() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 120; canvas.height = 320;
    let t = 0, raf;

    function draw() {
      ctx.clearRect(0, 0, 120, 320);
      for (let y = 0; y < 320; y += 6) {
        const x1 = 60 + Math.sin((y / 30) + t) * 45;
        const x2 = 60 - Math.sin((y / 30) + t) * 45;
        ctx.beginPath(); ctx.arc(x1, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${350 + Math.sin(y) * 20},80%,55%)`;
        ctx.fill();
        ctx.beginPath(); ctx.arc(x2, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${210 + Math.sin(y) * 20},70%,60%)`;
        ctx.fill();
        if (y % 18 === 0) {
          ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y);
          ctx.strokeStyle = "rgba(255,255,255,0.15)";
          ctx.lineWidth = 1.5; ctx.stroke();
        }
      }
      t += 0.025;
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} style={{ opacity: 0.85 }} />;
}

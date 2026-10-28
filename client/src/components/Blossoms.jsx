import { useEffect, useRef } from "react";

// Slow drift of tiny gold blossoms behind the content.
export default function Blossoms({ active }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = ref.current, ctx = c.getContext("2d");
    let w, h, raf, dpr;
    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = c.width = innerWidth * dpr; h = c.height = innerHeight * dpr;
    };
    size();
    addEventListener("resize", size);
    const n = innerWidth < 600 ? 26 : 44;
    const ps = Array.from({ length: n }, () => ({
      x: Math.random(), y: Math.random(), r: 1.5 + Math.random() * 2.6,
      s: 0.00025 + Math.random() * 0.0005, t: Math.random() * 6, a: 0.25 + Math.random() * 0.5,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.y += p.s; p.t += 0.01;
        if (p.y > 1.05) { p.y = -0.05; p.x = Math.random(); }
        const x = (p.x + Math.sin(p.t) * 0.02) * w, y = p.y * h, r = p.r * dpr;
        ctx.globalAlpha = p.a;
        ctx.fillStyle = "#e9cf8f";
        for (let k = 0; k < 5; k++) {
          const ang = p.t + (k * Math.PI * 2) / 5;
          ctx.beginPath();
          ctx.arc(x + Math.cos(ang) * r, y + Math.sin(ang) * r, r * 0.75, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", size); };
  }, [active]);
  return <canvas ref={ref} className="blossoms" aria-hidden="true" />;
}

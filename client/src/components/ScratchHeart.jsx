import { useEffect, useRef, useState } from "react";
import { EVENT } from "../data.js";
import { burst, dust, haptic } from "../lib/fx.js";

const heartD = (s) =>
  `M${50*s} ${88*s} C${20*s} ${68*s} 0 ${50*s} 0 ${28*s} C0 ${12*s} ${12*s} 0 ${27*s} 0 ` +
  `C${38*s} 0 ${46*s} ${6*s} ${50*s} ${14*s} C${54*s} ${6*s} ${62*s} 0 ${73*s} 0 ` +
  `C${88*s} 0 ${100*s} ${12*s} ${100*s} ${28*s} C${100*s} ${50*s} ${80*s} ${68*s} ${50*s} ${88*s}Z`;

const W = 300, H = 268;
const S = W / 100;

export default function ScratchHeart() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [started, setStarted] = useState(false);
  const state = useRef({ drawing: false, last: null, moves: 0, total: 0, done: false });

  // Paint the gold foil
  useEffect(() => {
    const c = canvasRef.current, ctx = c.getContext("2d", { willReadFrequently: true });
    const dpr = Math.min(devicePixelRatio || 1, 2);
    c.width = W * dpr; c.height = H * dpr;
    ctx.scale(dpr, dpr);
    const paint = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.clip(new Path2D(heartD(S)));
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, "#f7e3a8"); g.addColorStop(0.25, "#c99a4a"); g.addColorStop(0.5, "#fbeec6");
      g.addColorStop(0.75, "#b4863b"); g.addColorStop(1, "#e7c67f");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // brushed foil streaks
      for (let i = 0; i < 160; i++) {
        ctx.strokeStyle = `rgba(${Math.random() > 0.5 ? "255,250,230" : "120,80,20"},${Math.random() * 0.12})`;
        ctx.lineWidth = Math.random() * 1.4;
        const y = Math.random() * H;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y + (Math.random() - 0.5) * 30); ctx.stroke();
      }
      for (let i = 0; i < 220; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.8})`;
        ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
      }
      ctx.strokeStyle = "rgba(90,58,18,.55)"; ctx.lineWidth = 1;
      ctx.save(); ctx.translate(W * 0.06, H * 0.06); ctx.scale(0.88, 0.88);
      ctx.stroke(new Path2D(heartD(S))); ctx.restore();
      ctx.fillStyle = "rgba(80,50,14,.78)"; ctx.textAlign = "center";
      ctx.font = "500 13px Cinzel, serif";
      ctx.fillText("S C R A T C H   M E", W / 2, H * 0.4);
      ctx.font = "italic 18px 'Cormorant Garamond', serif";
      ctx.fillText("to find our date", W / 2, H * 0.4 + 26);
      ctx.restore();
      // count foil pixels once, for progress
      const d = ctx.getImageData(0, 0, c.width, c.height).data;
      let t = 0; for (let i = 3; i < d.length; i += 16) if (d[i] > 0) t++;
      state.current.total = t;
    };
    (document.fonts?.ready || Promise.resolve()).then(paint);
  }, []);

  const finish = () => {
    if (state.current.done) return;
    state.current.done = true;
    setRevealed(true);
    haptic([20, 50, 20, 50, 80]);
    const r = wrapRef.current.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height * 0.4, { count: 90 });
  };

  const progress = () => {
    const c = canvasRef.current, d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let left = 0; for (let i = 3; i < d.length; i += 16) if (d[i] > 0) left++;
    if (state.current.total && 1 - left / state.current.total > 0.55) finish();
  };

  const point = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H, cx: e.clientX, cy: e.clientY };
  };

  const scratch = (p) => {
    const ctx = canvasRef.current.getContext("2d");
    const st = state.current;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = 38;
    ctx.beginPath();
    ctx.moveTo(st.last?.x ?? p.x, st.last?.y ?? p.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    st.last = p;
    dust(p.cx, p.cy);
    if (++st.moves % 8 === 0) { progress(); haptic(4); }
  };

  const down = (e) => {
    if (state.current.done) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    state.current.drawing = true; state.current.last = null;
    if (!started) setStarted(true);
    scratch(point(e));
  };
  const move = (e) => state.current.drawing && scratch(point(e));
  const up = () => { state.current.drawing = false; progress(); };

  return (
    <section className="date-section" id="date" aria-labelledby="date-title">
      <h2 id="date-title" className="section-script" data-reveal>We’re Getting Engaged!</h2>
      <p className="section-note" data-reveal>
        {revealed ? "We can’t wait to see you there." : "Scratch the golden heart with your finger"}
      </p>

      <div className="heart-stage" data-reveal style={{ width: W + 8, height: H + 8 }}>
      <div className={`heart-wrap ${revealed ? "is-revealed" : ""}`} ref={wrapRef}
        style={{ width: W, height: H, clipPath: `path('${heartD(S)}')` }}>
        <div className="heart-under" aria-live="polite">
          <span className="hu-day">{EVENT.day}</span>
          <span className="hu-num">{EVENT.dateNum}</span>
          <span className="hu-month">{EVENT.month} {EVENT.year}</span>
          <span className="hu-time">at {EVENT.time}</span>
        </div>
        <canvas
          ref={canvasRef}
          className="heart-foil"
          style={{ width: W, height: H }}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          aria-hidden="true"
        />
      </div>
      <svg className="heart-outline" viewBox={`-4 -4 ${W + 8} ${H + 8}`} style={{ width: W + 8, height: H + 8 }} aria-hidden="true">
        <path d={heartD(S)} fill="none" stroke="url(#goldH)" strokeWidth="1.2" />
      </svg>
      </div>

      {!revealed && (
        <button className="text-btn" onClick={finish}>
          {started ? "Reveal the rest" : "Reveal without scratching"}
        </button>
      )}
    </section>
  );
}

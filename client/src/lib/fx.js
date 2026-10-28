// One shared full-screen canvas for gold dust, heart confetti and petal bursts.
const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let canvas, ctx, parts = [], raf = null, dpr = 1;
const GOLDS = ["#fbeec6", "#f0d48f", "#d6b46a", "#b88d42", "#fff7e0"];

function ensure() {
  if (canvas) return;
  canvas = document.createElement("canvas");
  canvas.className = "fx-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");
  const size = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size();
  addEventListener("resize", size);
}

function heart(c, s) {
  c.beginPath();
  c.moveTo(0, s * 0.35);
  c.bezierCurveTo(-s * 0.9, -s * 0.3, -s * 0.45, -s * 1.05, 0, -s * 0.45);
  c.bezierCurveTo(s * 0.45, -s * 1.05, s * 0.9, -s * 0.3, 0, s * 0.35);
  c.fill();
}

function loop() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter((p) => p.life > 0);
  for (const p of parts) {
    p.vy += p.g;
    p.vx *= p.drag;
    p.vy *= p.drag;
    p.x += p.vx + Math.sin((p.t += 0.05)) * p.sway;
    p.y += p.vy;
    p.rot += p.vr;
    p.life -= 1;
    const a = Math.min(1, p.life / 40);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    if (p.kind === "heart") heart(ctx, p.size);
    else if (p.kind === "flake") {
      ctx.fillRect(-p.size / 2, -p.size / 5, p.size, p.size / 2.5);
    } else {
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  raf = parts.length ? requestAnimationFrame(loop) : (ctx.clearRect(0, 0, innerWidth, innerHeight), null);
}

function add(p) {
  parts.push({ t: Math.random() * 6, rot: Math.random() * 6, vr: 0, sway: 0, drag: 0.985, g: 0.12, ...p });
  if (!raf) raf = requestAnimationFrame(loop);
}

const pick = (arr) => arr[(Math.random() * arr.length) | 0];

export function burst(x, y, { count = 70, hearts = true } = {}) {
  if (reduce()) return;
  ensure();
  for (let i = 0; i < count; i++) {
    const ang = Math.random() * Math.PI * 2;
    const sp = 3 + Math.random() * 7;
    add({
      x, y,
      vx: Math.cos(ang) * sp,
      vy: Math.sin(ang) * sp - 4,
      size: hearts && i % 3 === 0 ? 7 + Math.random() * 7 : 4 + Math.random() * 6,
      kind: hearts && i % 3 === 0 ? "heart" : "flake",
      color: i % 3 === 0 && hearts ? pick(["#e9b7a0", "#f3d39a", "#d6b46a"]) : pick(GOLDS),
      vr: (Math.random() - 0.5) * 0.3,
      sway: 0.6,
      life: 110 + Math.random() * 60,
    });
  }
}

export function dust(x, y) {
  if (reduce()) return;
  ensure();
  for (let i = 0; i < 2; i++) {
    add({
      x: x + (Math.random() - 0.5) * 16, y,
      vx: (Math.random() - 0.5) * 1.6, vy: -Math.random() * 1.5,
      g: 0.08, size: 0.8 + Math.random() * 1.6, kind: "dot",
      color: pick(GOLDS), life: 40 + Math.random() * 30,
    });
  }
}

// Gold flecks pouring out of the seam when the card opens
// Gold flecks bursting out of the envelope's centre as it opens
export function seamShower() {
  if (reduce()) return;
  ensure();
  const cx = innerWidth / 2, cy = innerHeight * 0.52;
  for (let i = 0; i < 110; i++) {
    const ang = Math.random() * Math.PI * 2, sp = 1 + Math.random() * 7;
    add({
      x: cx + (Math.random() - 0.5) * 20, y: cy + (Math.random() - 0.5) * 40,
      vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 1.5,
      g: 0.04, drag: 0.975, size: 1 + Math.random() * 2.6,
      kind: Math.random() > 0.55 ? "flake" : "dot",
      vr: (Math.random() - 0.5) * 0.2, sway: 0.4,
      color: pick(GOLDS), life: 90 + Math.random() * 90,
    });
  }
}

export const haptic = (pattern) => {
  try { navigator.vibrate?.(pattern); } catch {}
};

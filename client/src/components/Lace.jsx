// Sheer black lace envelope: geometry + SVG pieces.
// Everything is drawn in one 390×844 space and every layer uses
// preserveAspectRatio="xMidYMid slice", so all layers line up on any screen.
export const VB = "0 0 390 844";
const f = (n) => n.toFixed(1);

// Scalloped lace along a straight edge a→b.
// away=true: bumps point away from `ref`; away=false: toward `ref`.
function scallops(a, b, ref, away, r = 7) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
  const n = Math.max(1, Math.round(L / (2 * r)));
  let nx = dy / L, ny = -dx / L;
  const mx = (a[0] + b[0]) / 2 - ref[0], my = (a[1] + b[1]) / 2 - ref[1];
  const dot = nx * mx + ny * my;
  if ((away && dot < 0) || (!away && dot > 0)) { nx = -nx; ny = -ny; }
  const sweep = nx * (dy / L) + ny * (-dx / L) > 0 ? 1 : 0;
  const rr = L / n / 2;
  let arcs = "";
  const pearls = [], eyelets = [];
  for (let i = 0; i < n; i++) {
    const p1 = [a[0] + (dx * (i + 1)) / n, a[1] + (dy * (i + 1)) / n];
    const pm = [a[0] + (dx * (i + 0.5)) / n, a[1] + (dy * (i + 0.5)) / n];
    arcs += ` A${f(rr)} ${f(rr)} 0 0 ${sweep} ${f(p1[0])} ${f(p1[1])}`;
    eyelets.push([pm[0] + nx * rr * 0.45, pm[1] + ny * rr * 0.45, rr * 0.28]);
    pearls.push([pm[0] - nx * 4.5, pm[1] - ny * 4.5]);
  }
  const inner = `M${f(a[0] - nx * 9)} ${f(a[1] - ny * 9)} L${f(b[0] - nx * 9)} ${f(b[1] - ny * 9)}`;
  return { arcs, pearls, eyelets, inner };
}

// A flap = polygon vertices + which edges get lace
function makeFlap(pts, lace) {
  const c = pts.reduce((s, p) => [s[0] + p[0] / pts.length, s[1] + p[1] / pts.length], [0, 0]);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`, edge = "", inner = "";
  const pearls = [], eyelets = [];
  pts.forEach((p, i) => {
    const q = pts[(i + 1) % pts.length];
    if (lace[i]) {
      const s = scallops(p, q, c, true);
      d += s.arcs;
      edge += `M${f(p[0])} ${f(p[1])}${s.arcs}`;
      inner += s.inner;
      pearls.push(...s.pearls);
      eyelets.push(...s.eyelets);
    } else d += ` L${f(q[0])} ${f(q[1])}`;
  });
  return { d: d + "Z", edge, inner, pearls, eyelets };
}

export const FLAPS = {
  left:   makeFlap([[-12, 8], [224, 474], [-12, 824]], [1, 1, 0]),
  right:  makeFlap([[402, 8], [402, 824], [166, 474]], [0, 1, 1]),
  bottom: makeFlap([[-12, 856], [-12, 646], [195, 508], [402, 646], [402, 856]], [0, 1, 1, 0, 0]),
  top:    makeFlap([[-12, -12], [402, -12], [402, 22], [195, 336], [-12, 22]], [0, 0, 1, 1, 0]),
};
export const SEAL = { x: 195, y: 330, r: 46 };

// Lace oval card under the flaps
const OVAL = { cx: 195, cy: 432, rx: 158, ry: 338 };
export const CARD = (() => {
  const N = 84, pts = [];
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2;
    pts.push([OVAL.cx + Math.cos(t) * OVAL.rx, OVAL.cy + Math.sin(t) * OVAL.ry]);
  }
  let hole = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  const pearls = [], motifs = [];
  pts.forEach((p, i) => {
    const q = pts[(i + 1) % N];
    const s = scallops(p, q, [OVAL.cx, OVAL.cy], false, 6);
    hole += s.arcs;
    pearls.push(...s.pearls);
    if (i % 3 === 0) {
      const t = (i / N) * Math.PI * 2;
      motifs.push([OVAL.cx + Math.cos(t) * (OVAL.rx + 22), OVAL.cy + Math.sin(t) * (OVAL.ry + 22), (t * 180) / Math.PI]);
    }
  });
  const ring = (k) =>
    `M${OVAL.cx + OVAL.rx + k} ${OVAL.cy} A${OVAL.rx + k} ${OVAL.ry + k} 0 1 1 ${OVAL.cx - OVAL.rx - k} ${OVAL.cy} A${OVAL.rx + k} ${OVAL.ry + k} 0 1 1 ${OVAL.cx + OVAL.rx + k} ${OVAL.cy}`;
  return { d: `M-20 -20 H410 V864 H-20Z ${hole}Z`, hole: hole + "Z", pearls, motifs, ring1: ring(12), ring2: ring(36) };
})();

// Shared defs: one lace pattern (tulle mesh + tiny flowers), sheer fill, pearls
export const LaceDefs = () => (
  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
    <defs>
      <pattern id="lace-flowers" width="38" height="38" patternUnits="userSpaceOnUse">
        {/* tulle mesh + lace flowers in ONE pattern (one fill per flap = less work while animating) */}
        <path d="M9.5 0 L0 9.5 M28.5 0 L38 9.5 M19 0 L0 19 M19 0 L38 19 M28.5 0 L0 28.5 M9.5 0 L38 28.5 M38 0 L0 38 M0 0 L38 38 M9.5 38 L38 9.5 M0 9.5 L28.5 38 M19 38 L38 19 M0 19 L19 38 M28.5 38 L38 28.5 M0 28.5 L9.5 38" stroke="rgba(214,180,106,.10)" strokeWidth=".5" fill="none" />
        <g fill="none" stroke="rgba(214,180,106,.22)" strokeWidth=".7">
          <circle cx="19" cy="19" r="2.2" />
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="19" cy="14.6" rx="2.2" ry="3.4" transform={`rotate(${a} 19 19)`} />
          ))}
          <path d="M0 0 q5 5 0 10 M38 28 q-5 5 0 10 M28 0 q5 4 10 0" />
        </g>
        <circle cx="4" cy="30" r=".9" fill="rgba(246,227,176,.35)" />
        <circle cx="31" cy="7" r=".9" fill="rgba(246,227,176,.35)" />
      </pattern>
      <linearGradient id="sheer" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="rgba(40,32,24,.74)" />
        <stop offset=".5" stopColor="rgba(12,10,8,.64)" />
        <stop offset="1" stopColor="rgba(30,24,18,.74)" />
      </linearGradient>
      <radialGradient id="pearl" cx=".35" cy=".3" r=".8">
        <stop offset="0" stopColor="#fffaf0" />
        <stop offset=".5" stopColor="#ead7a8" />
        <stop offset="1" stopColor="#9c7a3c" />
      </radialGradient>
    </defs>
  </svg>
);

export function Flap({ name, children }) {
  const fl = FLAPS[name];
  return (
    <svg className={`lace-flap lace-${name}`} viewBox={VB} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path d={fl.d} fill="url(#sheer)" />
      <path d={fl.d} fill="url(#lace-flowers)" />
      <path d={fl.inner} className="lace-inner" />
      <path d={fl.edge} className="lace-edge" />
      {fl.eyelets.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} className="lace-eyelet" />)}
      {fl.pearls.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.6" fill="url(#pearl)" />)}
      {children}
    </svg>
  );
}

export function LaceCard() {
  return (
    <svg className="lace-card" viewBox={VB} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path d={CARD.d} fill="#080706" fillRule="evenodd" />
      <path d={CARD.d} fill="url(#lace-flowers)" fillRule="evenodd" />
      <path d={CARD.hole} className="lace-edge" />
      <path d={CARD.ring1} className="lace-inner" />
      <path d={CARD.ring2} className="lace-inner" />
      {CARD.motifs.map(([x, y, a], i) => (
        <g key={i} transform={`translate(${f(x)} ${f(y)}) rotate(${f(a + 90)})`} className="card-motif">
          <path d="M-9 0 Q-4 -6 0 0 Q4 -6 9 0 Q4 6 0 0 Q-4 6 -9 0Z" />
          <circle r="1.6" fill="url(#pearl)" stroke="none" />
        </g>
      ))}
      {CARD.pearls.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.3" fill="url(#pearl)" />)}
    </svg>
  );
}
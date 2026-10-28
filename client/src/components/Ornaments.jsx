// Small gold SVG pieces shared across the page.
export const GoldDefs = () => (
  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
    <defs>
      <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fbeec6" />
        <stop offset=".45" stopColor="#e3c27a" />
        <stop offset="1" stopColor="#a57a34" />
      </linearGradient>
      <linearGradient id="goldH" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#a57a34" />
        <stop offset=".5" stopColor="#f6e3b0" />
        <stop offset="1" stopColor="#a57a34" />
      </linearGradient>
    </defs>
  </svg>
);

// J ♡ A in Parisienne, joined by one thin gold line with a heart loop
export const Monogram = ({ className = "", draw = true }) => (
  <svg className={`monogram ${draw ? "draw" : ""} ${className}`} viewBox="0 0 400 200" role="img" aria-label="J and A monogram">
    <g fill="none" stroke="url(#goldH)" strokeLinecap="round" strokeWidth="1.3">
      <path className="m-lead" pathLength="1" d="M10 168 C 70 168 110 156 134 140" />
      <path className="m-heart" pathLength="1"
        d="M168 112 C 178 110 186 108 194 104 C 184 96 181 88 186 84 C 190 81 194 84 194 89 C 194 84 198 81 202 84 C 207 88 204 96 194 104 C 202 108 210 110 222 110" />
      <path className="m-tail" pathLength="1" d="M302 117 C 322 111 340 96 358 80 C 372 68 384 60 396 56" />
    </g>
    <text className="m-letter m-j" x="118" y="124" fill="url(#gold)">J</text>
    <text className="m-letter m-a" x="206" y="124" fill="url(#gold)">A</text>
  </svg>
);

// Gold wax seal with the monogram pressed into it.
// x / y / size let it sit inside the lace envelope's top flap and move with it.
const SEAL_EDGE = (() => {
  const pts = [];
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2;
    const r = 47 + Math.sin(i * 2.7) * 2.2 + Math.cos(i * 1.3) * 1.4;
    pts.push([50 + Math.cos(a) * r, 50 + Math.sin(a) * r]);
  }
  return "M" + pts.map((p) => p.map((n) => n.toFixed(1)).join(" ")).join(" L") + "Z";
})();

export const WaxSeal = ({ x, y, size }) => (
  <svg className="wax-seal" viewBox="0 0 100 100" x={x} y={y} width={size} height={size} aria-hidden="true">
    <defs>
      <radialGradient id="wax" cx=".35" cy=".3" r=".8">
        <stop offset="0" stopColor="#fdf0c8" />
        <stop offset=".45" stopColor="#d9b366" />
        <stop offset="1" stopColor="#8a6428" />
      </radialGradient>
    </defs>
    <path d={SEAL_EDGE} fill="url(#wax)" />
    <circle cx="50" cy="50" r="35" fill="none" stroke="#9c7531" strokeWidth="1.2" />
    <circle cx="50" cy="50" r="33.5" fill="none" stroke="rgba(255,244,214,.55)" strokeWidth=".6" />
    <g className="seal-mark">
      <text x="27" y="60" className="seal-letter" fill="#7d5a22">J</text>
      <text x="50" y="60" className="seal-letter" fill="#7d5a22">A</text>
      <path d="M48 56 C 44 52 43 49 45 47.6 C 46.6 46.6 48 47.6 48 49 C 48 47.6 49.4 46.6 51 47.6 C 53 49 52 52 48 56Z" fill="#7d5a22" />
    </g>
  </svg>
);

export const Cross = () => (
  <svg className="cross" viewBox="0 0 40 56" aria-hidden="true">
    <path d="M20 2v52M6 16h28" stroke="url(#gold)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
  </svg>
);

export const Rings = () => (
  <svg className="rings" viewBox="0 0 80 60" aria-hidden="true">
    <g fill="none" stroke="url(#gold)" strokeWidth="3">
      <circle cx="31" cy="38" r="15" />
      <circle cx="49" cy="38" r="15" />
      <path d="M43 22l6-8h6l6 8-9 9z" strokeWidth="2" strokeLinejoin="round" />
      <path d="M43 22h18M49 14l3 17M55 14l-3 17" strokeWidth="1" />
    </g>
  </svg>
);

export const Divider = ({ className = "" }) => (
  <div className={`divider ${className}`} aria-hidden="true">
    <span />
    <svg viewBox="0 0 20 18"><path d="M10 17C2 11 0 7 0 4.5 0 2 2 0 4.8 0 7 0 8.6 1.3 10 3c1.4-1.7 3-3 5.2-3C18 0 20 2 20 4.5 20 7 18 11 10 17z" fill="url(#gold)" /></svg>
    <span />
  </div>
);

// Gypsophila-like gold sprig, as on the printed card
const BRANCHES = [
  "M10 300 C 40 230 70 170 120 110 C 150 75 185 45 230 20",
  "M62 205 C 40 180 28 150 30 120",
  "M92 150 C 70 120 66 92 78 64",
  "M125 105 C 120 80 128 55 146 36",
  "M80 178 C 110 170 140 160 165 140",
  "M150 80 C 175 78 198 66 214 50",
  "M40 255 C 70 250 95 240 112 220",
];
const FLOWERS = [
  [30,120],[34,132],[24,140],[78,64],[70,76],[86,80],[146,36],[136,46],[154,48],[165,140],[156,150],[172,128],
  [214,50],[204,58],[222,40],[230,20],[218,24],[112,220],[104,230],[120,212],[60,108],[96,90],[138,60],[186,70],
  [148,152],[198,30],[44,148],[90,236],[128,126],[176,88],
];
export const Sprig = ({ className = "" }) => (
  <svg className={`sprig ${className}`} viewBox="0 0 240 310" aria-hidden="true">
    <g fill="none" stroke="url(#gold)" strokeWidth="1.3" strokeLinecap="round">
      {BRANCHES.map((d, i) => <path key={i} d={d} />)}
    </g>
    <g fill="url(#gold)">
      {FLOWERS.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${0.7 + (i % 4) * 0.12})`}>
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx="0" cy="-3.2" rx="2" ry="3" transform={`rotate(${r})`} />
          ))}
          <circle r="1.4" fill="#5b3d12" />
        </g>
      ))}
    </g>
  </svg>
);

export const Icon = ({ name }) => {
  const paths = {
    calendar: "M5 7h22v20H5zM5 13h22M11 4v6M21 4v6M10 18h3M15 18h3M20 18h3M10 22h3M15 22h3",
    clock: "M16 4a12 12 0 1 1 0 24 12 12 0 0 1 0-24zM16 10v7l5 3",
    pin: "M16 29s-9-9.6-9-16a9 9 0 0 1 18 0c0 6.4-9 16-9 16zM16 9.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z",
  };
  return (
    <svg className="icon" viewBox="0 0 32 32" aria-hidden="true">
      <path d={paths[name]} fill="none" stroke="url(#gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
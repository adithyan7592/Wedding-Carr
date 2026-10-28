import { useRef, useState } from "react";
import { WaxSeal } from "./Ornaments.jsx";
import { LaceDefs, Flap, LaceCard, SEAL } from "./Lace.jsx";
import { burst, haptic } from "../lib/fx.js";

// Sheer black lace envelope. Tap: the seal presses, the top flap (with the
// seal) glides up, the side and bottom flaps slide away, leaving a lace oval.
// The invitation writes itself inside the oval, then the lace widens away.
export default function Envelope({ onOpen }) {
  const [stage, setStage] = useState("closed"); // closed → press → open → reveal → gone
  const sealRef = useRef(null);

  const open = () => {
    if (stage !== "closed") return;
    haptic(20);
    setStage("press");
    const r = sealRef.current?.getBoundingClientRect();
    if (r) burst(r.left + r.width / 2, r.top + r.height / 2, { count: 24, hearts: false });
    setTimeout(() => { setStage("open"); haptic([10, 60, 20]); }, 200);
    setTimeout(onOpen, 900);                        // invitation starts appearing
    setTimeout(() => setStage("reveal"), 1100);     // lace oval widens and fades right away
    setTimeout(() => setStage("gone"), 2100);       // envelope removed from the page
  };

  if (stage === "gone") return null;

  return (
    <div
      className={`envelope stage-${stage}`}
      onClick={open}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), open())}
      role="button"
      tabIndex={0}
      aria-label="Open the invitation"
    >
      <LaceDefs />
      {/* full screen on phones, a centred card on tablet/desktop */}
      <div className="env-stage">
        <LaceCard />
        <Flap name="left" />
        <Flap name="right" />
        <Flap name="bottom" />
        <Flap name="top">
          <g className="seal-group" ref={sealRef}>
            <circle cx={SEAL.x} cy={SEAL.y} r={SEAL.r + 8} className="seal-ring" />
            <WaxSeal x={SEAL.x - SEAL.r} y={SEAL.y - SEAL.r} size={SEAL.r * 2} />
          </g>
        </Flap>

        <p className="env-names" aria-hidden="true">Jancy &amp; Aswin</p>
        <p className="open-hint">Tap the seal to open</p>
      </div>
    </div>
  );
}
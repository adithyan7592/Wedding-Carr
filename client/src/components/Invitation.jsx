import { EVENT } from "../data.js";
import { Cross, Rings, Divider, Sprig } from "./Ornaments.jsx";

// Mirrors the printed card; plays its entrance once the black card has opened.
export default function Invitation() {
  return (
    <section className="invite" aria-label="Invitation">
      <div className="invite-frame">
        <Sprig className="sprig-tl" />
        <Sprig className="sprig-br" />

        <div className="seq s1"><Cross /></div>
        <blockquote className="verse seq s2">
          “{EVENT.verse}”
          <cite>{EVENT.verseRef}</cite>
        </blockquote>
        <Divider className="seq s3" />

        <p className="caps seq s3">Together with our parents</p>
        <p className="parents seq s4">{EVENT.brideParents}</p>
        <p className="house seq s4">{EVENT.brideHouse}</p>

        <p className="caps invite-line seq s5">
          We cordially invite you to celebrate the engagement of our daughter
        </p>

        <h1 className="names">
          <span className="script-name write w1">{EVENT.bride}</span>
          <span className="with seq s7">
            <span className="rule" />
            <Rings />
            <span className="rule" />
          </span>
          <span className="with-word seq s7">with</span>
          <span className="script-name write w2">{EVENT.groom}</span>
        </h1>

        <p className="son-of seq s9">Son of</p>
        <p className="parents seq s9">{EVENT.groomParents}</p>
        <p className="house seq s9">{EVENT.groomHouse}</p>

        <a className="scroll-cue seq s10" href="#date">
          <span>Scroll for the date</span>
          <svg viewBox="0 0 16 24" aria-hidden="true"><path d="M8 2v18M2 14l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
        </a>
      </div>
    </section>
  );
}

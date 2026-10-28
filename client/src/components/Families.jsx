import { EVENT } from "../data.js";
import { Divider } from "./Ornaments.jsx";

export default function Families() {
  return (
    <section className="families" aria-label="Families">
      <h2 className="section-script" data-reveal>Two families, one blessing</h2>
      <div className="family-grid">
        <article className="family" data-reveal>
          <p className="family-role">Bride’s parents</p>
          <p className="parents">{EVENT.brideParents}</p>
          <p className="house">{EVENT.brideHouse}</p>
        </article>
        <article className="family" data-reveal>
          <p className="family-role">Groom’s parents</p>
          <p className="parents">{EVENT.groomParents}</p>
          <p className="house">{EVENT.groomHouse}</p>
        </article>
      </div>
      <Divider />
      <p className="siblings" data-reveal>
        {EVENT.siblings.map((s, i) => (
          <span key={s}>{s}{i < EVENT.siblings.length - 1 && <i aria-hidden="true">|</i>}</span>
        ))}
      </p>
      <p className="with-love" data-reveal>
        <span>With love,</span>
        {EVENT.withLove}
      </p>
    </section>
  );
}

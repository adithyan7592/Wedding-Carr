import { MADHURAM, madhuramCalendarUrl } from "../data.js";
import { Icon } from "./Ornaments.jsx";

// Madhuram Vaippu — shown between the engagement details and the families
export default function Madhuram() {
  const m = MADHURAM;
  return (
    <section className="madhuram" aria-labelledby="madhuram-title">
      <div className="madhuram-card" data-reveal>
        <p className="madhuram-eyebrow">Before the engagement</p>
        <h2 id="madhuram-title" className="section-script">{m.title}</h2>
        <p className="madhuram-sub">{m.subtitle}</p>

        <div className="madhuram-date" aria-label={`${m.day} ${m.dateNum} ${m.month} ${m.year}`}>
          <span className="md-day">{m.day}</span>
          <span className="md-num">{m.dateNum}</span>
          <span className="md-month">{m.month} {m.year}</span>
        </div>

        <div className="madhuram-info">
          {m.time && (
            <p><Icon name="clock" /><span>{m.time}</span></p>
          )}
          <p><Icon name="pin" /><span>{m.venue}<br />{m.venueArea}</span></p>
        </div>

        <div className="detail-actions">
          <a className="btn" href={m.mapsUrl} target="_blank" rel="noopener noreferrer">Open in Maps</a>
          <a className="btn btn-ghost" href={madhuramCalendarUrl()} target="_blank" rel="noopener noreferrer">Add to calendar</a>
        </div>
      </div>
    </section>
  );
}
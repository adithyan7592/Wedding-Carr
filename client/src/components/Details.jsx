import { EVENT, calendarUrl } from "../data.js";
import { Icon, Divider } from "./Ornaments.jsx";
import Countdown from "./Countdown.jsx";

export default function Details() {
  return (
    <section className="details" aria-label="When and where">
      <Countdown />
      <Divider />
      <div className="detail-row" data-reveal>
        <div className="detail">
          <Icon name="calendar" />
          <p>{EVENT.day}<br />{EVENT.dateNum} {EVENT.month} {EVENT.year}</p>
        </div>
        <div className="detail">
          <Icon name="clock" />
          <p>{EVENT.time}</p>
        </div>
        <div className="detail">
          <Icon name="pin" />
          <p>{EVENT.venue}<br />{EVENT.venueArea}</p>
        </div>
      </div>
      <div className="detail-actions" data-reveal>
        <a className="btn" href={EVENT.mapsUrl} target="_blank" rel="noopener noreferrer">Open in Maps</a>
        <a className="btn btn-ghost" href={calendarUrl()} target="_blank" rel="noopener noreferrer">Add to calendar</a>
      </div>
    </section>
  );
}

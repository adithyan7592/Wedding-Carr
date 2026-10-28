import { useEffect, useState } from "react";
import { EVENT } from "../data.js";

const target = new Date(EVENT.dateISO).getTime();
const calc = () => {
  const d = Math.max(0, target - Date.now());
  return { days: Math.floor(d / 864e5), hours: Math.floor(d / 36e5) % 24, minutes: Math.floor(d / 6e4) % 60, seconds: Math.floor(d / 1e3) % 60, over: d === 0 };
};

export default function Countdown() {
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  if (t.over) {
    return <p className="countdown-done" data-reveal>The day is here. Thank you for celebrating with us.</p>;
  }
  const units = [["days", t.days], ["hours", t.hours], ["minutes", t.minutes], ["seconds", t.seconds]];
  return (
    <div className="countdown" data-reveal role="timer" aria-label={`${t.days} days to go`}>
      {units.map(([label, v]) => (
        <div className="cd-unit" key={label}>
          <span className="cd-num"><span key={v} className="tick">{String(v).padStart(2, "0")}</span></span>
          <span className="cd-label">{label}</span>
        </div>
      ))}
    </div>
  );
}

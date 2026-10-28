import { useState } from "react";
import { sendRsvp } from "../api.js";
import { burst, haptic } from "../lib/fx.js";

export default function Rsvp() {
  const [form, setForm] = useState({ name: "", phone: "", attending: true, guests: 1 });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    if (!form.name.trim()) return setError("Add your name so the family knows who’s coming.");
    setError(""); setStatus("sending");
    try {
      await sendRsvp({ ...form, name: form.name.trim() });
      setStatus("sent");
      haptic([20, 40, 20]);
      const r = formEl.getBoundingClientRect();
      if (form.attending && r) burst(r.left + r.width / 2, r.top + 80, { count: 60 });
    } catch (err) {
      setStatus("idle");
      setError(err.message);
    }
  };

  return (
    <section className="rsvp" id="rsvp" aria-labelledby="rsvp-title">
      <h2 id="rsvp-title" className="section-script" data-reveal>Will you join us?</h2>
      {status === "sent" ? (
        <div className="rsvp-done" role="status">
          <svg viewBox="0 0 20 18" className="beat" aria-hidden="true"><path d="M10 17C2 11 0 7 0 4.5 0 2 2 0 4.8 0 7 0 8.6 1.3 10 3c1.4-1.7 3-3 5.2-3C18 0 20 2 20 4.5 20 7 18 11 10 17z" fill="url(#gold)" /></svg>
          <p className="rsvp-thanks">Thank you, {form.name.split(" ")[0]}.</p>
          <p>{form.attending ? `Your RSVP is in. We’ve saved ${form.guests === 1 ? "a seat" : `${form.guests} seats`} for you.` : "We’ll miss you, and we’re grateful for your love."}</p>
        </div>
      ) : (
        <form className="rsvp-form" onSubmit={submit} noValidate data-reveal>
          <div className="choice" role="radiogroup" aria-label="Attendance">
            <button type="button" role="radio" aria-checked={form.attending} className={form.attending ? "on" : ""} onClick={() => set("attending", true)}>
              Joyfully attending
            </button>
            <button type="button" role="radio" aria-checked={!form.attending} className={!form.attending ? "on" : ""} onClick={() => set("attending", false)}>
              Sending love from afar
            </button>
          </div>
          <label className="field">
            <span>Your name</span>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" maxLength={80} />
          </label>
          <label className="field">
            <span>Phone (optional)</span>
            <input value={form.phone} onChange={(e) => set("phone", e.target.value)} type="tel" inputMode="tel" autoComplete="tel" maxLength={20} />
          </label>
          {form.attending && (
            <div className="field stepper-field">
              <span id="guests-label">Number of guests</span>
              <div className="stepper" aria-labelledby="guests-label">
                <button type="button" aria-label="Fewer guests" onClick={() => set("guests", Math.max(1, form.guests - 1))}>−</button>
                <output aria-live="polite">{form.guests}</output>
                <button type="button" aria-label="More guests" onClick={() => set("guests", Math.min(10, form.guests + 1))}>+</button>
              </div>
            </div>
          )}
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="btn btn-wide" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send RSVP"}
          </button>
        </form>
      )}
    </section>
  );
}

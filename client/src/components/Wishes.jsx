import { useEffect, useState } from "react";
import { getWishes, sendWish } from "../api.js";
import { haptic } from "../lib/fx.js";

export default function Wishes() {
  const [wishes, setWishes] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => { getWishes().then(setWishes); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return setError("Add your name and a few words for the couple.");
    setError(""); setSending(true);
    try {
      const w = await sendWish({ name: name.trim(), message: message.trim() });
      setWishes((ws) => [{ ...w, fresh: true }, ...ws]);
      setMessage("");
      haptic(20);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="wishes" aria-labelledby="wishes-title">
      <h2 id="wishes-title" className="section-script" data-reveal>Blessings for the couple</h2>
      <form className="wish-form" onSubmit={submit} noValidate data-reveal>
        <label className="field">
          <span>Your name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} autoComplete="name" />
        </label>
        <label className="field">
          <span>Your blessing</span>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={280} rows={3} />
          <small className="count">{message.length}/280</small>
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn btn-wide" disabled={sending}>{sending ? "Posting…" : "Post blessing"}</button>
      </form>

      {wishes.length === 0 ? (
        <p className="empty">Be the first to leave a blessing for Jancy and Aswin.</p>
      ) : (
        <ul className="wish-list" aria-label="Blessings">
          {wishes.map((w) => (
            <li key={w._id} className={`wish ${w.fresh ? "fresh" : ""}`}>
              <p>“{w.message}”</p>
              <span>{w.name}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

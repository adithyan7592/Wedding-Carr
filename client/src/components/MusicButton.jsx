import { useEffect, useState } from "react";
import { toggleMusic, onMusicChange } from "../lib/music.js";

// Floating gold button: dancing bars while playing, a muted note when paused.
export default function MusicButton({ visible }) {
  const [playing, setPlaying] = useState(false);
  useEffect(() => onMusicChange(setPlaying), []);

  return (
    <button
      type="button"
      className={`music-btn ${visible ? "show" : ""} ${playing ? "playing" : ""}`}
      onClick={toggleMusic}
      aria-pressed={playing}
      aria-label={playing ? "Pause music" : "Play music"}
      title={playing ? "Pause music" : "Play music"}
    >
      {playing ? (
        <span className="bars" aria-hidden="true"><i /><i /><i /><i /></span>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 18V6l10-2v12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="7" cy="18" r="2.2" fill="currentColor" />
          <circle cx="17" cy="16" r="2.2" fill="currentColor" />
          <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}
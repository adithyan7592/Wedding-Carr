// Soft background music.
// Starts from the seal tap (browsers only allow sound after a tap), fades in,
// and can be paused with the floating button. Uses Web Audio for the fade,
// because iPhones ignore audio.volume.
const SRC = "/music.mp3";   // put your track in client/public/music.mp3
const VOLUME = 0.45;        // 0–1, keep it gentle

let audio = null, ctx = null, gain = null, wanted = false;
const listeners = new Set();
const emit = () => listeners.forEach((fn) => fn(!!audio && !audio.paused));

function getAudio() {
  if (!audio) {
    audio = new Audio(SRC);
    audio.loop = true;
    audio.preload = "auto";
    audio.addEventListener("play", emit);
    audio.addEventListener("pause", emit);
  }
  return audio;
}

function setupGraph() {
  if (ctx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  try {
    ctx = new AC();
    gain = ctx.createGain();
    gain.gain.value = 0;
    ctx.createMediaElementSource(getAudio()).connect(gain).connect(ctx.destination);
  } catch {
    ctx = null; gain = null;
  }
}

function fadeTo(target, seconds) {
  if (gain && ctx) {
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(target, now + seconds);
  } else if (audio) {
    audio.volume = target;
  }
}

// Call this directly inside a tap/click handler.
export function startMusic() {
  wanted = true;
  const a = getAudio();
  setupGraph();
  ctx?.resume?.();
  if (!gain) a.volume = 0;
  a.play().then(() => fadeTo(VOLUME, 2.5)).catch(() => {});
}

export function stopMusic() {
  wanted = false;
  if (!audio || audio.paused) return;
  fadeTo(0, 0.5);
  setTimeout(() => audio.pause(), 550);
}

export const toggleMusic = () => (audio && !audio.paused ? stopMusic() : startMusic());

export function onMusicChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Pause when the guest switches apps/tabs, resume when they come back.
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (!audio) return;
    if (document.hidden) audio.pause();
    else if (wanted) { ctx?.resume?.(); audio.play().catch(() => {}); }
  });
}
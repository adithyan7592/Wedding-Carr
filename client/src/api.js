// Talks to the Express API. In the single-file preview build (or if the API is
// unreachable) it falls back to this browser's storage so the page never breaks.
const BASE = import.meta.env.VITE_API_URL || "";
const PREVIEW = !!import.meta.env.VITE_PREVIEW;

const local = {
  get(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
  },
  push(key, item) {
    try { localStorage.setItem(key, JSON.stringify([item, ...local.get(key)].slice(0, 50))); } catch {}
    return item;
  },
};

async function request(path, options) {
  if (PREVIEW) throw new Error("preview");
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  // 502/503/504, or no error message = API not reachable → fall back quietly
  if (!res.ok && (res.status >= 502 || !data.error)) throw new Error("offline");
  if (!res.ok) throw Object.assign(new Error(data.error), { server: true });
  return data;
}

export async function sendRsvp(payload) {
  try {
    return await request("/api/rsvp", { method: "POST", body: JSON.stringify(payload) });
  } catch (e) {
    if (e.server) throw e;
    local.push("rsvp", { ...payload, createdAt: new Date().toISOString() });
    return { ok: true, local: true };
  }
}

export async function getWishes() {
  try {
    return await request("/api/wishes");
  } catch {
    return local.get("wishes");
  }
}

export async function sendWish(payload) {
  try {
    return await request("/api/wishes", { method: "POST", body: JSON.stringify(payload) });
  } catch (e) {
    if (e.server) throw e;
    return local.push("wishes", { _id: String(Date.now()), ...payload, createdAt: new Date().toISOString() });
  }
}

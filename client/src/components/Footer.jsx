import { useState } from "react";
import { Monogram } from "./Ornaments.jsx";

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const data = { title: "Jancy & Aswin · Engagement", text: "You’re invited to the engagement of Jancy Joy and Aswin Jacob on 29 November 2026.", url: location.href };
    try {
      if (navigator.share) return await navigator.share(data);
      await navigator.clipboard.writeText(data.url);
      setCopied(true); setTimeout(() => setCopied(false), 2200);
    } catch {}
  };
  return (
    <footer className="footer">
      <Monogram draw={false} />
      <p>Your presence is the gift we treasure most.</p>
      <button className="btn btn-ghost" onClick={share}>{copied ? "Link copied" : "Share invitation"}</button>
    </footer>
  );
}

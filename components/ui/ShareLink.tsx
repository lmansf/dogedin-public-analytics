"use client";

import { useState } from "react";

// Per-section share affordance: native share sheet where the platform has one
// (phones), copy-to-clipboard everywhere else. The link is the current page
// plus the section anchor, so it works on any deploy URL without config.
export default function ShareLink({
  anchor,
  title,
}: {
  anchor: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = `${location.origin}${location.pathname}#${anchor}`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: `${title} · State of the Pack`, url });
        return;
      } catch {
        // Cancelled or unavailable — fall through to the clipboard.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked (e.g. insecure context) — the anchor in the URL bar
      // after clicking the section link is the manual fallback.
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      aria-label={`Share a link to the ${title} section`}
      className="shrink-0 border-2 border-black bg-white px-2 py-1 text-[10px] font-black uppercase tracking-wide shadow-hard transition-transform hover:-translate-y-0.5"
    >
      {copied ? "Link copied!" : "Share 🔗"}
    </button>
  );
}

import type { Metadata } from "next";
import PackDashboard from "@/components/sections/PackDashboard";

// Chromeless variant for iframing on the main site: no header, no footer, no
// per-section share buttons (share links belong to the full page), just the
// dashboard and a small link out to it.
//
// Dynamic like the full page so an embedded copy is never stale. If this embed
// lands on a very high-traffic host, consider a short `revalidate = 60` here.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false },
};

export default function EmbeddedStateOfThePack() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-4">
      <PackDashboard embed />
      <p className="mt-6 text-right text-xs font-bold text-black/50">
        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="border-b-2 border-black/30 hover:border-black"
        >
          Full State of the Pack dashboard →
        </a>
      </p>
    </div>
  );
}

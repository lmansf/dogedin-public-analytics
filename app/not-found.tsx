import Link from "next/link";
import SiteChrome from "@/components/SiteChrome";

// A 404 lands here. Because the header/footer live in the (site) route group,
// an unmatched path renders inside the bare root layout — so wrap it in the
// shared chrome to keep the branded shell instead of an unstyled Next default.
export default function NotFound() {
  return (
    <SiteChrome>
      <div className="mx-auto max-w-xl border-[3px] border-black bg-white p-8 text-center shadow-hard">
        <p className="text-5xl">🐾</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold">
          This trail went cold
        </h1>
        <p className="mt-2 text-sm font-bold text-black/60">
          That page isn&apos;t part of the pack. Head back to the live
          community stats.
        </p>
        <Link
          href="/"
          className="mt-5 inline-block border-[3px] border-black bg-[var(--gold)] px-4 py-2 text-xs font-black uppercase tracking-wide shadow-hard transition-transform hover:-translate-y-0.5"
        >
          ← State of the Pack
        </Link>
      </div>
    </SiteChrome>
  );
}

import { SITE_URL } from "@/lib/supabase";

// The full-page chrome (header + footer). The /embed route skips this layout
// so the dashboard can be iframed on the main site without double branding.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b-[3px] border-black bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🐾</span>
            <div>
              <p className="font-display text-xl font-extrabold leading-none">
                State of the Pack
              </p>
              <p className="text-[11px] font-black uppercase tracking-wide text-black/50">
                Dogedin · Dunedin, FL
              </p>
            </div>
          </div>
          <a
            href={SITE_URL}
            className="border-[3px] border-black bg-[var(--gold)] px-3 py-1.5 text-xs font-black uppercase tracking-wide shadow-hard transition-transform hover:-translate-y-0.5"
          >
            dogedin.com →
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      <footer className="border-t-[3px] border-black bg-white">
        <p className="mx-auto max-w-5xl px-4 py-4 text-xs font-bold text-black/50">
          Counted with love from public community data — no tracking, no
          personal info, just the pack. 🏴 Scotland of the Sunshine State.
        </p>
      </footer>
    </>
  );
}

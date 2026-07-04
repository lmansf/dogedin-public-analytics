import type { Metadata } from "next";
import { Fraunces, Nunito } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/supabase";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-display",
});

const body = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "State of the Pack · Dogedin",
  description:
    "Live community statistics for Dunedin, FL's dog club: how the pack is growing, who's making friends, and how the local dog-friendly scene is doing.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen">
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
      </body>
    </html>
  );
}

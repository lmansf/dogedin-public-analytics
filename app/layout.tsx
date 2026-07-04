import type { Metadata } from "next";
import { Fraunces, Nunito } from "next/font/google";
import "./globals.css";
import { DASHBOARD_URL } from "@/lib/supabase";

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

const TITLE = "State of the Pack · Dogedin";
const DESCRIPTION =
  "Live community statistics for Dunedin, FL's dog club: how the pack is growing, who's making friends, and how the local dog-friendly scene is doing.";

// metadataBase makes the OG/twitter image URLs absolute. When
// NEXT_PUBLIC_DASHBOARD_URL isn't set, Next falls back to the deployment's
// own URL (or localhost in dev), so relative metadata still resolves.
export const metadata: Metadata = {
  ...(DASHBOARD_URL ? { metadataBase: new URL(DASHBOARD_URL) } : {}),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Dogedin",
    type: "website",
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

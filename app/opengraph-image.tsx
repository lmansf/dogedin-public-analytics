import { ImageResponse } from "next/og";
import { getPackStats } from "@/lib/stats";

// Social-share card: the brand header plus three headline stats, restyled in
// the site's neo-brutalist idiom (Satori can't read CSS custom properties, so
// the palette hexes from globals.css are inlined). Uses the same
// getPackStats() as the page — including the labelled sample-data fallback,
// which the card marks honestly.
export const alt =
  "State of the Pack — live community statistics for Dogedin, Dunedin FL";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

const SAND = "#f4e9ce";
const INK = "#211e18";
const GOLD = "#c99a2e";
const TURQ = "#1fa89b";

export default async function OpengraphImage() {
  const s = await getPackStats();
  const stats = [
    { label: "Registered dogs", value: s.dogs.total.toLocaleString("en-US") },
    { label: "Friendships", value: s.social.friendships.toLocaleString("en-US") },
    { label: "Paws in 30 days", value: s.social.paws30.toLocaleString("en-US") },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: SAND,
          padding: 56,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 64, fontWeight: 800, color: INK }}>
              State of the Pack
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: 4,
                color: INK,
                opacity: 0.55,
                textTransform: "uppercase",
              }}
            >
              Dogedin · Dunedin, FL
            </div>
          </div>
          <div
            style={{
              display: "flex",
              backgroundColor: s.demo ? GOLD : TURQ,
              border: `4px solid ${INK}`,
              boxShadow: `8px 8px 0 0 ${INK}`,
              padding: "12px 24px",
              fontSize: 24,
              fontWeight: 800,
              color: s.demo ? INK : SAND,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            {s.demo ? "Sample data" : "Live pack stats"}
          </div>
        </div>

        <div style={{ display: "flex", gap: 32, marginTop: 72 }}>
          {stats.map((t) => (
            <div
              key={t.label}
              style={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                backgroundColor: "#ffffff",
                border: `5px solid ${INK}`,
                boxShadow: `10px 10px 0 0 ${INK}`,
                padding: "36px 40px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 24,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  color: INK,
                  opacity: 0.55,
                }}
              >
                {t.label}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 88,
                  fontWeight: 800,
                  color: INK,
                  marginTop: 12,
                }}
              >
                {t.value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            fontSize: 26,
            fontWeight: 700,
            color: INK,
            opacity: 0.6,
          }}
        >
          Counted with love from public community data — no tracking, just the pack.
        </div>
      </div>
    ),
    { ...size }
  );
}

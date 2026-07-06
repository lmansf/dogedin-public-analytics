import PackDashboard from "@/components/sections/PackDashboard";

// Render on every request so the public "State of the Pack" numbers are always
// current. Reads are all public views + aggregate RPCs (see lib/stats.ts); if
// this page ever draws heavy traffic, swap this for a short `revalidate = 60`
// to cap DB load while staying near-live.
export const dynamic = "force-dynamic";

export default function StateOfThePack() {
  return <PackDashboard />;
}

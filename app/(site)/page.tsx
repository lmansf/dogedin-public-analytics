import PackDashboard from "@/components/sections/PackDashboard";

// Re-counts hourly; the underlying reads are all public views + aggregate
// RPCs (see lib/stats.ts).
export const revalidate = 3600;

export default function StateOfThePack() {
  return <PackDashboard />;
}

import { getPackStats } from "@/lib/stats";
import { SITE_URL } from "@/lib/supabase";
import StatTile from "@/components/charts/StatTile";
import BarRows from "@/components/charts/BarRows";
import TrendChart from "@/components/charts/TrendChart";
import PawLeaderboard from "@/components/sections/PawLeaderboard";
import ShareLink from "@/components/ui/ShareLink";

// The whole dashboard, shared by the full page (/) and the chromeless embed
// (/embed). Community-first: it celebrates the pack; the underlying reads are
// all public views + aggregate RPCs (see lib/stats.ts).
export default async function PackDashboard({ embed = false }: { embed?: boolean }) {
  const s = await getPackStats();

  return (
    <div className="flex flex-col gap-10">
      {s.demo && (
        <p className="border-[3px] border-black bg-[var(--gold)]/30 px-4 py-2 text-xs font-black uppercase tracking-wide">
          Sample data — set NEXT_PUBLIC_SUPABASE_URL / ANON_KEY to show the real
          pack.
        </p>
      )}
      {s.degraded && (
        <p className="border-2 border-black bg-white px-4 py-2 text-xs font-bold text-black/60">
          Some live data is temporarily unavailable — a few numbers below may
          show lower than they really are. Fresh counts return automatically.
        </p>
      )}

      {/* ------------------------------------------------ Pack census */}
      <section id="pack-census" className="flex scroll-mt-6 flex-col gap-4">
        <SectionHead
          kicker="Pack census"
          title="The pack keeps growing"
          blurb={`${s.dogs.new90} dogs joined in the last 90 days.`}
          anchor={embed ? undefined : "pack-census"}
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile label="Registered dogs" value={s.dogs.total.toLocaleString("en-US")} />
          <StatTile label="New in 90 days" value={`+${s.dogs.new90}`} />
          <StatTile
            label="With a photo"
            value={`${s.dogs.photoPct}%`}
            hint="of profiles"
          />
          <StatTile
            label="Tag-protected"
            value={`${s.dogs.tagPct}%`}
            hint="lost-dog contact on"
          />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Registered dogs over time">
            <TrendChart
              labels={s.weeks}
              series={[
                { name: "Registered dogs", color: "var(--series-3)", values: s.dogs.growth },
              ]}
            />
          </Card>
          <Card title="Breeds of the pack">
            <BarRows rows={s.dogs.breeds} color="var(--series-4)" maxRows={8} />
          </Card>
        </div>
      </section>

      {/* ------------------------------------------------ Social pulse */}
      <section id="social-pulse" className="flex scroll-mt-6 flex-col gap-4">
        <SectionHead
          kicker="Social pulse"
          title="Friends, photos & paws"
          blurb="What the pack has been up to lately."
          anchor={embed ? undefined : "social-pulse"}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatTile label="Friendships" value={s.social.friendships.toLocaleString("en-US")} />
          <StatTile label="Photos · 30 days" value={s.social.posts30.toLocaleString("en-US")} />
          <StatTile label="Paws · 30 days" value={s.social.paws30.toLocaleString("en-US")} />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Photos & paws per week">
            <TrendChart
              labels={s.weeks}
              series={[
                { name: "Paws", color: "var(--series-2)", values: s.social.pawsPerWeek },
                { name: "Photos", color: "var(--series-1)", values: s.social.postsPerWeek },
              ]}
            />
          </Card>
          <Card title="Pawpularity contest 🏆">
            <PawLeaderboard rows={s.social.leaderboard} />
          </Card>
        </div>
      </section>

      {/* ------------------------------------------------ Local scene */}
      <section id="local-scene" className="flex scroll-mt-6 flex-col gap-4">
        <SectionHead
          kicker="Local scene"
          title="Dunedin's dog-friendly map"
          blurb="The places the pack goes, straight from the local guide."
          anchor={embed ? undefined : "local-scene"}
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile label="Places listed" value={s.scene.businesses.toLocaleString("en-US")} />
          <StatTile
            label="Dog friendly"
            value={s.scene.dogFriendly.toLocaleString("en-US")}
            hint={`of ${s.scene.businesses}`}
          />
          <StatTile
            label="Avg rating"
            value={s.scene.avgRating ? `${s.scene.avgRating}★` : "—"}
            hint={`${s.scene.reviews.toLocaleString("en-US")} reviews`}
          />
          <StatTile label="Open Sundays" value={s.scene.openSunday.toLocaleString("en-US")} />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Places by category">
            <BarRows rows={s.scene.categories} color="var(--series-1)" maxRows={8} />
          </Card>
          <Card title="Show some love 💛">
            {s.scene.needsReview.length === 0 ? (
              <p className="text-sm font-bold text-black/50">
                Every listed spot has at least one review. Well done, Dunedin.
              </p>
            ) : (
              <>
                <p className="mb-3 text-sm font-bold text-black/60">
                  These spots don&apos;t have a review yet — been there with your
                  dog? Be their first.
                </p>
                <ul className="flex flex-col gap-2">
                  {s.scene.needsReview.map((b) => (
                    <li key={b.slug}>
                      <a
                        href={`${SITE_URL}/things-to-do`}
                        className="flex items-center justify-between border-2 border-black bg-[var(--sand)] px-3 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5"
                      >
                        {b.name}
                        <span className="text-xs font-black uppercase text-[var(--turq)]">
                          Review →
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Card>
        </div>
      </section>

      {/* ------------------------------------------------ Join CTA */}
      <section className="relative overflow-hidden border-[3px] border-black bg-[var(--turq)] p-6 text-center shadow-hard-lg">
        <div className="dots absolute inset-0" />
        <div className="relative">
          <h2 className="font-display text-3xl font-extrabold text-[var(--sand)]">
            Your dog counts too 🐾
          </h2>
          <p className="mx-auto mt-1 max-w-md text-sm font-bold text-[var(--sand)]/90">
            Every Dunedin dog gets a free profile page — and a spot in these
            numbers.
          </p>
          <a
            href={`${SITE_URL}/register`}
            className="mt-4 inline-block border-[3px] border-black bg-[var(--gold)] px-5 py-2 text-sm font-black uppercase tracking-wide text-[var(--ink)] shadow-hard transition-transform hover:-translate-y-0.5"
          >
            Register your dog →
          </a>
        </div>
      </section>
    </div>
  );
}

function SectionHead({
  kicker,
  title,
  blurb,
  anchor,
}: {
  kicker: string;
  title: string;
  blurb: string;
  anchor?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <span className="inline-block -rotate-1 border-2 border-black bg-[var(--ink)] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[var(--sand)]">
          {kicker}
        </span>
        <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight">
          {title}
        </h2>
        <p className="text-sm font-bold text-black/50">{blurb}</p>
      </div>
      {anchor && <ShareLink anchor={anchor} title={title} />}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-[3px] border-black bg-white p-4 shadow-hard">
      <h3 className="mb-3 text-sm font-black uppercase tracking-wide">{title}</h3>
      {children}
    </div>
  );
}

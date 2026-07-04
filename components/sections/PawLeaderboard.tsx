"use client";

import { dogPhotoUrl, SITE_URL } from "@/lib/supabase";

const MEDALS = ["🥇", "🥈", "🥉"];

// Pawpularity ranking with a proportional paw bar per dog — a ranked bar list
// wearing faces. Values all sit at the row end; bars share one hue since rank
// is carried by order, not color.
export default function PawLeaderboard({
  rows,
}: {
  rows: { name: string; slug: string; paws: number; photo: string | null }[];
}) {
  if (rows.length === 0) {
    return (
      <p className="text-sm font-bold text-black/40">
        No paws given yet — the contest starts with the first photo.
      </p>
    );
  }
  const max = Math.max(1, ...rows.map((r) => r.paws));

  return (
    <ol className="flex flex-col gap-2">
      {rows.map((r, i) => {
        const img = dogPhotoUrl(r.photo);
        return (
          <li key={r.slug}>
            <a
              href={`${SITE_URL}/dog/${r.slug}`}
              className="flex items-center gap-2 rounded px-1 py-0.5 transition-colors hover:bg-black/5"
            >
              <span className="w-6 shrink-0 text-center text-sm font-black">
                {MEDALS[i] ?? i + 1}
              </span>
              <span className="h-7 w-7 shrink-0 overflow-hidden rounded-full border-2 border-black bg-[var(--sand)]">
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-xs">
                    🐶
                  </span>
                )}
              </span>
              <span className="w-20 shrink-0 truncate text-xs font-bold">{r.name}</span>
              <span className="relative h-4 flex-1">
                <span
                  className="absolute inset-y-0 left-0 rounded-r-[4px]"
                  style={{
                    width: `${Math.max(2, (100 * r.paws) / max)}%`,
                    background: "var(--series-2)",
                  }}
                />
              </span>
              <span className="w-10 shrink-0 text-right text-xs font-black tabular-nums">
                {r.paws} 🐾
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

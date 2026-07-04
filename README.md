# Dogedin · State of the Pack (public analytics)

A public, shareable dashboard of community statistics for
[dogedin.com](https://dogedin.com) — how the pack is growing, who's making
friends, and how Dunedin's dog-friendly scene is doing. Community-first by
design: it celebrates the pack, it doesn't track anyone.

## What it shows

- **Pack census** — registered-dog growth, breeds, % with photos, % with the
  lost-dog tag contact turned on.
- **Social pulse** — friendships, photos and paws per week, the pawpularity
  contest top 10.
- **Local scene** — the dog-friendly directory by category, review climate,
  Sunday-open coverage, and a "needs its first review" spotlight.

## Data access (why this is safe to host publicly)

Everything is read with the Supabase **anon key** through surfaces that are
already public on the main site: `public_dog_profiles`, `public_businesses`,
approved `dog_posts`, `post_likes`, `reviews`, and the `breed_counts()` /
`friendship_dates()` / `pawpularity_leaderboard()` aggregate functions (with a
temporary fallback to the old accepted-`dog_friendships` select until the main
site's schema adds `friendship_dates()`). No service-role key, no privileged
reads, no personal data beyond what a dog's public profile page already shows.

## Setup

```bash
npm install
cp .env.local.example .env.local   # fill in the Supabase URL + anon key
npm run dev                        # http://localhost:4001
```

With no env configured the app renders labelled **sample data**, so you can
work on the design without touching production.

Stats revalidate hourly (`revalidate = 3600` in `app/(site)/page.tsx`).

## Sharing

- Pasted links unfurl with a live-stats social card (`app/opengraph-image.tsx`).
- Each section has an anchor (`#pack-census`, `#social-pulse`, `#local-scene`)
  and a share button that copies / shares the deep link.
- `/embed` is a chromeless variant (no header/footer) for iframing the
  dashboard on the main site.

## Deploy

It's a stock Next.js 15 app — deploy to Vercel and set the two
`NEXT_PUBLIC_SUPABASE_*` env vars (plus `NEXT_PUBLIC_SITE_URL` if the main
site isn't at dogedin.com, and `NEXT_PUBLIC_DASHBOARD_URL` for absolute
social-card URLs).

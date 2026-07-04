# Shareability proposals — State of the Pack

Ranked ways to get the dashboard in front of the community (and the community
into the numbers). Effort is engineering effort; impact is a judgment call on
how much community reach/engagement each buys for Dunedin's actual scale
(dozens-to-hundreds of members, not thousands). Items marked **DONE** shipped
with this branch.

| # | Idea | Effort | Impact | Status |
|---|------|--------|--------|--------|
| 1 | OG / social cards | done | High | **DONE** |
| 2 | Per-section share links | done | Medium | **DONE** |
| 3 | Embed on the main site | done (dashboard side) | High | **DONE — needs main-site consumer** |
| 4 | Weekly "State of the Pack" Instagram snapshot | Medium | High | Proposed |
| 5 | Milestone auto-callouts | Medium | High | Proposed |
| 6 | Pawpularity share buttons on dog profiles | Small (main-site change) | High | Proposed |
| 7 | QR poster for local businesses | Small | Medium | Proposed |
| 8 | "Dog-friendly on Dogedin" badge for business websites | Small–Medium | Medium | Proposed |
| 9 | Monthly email digest | Medium | Medium | Proposed |

## 1. OG / social cards — DONE

Pasting the dashboard URL into iMessage/Slack/Facebook/X now unfurls a branded
card (`app/opengraph-image.tsx`) with three live headline stats (registered
dogs, friendships, paws in 30 days), regenerated hourly. Works in demo mode
too and labels sample data honestly. Zero ongoing effort; every share of the
link now carries numbers instead of a bare title.

Owner action: set `NEXT_PUBLIC_DASHBOARD_URL` on Vercel so card URLs are
absolute on custom domains (falls back to the deployment URL otherwise).

## 2. Per-section share links — DONE

Each section (`#pack-census`, `#social-pulse`, `#local-scene`) has an anchor
and a Share button — native share sheet on phones, copy-to-clipboard on
desktop. Lets someone send exactly "look at the breed chart" instead of "go to
this page and scroll".

## 3. Embed on the main site — DONE, needs a consumer

`/embed` renders the dashboard with no header/footer, ready for an iframe.
The remaining work is one small main-site change: an iframe (or a "community
stats" page) on dogedin.com pointing at it. That puts the numbers where the
members already are — the single highest-leverage follow-up.

```html
<iframe src="https://<dashboard-url>/embed" title="State of the Pack"
        style="width:100%;border:0;min-height:2400px"></iframe>
```

## 4. Weekly "State of the Pack" Instagram snapshot — Medium effort, High impact

The main repo already has the hard part: a `post_queue` table, admin approval
UI (`/admin/posts`), and Edge Functions (`daily-post`, `publish-post`,
`_shared/mod.ts:publishQueueRow`) that publish to the Instagram Graph API with
rate-limit and once-a-day guards. Proposal:

- Add an image route here (e.g. `/snapshot.png`, 1080×1350 portrait via
  `next/og`, same technique as the OG card) rendering the week's numbers:
  new dogs, new friendships, paws given, pawpularity winner.
- A weekly cron (pg_cron or a second Edge Function) inserts a `post_queue` row
  with that image URL + a generated caption; the existing admin approval and
  publish flow does the rest. No new credentials, no new moderation surface.

Why high impact: it's recurring content for the existing IG audience that
directly advertises registration ("your dog counts too").

## 5. Milestone auto-callouts — Medium effort, High impact

"100th dog registered", "500th paw given", "every listed business reviewed".
Cheapest version (small effort): compute upcoming/passed milestones in
`lib/stats.ts` from data already fetched and render a celebration banner on
the dashboard ("87 dogs — 13 to go until 100!"). That much is honest, static,
and needs no infrastructure. The fuller version wires milestone detection into
the IG queue (piggybacks on #4) so the 100th dog becomes a post the day it
happens. Recommend shipping the banner first, the IG hook with #4.

Caution: never fabricate proximity — only render a milestone banner from real
counts (the demo dataset should either hide it or clearly label sample data,
same as the existing banner).

## 6. Pawpularity share buttons on dog profiles — Small effort (main site), High impact

Owners are the distribution channel: "Biscuit is #2 in Dunedin this week" is
the single most shareable sentence this platform produces. Add a share button
on the main site's dog profile pages (and/or next to the leaderboard) that
shares the dog's profile URL; the dog pages would want their own OG card with
photo + paw count (the pattern from `app/opengraph-image.tsx` here transfers
directly). This is a main-site change, listed for completeness and because it
likely beats everything above on virality per hour of work.

## 7. QR poster for local businesses — Small effort, Medium impact

A printable A5/letter poster: "How dog-friendly is Dunedin? See the State of
the Pack" + QR code to the dashboard (or to `${SITE_URL}/register`). The 21
dog-friendly businesses already listed are natural hosts, and it recruits
exactly the people who are out with their dogs. Effort is design + a PDF (a
`/poster` print-styled route here, or a one-off in the media kit repo — note
`/home/user/dogedin-media-kit` exists and may be the right home). Needs no
backend. Impact is local-physical rather than viral, which for a town-sized
community may be worth more than social reach.

## 8. "Dog-friendly on Dogedin" badge for business sites — Small–Medium, Medium impact

A tiny embeddable snippet businesses can put on their own sites: "Dog friendly
· listed on Dogedin" linking to their listing. Gives businesses a reason to
link back (SEO + traffic), turns the directory into a network. Needs a small
badge image/iframe route and a copy-paste snippet on the business page.
Depends on per-business pages existing on the main site.

## 9. Monthly email digest — Medium effort, Medium impact

A "State of the Pack monthly" email to registered owners: growth, pawpularity
podium, new places. Owners already have accounts (emails exist), but this
needs a sending pipeline, unsubscribe handling, and template work — the most
infrastructure of anything here. Worth doing once the IG snapshot (#4) proves
the content format; the same numbers feed both.

## Deliberately not proposed

- Paid social / SEO plays — wrong scale for a town community project.
- Public API for the stats — no identified consumer; the embed covers the
  main-site need with less surface area.
- Auto-posting without the existing admin approval step — the moderation
  posture in the main repo is deliberate; keep humans in the loop.

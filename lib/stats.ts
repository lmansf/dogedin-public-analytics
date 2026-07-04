import { supabase } from "@/lib/supabase";
import {
  lastWeeks,
  countPerWeek,
  cumulativePerWeek,
  type WeekBucket,
} from "@/lib/format";

// Everything the page renders, in one fetch. All reads go through public
// surfaces only: public views (public_dog_profiles, public_businesses),
// public-select tables (dog_posts approved, post_likes, accepted
// dog_friendships, reviews of approved businesses) and SECURITY DEFINER
// aggregate RPCs (breed_counts, pawpularity_leaderboard). When Supabase isn't
// configured the app renders believable sample data and says so.

export type PackStats = {
  demo: boolean;
  weeks: string[]; // 12 week labels, oldest first
  dogs: {
    total: number;
    new90: number;
    photoPct: number;
    tagPct: number;
    growth: number[]; // cumulative registered dogs per week
    breeds: { label: string; value: number }[];
  };
  social: {
    friendships: number;
    posts30: number;
    paws30: number;
    postsPerWeek: number[];
    pawsPerWeek: number[];
    leaderboard: { name: string; slug: string; paws: number; photo: string | null }[];
  };
  scene: {
    businesses: number;
    dogFriendly: number;
    avgRating: number | null;
    reviews: number;
    openSunday: number;
    categories: { label: string; value: number }[];
    needsReview: { name: string; slug: string }[];
  };
};

const WEEK_COUNT = 12;

export async function getPackStats(): Promise<PackStats> {
  if (!supabase) return demoStats();
  const weeks = lastWeeks(WEEK_COUNT);

  const [profilesQ, breedsQ, postsQ, likesQ, friendsQ, boardQ, bizQ, reviewsQ] =
    await Promise.all([
      supabase
        .from("public_dog_profiles")
        .select("created_at, photo_path, lost_contact_opt_in")
        .limit(10000),
      supabase.rpc("breed_counts"),
      supabase.from("dog_posts").select("created_at").limit(10000),
      supabase.from("post_likes").select("created_at").limit(20000),
      supabase
        .from("dog_friendships")
        .select("created_at")
        .eq("status", "accepted")
        .limit(10000),
      supabase.rpc("pawpularity_leaderboard", { p_limit: 10 }),
      supabase
        .from("public_businesses")
        .select("id, name, slug, category, dog_friendly, hours")
        .limit(2000),
      supabase.from("reviews").select("business_id, rating").limit(10000),
    ]);

  const profiles = profilesQ.data ?? [];
  const posts = postsQ.data ?? [];
  const likes = likesQ.data ?? [];
  const friends = friendsQ.data ?? [];
  const businesses = bizQ.data ?? [];
  const reviews = reviewsQ.data ?? [];

  const now = Date.now();
  const d30 = now - 30 * 86400_000;
  const d90 = now - 90 * 86400_000;
  const profileDates = profiles.map((p) => new Date(p.created_at));

  const reviewedIds = new Set(reviews.map((r) => r.business_id));
  const categories = new Map<string, number>();
  for (const b of businesses) {
    categories.set(b.category, (categories.get(b.category) ?? 0) + 1);
  }

  return {
    demo: false,
    weeks: weeks.map((w) => w.label),
    dogs: {
      total: profiles.length,
      new90: profileDates.filter((d) => d.getTime() > d90).length,
      photoPct: share(profiles.filter((p) => p.photo_path).length, profiles.length),
      tagPct: share(
        profiles.filter((p) => p.lost_contact_opt_in).length,
        profiles.length
      ),
      growth: cumulativePerWeek(profileDates, weeks),
      breeds: ((breedsQ.data as { breed: string; count: number }[]) ?? []).map(
        (b) => ({ label: b.breed || "Unknown", value: Number(b.count) })
      ),
    },
    social: {
      friendships: friends.length,
      posts30: posts.filter((p) => new Date(p.created_at).getTime() > d30).length,
      paws30: likes.filter((l) => new Date(l.created_at).getTime() > d30).length,
      postsPerWeek: countPerWeek(posts.map((p) => new Date(p.created_at)), weeks),
      pawsPerWeek: countPerWeek(likes.map((l) => new Date(l.created_at)), weeks),
      leaderboard: (
        (boardQ.data as
          | { dog_name: string; slug: string; paw_count: number; photo_path: string | null }[]
          | null) ?? []
      ).map((d) => ({
        name: d.dog_name,
        slug: d.slug,
        paws: Number(d.paw_count),
        photo: d.photo_path,
      })),
    },
    scene: {
      businesses: businesses.length,
      dogFriendly: businesses.filter((b) => b.dog_friendly).length,
      avgRating: reviews.length
        ? Math.round((reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) * 10) / 10
        : null,
      reviews: reviews.length,
      openSunday: businesses.filter((b) => {
        const sun = (b.hours as Record<string, { closed?: boolean; open?: string | null }> | null)
          ?.sunday;
        return sun ? !sun.closed && !!sun.open : false;
      }).length,
      categories: [...categories.entries()]
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value),
      needsReview: businesses
        .filter((b) => !reviewedIds.has(b.id))
        .slice(0, 6)
        .map((b) => ({ name: b.name, slug: b.slug })),
    },
  };
}

function share(part: number, whole: number): number {
  return whole ? Math.round((100 * part) / whole) : 0;
}

// ---------------------------------------------------------------------------
// Sample data — keeps the app fully designed with no env configured. Numbers
// are believable for a small-town community site, not aspirational.
// ---------------------------------------------------------------------------
function demoStats(): PackStats {
  const weeks = lastWeeks(WEEK_COUNT).map((w: WeekBucket) => w.label);
  return {
    demo: true,
    weeks,
    dogs: {
      total: 87,
      new90: 34,
      photoPct: 71,
      tagPct: 44,
      growth: [41, 45, 48, 53, 57, 60, 66, 70, 74, 79, 83, 87],
      breeds: [
        { label: "Golden Retriever", value: 11 },
        { label: "Mixed / rescue", value: 10 },
        { label: "Labrador", value: 8 },
        { label: "Scottish Terrier", value: 7 },
        { label: "French Bulldog", value: 6 },
        { label: "Corgi", value: 5 },
        { label: "Australian Shepherd", value: 5 },
        { label: "Dachshund", value: 4 },
      ],
    },
    social: {
      friendships: 63,
      posts30: 42,
      paws30: 187,
      postsPerWeek: [4, 6, 5, 8, 7, 9, 8, 11, 10, 9, 12, 10],
      pawsPerWeek: [12, 19, 17, 25, 24, 31, 28, 39, 41, 44, 47, 45],
      leaderboard: [
        { name: "Angus", slug: "angus", paws: 48, photo: null },
        { name: "Biscuit", slug: "biscuit", paws: 41, photo: null },
        { name: "Pepper", slug: "pepper", paws: 36, photo: null },
        { name: "Maple", slug: "maple", paws: 29, photo: null },
        { name: "Gus", slug: "gus", paws: 24, photo: null },
        { name: "Luna", slug: "luna", paws: 22, photo: null },
        { name: "Banjo", slug: "banjo", paws: 18, photo: null },
        { name: "Skye", slug: "skye", paws: 15, photo: null },
      ],
    },
    scene: {
      businesses: 24,
      dogFriendly: 21,
      avgRating: 4.6,
      reviews: 58,
      openSunday: 14,
      categories: [
        { label: "Breweries & bars", value: 7 },
        { label: "Cafés & restaurants", value: 6 },
        { label: "Parks & trails", value: 4 },
        { label: "Pet services", value: 4 },
        { label: "Shops", value: 3 },
      ],
      needsReview: [
        { name: "Causeway Coffee Co.", slug: "causeway-coffee" },
        { name: "Salty Dog Outfitters", slug: "salty-dog-outfitters" },
        { name: "Hammock Park", slug: "hammock-park" },
      ],
    },
  };
}

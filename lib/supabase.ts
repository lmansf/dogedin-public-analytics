import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Anon-key client, or null when the env isn't configured (the app then renders
// its built-in sample data). This app only ever reads public views and
// SECURITY DEFINER aggregate functions — the anon key is the whole story.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null;

// Force https and strip trailing slashes so a hand-typed env value ("http://
// dogedin.com/", "dogedin.com") can never emit mixed-scheme or double-slash
// links from the markup.
function normalizeSiteUrl(raw: string): string {
  const bare = raw.trim().replace(/^[a-z]+:\/\//i, "").replace(/\/+$/, "");
  return `https://${bare}`;
}

export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || "https://dogedin.com"
);

// This dashboard's own deployed URL — for social-card metadata and share
// links, independent of the main site's NEXT_PUBLIC_SITE_URL. Optional: when
// unset, Next.js derives absolute metadata URLs from the deployment itself
// and share links stay relative.
export const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL
  ? normalizeSiteUrl(process.env.NEXT_PUBLIC_DASHBOARD_URL)
  : null;

// Public URL for a dog photo stored in the dog-photos bucket.
export function dogPhotoUrl(path: string | null): string | null {
  if (!path || !url) return null;
  return `${url}/storage/v1/object/public/dog-photos/${path}`;
}

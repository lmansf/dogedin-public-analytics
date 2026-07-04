import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Anon-key client, or null when the env isn't configured (the app then renders
// its built-in sample data). This app only ever reads public views and
// SECURITY DEFINER aggregate functions — the anon key is the whole story.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dogedin.com";

// Public URL for a dog photo stored in the dog-photos bucket.
export function dogPhotoUrl(path: string | null): string | null {
  if (!path || !url) return null;
  return `${url}/storage/v1/object/public/dog-photos/${path}`;
}

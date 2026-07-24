// Supabase client for the website server. Reads use the anon key (RLS limits it
// to published blogs); if a service key is provided it is used instead.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

function url(): string | undefined {
  return process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
}
function key(): string | undefined {
  return (
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isSupabaseConfigured(): boolean {
  return Boolean(url() && key());
}

export function getSupabase(): SupabaseClient | null {
  if (client) return client;
  const u = url();
  const k = key();
  if (!u || !k) return null;
  client = createClient(u, k, { auth: { persistSession: false } });
  return client;
}

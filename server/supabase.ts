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

export function supabaseMissingVars(): string[] {
  const missing: string[] = [];
  if (!url()) missing.push("SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)");
  if (!key()) missing.push("SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY)");
  return missing;
}

let warned = false;

export function getSupabase(): SupabaseClient | null {
  if (client) return client;
  const u = url();
  const k = key();
  if (!u || !k) {
    if (!warned) {
      warned = true;
      console.error(
        "[Supabase] NOT CONFIGURED — blogs will be empty and form submissions " +
          "cannot be stored. Missing: " + supabaseMissingVars().join(", ")
      );
    }
    return null;
  }
  client = createClient(u, k, { auth: { persistSession: false } });
  return client;
}

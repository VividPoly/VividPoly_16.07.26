// Public, read-only Supabase access for the website. Safe to use in client
// components: it only ever uses the anon key, and Row Level Security on the
// `blogs` table limits it to published posts. Blog creation/editing happens in
// the separate admin app (admin_Vivid), never here.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { blogFromRow, type Blog, type BlogRow } from './blog';

let client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function getClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  if (!client) {
    client = createClient(url, anonKey, { auth: { persistSession: false } });
  }
  return client;
}

// Fetch published blogs, newest first.
// - With Supabase configured: reads from the shared database (works in prod).
// - Without Supabase (local dev): reads posts the admin app saved locally, via
//   the /api/local-blogs bridge route. Returns [] if neither is available so
//   the caller falls back to the static blog list.
export async function fetchPublishedBlogs(): Promise<Blog[]> {
  if (!isSupabaseConfigured()) {
    try {
      const res = await fetch('/api/local-blogs');
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data.blogs) ? (data.blogs as Blog[]) : [];
    } catch {
      return [];
    }
  }
  const { data, error } = await getClient()
    .from('blogs')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data as BlogRow[]).map(blogFromRow);
}

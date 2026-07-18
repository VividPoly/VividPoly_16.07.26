import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// LOCAL DEV BRIDGE ONLY.
//
// While Supabase isn't configured, the admin app (admin_Vivid) saves blogs to a
// local file. This route lets the website read that same file so posts you add
// in the admin show up on the local site during development.
//
// In production you configure Supabase instead, and the website reads from
// there (see src/lib/supabase.ts) — this route just returns an empty list.
// The admin app may live either inside the website project (admin_Vivid/) or
// as a sibling folder next to it (../admin_Vivid/). Try both.
const CANDIDATE_FILES = [
  path.join(process.cwd(), 'admin_Vivid', '.data', 'blogs.json'),
  path.join(process.cwd(), '..', 'admin_Vivid', '.data', 'blogs.json'),
];

async function readBlogsFile(): Promise<string> {
  for (const file of CANDIDATE_FILES) {
    try {
      return await fs.readFile(file, 'utf8');
    } catch {
      // Try the next candidate location.
    }
  }
  throw new Error('blogs.json not found in any known location');
}

export async function GET() {
  try {
    const raw = await readBlogsFile();
    const all = JSON.parse(raw);
    const blogs = Array.isArray(all)
      ? all
          .filter((b) => b && b.published)
          .sort((a, b) =>
            String(b.createdAt).localeCompare(String(a.createdAt)),
          )
      : [];
    return NextResponse.json({ blogs });
  } catch {
    // No file yet, or unreadable — nothing to show.
    return NextResponse.json({ blogs: [] });
  }
}

// Shared blog types + helpers used by the admin panel, API routes, and the
// public blog page. Keep the shape in sync with the `blogs` table (see
// supabase/schema.sql).

export type Blog = {
  id: string;
  slug: string;
  title: string;
  purpose: string;
  excerpt: string;
  category: string;
  tags: string[];
  readTime: string;
  coverImageUrl: string | null;
  body: string; // rich HTML from the admin editor
  seoTitle: string;
  seoDescription: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

// A row exactly as Supabase returns it (snake_case columns).
export type BlogRow = {
  id: string;
  slug: string;
  title: string;
  purpose: string | null;
  excerpt: string | null;
  category: string | null;
  tags: string[] | null;
  read_time: string | null;
  cover_image_url: string | null;
  body: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export function blogFromRow(row: BlogRow): Blog {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    purpose: row.purpose ?? '',
    excerpt: row.excerpt ?? '',
    category: row.category ?? '',
    tags: row.tags ?? [],
    readTime: row.read_time ?? '',
    coverImageUrl: row.cover_image_url,
    body: row.body ?? '',
    seoTitle: row.seo_title ?? '',
    seoDescription: row.seo_description ?? '',
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Turn a title into a URL-friendly slug. Kept deterministic so the same title
// yields the same slug; the API adds a numeric suffix on collision.
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

// Rough read-time estimate ("N min read") from body text, used when the admin
// leaves the field blank.
export function estimateReadTime(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export type BlogInput = {
  title: string;
  purpose: string;
  excerpt: string;
  category: string;
  readTime: string;
  coverImageUrl: string | null;
  body: string;
  published: boolean;
};

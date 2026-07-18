// Client helper: fetch an on-the-fly translation of a blog post's text for the
// current locale from /api/translate-blog. Only { id, locale } is sent — the
// server loads the post's English text itself. Results are cached in memory and
// sessionStorage (keyed by slug + source hash + locale) so switching between the
// list and an article, or revisiting, doesn't re-translate; the hash in the key
// means an edited post naturally misses the cache and re-translates. English
// locales resolve to an empty translation (the original English fields show).

import { type Blog, type BlogTranslation, blogSourceHash } from './blog';

const memory = new Map<string, BlogTranslation>();
const REQUEST_TIMEOUT_MS = 20_000;

function isEnglish(locale: string): boolean {
  return !locale || locale === 'en' || locale.startsWith('en-');
}

export async function fetchBlogTranslation(
  blog: Blog,
  locale: string,
): Promise<BlogTranslation> {
  if (isEnglish(locale) || !blog.id) return {};
  const key = `${blog.slug}:${blogSourceHash(blog)}:${locale}`;
  const cached = memory.get(key);
  if (cached) return cached;

  try {
    const stored = sessionStorage.getItem(`blogtx:${key}`);
    if (stored) {
      const value = JSON.parse(stored) as BlogTranslation;
      memory.set(key, value);
      return value;
    }
  } catch {
    /* sessionStorage unavailable — fall through to fetch */
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch('/api/translate-blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: blog.id, locale }),
      signal: controller.signal,
    });
    if (!res.ok) return {};
    const value = (await res.json()) as BlogTranslation;
    memory.set(key, value);
    try {
      sessionStorage.setItem(`blogtx:${key}`, JSON.stringify(value));
    } catch {
      /* ignore quota / privacy-mode errors */
    }
    return value;
  } catch {
    return {}; // network error / timeout — keep English
  } finally {
    clearTimeout(timer);
  }
}

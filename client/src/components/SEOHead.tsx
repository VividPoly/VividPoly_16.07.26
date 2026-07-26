import { useEffect } from 'react';
import { SITE_ORIGIN } from '@/data/seo.generated';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  /** Path only, e.g. "/products/valve-bags". Resolved against SITE_ORIGIN. */
  canonicalPath?: string;
  noindex?: boolean;
  /** Absolute or root-relative image for og:image / twitter:image. */
  image?: string;
  /** JSON-LD blocks to keep in <head> while this component is mounted. */
  schema?: Record<string, unknown>[];
}

/** Also the logo URL used by the Organization schema, so the two stay in sync. */
const DEFAULT_OG_IMAGE = '/vividpoly-logo.png';

/** Marks the tags this component owns so they can be reconciled, not duplicated. */
const OWNED = 'data-seo-head';

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    el.setAttribute(OWNED, '');
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    el.setAttribute(OWNED, '');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function absoluteUrl(pathOrUrl: string) {
  return pathOrUrl.startsWith('http') ? pathOrUrl : `${SITE_ORIGIN}${pathOrUrl}`;
}

/**
 * Applies per-page title, meta, canonical, social tags and JSON-LD.
 *
 * This is a client-rendered SPA, so these land after hydration. Googlebot and
 * Bingbot render JS and pick them up; the static fallbacks in index.html cover
 * crawlers that do not.
 */
export function SEOHead({
  title,
  description,
  keywords,
  canonicalPath,
  noindex,
  image,
  schema,
}: SEOHeadProps) {
  useEffect(() => {
    document.title = title;

    setMeta('meta[name="robots"]', 'name', 'robots',
      noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large');
    setMeta('meta[name="description"]', 'name', 'description', description);
    if (keywords) setMeta('meta[name="keywords"]', 'name', 'keywords', keywords);

    const ogImage = absoluteUrl(image ?? DEFAULT_OG_IMAGE);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:image"]', 'property', 'og:image', ogImage);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

    if (canonicalPath) {
      const href = absoluteUrl(canonicalPath);
      setLink('canonical', href);
      setMeta('meta[property="og:url"]', 'property', 'og:url', href);
    }
  }, [title, description, keywords, canonicalPath, noindex, image]);

  // JSON-LD is a separate effect so route changes swap the blocks cleanly
  // instead of leaving the previous page's Product/Breadcrumb behind.
  useEffect(() => {
    if (!schema?.length) return;
    const nodes = schema.map((block) => {
      const el = document.createElement('script');
      el.type = 'application/ld+json';
      el.setAttribute(OWNED, '');
      el.textContent = JSON.stringify(block);
      document.head.appendChild(el);
      return el;
    });
    return () => nodes.forEach((n) => n.remove());
  }, [schema]);

  return null;
}

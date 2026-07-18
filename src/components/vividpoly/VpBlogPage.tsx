'use client';

import { useEffect, useState } from 'react';
import VpSubpageTop from '@/components/vividpoly/VpSubpageTop';
import { ChevronRightIcon } from '@/components/vividpoly/VividPolyIcons';
import type { VpBreadcrumb } from '@/lib/vividpoly-navigation';
import { fetchPublishedBlogs } from '@/lib/supabase';
import {
  type Blog,
  type BlogTranslation,
  localizeBlog,
  translationIsCurrent,
} from '@/lib/blog';
import { fetchBlogTranslation } from '@/lib/blog-i18n';
import VpContactEnquiryForm, {
  type ContactEnquiryFormProps,
} from '@/components/vividpoly/VpContactEnquiryForm';
import { useLocale, useLocaleMessages } from '@/lib/i18n/LocaleProvider';

type BlogRow = {
  title: string;
  purpose: string;
  excerpt: string;
  category: string;
  readTime: string;
  open: () => void;
};

type SiteCopy = {
  blogIntro: string;
  blogReadArticle: string;
};

type VpBlogPageProps = {
  blogRows: BlogRow[];
  breadcrumbs: VpBreadcrumb[];
  onHomeClick?: () => void;
  siteCopy: SiteCopy;
  // Same enquiry form used elsewhere on the site; rendered as a sticky card
  // beside the article when provided.
  enquiryForm?: Omit<ContactEnquiryFormProps, 'variant' | 'onSubmitSuccess'>;
  // Lets the parent know when a full article is open (vs. the list) so it can,
  // e.g., hide the floating enquiry popup only on the article view.
  onArticleOpenChange?: (open: boolean) => void;
};

export default function VpBlogPage({
  blogRows,
  breadcrumbs,
  onHomeClick,
  siteCopy,
  enquiryForm,
  onArticleOpenChange,
}: VpBlogPageProps) {
  // Blogs published from the admin app. `null` while loading, then the live
  // list (empty state shown when there are none).
  const [posts, setPosts] = useState<Blog[] | null>(null);
  const [activePost, setActivePost] = useState<Blog | null>(null);
  const { blog } = useLocaleMessages();
  const { locale } = useLocale();
  // On-the-fly translations of blog text for the current locale, keyed by
  // `${slug}:${updatedAt}:${locale}`. Filled in the background from
  // /api/translate-blog; until a post's translation arrives it shows English.
  const [txMap, setTxMap] = useState<Record<string, BlogTranslation>>({});

  const applyTx = (b: Blog): Blog => {
    // Prefer a freshly fetched translation; otherwise use the DB one only if it
    // matches the current source (not stale). Else show English until it loads.
    const fresh = txMap[`${b.id}:${locale}`];
    const dbTx = b.translations?.[locale];
    const tx = fresh ?? (translationIsCurrent(b, dbTx) ? dbTx : undefined);
    if (!tx) return b;
    return localizeBlog({ ...b, translations: { ...b.translations, [locale]: tx } }, locale);
  };

  // Fetch translations for the open article and the list posts when the locale
  // is non-English. Fetches are cached (memory + sessionStorage + server), so
  // re-running on state changes is cheap.
  useEffect(() => {
    if (!locale || locale === 'en' || locale.startsWith('en-')) return;
    const targets = [...(activePost ? [activePost] : []), ...(posts ?? [])];
    let cancelled = false;
    (async () => {
      // De-dupe (the open article may also appear in the list) and drop posts
      // whose stored translation is already current — those need no request.
      const seen = new Set<string>();
      const pending = targets.filter((b) => {
        if (seen.has(b.id)) return false;
        seen.add(b.id);
        // Skip only if the stored translation is current AND real; stale (post
        // edited) or a failed English row falls through to re-translate.
        return !translationIsCurrent(b, b.translations?.[locale]);
      });

      // Translate a few posts at once (instead of one-by-one, top to bottom) so
      // the cards fill in together. Kept small to stay under the free Google
      // endpoint's rate limit — too many at once just triggers 429s.
      const CONCURRENCY = 3;
      let cursor = 0;
      const worker = async () => {
        while (cursor < pending.length && !cancelled) {
          const b = pending[cursor];
          cursor += 1;
          const tx = await fetchBlogTranslation(b, locale);
          if (cancelled || !tx || Object.keys(tx).length === 0) continue;
          const key = `${b.id}:${locale}`;
          setTxMap((m) => (m[key] ? m : { ...m, [key]: tx }));
        }
      };
      await Promise.all(
        Array.from({ length: Math.min(CONCURRENCY, pending.length) }, worker),
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [locale, posts, activePost]);

  useEffect(() => {
    let cancelled = false;
    fetchPublishedBlogs()
      .then((data) => {
        if (!cancelled) setPosts(data);
      })
      .catch(() => {
        if (!cancelled) setPosts([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Report article-open state up to the parent (used to hide the enquiry popup
  // only while reading an article). Reset to false when leaving the blog.
  useEffect(() => {
    onArticleOpenChange?.(Boolean(activePost));
  }, [activePost, onArticleOpenChange]);
  useEffect(() => {
    return () => onArticleOpenChange?.(false);
  }, [onArticleOpenChange]);

  // --- Full article view -------------------------------------------------
  if (activePost) {
    // Show the active locale's translation where available (title, body, etc.);
    // tags/cover image stay as authored. Falls back to English per field.
    const post = applyTx(activePost);
    const metaParts = [
      ...(post.tags ?? []).map((t) => `#${t}`),
      post.readTime,
    ].filter(Boolean);
    return (
      <div
        data-screen-label="Blog"
        className="vp-blog-page vp-page-shell vp-blog-article-view"
      >
        <VpSubpageTop
          breadcrumbs={breadcrumbs}
          onHomeClick={onHomeClick}
          className="vp-blog-top"
        />

        <div className="vp-blog-layout vp-blog-layout--article">
          <div className="vp-blog-main">
            <button
              type="button"
              className="vp-blog-back"
              onClick={() => setActivePost(null)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                color: 'inherit',
                font: 'inherit',
                marginBottom: 12,
                opacity: 0.75,
              }}
            >
              <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}>
                <ChevronRightIcon size={14} />
              </span>
              {blog.backToArticles}
            </button>
            <h1 className="vp-h1 vp-blog-title">{post.title}</h1>
            {metaParts.length > 0 && (
              <p className="vp-blog-intro">{metaParts.join('  ·  ')}</p>
            )}
            <article className="vp-blog-article" style={{ maxWidth: 760 }}>
              {post.coverImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.coverImageUrl}
                  alt=""
                  style={{
                    width: '100%',
                    borderRadius: 14,
                    marginBottom: 24,
                    display: 'block',
                  }}
                />
              )}
              <div
                className="vp-blog-article-body"
                dangerouslySetInnerHTML={{ __html: post.body }}
              />
            </article>
          </div>

          {enquiryForm && (
            <aside className="vp-blog-enquiry-col">
              <div className="vp-blog-enquiry-card">
                <div className="vp-blog-enquiry-head">
                  <h2 className="vp-blog-enquiry-title">
                    {enquiryForm.copy.sendRequirement || 'Send an enquiry'}
                  </h2>
                </div>
                <div className="vp-blog-enquiry-body">
                  <VpContactEnquiryForm {...enquiryForm} variant="modal" />
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    );
  }

  // --- Blog list ---------------------------------------------------------
  return (
    <div data-screen-label="Blog" className="vp-blog-page vp-page-shell">
      <VpSubpageTop
        breadcrumbs={breadcrumbs}
        onHomeClick={onHomeClick}
        className="vp-blog-top"
      >
        <h1 className="vp-h1 vp-blog-title">{blog.pageTitle}</h1>
        <p className="vp-blog-intro">{siteCopy.blogIntro}</p>
      </VpSubpageTop>

      <div className="vp-blog-layout vp-blog-layout--single">
        <div className="vp-blog-main">
          {posts === null ? (
            <p
              className="vp-blog-intro"
              style={{ textAlign: 'center', padding: '32px 0' }}
            >
              {blog.loading}
            </p>
          ) : posts.length === 0 && blogRows.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 16px' }}>
              <h2 className="vp-blog-card-title" style={{ marginBottom: 8 }}>
                {blog.emptyTitle}
              </h2>
              <p className="vp-blog-intro">
                {blog.emptyBody}
              </p>
            </div>
          ) : (
            <div className="vp-blog-grid">
              {/* Admin-published posts (from the admin app / Supabase) */}
              {posts.map((rawPost) => {
                // Localized copy for display; keep the raw post for opening so
                // the article view localizes it against the current locale too.
                const post = applyTx(rawPost);
                return (
                  <article
                    key={rawPost.id}
                    className="vp-blog-card"
                    onClick={() => setActivePost(rawPost)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setActivePost(rawPost);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    {post.coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="vp-blog-card-media"
                        src={post.coverImageUrl}
                        alt=""
                        style={{ objectFit: 'cover', width: '100%' }}
                      />
                    ) : (
                      <div className="vp-blog-card-media vp-ph" aria-hidden="true" />
                    )}
                    <div className="vp-blog-card-body">
                      <h2 className="vp-blog-card-title">{post.title}</h2>
                      <div className="vp-blog-card-footer">
                        <span className="vp-blog-card-tags">
                          {(post.tags ?? []).slice(0, 2).map((tag) => (
                            <span className="vp-blog-card-tag" key={tag}>
                              {tag}
                            </span>
                          ))}
                        </span>
                        <span className="vp-blog-card-cta">
                          {siteCopy.blogReadArticle}
                          <ChevronRightIcon size={14} />
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
              {/* Original sample cards built into the site */}
              {blogRows.map((row, index) => (
                <article
                  key={`static-${index}-${row.title}`}
                  className="vp-blog-card"
                  onClick={() => row.open()}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      row.open();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="vp-blog-card-media vp-ph" aria-hidden="true" />
                  <div className="vp-blog-card-body">
                    <h2 className="vp-blog-card-title">{row.title}</h2>
                    <div className="vp-blog-card-footer">
                      <span className="vp-blog-card-tags">
                        {row.category && (
                          <span className="vp-blog-card-tag">{row.category}</span>
                        )}
                        {row.readTime && (
                          <span className="vp-blog-card-tag">{row.readTime}</span>
                        )}
                      </span>
                      <span className="vp-blog-card-cta">
                        {siteCopy.blogReadArticle}
                        <ChevronRightIcon size={14} />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

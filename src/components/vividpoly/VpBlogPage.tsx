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

  // --- List filters (search / date / topic) ------------------------------
  type DateFilter = 'all' | '7' | '30' | '90' | 'year';
  // `query` is the debounced/committed term used for filtering; `searchInput`
  // is what the user is typing. They stay in sync so results update live, but a
  // separate input lets the search field also be submitted via the button/Enter.
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [topic, setTopic] = useState('all');

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
  // Topics come from the authored tags (which aren't translated) plus any
  // categories on the built-in sample cards, de-duped and alphabetised.
  const topicSet = new Set<string>();
  (posts ?? []).forEach((p) => (p.tags ?? []).forEach((t) => t && topicSet.add(t)));
  blogRows.forEach((r) => r.category && topicSet.add(r.category));
  const topics = Array.from(topicSet).sort((a, b) => a.localeCompare(b));

  const q = query.trim().toLowerCase();
  const now = Date.now();
  const withinDate = (iso: string): boolean => {
    if (dateFilter === 'all') return true;
    const d = new Date(iso);
    const t = d.getTime();
    if (Number.isNaN(t)) return false;
    if (dateFilter === 'year') return d.getFullYear() === new Date().getFullYear();
    const days = Number(dateFilter);
    return now - t <= days * 24 * 60 * 60 * 1000;
  };

  // Filter the admin-published posts by search term, date range and topic.
  const filteredPosts = (posts ?? []).filter((raw) => {
    if (!withinDate(raw.createdAt)) return false;
    if (topic !== 'all' && !(raw.tags ?? []).includes(topic) && raw.category !== topic)
      return false;
    if (q) {
      const local = applyTx(raw);
      const hay = [local.title, local.excerpt, local.category, ...(raw.tags ?? [])]
        .join(' ')
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  // The built-in sample cards carry no publish date, so any date filter other
  // than "All time" hides them.
  const filteredRows = blogRows.filter((row) => {
    if (dateFilter !== 'all') return false;
    if (topic !== 'all' && row.category !== topic) return false;
    if (q) {
      const hay = [row.title, row.excerpt, row.category].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const resultCount = filteredPosts.length + filteredRows.length;
  const filtersActive = q !== '' || dateFilter !== 'all' || topic !== 'all';
  const clearFilters = () => {
    setSearchInput('');
    setQuery('');
    setDateFilter('all');
    setTopic('all');
  };

  const dateOptions: { value: DateFilter; label: string }[] = [
    { value: 'all', label: blog.dateAll },
    { value: '7', label: blog.date7 },
    { value: '30', label: blog.date30 },
    { value: '90', label: blog.date90 },
    { value: 'year', label: blog.dateYear },
  ];

  const countLabel =
    resultCount === 1
      ? blog.articlesOne
      : (blog.articlesMany || '{count} articles').replace('{count}', String(resultCount));

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

      {posts === null ? (
        <div className="vp-blog-layout vp-blog-layout--single">
          <div className="vp-blog-main">
            <p
              className="vp-blog-intro"
              style={{ textAlign: 'center', padding: '32px 0' }}
            >
              {blog.loading}
            </p>
          </div>
        </div>
      ) : posts.length === 0 && blogRows.length === 0 ? (
        <div className="vp-blog-layout vp-blog-layout--single">
          <div className="vp-blog-main">
            <div style={{ textAlign: 'center', padding: '48px 16px' }}>
              <h2 className="vp-blog-card-title" style={{ marginBottom: 8 }}>
                {blog.emptyTitle}
              </h2>
              <p className="vp-blog-intro">{blog.emptyBody}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="vp-blog-layout vp-blog-layout--index">
          {/* Left rail: search, date range and topic filters. */}
          <aside className="vp-blog-filters" aria-label={blog.searchLabel}>
            <form
              className="vp-blog-filter-group"
              onSubmit={(event) => {
                event.preventDefault();
                setQuery(searchInput);
              }}
            >
              <h2 className="vp-blog-filter-label">{blog.searchLabel}</h2>
              <div className="vp-blog-search">
                <input
                  type="search"
                  className="vp-blog-search-input"
                  placeholder={blog.searchPlaceholder}
                  value={searchInput}
                  aria-label={blog.searchLabel}
                  onChange={(event) => {
                    // Live filtering as the user types; the button/Enter just
                    // commits the same value (kept for the expected affordance).
                    setSearchInput(event.target.value);
                    setQuery(event.target.value);
                  }}
                />
                <button
                  type="submit"
                  className="vp-blog-search-btn"
                  aria-label={blog.searchSubmit}
                >
                  <ChevronRightIcon size={18} />
                </button>
              </div>
            </form>

            <div className="vp-blog-filter-group">
              <h2 className="vp-blog-filter-label">{blog.dateLabel}</h2>
              <div className="vp-blog-chip-list vp-blog-chip-list--stack">
                {dateOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`vp-blog-chip${dateFilter === opt.value ? ' is-active' : ''}`}
                    aria-pressed={dateFilter === opt.value}
                    onClick={() => setDateFilter(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {topics.length > 0 && (
              <div className="vp-blog-filter-group">
                <h2 className="vp-blog-filter-label">{blog.topicsLabel}</h2>
                <div className="vp-blog-chip-list">
                  <button
                    type="button"
                    className={`vp-blog-chip${topic === 'all' ? ' is-active' : ''}`}
                    aria-pressed={topic === 'all'}
                    onClick={() => setTopic('all')}
                  >
                    {blog.topicsAll}
                  </button>
                  {topics.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`vp-blog-chip${topic === t ? ' is-active' : ''}`}
                      aria-pressed={topic === t}
                      onClick={() => setTopic(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <div className="vp-blog-main">
            <p className="vp-blog-count">{countLabel}</p>

            {resultCount === 0 ? (
              <div className="vp-blog-noresults">
                <h2 className="vp-blog-card-title" style={{ marginBottom: 8 }}>
                  {blog.noResultsTitle}
                </h2>
                <p className="vp-blog-intro" style={{ marginBottom: 16 }}>
                  {blog.noResultsBody}
                </p>
                {filtersActive && (
                  <button
                    type="button"
                    className="vp-blog-chip is-active"
                    onClick={clearFilters}
                  >
                    {blog.clearFilters}
                  </button>
                )}
              </div>
            ) : (
              <div className="vp-blog-grid">
                {/* Admin-published posts (from the admin app / Supabase) */}
                {filteredPosts.map((rawPost) => {
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
              {filteredRows.map((row, index) => (
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
      )}
    </div>
  );
}

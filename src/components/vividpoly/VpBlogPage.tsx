'use client';

import { useEffect, useState } from 'react';
import VpSubpageTop from '@/components/vividpoly/VpSubpageTop';
import { ChevronRightIcon } from '@/components/vividpoly/VividPolyIcons';
import type { VpBreadcrumb } from '@/lib/vividpoly-navigation';
import { fetchPublishedBlogs } from '@/lib/supabase';
import type { Blog } from '@/lib/blog';
import VpContactEnquiryForm, {
  type ContactEnquiryFormProps,
} from '@/components/vividpoly/VpContactEnquiryForm';

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
    const metaParts = [
      ...(activePost.tags ?? []).map((t) => `#${t}`),
      activePost.readTime,
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
              Back to all articles
            </button>
            <h1 className="vp-h1 vp-blog-title">{activePost.title}</h1>
            {metaParts.length > 0 && (
              <p className="vp-blog-intro">{metaParts.join('  ·  ')}</p>
            )}
            <article className="vp-blog-article" style={{ maxWidth: 760 }}>
              {activePost.coverImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activePost.coverImageUrl}
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
                dangerouslySetInnerHTML={{ __html: activePost.body }}
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
        <h1 className="vp-h1 vp-blog-title">Buyer guides &amp; insights</h1>
        <p className="vp-blog-intro">{siteCopy.blogIntro}</p>
      </VpSubpageTop>

      <div className="vp-blog-layout vp-blog-layout--single">
        <div className="vp-blog-main">
          {posts === null ? (
            <p
              className="vp-blog-intro"
              style={{ textAlign: 'center', padding: '32px 0' }}
            >
              Loading articles…
            </p>
          ) : posts.length === 0 && blogRows.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 16px' }}>
              <h2 className="vp-blog-card-title" style={{ marginBottom: 8 }}>
                No articles yet
              </h2>
              <p className="vp-blog-intro">
                New buyer guides and insights are on the way — check back soon.
              </p>
            </div>
          ) : (
            <div className="vp-blog-grid">
              {/* Admin-published posts (from the admin app / Supabase) */}
              {posts.map((post) => (
                  <article
                    key={post.id}
                    className="vp-blog-card"
                    onClick={() => setActivePost(post)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setActivePost(post);
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
              ))}
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

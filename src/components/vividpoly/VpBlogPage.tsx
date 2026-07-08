'use client';

import VpSubpageTop from '@/components/vividpoly/VpSubpageTop';
import type { VpBreadcrumb } from '@/lib/vividpoly-navigation';

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
  blogLeadTitle: string;
  blogLeadBody: string;
  blogLeadCta: string;
  blogReadArticle: string;
};

type VpBlogPageProps = {
  blogRows: BlogRow[];
  breadcrumbs: VpBreadcrumb[];
  onHomeClick?: () => void;
  siteCopy: SiteCopy;
  onEnquire: () => void;
};

export default function VpBlogPage({
  blogRows,
  breadcrumbs,
  onHomeClick,
  siteCopy,
  onEnquire,
}: VpBlogPageProps) {
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

      <div className="vp-blog-layout">
        <div className="vp-blog-main">
          <div className="vp-blog-grid">
            {blogRows.map((post, index) => (
              <article
                key={index}
                className="vp-blog-card"
                onClick={post.open}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    post.open();
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="vp-blog-card-media vp-ph" aria-hidden="true" />
                <div className="vp-blog-card-body">
                  <div className="vp-blog-card-meta">
                    <span className="vp-blog-card-read">{post.readTime}</span>
                  </div>
                  <h2 className="vp-blog-card-title">{post.title}</h2>
                  <p className="vp-blog-card-excerpt">{post.excerpt}</p>
                  <div className="vp-blog-card-footer">
                    <span className="vp-blog-card-tags">
                      <span className="vp-blog-card-tag">{post.category}</span>
                    </span>
                    <span className="vp-blog-card-cta">
                      {siteCopy.blogReadArticle}
                      <span aria-hidden="true"> →</span>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="vp-blog-lead" aria-label="Product enquiry">
          <div className="vp-blog-lead-card">
            <div className="vp-blog-lead-copy">
              <h2 className="vp-blog-lead-title">{siteCopy.blogLeadTitle}</h2>
              <p className="vp-blog-lead-text">{siteCopy.blogLeadBody}</p>
            </div>
            <button type="button" className="vp-cta-primary vp-cta-primary--lg vp-cta-primary--block" onClick={onEnquire}>
              {siteCopy.blogLeadCta}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

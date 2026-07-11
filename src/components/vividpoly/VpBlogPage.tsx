'use client';

import VpSubpageTop from '@/components/vividpoly/VpSubpageTop';
import { ChevronRightIcon } from '@/components/vividpoly/VividPolyIcons';
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
  blogReadArticle: string;
};

type VpBlogPageProps = {
  blogRows: BlogRow[];
  breadcrumbs: VpBreadcrumb[];
  onHomeClick?: () => void;
  siteCopy: SiteCopy;
};

export default function VpBlogPage({
  blogRows,
  breadcrumbs,
  onHomeClick,
  siteCopy,
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

      <div className="vp-blog-layout vp-blog-layout--single">
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
                  <h2 className="vp-blog-card-title">{post.title}</h2>
                  <div className="vp-blog-card-footer">
                    <span className="vp-blog-card-tags">
                      <span className="vp-blog-card-tag">{post.category}</span>
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
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import VpSubpageTop from '@/components/vividpoly/VpSubpageTop';
import type { VpBreadcrumb } from '@/lib/vividpoly-navigation';

type CareerReason = {
  title: string;
  body: string;
};

type CareerPlatform = {
  id: string;
  label: string;
  href: string;
  blurb?: string;
};

type CareersCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  applyNow: string;
  applyHref: string;
  whyHeading: string;
  whyLead: string;
  whyBody?: string;
  reasons: CareerReason[];
  positionsEyebrow: string;
  positionsHeading: string;
  positionsLead: string;
  positionsNote: string;
  positionsMoreLabel?: string;
  platforms: CareerPlatform[];
  ctaEyebrow: string;
  ctaHeading: string;
  ctaLead: string;
};

type VpCareersPageProps = {
  copy: CareersCopy;
  breadcrumbs: VpBreadcrumb[];
  onHomeClick?: () => void;
};

/** Official platform wordmarks (icon + brand name), logo only in tile. */
const PLATFORM_WORDMARKS: Record<string, string> = {
  linkedin: '/images/platforms/linkedin.svg',
  indeed: '/images/platforms/indeed.svg',
  naukri: '/images/platforms/naukri.png',
};

function PlatformLogo({ id, label }: { id: string; label: string }) {
  const src = PLATFORM_WORDMARKS[id];
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <span className="vp-careers-platform-logo-wrap" data-platform={label}>
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="vp-careers-platform-logo"
          src={src}
          alt=""
          decoding="async"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="vp-careers-platform-fallback">{label}</span>
      )}
    </span>
  );
}

export default function VpCareersPage({
  copy,
  breadcrumbs,
  onHomeClick,
}: VpCareersPageProps) {
  const moreLabel = copy.positionsMoreLabel || 'VIEW OPENINGS';

  return (
    <div data-screen-label="Careers" className="vp-careers-page">
      <div className="vp-page-shell vp-careers-top">
        <VpSubpageTop
          breadcrumbs={breadcrumbs}
          onHomeClick={onHomeClick}
          className="vp-subpage-top--page"
        >
          <h1 id="vp-careers-hero-title" className="vp-h1 vp-subpage-title">
            {copy.title}
          </h1>
          <p className="vp-subpage-intro">{copy.lead}</p>
          <div className="vp-careers-hero-ctas">
            {/* Replace with actual Google Form URL before going live */}
            <a
              href={copy.applyHref}
              className="vp-cta-primary vp-cta-primary--lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              {copy.applyNow}
            </a>
          </div>
        </VpSubpageTop>
      </div>

      <div className="vp-page-shell vp-careers-body">
        <section id="vp-careers-why" className="vp-careers-why" aria-labelledby="vp-careers-why-heading">
          <div className="vp-careers-why-head">
            <h2 id="vp-careers-why-heading" className="vp-h2 vp-careers-why-title">
              {copy.whyHeading}
            </h2>
            <p className="vp-careers-why-lead">{copy.whyLead}</p>
          </div>
          <ul className="vp-careers-why-points">
            {copy.reasons.map((reason, index) => (
              <li key={reason.title} className="vp-careers-why-point">
                <span className="vp-careers-why-point-index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="vp-careers-why-point-title">{reason.title}</h3>
                <p className="vp-careers-why-point-body">{reason.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section
        className="vp-careers-platforms"
        aria-labelledby="vp-careers-positions-heading"
      >
        <div className="vp-careers-platforms-inner">
          <div className="vp-careers-platforms-head">
            <p className="vp-careers-platforms-eyebrow">{copy.positionsEyebrow}</p>
            <h2 id="vp-careers-positions-heading" className="vp-careers-platforms-title">
              {copy.positionsHeading}
            </h2>
            <p className="vp-careers-platforms-lead">{copy.positionsLead}</p>
          </div>
          <ul className="vp-careers-platform-grid">
            {copy.platforms.map((platform) => (
              <li key={platform.id}>
                <a
                  href={platform.href}
                  className="vp-careers-platform-card"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PlatformLogo id={platform.id} label={platform.label} />
                  <h3 className="vp-careers-platform-name">{platform.label}</h3>
                  {platform.blurb ? (
                    <ul className="vp-careers-platform-points">
                      <li>{platform.blurb}</li>
                    </ul>
                  ) : null}
                  <span className="vp-careers-platform-link">{moreLabel}</span>
                </a>
              </li>
            ))}
          </ul>
          {copy.positionsNote ? (
            <p className="vp-careers-platforms-note">{copy.positionsNote}</p>
          ) : null}
        </div>
      </section>

      <section className="vp-careers-cta" aria-labelledby="vp-careers-cta-heading">
        <div className="vp-careers-cta-inner">
          <p className="vp-careers-cta-eyebrow">{copy.ctaEyebrow}</p>
          <h2 id="vp-careers-cta-heading" className="vp-h2 vp-careers-cta-title">
            {copy.ctaHeading}
          </h2>
          <p className="vp-careers-cta-lead">{copy.ctaLead}</p>
          {/* Replace with actual Google Form URL before going live */}
          <a
            href={copy.applyHref}
            className="vp-careers-cta-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            {copy.applyNow}
          </a>
        </div>
      </section>
    </div>
  );
}

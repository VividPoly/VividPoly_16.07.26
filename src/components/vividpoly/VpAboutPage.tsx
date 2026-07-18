'use client';

import type { VpBreadcrumb } from '@/lib/vividpoly-navigation';
import VpSubpageTop from '@/components/vividpoly/VpSubpageTop';
import VpKnackAboutSection from '@/components/vividpoly/VpKnackAboutSection';

type AboutPillar = {
  title: string;
  body: string;
};

type AboutCopy = {
  title: string;
  pageEyebrow?: string;
  pageTitle?: string;
  pageTagline?: string;
  p1: string;
  p2: string;
  image?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  exportVisionEyebrow: string;
  exportVisionHeading?: string;
  exportVisionBody: string;
  pillarsEyebrow?: string;
  pillarsHeading?: string;
  pillarsLead?: string;
  pillarsBody?: string;
  pillars?: AboutPillar[];
  factsEyebrow?: string;
  factsHeading?: string;
  whyEyebrow: string;
  whyHeading: string;
  whyLead: string;
  whyBody?: string;
  whyMoreLabel?: string;
  contactTeam: string;
  ctaBandEyebrow?: string;
  ctaBandTitle?: string;
  ctaBandBody?: string;
  ctaBandButton?: string;
};

type CompanyRow = { k: string; v: string };
type WhyRow = { k: string; v: string };

type VpAboutPageProps = {
  about: AboutCopy;
  breadcrumbs: VpBreadcrumb[];
  companyRows: CompanyRow[];
  whyRows: WhyRow[];
  onHomeClick: () => void;
  onContact: () => void;
  onCatalogueType: () => void;
};

export default function VpAboutPage({
  about,
  breadcrumbs,
  companyRows,
  whyRows,
  onHomeClick,
  onContact,
  onCatalogueType,
}: VpAboutPageProps) {
  const pillars = about.pillars ?? [];

  return (
    <div data-screen-label="About" className="vp-about-page">
      <div className="vp-about-page-top">
        <VpSubpageTop breadcrumbs={breadcrumbs} onHomeClick={onHomeClick} className="vp-subpage-top--page">
          <h1 className="vp-h1 vp-subpage-h1">{about.title}</h1>
        </VpSubpageTop>
      </div>

      <VpKnackAboutSection
        eyebrow={about.pageEyebrow || 'ABOUT US'}
        title={about.pageTitle || about.title}
        subtitle=""
        paragraphs={[about.p1, about.p2]}
        imageSrc={about.image || '/images/shop-product-type.jpg'}
        primaryCtaLabel={about.ctaSecondary || 'Shop by Product Type'}
        onPrimaryCta={onCatalogueType}
      />

      <section className="vp-about-legacy" aria-labelledby="vp-about-legacy-title">
        <div className="vp-about-legacy-inner">
          <div className="vp-about-legacy-head">
            <p className="vp-about-legacy-eyebrow">{about.pillarsEyebrow || 'STRENGTHS'}</p>
            <h2 id="vp-about-legacy-title" className="vp-about-legacy-title">
              {about.pillarsHeading}
            </h2>
            {about.pillarsLead ? <p className="vp-about-legacy-lead">{about.pillarsLead}</p> : null}
          </div>
          {pillars.length > 0 ? (
            <ul className="vp-about-legacy-grid">
              {pillars.slice(0, 4).map((pillar, index) => (
                <li key={pillar.title} className="vp-about-legacy-card">
                  <span className="vp-about-legacy-index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="vp-about-legacy-card-copy">
                    <h3 className="vp-about-legacy-card-title">{pillar.title}</h3>
                    <p className="vp-about-legacy-card-body">{pillar.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      <section className="vp-about-vision" aria-labelledby="vp-about-vision-title">
        <div className="vp-about-vision-inner">
          <div className="vp-about-vision-head">
            <p className="vp-about-vision-eyebrow">{about.exportVisionEyebrow}</p>
            <h2 id="vp-about-vision-title" className="vp-about-vision-title">
              {about.exportVisionHeading || about.exportVisionEyebrow}
            </h2>
          </div>
          <div className="vp-about-vision-panel">
            <p className="vp-about-vision-body">{about.exportVisionBody}</p>
          </div>
        </div>
      </section>

      <section className="vp-about-facts" aria-labelledby="vp-about-facts-title">
        <div className="vp-about-facts-inner">
          <div className="vp-about-facts-media" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="vp-about-facts-img"
              src="/images/about-company.jpg"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="vp-about-facts-copy">
            {about.factsEyebrow ? <p className="vp-about-facts-eyebrow">{about.factsEyebrow}</p> : null}
            <h2 id="vp-about-facts-title" className="vp-about-facts-title">
              {about.factsHeading || 'Company details'}
            </h2>
            <ul className="vp-about-facts-list">
              {companyRows.map((row) => (
                <li key={row.k} className="vp-about-facts-row">
                  <span className="vp-about-facts-key">{row.k}</span>
                  <span className="vp-about-facts-value">{row.v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="why-choose-vividpoly" className="vp-about-services" aria-labelledby="vp-about-services-title">
        <div className="vp-about-services-inner">
          <div className="vp-about-services-head">
            <p className="vp-about-services-eyebrow">{about.whyEyebrow}</p>
            <h2 id="vp-about-services-title" className="vp-about-services-title">
              {about.whyHeading}
            </h2>
            <p className="vp-about-services-lead">{about.whyLead}</p>
          </div>
          <ul className="vp-about-services-grid">
            {whyRows.slice(0, 4).map((row, index) => (
              <li key={row.k} className="vp-about-services-card">
                <span className="vp-about-services-index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="vp-about-services-card-title">{row.k}</h3>
                <p className="vp-about-services-card-body">{row.v}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="vp-about-enquire" aria-labelledby="vp-about-enquire-title">
        <div className="vp-about-enquire-inner">
          <p className="vp-about-enquire-eyebrow">{about.ctaBandEyebrow}</p>
          <h2 id="vp-about-enquire-title" className="vp-about-enquire-title">
            {about.ctaBandTitle || about.contactTeam}
          </h2>
          {about.ctaBandBody ? <p className="vp-about-enquire-body">{about.ctaBandBody}</p> : null}
          <button type="button" className="vp-about-enquire-button" onClick={onContact}>
            {about.ctaBandButton || about.contactTeam}
          </button>
        </div>
      </section>
    </div>
  );
}

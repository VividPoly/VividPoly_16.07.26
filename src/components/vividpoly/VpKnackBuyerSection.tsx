'use client';

type VpKnackBuyerSectionProps = {
  title: string;
  paragraphs: string[];
  ctaLabel?: string;
  onCta?: () => void;
  mapSrc?: string;
};

export default function VpKnackBuyerSection({
  title,
  paragraphs,
  ctaLabel,
  onCta,
  mapSrc = '/images/world-map-dotted.svg',
}: VpKnackBuyerSectionProps) {
  const showCta = Boolean(ctaLabel && onCta);

  return (
    <section className="vp-buyer-section--knack" aria-labelledby="vp-buyer-section-title">
      <div className="vp-buyer-section-shell">
        <div className="vp-buyer-section-grid">
          <div className="vp-buyer-section-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mapSrc}
              alt="World map showing VividPoly export destinations"
              className="vp-buyer-section-map"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="vp-buyer-section-copy">
            <h2 id="vp-buyer-section-title" className="vp-buyer-section-title">
              {title}
            </h2>
            <span className="vp-buyer-section-rule" aria-hidden="true" />
            <div className="vp-buyer-section-body-wrap">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="vp-buyer-section-body">
                  {paragraph}
                </p>
              ))}
            </div>
            {showCta ? (
              <button type="button" className="vp-buyer-section-cta" onClick={onCta}>
                {ctaLabel}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

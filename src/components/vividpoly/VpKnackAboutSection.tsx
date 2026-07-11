'use client';

import VpPhotoSlot from '@/components/vividpoly/VpPhotoSlot';

type VpKnackAboutSectionProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
  imageSrc: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  onPrimaryCta?: () => void;
  onSecondaryCta?: () => void;
};

export default function VpKnackAboutSection({
  eyebrow,
  title,
  subtitle,
  paragraphs,
  imageSrc,
  primaryCtaLabel,
  secondaryCtaLabel,
  onPrimaryCta,
  onSecondaryCta,
}: VpKnackAboutSectionProps) {
  const showPrimary = Boolean(primaryCtaLabel && onPrimaryCta);
  const showSecondary = Boolean(secondaryCtaLabel && onSecondaryCta);
  const showActions = showPrimary || showSecondary;

  return (
    <section className="vp-about-section--knack" aria-labelledby="vp-about-section-title">
      <div className="vp-about-section-inner">
        <div className="vp-about-section-media">
          <VpPhotoSlot
            src={imageSrc}
            alt=""
            variant="hero"
            className="vp-about-section-img"
          />
        </div>
        <div className="vp-about-section-copy">
          <p className="vp-about-section-eyebrow">{eyebrow}</p>
          <h2 id="vp-about-section-title" className="vp-about-section-title">
            {title}
          </h2>
          {subtitle ? <p className="vp-about-section-subtitle">{subtitle}</p> : null}
          <div className="vp-about-section-body">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          {showActions ? (
            <div className="vp-about-section-actions">
              {showPrimary ? (
                <button type="button" className="vp-about-section-cta" onClick={onPrimaryCta}>
                  {primaryCtaLabel}
                </button>
              ) : null}
              {showSecondary ? (
                <button
                  type="button"
                  className="vp-about-section-cta vp-about-section-cta--ghost"
                  onClick={onSecondaryCta}
                >
                  {secondaryCtaLabel}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

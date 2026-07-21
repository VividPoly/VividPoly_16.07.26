'use client';

import VpKnackReveal from '@/components/vividpoly/VpKnackReveal';

type VpKnackImageBandProps = {
  imageSrc: string;
  eyebrow?: string;
  title: string;
  body?: string;
  ctaLabel?: string;
  onCta?: () => void;
};

/** Full-bleed photo band used as a breather between two content sections. */
export default function VpKnackImageBand({
  imageSrc,
  eyebrow,
  title,
  body,
  ctaLabel,
  onCta,
}: VpKnackImageBandProps) {
  const showCta = Boolean(ctaLabel && onCta);

  return (
    <section className="vp-image-band--knack" aria-labelledby="vp-image-band-title">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt=""
        className="vp-image-band-photo"
        loading="lazy"
        decoding="async"
        aria-hidden="true"
      />
      <span className="vp-image-band-scrim" aria-hidden="true" />
      <div className="vp-image-band-inner">
        <VpKnackReveal className="vp-image-band-copy">
          {eyebrow ? <p className="vp-image-band-eyebrow">{eyebrow}</p> : null}
          <h2 id="vp-image-band-title" className="vp-image-band-title">
            {title}
          </h2>
          {body ? <p className="vp-image-band-body">{body}</p> : null}
          {showCta ? (
            <button type="button" className="vp-image-band-cta" onClick={onCta}>
              {ctaLabel}
            </button>
          ) : null}
        </VpKnackReveal>
      </div>
    </section>
  );
}

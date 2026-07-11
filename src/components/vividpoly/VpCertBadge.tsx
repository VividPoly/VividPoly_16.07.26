'use client';

import { useState } from 'react';

type CertKind = 'iso' | 'iec';

type VpCertBadgeProps = {
  kind: CertKind;
  className?: string;
  size?: 'sm' | 'md';
};

/**
 * Certification badge.
 * Drop official artwork at /public/images/certs/iso.svg|png or iec.svg|png to replace the placeholder.
 */
export default function VpCertBadge({ kind, className = '', size = 'md' }: VpCertBadgeProps) {
  const [srcIndex, setSrcIndex] = useState(0);
  const label = kind === 'iso' ? 'ISO certified' : 'IEC certified';
  const sources = [`/images/certs/${kind}.svg`, `/images/certs/${kind}.png`];
  const src = sources[srcIndex];

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={label}
        className={`vp-cert-badge vp-cert-badge--${size} ${className}`.trim()}
        onError={() => setSrcIndex((i) => i + 1)}
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <svg
      className={`vp-cert-badge vp-cert-badge--${size} ${className}`.trim()}
      viewBox="0 0 80 80"
      role="img"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="40" cy="40" r="37" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="40" cy="40" r="30" fill="none" stroke="currentColor" strokeWidth="1.75" className="vp-cert-badge-ring" />
      <text
        x="40"
        y="46"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="20"
        fontWeight="700"
        letterSpacing="1.5"
      >
        {kind.toUpperCase()}
      </text>
    </svg>
  );
}

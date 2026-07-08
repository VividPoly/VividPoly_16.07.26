'use client';

import { useState } from 'react';

type VpPhotoSlotProps = {
  src: string;
  alt: string;
  className?: string;
  variant?: 'hero' | 'card' | 'thumb';
};

/**
 * Image slot that loads a real photo when present under /public,
 * otherwise shows a branded placeholder ready to swap later.
 */
export default function VpPhotoSlot({
  src,
  alt,
  className = '',
  variant = 'card',
}: VpPhotoSlotProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`vp-photo-slot vp-photo-slot--${variant} vp-photo-slot--fallback ${className}`.trim()}
        role="img"
        aria-label={alt}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`vp-photo-slot vp-photo-slot--${variant} ${className}`.trim()}
      onError={() => setFailed(true)}
      loading="lazy"
      decoding="async"
    />
  );
}

'use client';

import { useEffect, useState } from 'react';

const VISIBLE_MS = 3200;
const FADE_MS = 600;

type VpCatalogueGuideTooltipProps = {
  message: string;
  placement: 'filter' | 'sort';
  onDismiss: () => void;
};

export default function VpCatalogueGuideTooltip({
  message,
  placement,
  onDismiss,
}: VpCatalogueGuideTooltipProps) {
  const [phase, setPhase] = useState<'in' | 'out'>('in');

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setPhase('out'), VISIBLE_MS);
    const dismissTimer = window.setTimeout(() => onDismiss(), VISIBLE_MS + FADE_MS);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(dismissTimer);
    };
  }, [onDismiss]);

  return (
    <div
      className={`vp-cat-guide vp-cat-guide--${placement}${phase === 'out' ? ' vp-cat-guide--out' : ''}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}

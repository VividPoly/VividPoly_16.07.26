'use client';

import { ChevronUpIcon } from '@/components/vividpoly/VividPolyIcons';
import { scrollPageToTop } from '@/lib/vividpoly-navigation';

type VpBackToTopProps = {
  label: string;
  ariaLabel?: string;
};

export default function VpBackToTop({ label, ariaLabel }: VpBackToTopProps) {
  return (
    <div className="vp-footer-back-top">
      <button
        type="button"
        className="vp-footer-back-top-btn"
        onClick={() => scrollPageToTop('smooth')}
        aria-label={ariaLabel ?? label}
      >
        <span className="vp-footer-back-top-icon" aria-hidden="true">
          <ChevronUpIcon size={14} />
        </span>
        <span className="vp-footer-back-top-label">{label}</span>
      </button>
    </div>
  );
}

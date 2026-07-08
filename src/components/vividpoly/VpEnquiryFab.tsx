'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type VpEnquiryFabProps = {
  label: string;
  ariaLabel: string;
  onClick: () => void;
  hidden?: boolean;
  active?: boolean;
};

type FabTone = 'on-dark' | 'on-light';

const DARK_BACKDROP_SELECTORS = [
  '.vp-hero',
  '.vp-site-footer',
  '.vp-final-cta-band',
].join(', ');

function readFabTone(button: HTMLButtonElement): FabTone {
  const rect = button.getBoundingClientRect();
  const x = Math.min(Math.max(rect.left + rect.width * 0.35, 8), window.innerWidth - 8);
  const y = Math.min(Math.max(rect.top + rect.height * 0.5, 8), window.innerHeight - 8);
  const stack = document.elementsFromPoint(x, y);
  const backdrop = stack.find((node) => !node.closest('.vp-enquiry-fab'));

  if (backdrop?.closest(DARK_BACKDROP_SELECTORS)) {
    return 'on-dark';
  }

  return 'on-light';
}

export default function VpEnquiryFab({
  label,
  ariaLabel,
  onClick,
  hidden = false,
  active = true,
}: VpEnquiryFabProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [tone, setTone] = useState<FabTone>('on-light');
  const [lifted, setLifted] = useState(false);

  const refreshFab = useCallback(() => {
    const button = buttonRef.current;
    if (!button || hidden) return;

    setTone(readFabTone(button));

    const markets = document.querySelector('.vp-hero-markets');
    if (!markets) {
      setLifted(false);
      return;
    }

    const marketsRect = markets.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const overlapsTicker = marketsRect.top < buttonRect.bottom + 8 && marketsRect.bottom > buttonRect.top - 8;
    setLifted(overlapsTicker);
  }, [hidden]);

  useEffect(() => {
    if (hidden || !active) return;

    refreshFab();

    const onChange = () => refreshFab();
    window.addEventListener('scroll', onChange, { passive: true });
    window.addEventListener('resize', onChange);
    window.addEventListener('vp:layout', onChange);

    const markets = document.querySelector('.vp-hero-markets');
    let observer: IntersectionObserver | undefined;
    if (markets) {
      observer = new IntersectionObserver(onChange, { threshold: [0, 0.15, 0.5, 1] });
      observer.observe(markets);
    }

    return () => {
      window.removeEventListener('scroll', onChange);
      window.removeEventListener('resize', onChange);
      window.removeEventListener('vp:layout', onChange);
      observer?.disconnect();
    };
  }, [active, hidden, refreshFab]);

  if (hidden) return null;

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`vp-enquiry-fab vp-enquiry-fab--${tone}${lifted ? ' vp-enquiry-fab--lifted' : ''}`}
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        position: 'fixed',
        right: 24,
        bottom: lifted ? 80 : 24,
        zIndex: 2147482000,
      }}
    >
      <span className="vp-enquiry-fab-icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 18V8.24l7.38 6.35a1 1 0 001.24 0L20 8.24V18H4z" />
        </svg>
      </span>
      <span className="vp-enquiry-fab-label">{label}</span>
    </button>
  );
}

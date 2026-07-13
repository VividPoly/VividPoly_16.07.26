'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChatIcon } from '@/components/vividpoly/VividPolyIcons';
import { readSurfaceToneForElement, type SurfaceTone } from '@/lib/vp-surface-tone';

type VpEnquiryFabProps = {
  label: string;
  mobileLabel?: string;
  ariaLabel: string;
  onClick: () => void;
  hidden?: boolean;
  active?: boolean;
};

type FabTone = SurfaceTone;

const MOBILE_FAB_MQ = '(max-width: 991px)';

export default function VpEnquiryFab({
  label,
  mobileLabel,
  ariaLabel,
  onClick,
  hidden = false,
  active = true,
}: VpEnquiryFabProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const toneRef = useRef<FabTone>('on-light');
  const liftedRef = useRef(false);
  const mobileRef = useRef(false);
  const [tone, setTone] = useState<FabTone>('on-light');
  const [lifted, setLifted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const refreshFab = useCallback(() => {
    const button = buttonRef.current;
    if (!button || hidden) return;

    const mobile = window.matchMedia(MOBILE_FAB_MQ).matches;
    if (mobileRef.current !== mobile) {
      mobileRef.current = mobile;
      setIsMobile(mobile);
    }

    if (mobile) {
      if (toneRef.current !== 'on-light') {
        toneRef.current = 'on-light';
        setTone('on-light');
      }
      if (liftedRef.current) {
        liftedRef.current = false;
        setLifted(false);
      }
      return;
    }

    const nextTone = readSurfaceToneForElement(button, {
      sideTab: false,
      currentTone: toneRef.current,
    });
    if (toneRef.current !== nextTone) {
      toneRef.current = nextTone;
      setTone(nextTone);
    }

    const markets = document.querySelector('.vp-hero-markets');
    if (!markets) {
      if (liftedRef.current) {
        liftedRef.current = false;
        setLifted(false);
      }
      return;
    }

    const marketsRect = markets.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const overlapsTicker = marketsRect.top < buttonRect.bottom + 8 && marketsRect.bottom > buttonRect.top - 8;
    if (liftedRef.current !== overlapsTicker) {
      liftedRef.current = overlapsTicker;
      setLifted(overlapsTicker);
    }
  }, [hidden]);

  useLayoutEffect(() => {
    if (hidden || !active) return;
    refreshFab();
  }, [active, hidden, refreshFab]);

  useEffect(() => {
    if (hidden || !active) return;

    let rafId = 0;
    const onChange = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        refreshFab();
      });
    };

    const mobileMq = window.matchMedia(MOBILE_FAB_MQ);
    mobileMq.addEventListener('change', onChange);
    window.addEventListener('scroll', onChange, { passive: true });
    window.addEventListener('resize', onChange);
    window.addEventListener('vp:layout', onChange);

    const markets = document.querySelector('.vp-hero-markets');
    let observer: IntersectionObserver | undefined;
    if (markets) {
      observer = new IntersectionObserver(onChange, { threshold: [0, 0.25, 0.75, 1] });
      observer.observe(markets);
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      mobileMq.removeEventListener('change', onChange);
      window.removeEventListener('scroll', onChange);
      window.removeEventListener('resize', onChange);
      window.removeEventListener('vp:layout', onChange);
      observer?.disconnect();
    };
  }, [active, hidden, refreshFab]);

  if (hidden) return null;

  const displayLabel = isMobile ? (mobileLabel || label) : label;

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`vp-enquiry-fab vp-enquiry-fab--${tone}${isMobile ? ' vp-enquiry-fab--circle' : ''}${lifted ? ' vp-enquiry-fab--lifted' : ''}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <span className="vp-enquiry-fab-icon" aria-hidden="true">
        <ChatIcon size={isMobile ? 22 : 18} />
      </span>
      <span className={`vp-enquiry-fab-label${isMobile ? ' vp-enquiry-fab-label--sr' : ''}`}>
        {displayLabel}
      </span>
    </button>
  );
}

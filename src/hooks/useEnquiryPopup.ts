'use client';

import { useEffect, useRef } from 'react';
import {
  canAutoOpenEnquiryPopup,
  ENQUIRY_AUTO_OPEN_MS,
  ensureEnquiryVisitClock,
  getEnquiryVisitElapsedMs,
  markEnquiryAutoOpened,
} from '@/lib/enquiry-popup-session';

type UseEnquiryPopupOptions = {
  pageKey: string;
  onAutoOpen: () => void;
  /** Checked when the timer fires; return false to skip auto-open on that screen. */
  getShouldAutoOpen: () => boolean;
};

/**
 * Opens the enquiry modal once after ENQUIRY_AUTO_OPEN_MS of site dwell time.
 * Closing or submitting suppresses auto-open permanently (localStorage).
 */
export function useEnquiryPopup({ pageKey, onAutoOpen, getShouldAutoOpen }: UseEnquiryPopupOptions) {
  const onAutoOpenRef = useRef(onAutoOpen);
  const getShouldAutoOpenRef = useRef(getShouldAutoOpen);
  onAutoOpenRef.current = onAutoOpen;
  getShouldAutoOpenRef.current = getShouldAutoOpen;

  useEffect(() => {
    ensureEnquiryVisitClock();
  }, []);

  useEffect(() => {
    if (!pageKey || !canAutoOpenEnquiryPopup(pageKey)) return;
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 991px)').matches) return;

    const remaining = Math.max(0, ENQUIRY_AUTO_OPEN_MS - getEnquiryVisitElapsedMs());

    const timerId = window.setTimeout(() => {
      if (!canAutoOpenEnquiryPopup(pageKey)) return;
      if (!getShouldAutoOpenRef.current()) return;
      markEnquiryAutoOpened(pageKey);
      onAutoOpenRef.current();
    }, remaining);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [pageKey]);
}

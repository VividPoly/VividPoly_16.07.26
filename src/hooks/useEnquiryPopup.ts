'use client';

import { useEffect, useRef } from 'react';
import {
  canAutoOpenEnquiryPopup,
  ENQUIRY_AUTO_OPEN_MS,
  resetEnquiryPopupSession,
} from '@/lib/enquiry-popup-session';

type UseEnquiryPopupOptions = {
  onAutoOpen: () => void;
};

/** Survives React Strict Mode double-mount in dev (cleanup must not cancel it). */
let pageTimerId: ReturnType<typeof setTimeout> | null = null;

/**
 * Opens the enquiry modal once, ENQUIRY_AUTO_OPEN_MS after first mount.
 */
export function useEnquiryPopup({ onAutoOpen }: UseEnquiryPopupOptions) {
  const onAutoOpenRef = useRef(onAutoOpen);
  onAutoOpenRef.current = onAutoOpen;

  useEffect(() => {
    resetEnquiryPopupSession();

    if (pageTimerId != null) return;

    pageTimerId = setTimeout(() => {
      pageTimerId = null;
      if (!canAutoOpenEnquiryPopup()) return;
      onAutoOpenRef.current();
    }, ENQUIRY_AUTO_OPEN_MS);
  }, []);
}

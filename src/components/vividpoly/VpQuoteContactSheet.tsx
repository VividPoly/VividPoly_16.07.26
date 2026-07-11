'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import VpQuoteContactForm, { quoteContactFromQuote } from '@/components/vividpoly/VpQuoteContactForm';
import { CloseIcon } from '@/components/vividpoly/VividPolyIcons';
import type { QuoteContactFormData } from '@/components/vividpoly/VpQuoteContactForm';
import { useFocusTrap } from '@/hooks/useFocusTrap';

type SiteCopy = {
  quoteContactStepLead: string;
  quoteContactSubmitLabel: string;
};

type QuoteContactView = {
  qv: Record<string, string | undefined>;
  contactCountries: string[];
  siteCopy: SiteCopy;
  quoteContactLabels: {
    name: string;
    company: string;
    email: string;
    phone: string;
    country: string;
    selectCountry: string;
    emailInvalid: string;
  };
  quoteStepLabels: {
    howReachYou: string;
    closeForm: string;
  };
  closeQuoteContact: () => void;
  quoteContinueFromContact: (contact: QuoteContactFormData) => void;
};

export default function VpQuoteContactSheet({ v }: { v: QuoteContactView }) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useFocusTrap(true, sheetRef, v.closeQuoteContact);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return createPortal(
    <div className="vp-quote-contact-overlay" role="presentation">
      <div
        ref={sheetRef}
        className="vp-quote-contact-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vp-quote-contact-title"
      >
        <button
          type="button"
          className="vp-icon-close-btn vp-quote-contact-close"
          onClick={v.closeQuoteContact}
          aria-label={v.quoteStepLabels.closeForm}
        >
          <CloseIcon size={18} />
        </button>
        <h2 id="vp-quote-contact-title" className="vp-quote-contact-title">{v.quoteStepLabels.howReachYou}</h2>
        <p className="vp-quote-contact-sub">{v.siteCopy.quoteContactStepLead}</p>
        <VpQuoteContactForm
          initialValues={quoteContactFromQuote(v.qv)}
          contactCountries={v.contactCountries}
          submitLabel={v.siteCopy.quoteContactSubmitLabel}
          labels={v.quoteContactLabels}
          onSubmit={v.quoteContinueFromContact}
          autoFocus
        />
      </div>
    </div>,
    document.body,
  );
}

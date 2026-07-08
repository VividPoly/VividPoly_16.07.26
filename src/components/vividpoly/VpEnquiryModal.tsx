'use client';

import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import VpContactEnquiryForm, { type ContactEnquiryFormProps } from '@/components/vividpoly/VpContactEnquiryForm';

type VpEnquiryModalProps = {
  open: boolean;
  title: string;
  closeLabel: string;
  onClose: () => void;
  onSubmitSuccess: () => void;
  formProps: Omit<ContactEnquiryFormProps, 'variant' | 'onSubmitSuccess'>;
};

export default function VpEnquiryModal({
  open,
  title,
  closeLabel,
  onClose,
  onSubmitSuccess,
  formProps,
}: VpEnquiryModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const openedAtRef = useRef(0);

  useEffect(() => {
    if (!open) return;

    openedAtRef.current = Date.now();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      const firstField = panelRef.current?.querySelector<HTMLElement>(
        'input, textarea, button, [tabindex]:not([tabindex="-1"])',
      );
      firstField?.focus();
    }, 50);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="vp-enquiry-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (Date.now() - openedAtRef.current < 500) return;
        onClose();
      }}
    >
      <div
        ref={panelRef}
        className="vp-enquiry-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="vp-enquiry-modal-head">
          <h2 id={titleId} className="vp-enquiry-modal-title">{title}</h2>
          <button
            type="button"
            className="vp-enquiry-modal-close"
            onClick={onClose}
            aria-label={closeLabel}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="vp-enquiry-modal-body">
          <VpContactEnquiryForm
            {...formProps}
            variant="modal"
            onSubmitSuccess={onSubmitSuccess}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}

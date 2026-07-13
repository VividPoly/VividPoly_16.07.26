'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

type VpToastProps = {
  message: string;
  open: boolean;
  onClose: () => void;
  durationMs?: number;
  tone?: 'success' | 'error';
};

export default function VpToast({
  message,
  open,
  onClose,
  durationMs = 4200,
  tone = 'success',
}: VpToastProps) {
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(onClose, durationMs);
    return () => window.clearTimeout(timer);
  }, [open, durationMs, onClose, message]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="vp-toast-region" aria-live="polite" aria-relevant="additions">
      <div
        className={`vp-toast vp-toast--${tone}`}
        role="status"
      >
        <span className="vp-toast-message">{message}</span>
        <button
          type="button"
          className="vp-toast-dismiss"
          onClick={onClose}
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </div>,
    document.body,
  );
}

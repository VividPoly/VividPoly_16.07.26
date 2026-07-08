'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '@/hooks/useFocusTrap';

type EmailComposeCopy = {
  title: string;
  toLabel: string;
  fromLabel: string;
  nameLabel: string;
  subjectLabel: string;
  messageLabel: string;
  send: string;
  sending: string;
  close: string;
  defaultSubject: string;
  hint: string;
  emailInvalid: string;
  messageRequired: string;
  sendSuccess: string;
  sendError: string;
  sendUnavailable: string;
};

type VpEmailComposePanelProps = {
  open: boolean;
  onClose: () => void;
  toAddress: string;
  copy: EmailComposeCopy;
};

type SendStatus = 'idle' | 'sending' | 'success' | 'error' | 'unavailable';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function VpEmailComposePanel({
  open,
  onClose,
  toAddress,
  copy,
}: VpEmailComposePanelProps) {
  const panelRef = useRef<HTMLElement>(null);
  const [name, setName] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [subject, setSubject] = useState(copy.defaultSubject);
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [sendStatus, setSendStatus] = useState<SendStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  useFocusTrap(open, panelRef, onClose);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setSubject(copy.defaultSubject);
    setEmailError(false);
    setMessageError(false);
    setSendStatus('idle');
    setStatusMessage('');
  }, [open, copy.defaultSubject]);

  useEffect(() => {
    const root = document.documentElement;
    if (open) {
      root.classList.add('vp-email-compose-open');
    } else {
      root.classList.remove('vp-email-compose-open');
    }
    return () => root.classList.remove('vp-email-compose-open');
  }, [open]);

  const handleSend = async () => {
    const email = fromEmail.trim();
    const bodyText = message.trim();
    let hasError = false;

    if (!email || !isValidEmail(email)) {
      setEmailError(true);
      hasError = true;
    } else {
      setEmailError(false);
    }

    if (!bodyText) {
      setMessageError(true);
      hasError = true;
    } else {
      setMessageError(false);
    }

    if (hasError || sendStatus === 'sending') return;

    setSendStatus('sending');
    setStatusMessage('');

    try {
      const response = await fetch('/api/contact-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          fromEmail: email,
          subject: subject.trim(),
          message: bodyText,
          website: '',
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (response.status === 503) {
        setSendStatus('unavailable');
        setStatusMessage(copy.sendUnavailable);
        return;
      }

      if (!response.ok || !data?.ok) {
        setSendStatus('error');
        setStatusMessage(data?.error || copy.sendError);
        return;
      }

      setSendStatus('success');
      setStatusMessage(copy.sendSuccess);
      setMessage('');
      setName('');
      setFromEmail('');
      setSubject(copy.defaultSubject);
    } catch {
      setSendStatus('error');
      setStatusMessage(copy.sendError);
    }
  };

  if (!mounted || !open) return null;

  const isSending = sendStatus === 'sending';

  return createPortal(
    <aside
      ref={panelRef}
      id="vp-email-compose-panel"
      className="vp-email-compose-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vp-email-compose-title"
    >
      <div className="vp-email-compose-head">
        <h2 id="vp-email-compose-title" className="vp-email-compose-title">{copy.title}</h2>
        <button
          type="button"
          className="vp-email-compose-close"
          onClick={onClose}
          aria-label={copy.close}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <form
        className="vp-email-compose-form"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSend();
        }}
      >
        <label className="vp-email-compose-field">
          <span className="vp-email-compose-label">{copy.toLabel}</span>
          <input
            type="email"
            className="vp-email-compose-input"
            value={toAddress}
            readOnly
            tabIndex={-1}
          />
        </label>

        <label className="vp-email-compose-field">
          <span className="vp-email-compose-label">{copy.nameLabel}</span>
          <input
            type="text"
            className="vp-email-compose-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            disabled={isSending}
          />
        </label>

        <label className="vp-email-compose-field">
          <span className="vp-email-compose-label">{copy.fromLabel}</span>
          <input
            type="email"
            className={`vp-email-compose-input${emailError ? ' vp-email-compose-input--error' : ''}`}
            value={fromEmail}
            onChange={(event) => {
              setFromEmail(event.target.value);
              if (emailError) setEmailError(false);
            }}
            autoComplete="email"
            autoFocus
            required
            disabled={isSending}
          />
          {emailError && (
            <span className="vp-email-compose-error" role="alert">{copy.emailInvalid}</span>
          )}
        </label>

        <label className="vp-email-compose-field">
          <span className="vp-email-compose-label">{copy.subjectLabel}</span>
          <input
            type="text"
            className="vp-email-compose-input"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            disabled={isSending}
          />
        </label>

        <label className="vp-email-compose-field vp-email-compose-field--grow">
          <span className="vp-email-compose-label">{copy.messageLabel}</span>
          <textarea
            className={`vp-email-compose-input vp-email-compose-input--textarea${messageError ? ' vp-email-compose-input--error' : ''}`}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              if (messageError) setMessageError(false);
            }}
            rows={8}
            required
            disabled={isSending}
          />
          {messageError && (
            <span className="vp-email-compose-error" role="alert">{copy.messageRequired}</span>
          )}
        </label>

        {statusMessage && (
          <p
            className={`vp-email-compose-status vp-email-compose-status--${sendStatus}`}
            role={sendStatus === 'error' || sendStatus === 'unavailable' ? 'alert' : 'status'}
          >
            {statusMessage}
          </p>
        )}

        <p className="vp-email-compose-hint">{copy.hint}</p>

        <div className="vp-email-compose-actions">
          <button
            type="submit"
            className="vp-cta-primary vp-cta-primary--lg"
            disabled={isSending}
          >
            {isSending ? copy.sending : copy.send}
          </button>
        </div>
      </form>
    </aside>,
    document.body,
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import VpCustomSelect from '@/components/vividpoly/VpCustomSelect';

export type QuoteContactFormData = {
  name: string;
  company: string;
  email: string;
  whatsapp: string;
  country: string;
};

type VpQuoteContactFormProps = {
  initialValues: QuoteContactFormData;
  contactCountries: string[];
  submitLabel: string;
  labels: {
    name: string;
    company: string;
    email: string;
    phone: string;
    country: string;
    selectCountry: string;
    emailInvalid: string;
  };
  onSubmit: (contact: QuoteContactFormData) => void;
  autoFocus?: boolean;
  className?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function quoteContactFromQuote(qv: Record<string, string | undefined>): QuoteContactFormData {
  return {
    name: qv.name ?? '',
    company: qv.company ?? '',
    email: qv.email ?? '',
    whatsapp: qv.whatsapp ?? '',
    country: qv.country ?? '',
  };
}

export default function VpQuoteContactForm({
  initialValues,
  contactCountries,
  submitLabel,
  labels,
  onSubmit,
  autoFocus = false,
  className,
}: VpQuoteContactFormProps) {
  const [form, setForm] = useState(initialValues);
  const [emailError, setEmailError] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  const canSubmit = Boolean(form.name.trim() && form.email.trim());

  useEffect(() => {
    if (autoFocus) nameRef.current?.focus();
  }, [autoFocus]);

  const setField = <K extends keyof QuoteContactFormData>(key: K, value: QuoteContactFormData[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleCountryChange = (country: string) => {
    setField('country', country);
  };

  const handleSubmit = () => {
    const email = form.email.trim();
    if (!email || !isValidEmail(email)) {
      setEmailError(true);
      return;
    }
    onSubmit({
      ...form,
      name: form.name.trim(),
      company: form.company.trim(),
      email,
      whatsapp: form.whatsapp.trim(),
    });
  };

  return (
    <div className={className}>
      <div className="vp-quote-contact-grid">
        <div className="vp-quote-contact-field">
          <label className="vp-quote-contact-label" htmlFor="vp-quote-name">{labels.name}</label>
          <input
            ref={nameRef}
            id="vp-quote-name"
            value={form.name}
            onChange={(event) => setField('name', event.target.value)}
            className="vp-quote-contact-input"
          />
        </div>
        <div className="vp-quote-contact-field">
          <label className="vp-quote-contact-label" htmlFor="vp-quote-company">{labels.company}</label>
          <input
            id="vp-quote-company"
            value={form.company}
            onChange={(event) => setField('company', event.target.value)}
            className="vp-quote-contact-input"
          />
        </div>
        <div className="vp-quote-contact-field">
          <label className="vp-quote-contact-label" htmlFor="vp-quote-email">{labels.email}</label>
          <input
            id="vp-quote-email"
            type="email"
            value={form.email}
            onChange={(event) => {
              if (emailError) setEmailError(false);
              setField('email', event.target.value);
            }}
            className={`vp-quote-contact-input${emailError ? ' vp-quote-contact-input--error' : ''}`}
            aria-invalid={emailError}
            aria-describedby={emailError ? 'vp-quote-email-error' : undefined}
          />
          {emailError && (
            <div id="vp-quote-email-error" className="vp-quote-email-tooltip" role="alert">
              {labels.emailInvalid}
            </div>
          )}
        </div>
        <div className="vp-quote-contact-field">
          <label className="vp-quote-contact-label" htmlFor="vp-quote-phone">{labels.phone}</label>
          <input
            id="vp-quote-phone"
            value={form.whatsapp}
            onChange={(event) => setField('whatsapp', event.target.value)}
            className="vp-quote-contact-input"
          />
        </div>
        <div className="vp-quote-contact-field">
          <label className="vp-quote-contact-label" htmlFor="vp-quote-country">{labels.country}</label>
          <VpCustomSelect
            id="vp-quote-country"
            value={form.country}
            onChange={handleCountryChange}
            options={contactCountries}
            placeholder={labels.selectCountry}
            ariaLabel={labels.country}
            searchable
            menuClassName="vp-sort-menu--contact"
          />
        </div>
      </div>
      <div className="vp-quote-contact-actions">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="vp-cta-primary vp-cta-primary--lg"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}

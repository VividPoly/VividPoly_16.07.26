'use client';

import { useState } from 'react';
import VpCustomSelect from '@/components/vividpoly/VpCustomSelect';
import { markEnquirySubmitted } from '@/lib/enquiry-popup-session';

export type ContactCopy = {
  sendRequirement: string;
  sendRequirementLead: string;
  formName: string;
  formCompany: string;
  formEmail: string;
  formPhone: string;
  formCountry: string;
  formEnquiryType: string;
  formMessage: string;
  submitEnquiry: string;
  sending: string;
  submitSuccess: string;
  submitError: string;
  submitUnavailable: string;
  emailInvalid: string;
  messageRequired: string;
  phoneRequired: string;
};

function RequiredMark() {
  return (
    <>
      <span className="vp-form-required" aria-hidden="true">*</span>
      <span className="vp-visually-hidden"> (required)</span>
    </>
  );
}

export type EnquiryProductType = {
  label: string;
  id: string;
};

export type ContactEnquiryFormProps = {
  copy: ContactCopy;
  commonSelectCountry: string;
  commonSelectEnquiryType: string;
  enquiryProductTypes: EnquiryProductType[];
  contactCountries: string[];
  values: {
    name: string;
    company: string;
    email: string;
    phone: string;
    country: string;
    enquiryType: string;
    message: string;
  };
  onChange: {
    name: (value: string) => void;
    company: (value: string) => void;
    email: (value: string) => void;
    phone: (value: string) => void;
    country: (value: string) => void;
    enquiryType: (value: string) => void;
    message: (value: string) => void;
  };
  variant?: 'page' | 'modal';
  onSubmitSuccess?: () => void;
};

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error' | 'unavailable';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function VpContactEnquiryForm({
  copy,
  commonSelectCountry,
  commonSelectEnquiryType,
  enquiryProductTypes,
  contactCountries,
  values,
  onChange,
  variant = 'page',
  onSubmitSuccess,
}: ContactEnquiryFormProps) {
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const isModal = variant === 'modal';
  const enquiryTypeOptions = enquiryProductTypes.map((item) => item.label);

  const handleSubmit = async () => {
    const email = values.email.trim();
    const phoneText = values.phone.trim();
    const messageText = values.message.trim();
    let hasError = false;

    if (!email || !isValidEmail(email)) {
      setEmailError(true);
      hasError = true;
    } else {
      setEmailError(false);
    }

    if (!phoneText) {
      setPhoneError(true);
      hasError = true;
    } else {
      setPhoneError(false);
    }

    if (hasError || submitStatus === 'sending') return;

    setSubmitStatus('sending');
    setStatusMessage('');

    const enquiryType = values.enquiryType.trim() || enquiryProductTypes[0]?.label || 'General Query';
    const message = [
      messageText,
      values.country.trim() ? `Country: ${values.country.trim()}` : '',
    ].filter(Boolean).join('\n');

    try {
      const response = await fetch('/api/contact-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          company: values.company.trim(),
          fromEmail: email,
          phone: values.phone.trim(),
          country: values.country.trim(),
          enquiryType,
          subject: 'Enquiry from vividpoly.com',
          message,
          website: '',
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (response.status === 503) {
        setSubmitStatus('unavailable');
        setStatusMessage(copy.submitUnavailable);
        return;
      }

      if (!response.ok || !data?.ok) {
        setSubmitStatus('error');
        setStatusMessage(data?.error || copy.submitError);
        return;
      }

      setSubmitStatus('success');
      setStatusMessage(copy.submitSuccess);
      markEnquirySubmitted();
      onChange.name('');
      onChange.company('');
      onChange.email('');
      onChange.phone('');
      onChange.country('');
      onChange.message('');
      onChange.enquiryType(enquiryProductTypes[0]?.label || 'General Query');
      onSubmitSuccess?.();
    } catch {
      setSubmitStatus('error');
      setStatusMessage(copy.submitError);
    }
  };

  const isSending = submitStatus === 'sending';

  const form = (
    <form
      className={`vp-contact-form-grid${isModal ? ' vp-contact-form-grid--modal' : ''}`}
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
    >
      <div>
        <div className="vp-contact-form-label">{copy.formName}</div>
        <input
          value={values.name}
          onChange={(event) => onChange.name(event.target.value)}
          className="vp-quote-contact-input"
          autoComplete="name"
          disabled={isSending}
        />
      </div>

      <div>
        <div className="vp-contact-form-label">{copy.formCompany}</div>
        <input
          value={values.company}
          onChange={(event) => onChange.company(event.target.value)}
          className="vp-quote-contact-input"
          autoComplete="organization"
          disabled={isSending}
        />
      </div>

      <div>
        <div className="vp-contact-form-label">{copy.formEmail}<RequiredMark /></div>
        <input
          type="email"
          value={values.email}
          onChange={(event) => {
            onChange.email(event.target.value);
            if (emailError) setEmailError(false);
          }}
          className={`vp-quote-contact-input${emailError ? ' vp-quote-contact-input--error' : ''}`}
          autoComplete="email"
          required
          aria-required="true"
          disabled={isSending}
        />
        {emailError && (
          <span className="vp-contact-form-error" role="alert">{copy.emailInvalid}</span>
        )}
      </div>

      <div>
        <div className="vp-contact-form-label">{copy.formPhone}<RequiredMark /></div>
        <input
          value={values.phone}
          onChange={(event) => {
            onChange.phone(event.target.value);
            if (phoneError) setPhoneError(false);
          }}
          className={`vp-quote-contact-input${phoneError ? ' vp-quote-contact-input--error' : ''}`}
          autoComplete="tel"
          required
          aria-required="true"
          disabled={isSending}
        />
        {phoneError && (
          <span className="vp-contact-form-error" role="alert">{copy.phoneRequired}</span>
        )}
      </div>

      <div className="vp-contact-form-field--full">
        <div className="vp-contact-form-label">{copy.formCountry}</div>
        <VpCustomSelect
          value={values.country}
          onChange={onChange.country}
          options={contactCountries}
          placeholder={commonSelectCountry}
          ariaLabel={copy.formCountry}
          searchable
          menuClassName="vp-sort-menu--contact"
        />
      </div>

      <div className="vp-contact-form-field--full">
        <div className="vp-contact-form-label">{copy.formEnquiryType}</div>
        <VpCustomSelect
          value={values.enquiryType}
          onChange={onChange.enquiryType}
          options={enquiryTypeOptions}
          placeholder={commonSelectEnquiryType}
          ariaLabel={copy.formEnquiryType}
          menuClassName="vp-sort-menu--contact"
        />
      </div>

      <div className="vp-contact-form-field--full">
        <div className="vp-contact-form-label">{copy.formMessage}</div>
        <textarea
          value={values.message}
          onChange={(event) => onChange.message(event.target.value)}
          className="vp-quote-contact-input vp-quote-contact-input--textarea"
          rows={4}
          disabled={isSending}
        />
      </div>

      {statusMessage && (
        <p
          className={`vp-contact-form-status vp-contact-form-status--${submitStatus}`}
          role={submitStatus === 'error' || submitStatus === 'unavailable' ? 'alert' : 'status'}
        >
          {statusMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isSending}
        className={`vp-cta-primary vp-cta-primary--block vp-contact-form-submit${isModal ? ' vp-contact-form-submit--modal' : ' vp-cta-primary--lg'}`}
      >
        {isSending ? copy.sending : copy.submitEnquiry}
      </button>
    </form>
  );

  if (isModal) {
    return (
      <div className="vp-contact-form-card vp-contact-form-card--modal">
        {form}
      </div>
    );
  }

  return (
    <div id="vp-contact-enquiry" className="vp-contact-form-card">
      <div className="vp-contact-form-head">
        <h2 className="vp-contact-form-title">{copy.sendRequirement}</h2>
        <p className="vp-contact-form-lead">{copy.sendRequirementLead}</p>
      </div>
      {form}
    </div>
  );
}

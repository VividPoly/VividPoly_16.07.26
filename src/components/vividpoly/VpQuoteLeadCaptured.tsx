'use client';

import VpSuccessCard from '@/components/vividpoly/VpSuccessCard';

type QuoteLeadCapturedCopy = {
  quoteLeadCapturedTitle: string;
  quoteLeadCapturedLead: string;
  quoteLeadCapturedOptionalTitle: string;
  quoteLeadCapturedOptionalBody: string;
  quoteLeadCapturedContinueCta: string;
  quoteLeadCapturedSkipCta: string;
};

type VpQuoteLeadCapturedProps = {
  siteCopy: QuoteLeadCapturedCopy;
  contactName?: string;
  onContinue?: () => void;
  onSkip?: () => void;
  embedded?: boolean;
  /** Contact-only success: checkmark, title, and confirmation text only. */
  minimal?: boolean;
};

export default function VpQuoteLeadCaptured({
  siteCopy,
  contactName,
  onContinue,
  onSkip,
  embedded = false,
  minimal = false,
}: VpQuoteLeadCapturedProps) {
  return (
    <VpSuccessCard
      className={embedded ? 'vp-success-page--embedded' : undefined}
      titleId="vp-quote-lead-captured-title"
      title={siteCopy.quoteLeadCapturedTitle}
      body={
        <>
          {contactName
            ? `${contactName}, your contact details are saved. `
            : 'Your contact details are saved. '}
          {siteCopy.quoteLeadCapturedLead}
        </>
      }
      optional={
        minimal
          ? undefined
          : {
              title: siteCopy.quoteLeadCapturedOptionalTitle,
              body: siteCopy.quoteLeadCapturedOptionalBody,
            }
      }
      primary={
        minimal || !onContinue
          ? undefined
          : { label: siteCopy.quoteLeadCapturedContinueCta, onClick: onContinue }
      }
      secondary={
        minimal || !onSkip
          ? undefined
          : { label: siteCopy.quoteLeadCapturedSkipCta, onClick: onSkip }
      }
    />
  );
}

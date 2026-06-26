'use client';

import VpSuccessCard from '@/components/vividpoly/VpSuccessCard';

type QuoteSuccessCopy = {
  quoteSuccessTitle: string;
  quoteSuccessBody: string;
};

type VpQuoteSuccessProps = {
  siteCopy: QuoteSuccessCopy;
  title?: string;
  successBody?: string;
  contactName?: string;
  onRestart: () => void;
};

export default function VpQuoteSuccess({
  siteCopy,
  title,
  successBody,
  contactName,
  onRestart,
}: VpQuoteSuccessProps) {
  const message = successBody ?? siteCopy.quoteSuccessBody;
  const displayTitle = title ?? siteCopy.quoteSuccessTitle;
  const displayBody = contactName
    ? `${contactName}, ${message.charAt(0).toLowerCase()}${message.slice(1)}`
    : message;

  return (
    <VpSuccessCard
      titleId="vp-quote-success-title"
      title={displayTitle}
      body={displayBody}
      primary={{ label: 'Back to Home', onClick: onRestart }}
    />
  );
}

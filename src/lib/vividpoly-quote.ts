export type QuoteData = Record<string, unknown>;

/** Land on contact details first, then lead confirmation, optional bag spec, then success. */
export function getInitialQuoteStep(_quote: QuoteData): number {
  return 3;
}

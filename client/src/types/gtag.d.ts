/** Google Analytics / Consent Mode globals installed by the tags in index.html. */
export {};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

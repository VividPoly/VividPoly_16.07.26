const ENQUIRY_SUBMITTED_KEY = 'vp-enquiry-submitted';
const ENQUIRY_DISMISSED_KEY = 'vp-enquiry-dismissed';

export const ENQUIRY_AUTO_OPEN_MS = 20_000;

/** In-memory only for this page load. Refresh always allows auto-open again. */
let blockedThisLoad = false;

function removeSessionFlag(key: string) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(key);
  } catch {
    // Ignore blocked/private-mode storage.
  }
}

/** Clear legacy session flags that used to permanently block the popup. */
export function resetEnquiryPopupSession() {
  blockedThisLoad = false;
  removeSessionFlag(ENQUIRY_SUBMITTED_KEY);
  removeSessionFlag(ENQUIRY_DISMISSED_KEY);
}

export function canAutoOpenEnquiryPopup() {
  return !blockedThisLoad;
}

export function markEnquirySubmitted() {
  blockedThisLoad = true;
}

export function markEnquiryDismissed() {
  blockedThisLoad = true;
}

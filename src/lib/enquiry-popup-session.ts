const ENQUIRY_DONE_KEY = 'vp-enquiry-auto-done';

/** Time on site before the enquiry modal may auto-open once. */
export const ENQUIRY_AUTO_OPEN_MS = 5 * 60 * 1000;

let doneMemory: boolean | null = null;
let visitStartedAt: number | null = null;
let autoOpenedThisVisit = false;

function readDoneFlag() {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(ENQUIRY_DONE_KEY) === '1';
  } catch {
    return false;
  }
}

function writeDoneFlag() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ENQUIRY_DONE_KEY, '1');
  } catch {
    // Ignore blocked/private-mode storage.
  }
}

/** Call once when the app mounts so dwell time spans the whole visit. */
export function ensureEnquiryVisitClock() {
  if (visitStartedAt == null) {
    visitStartedAt = Date.now();
  }
  if (doneMemory == null) {
    doneMemory = readDoneFlag();
  }
}

export function getEnquiryVisitElapsedMs() {
  ensureEnquiryVisitClock();
  return Date.now() - (visitStartedAt ?? Date.now());
}

export function isEnquiryAutoDone() {
  if (doneMemory) return true;
  doneMemory = readDoneFlag();
  return doneMemory;
}

export function canAutoOpenEnquiryPopup(_pageKey?: string) {
  if (isEnquiryAutoDone()) return false;
  if (autoOpenedThisVisit) return false;
  return true;
}

export function markEnquiryAutoOpened(_pageKey?: string) {
  autoOpenedThisVisit = true;
}

/** User closed or submitted the form: never auto-open again on this browser. */
export function markEnquiryDismissed(_pageKey?: string) {
  doneMemory = true;
  autoOpenedThisVisit = true;
  writeDoneFlag();
}

export function markEnquirySubmitted(_pageKey?: string) {
  markEnquiryDismissed(_pageKey);
}

/** @deprecated No longer clears the permanent done flag. Kept for call-site compatibility. */
export function resetEnquiryPopupSession() {
  ensureEnquiryVisitClock();
}

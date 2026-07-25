import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Cookie } from "lucide-react";

const CONSENT_KEY = "vividpoly_cookie_consent";

// Cookie-consent bar with Accept / Reject. The choice is stored so the bar does
// not reappear. Kept bottom-center so it never overlaps the chat widget
// (bottom-right) or the language banner (bottom-left).
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
    } catch {
      /* ignore */
    }
  }, []);

  const choose = (value: "accepted" | "rejected") => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-2xl sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#DC2626]/10 text-[#DC2626]">
            <Cookie className="h-5 w-5" />
          </span>
          <p className="text-sm text-gray-600">
            We use cookies to give you a better browsing experience and to understand how
            our site is used. See our{" "}
            <Link href="/privacy-policy" className="font-medium text-[#DC2626] underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-shrink-0 gap-2 self-end sm:self-auto">
          <button
            onClick={() => choose("rejected")}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            Reject
          </button>
          <button
            onClick={() => choose("accepted")}
            className="rounded-lg bg-[#DC2626] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#B91C1C]"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

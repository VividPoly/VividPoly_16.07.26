import { useGeoLanguage } from "@/hooks/useGeoLanguage";
import { Globe, X } from "lucide-react";
import { useState } from "react";

export function LanguageBanner() {
  const { shouldOfferTranslation, languageName, detectedLanguage, dismissTranslation } = useGeoLanguage();
  const [translating, setTranslating] = useState(false);

  if (!shouldOfferTranslation) return null;

  const handleTranslate = () => {
    setTranslating(true);
    // Use Google Translate widget to translate the page
    const translateUrl = `https://translate.google.com/translate?sl=en&tl=${detectedLanguage}&u=${encodeURIComponent(window.location.href)}`;
    window.open(translateUrl, "_blank");
    // Save preference
    localStorage.setItem("vividpoly_lang_preference", JSON.stringify({
      detectedLanguage,
      languageName,
    }));
    setTranslating(false);
    dismissTranslation();
  };

  const handleStayEnglish = () => {
    dismissTranslation();
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-xs bg-white border border-gray-200 rounded-xl shadow-2xl p-4 animate-in slide-in-from-bottom-4">
      <button
        onClick={handleStayEnglish}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-[#DC2626]/10 rounded-full flex items-center justify-center">
          <Globe className="w-5 h-5 text-[#DC2626]" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 mb-1">
            View in {languageName}?
          </p>
          <p className="text-xs text-gray-500 mb-3">
            We detected you may prefer {languageName}. Would you like to translate this page?
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleTranslate}
              disabled={translating}
              className="px-3 py-1.5 text-xs font-medium text-white bg-[#DC2626] rounded-lg hover:bg-[#B91C1C] transition-colors disabled:opacity-50"
            >
              {translating ? "Translating..." : `Switch to ${languageName}`}
            </button>
            <button
              onClick={handleStayEnglish}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Stay in English
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

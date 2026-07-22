# Locale translation files

English (US) is the complete base and lives in `src/data/ui-copy.json`.
Every file here overrides that base for one locale. Anything you DON'T include
falls back to English automatically (deep-merge), so files can be partial and
filled in over time.

## How to translate
1. Open the locale file (e.g. `fr.json`).
2. Copy the keys you want from `../ui-copy.json`, keeping the same nesting.
3. Replace the English values with translations. Leave out anything not ready.

Example `fr.json`:
```json
{
  "nav": { "home": "Accueil", "products": "Produits", "contact": "Contact" },
  "common": { "getQuote": "Demander un devis", "submitEnquiry": "Envoyer" }
}
```

These files are already imported and wired in `src/lib/i18n/locales.ts`, so
editing a file takes effect immediately — no code changes needed.

RTL locales (ar, fa, he) automatically get `dir="rtl"` on the page.

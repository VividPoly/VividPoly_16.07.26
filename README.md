# VividPoly Website (Next.js)

Production Next.js port of the VividPoly marketing site and product catalogue.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

On Windows, `START-PREVIEW.bat` installs dependencies (if needed), starts the dev server, and opens the browser.

## Production build

```bash
npm run build
npm start
```

## Deploy on Vercel

1. Import this repository in [Vercel](https://vercel.com).
2. Framework preset: **Next.js** (auto-detected).
3. No environment variables are required for the static marketing site. See `.env.example` for optional local overrides.
4. Deploy. Vercel runs `npm run build` by default.

No `vercel.json` or middleware is required for this App Router project.

## Re-sync from design HTML

When the source `VividPoly.dc.html` prototype changes:

```bash
npm run convert
```

This regenerates:

- `src/components/vividpoly/VividPolyView.tsx` (UI)
- `src/hooks/useVividPoly.ts` (state and interactions)
- `src/data/vividpoly-data.ts` (static content)

## Architecture

| Path | Purpose |
|------|---------|
| `src/components/vividpoly/` | Page UI, forms, icons |
| `src/hooks/useVividPoly.ts` | SPA state and hash routing |
| `src/data/vividpoly-data.ts` | Products, FAQs, blog content |
| `src/data/ui-copy.json` | Nav, footer, and UI chrome strings |
| `src/app/globals.css` | Design tokens, layout, responsive CSS |
| `scripts/convert-vividpoly.mjs` | HTML to Next.js converter |
| `scripts/snap-to-4px-grid.mjs` | Spacing audit helper (4px grid) |

Design fidelity is preserved by keeping original inline styles and a dedicated stylesheet rather than rewriting to Tailwind.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run convert` | Regenerate from HTML prototype |
| `npm run audit:responsive` | Playwright responsive audit (dev server required) |

## Environment

Copy `.env.example` to `.env.local` for optional overrides. Never commit real secrets.

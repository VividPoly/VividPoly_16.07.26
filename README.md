# VividPoly — Website

The VividPoly marketing site: the exact client-approved design (Vite + React +
Express + tRPC), with the requested tweaks applied.

## Stack

- **Vite + React 19** client (`client/`), **wouter** routing
- **Express + tRPC** server (`server/`), **Drizzle ORM** on **MySQL**
- **Tailwind CSS v4**, product content in `client/src/content` + `client/src/data`
- Live chat via **Tawk.to**

## Local development

```bash
pnpm install
pnpm dev        # http://localhost:3000  (Vite + Express together)
pnpm build      # client -> dist/public, server -> dist/index.js
pnpm start      # run the production build
```

The site renders fully without a database (product/marketing content is static).
A `DATABASE_URL` (MySQL) is only needed for admin-published blogs and for storing
inquiry submissions.

## Environment variables

| Variable | Needed for |
| --- | --- |
| `JWT_SECRET` | Signing session cookies (any strong random string) |
| `DATABASE_URL` | MySQL connection — blog posts + saved inquiries |
| `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY` | Optional file-storage backend for inquiry attachments |
| `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`, `VITE_APP_ID` | Optional owner/admin login (off by default) |

## Deploy to Vercel

`vercel.json` + `api/[...path].ts` are included:

1. Vercel → **Add New → Project → Import** `VividPoly/Website-New`.
2. Build command `pnpm build`, output `dist/public` (already set in `vercel.json`).
3. Add the environment variables above (at minimum `JWT_SECRET`; add `DATABASE_URL`
   for blogs/inquiries).
4. Deploy. The client is served statically; every `/api/*` request is handled by
   the serverless function, which reuses the same tRPC router as the local server.

> This is an Express + MySQL app, so if a Vercel serverless nuance needs a tweak,
> it can also run unchanged on any Node host (Render, Railway, Fly) with
> `pnpm build && pnpm start` and the same env vars — the most direct fit for this
> stack.

## Applied tweaks

- Tawk.to live chat (old AI chatbot removed)
- Home: "Watch Video" button + intro video removed
- Home: static "Product by Use" grid replaced with the "Packaging in Action" slider
- Removed the duplicated footer export-CTA banner (each page keeps its own CTA)
- Staff-login button removed; all Manus references/traces removed
- All `/manus-storage` images localized to `/media` (supplied product photos,
  real logo, team/conference-room hero photo)

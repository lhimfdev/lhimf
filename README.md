# LHIMF Store (Next.js 15, App Router, TypeScript)

## Run (Windows/macOS/Linux)
```
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```
Copy `.env.example` to `.env.local` and fill it in.

## Configure
- `lib/config.ts` – brand, announcement, contact, social links (placeholders until set).
- `lib/products.ts` – the only place prices/packages live.
- `lib/content.ts` – FAQ (shown on About) and steps (shown on NFC Cards). `public/images/` – replaceable card images.
- Orders/contact: `POST /api/orders` validates with Zod, honeypot, in-memory rate limit, then forwards JSON to `ORDER_WEBHOOK_URL`. With no URL it returns 503 and the UI shows "demo mode" — nothing is faked. No payment data is collected.

## Deploy to Vercel
Push to Git, import in Vercel, set the env vars from `.env.example` (especially `NEXT_PUBLIC_SITE_URL`, `ORDER_WEBHOOK_URL`), deploy.

## Status / known limitations
- Generated in an environment without network access: **`npm install`, lint, type-check and build have NOT been run.** Run them and fix any issue before deploying.
- Plain CSS (`app/globals.css`) is used instead of Tailwind.
- Rate limiter is per-instance memory; use a shared store (e.g. Upstash) in production.
- Not built: lightbox, social sharing image, structured data, favicon set, payment gateway. Privacy/Terms are placeholders to edit.
- Not tested: responsive layouts, keyboard/reduced-motion behavior, sample URLs.

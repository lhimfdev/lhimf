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

## Admin dashboard
- Visit `/admin/login` to sign in and `/admin` to manage the existing `orders` table.
- Dashboard APIs require a signed, HTTP-only, SameSite=Strict session cookie. Passwords are checked against a scrypt hash; the admin email, hash, and signing secret must be configured as server-side environment variables.
- Set `ADMIN_EMAIL` to the admin email. Generate a password hash with `node scripts/create-admin-password-hash.mjs`, then set the printed value as `ADMIN_PASSWORD_HASH`. Set `ADMIN_SESSION_SECRET` to a unique random value of at least 32 characters (PowerShell: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`).
- Keep `DATABASE_URL`, `ADMIN_PASSWORD_HASH`, and `ADMIN_SESSION_SECRET` only in `.env.local` and your hosting provider's encrypted environment settings. Never commit `.env.local` or include it in project ZIP files.
- The dashboard reads existing order rows and updates the existing `status` field. It does not create a replacement orders table or collect payments. Status values used by the dashboard: `pending`, `reviewing`, `contacted`, `in_progress`, `completed`, `cancelled`.
- The overview shows up to the latest 500 rows. Its order value is an estimate based on package prices for in-progress/completed orders, not money received.

# Inquiry Worker

Cloudflare Worker that receives order inquiries and contact messages from the
static site and emails them to the Scandinavian representative via Resend.
Implemented and tested; **not deployed**. Deploying it and pointing the site at
it is a business decision (see "Before activation").

## What it does

- `POST /inquiry` (JSON, ≤ 32 KB), CORS-restricted to `ALLOWED_ORIGIN`.
- Validates every field server-side; rejects control characters/header injection.
- Re-derives products, sizes and prices from `website/src/lib/catalog.ts` — browser prices are ignored.
- Spam protection: Cloudflare Turnstile (required), honeypot field, 3-second minimum fill time, 5 submissions / 10 min per IP (hashed).
- Idempotency: the browser sends one UUID per form view; retries return the first result without a second email (24 h, KV). Resend also receives an `Idempotency-Key`.
- Server-generated reference (`EQ-YYYYMMDD-XXXXXX`) and UTC timestamp.
- Representative email contains customer details, every line with product/build/size ids, quantities, reference prices in EUR, availability notes and comments; `reply_to` is the customer.
- Optional customer confirmation (`SEND_CUSTOMER_CONFIRMATION=true`); its failure never fails an accepted inquiry.
- Responds `200 {ok, reference, receivedAt}` only after Resend accepted the representative email (accepted ≠ delivered to inbox). Any failure leaves the customer's bag intact.
- Logs nothing containing personal data.

## Configuration

| Name | Kind | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | secret | Resend API key (sending-only scope) |
| `INQUIRY_RECIPIENT` | secret | Representative inbox |
| `INQUIRY_FROM` | secret | Verified sender, e.g. `Equator Scandinavia <inquiries@your-domain>` |
| `TURNSTILE_SECRET_KEY` | secret | Turnstile secret |
| `ALLOWED_ORIGIN` | var | Site origin(s), comma separated, e.g. `https://theradim.github.io` |
| `SEND_CUSTOMER_CONFIRMATION` | var | `true` / `false` |
| `ALLOW_NO_TURNSTILE` | var | `true` **only** for local dev |
| `INQUIRY_KV` | KV binding | Idempotency + rate limiting |

Site side (GitHub Actions *variables*, public): `PUBLIC_INQUIRY_ENDPOINT` (e.g. `https://equator-scandinavia-inquiry.<account>.workers.dev/inquiry`), `PUBLIC_TURNSTILE_SITE_KEY`, `PUBLIC_REPRESENTATIVE_EMAIL`.

## Setup (once approved)

1. Resend: create account, verify a sending domain you control, create a sending-only API key.
2. Cloudflare: create a Turnstile widget for the site hostname → site key + secret.
3. `cd worker && npx wrangler@4 login`
4. `npx wrangler@4 kv namespace create INQUIRY_KV` → paste the id into `wrangler.toml`.
5. `npx wrangler@4 secret put RESEND_API_KEY` (repeat for `INQUIRY_RECIPIENT`, `INQUIRY_FROM`, `TURNSTILE_SECRET_KEY`).
6. Set `ALLOWED_ORIGIN` in `wrangler.toml`; `npm run deploy`.
7. Add the GitHub variables above and redeploy the site.
8. Test with an authorised test recipient: valid order, contact message, failed Turnstile, duplicate click, provider outage (wrong key), unavailable product.

## Before activation

Approval is required for: legal operator / data controller, processors (Cloudflare, Resend), retention, final privacy text and terms. The current privacy, terms and cookie pages are prototype notices and **must be replaced** before `PUBLIC_INQUIRY_ENDPOINT` is set.

## Tests

`npm test` (Node 22, no install needed) covers valid order, server pricing, HTML escaping, idempotent retry, Turnstile failure / fail-closed, foreign origin, honeypot, fast submit, provider failure, invalid items, header injection, rate limit and contact validation.

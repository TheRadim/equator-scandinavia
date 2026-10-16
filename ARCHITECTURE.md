# Website architecture

Updated 2026-10-16.

## Components

- `website/` — Astro 7 static output, strict TypeScript, Tailwind CSS 4 (plus a small hand-written design system in `src/styles/global.css`), Inter Variable self-hosted via `@fontsource-variable/inter`. No UI framework; interactive parts are small native `<script>` modules (configurator, gallery, wheel filters/freehub, cart, inquiry form).
- `website/src/data/` — product content, separate from presentation: `bikes/catalog.ts` (+ `families.ts` card copy), `wheels/catalog.ts`, `accessories/catalog.ts`, image provenance (`image-sources.json`) and pending gallery URLs (`gallery-candidates.json`).
- `website/src/lib/` — pure logic: `catalog.ts` (resolve/validate cart lines, totals, money), `publication.ts` (statuses, visibility), `storage.ts` (localStorage cart), `config.ts` (public build flags), `inquiry.ts` (shared form enums), `seo.ts` (JSON-LD), `urls.ts` (base path).
- `worker/` — Cloudflare Worker `POST /inquiry`: validation, Turnstile, rate limit + idempotency in KV, server-side pricing from the same `catalog.ts`, email via Resend. Not deployed.
- `docs/website-workflows/` — CI (tests + build) and manual Pages deploy templates; they move to `.github/workflows/` when a token with `workflow` scope is available.

## Data flow

1. Catalog TS files → static pages at build time (one page per bike family / wheelset).
2. Configurator selects only factory builds (`buildId`) + listed size; wheels select a listed freehub. Cart lines store `{productId, buildId, size, quantity}` only — never prices.
3. Cart and totals are re-derived from the catalog on every render; corrupt or stale lines fail closed with a reset option.
4. Inquiry: demo mode (default) keeps everything in the browser. Live mode posts ids + quantities + contact fields to the Worker, which re-validates and prices server-side, emails the representative, and returns a reference. The bag is cleared only after acceptance.

## Build flags (public, build-time)

`PUBLIC_INQUIRY_ENDPOINT` (empty = demo), `PUBLIC_TURNSTILE_SITE_KEY`, `PUBLIC_REPRESENTATIVE_EMAIL`, `PUBLIC_ALLOW_INDEXING` (`true` = index + robots allow). Secrets exist only as Worker secrets.

## Future checkout

Cart lines are already id-based and server-priced in the Worker, so a payment step can be added as a second Worker route (e.g. Stripe Checkout session from the same validated lines) without changing the catalog or cart format. Multi-currency: prices are integer minor units with a single `displayCurrency`; add per-currency price fields only with an approved pricing policy (no automatic FX).

## Routes

Home; bikes + 3 family pages; wheels (Road / Gravel / TT filter, `?category=`) + 4 wheelset pages; accessories (held — honest empty state); about; contact; cart; inquiry; confirmation; privacy; terms; warranty; crash replacement; shipping; FAQ; cookies; 404; sitemap.xml; robots.txt.

## Quality gates

`npm test` (11 tests: compatibility, frameset exclusion, cart identity, unknown prices, corrupt storage, price injection, freehub validation, category coverage, no zero prices, image variants, metadata), `npm run build` (astro check, 0 errors), `worker npm test` (8 tests). Browser QA (Playwright) at 375/768/1024/1440/1920: no horizontal overflow, no console errors, axe-core WCAG 2 A/AA + best-practice: 0 violations on 13 key routes.

## References

https://docs.astro.build/en/guides/deploy/github/ · https://developers.cloudflare.com/workers/ · https://developers.cloudflare.com/turnstile/ · https://resend.com/docs/api-reference/emails/send-email

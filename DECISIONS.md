# Website decisions

2026-10-16:
- User clarified prototype scope: no real submission, purchase or production launch. Equator is intended to handle sales; precise legal/data-controller responsibilities remain to be settled before collection.
- Preserve existing operational project; isolate Astro under website/.
- Use three bicycle families and factory build bundles, not invented component combinations.
- EUR manufacturer reference prices only; no Scandinavian offer or currency conversion.
- Image reuse permission confirmed; current photos are temporary and replaceable.
- Keep unconfirmed wheel/accessory entries out of active merchandise.
- Use manual dated inventory review; no API access inferred from Shoptet platform.
- Cloudflare Workers + Resend remains a production recommendation, not an approved processor setup.
- Existing business decisions remain in docs/decisions.md.

2026-10-16 (continuation session, Claude):
- Inquiry endpoint implemented as a Cloudflare Worker + Resend in `worker/`, with Turnstile, KV idempotency/rate limiting and server-side pricing. It is not deployed. The site switches to live mode only when `PUBLIC_INQUIRY_ENDPOINT` is set at build time; this replaces the earlier "production is unimplemented" stance. Setting it still requires the legal/data-controller approvals and final privacy text listed in worker/README.md.
- Published Wavy 50C (in stock at manufacturer), Gravel Ultimate 40C (custom production → "Available to order") and TT 88C (restock November 2026 → "Out of stock", inquiries allowed) so all three wheel categories have a current product. Older road/gravel wheels remain held.
- Wheel prices stay `null` (Price on request) with a separate "from" reference, because manufacturer variant prices (e.g. €1,411 vs €1,443) do not map clearly to freehub options.
- Conflicting manufacturer values (Wavy 35C depth 35 vs 50 mm, weight 1,380 vs 1,480 g) are shown as conflicts, not resolved.
- Yasei Force XPLR wheel ("Equator Gravel 40C") is not linked to Gravel Ultimate 40C, because the manufacturer does not say which 40C model it is.
- Configurator uses option tiles, six steps; wheelset/components are shown as included with the factory build (no unverified upgrade pricing).
- Product JSON-LD omits Offer (no binding price/stock). Search indexing off unless `PUBLIC_ALLOW_INDEXING=true`.
- Typeface: Inter Variable, self-hosted.

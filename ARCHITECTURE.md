# Website architecture

Decision date: 2026-10-16. Scope: private, non-production prototype (user clarification).

- `website/`: Astro static output, strict TypeScript, Tailwind CSS; native browser modules for configuration, cart and forms. No React dependency.
- `website/src/data/`: reviewed public product facts, stable product/build IDs, source URLs and dates. Approved photography is replaceable through data rather than components.
- `website/src/lib/`: pure compatibility, pricing and cart logic; browser persistence contains products only, never customer details.
- GitHub Actions checks the static build. Pages deployment is manual and remains disabled until a deliberate publication decision. Default future base: `/equator-scandinavia/`; no domain assumed.
- Inquiry prototype validates locally and explicitly simulates confirmation. No email, payment or customer-data collection service is activated.
- Production recommendation, not approved deployment: Cloudflare Worker validates bounded payloads against the catalog and server-side spam tokens, enforces rate limits, and sends via Resend with environment-held credentials. Pages cannot execute this server code. Do not accept browser prices as authoritative. Use idempotency keys; clear cart only after server acceptance. Vendor/data-controller decisions remain open.
- No product scraping at runtime, inventory sync, accounts, analytics, CRM or payment processing. Existing Python and Sheets workflow remains independent.

## Routes

Home; bikes and three family detail routes; wheels (road/gravel/TT) and approved detail routes; accessories and eligible detail routes; about; contact; cart; inquiry; confirmation; privacy; terms; warranty; crash replacement; shipping; FAQ; cookies; 404.

## Verification

Build and type-check each milestone. Unit tests target compatibility, unknown-price totals, quantity bounds, corrupt storage and identity preservation. Browser QA targets 375/768/1024/1440/1920 px, keyboard navigation, configuration switching, reload persistence, cart editing, demo submission and console errors.

## References

Checked 2026-10-16: https://docs.astro.build/en/guides/deploy/github/ ; https://developers.cloudflare.com/workers/ ; https://resend.com/docs/api-reference/emails/send-email

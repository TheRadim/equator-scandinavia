# Website inquiries

Updated 2026-10-16.

The site has two inquiry modes, chosen at build time:

- **Demo (default)** — `PUBLIC_INQUIRY_ENDPOINT` empty. Forms validate in the browser and nothing leaves it. The confirmation page states nothing was sent; the bag is kept.
- **Live** — `PUBLIC_INQUIRY_ENDPOINT` points to the inquiry Worker (`worker/`). The form POSTs JSON with a Turnstile token and an idempotency key. The bag is cleared only after a `200 {ok:true}`; every error keeps the bag and shows the server's message.

Customer contact details are never written to localStorage/sessionStorage. Only a product summary, reference and timestamp are kept in sessionStorage for the confirmation page.

Endpoint implementation, security properties, configuration and setup: see `worker/README.md`. All original acceptance criteria (bounded payload, schema validation, allowlisted combinations, server prices, injection-safe email, Turnstile, rate limiting, idempotency, timeouts, server reference/timestamp, minimal logging, accepted-vs-delivered distinction, optional customer copy that cannot duplicate representative delivery) are implemented and unit-tested.

Activation still requires the business approvals listed in `worker/README.md` → "Before activation", followed by a test with an authorised recipient.

/**
 * Build-time public configuration (safe to expose). Set in website/.env or as
 * GitHub Actions variables. Leaving PUBLIC_INQUIRY_ENDPOINT empty keeps the
 * site in demo mode: forms validate locally and nothing is sent.
 */
export const inquiryEndpoint: string = (
  import.meta.env.PUBLIC_INQUIRY_ENDPOINT ?? ""
).trim();
export const turnstileSiteKey: string = (
  import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? ""
).trim();
export const representativeEmail: string = (
  import.meta.env.PUBLIC_REPRESENTATIVE_EMAIL ?? ""
).trim();
export const liveInquiries = inquiryEndpoint.length > 0;
/** Search indexing stays off until a deliberate public launch (PUBLIC_ALLOW_INDEXING=true). */
export const allowIndexing =
  (import.meta.env.PUBLIC_ALLOW_INDEXING ?? "").trim() === "true";

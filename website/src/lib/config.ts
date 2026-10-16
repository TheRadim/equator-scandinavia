import { site } from "../data/site.ts";
/**
 * Build-time public configuration (safe to expose). Values come from
 * src/data/site.ts and can be overridden with PUBLIC_* build variables.
 *
 * Form delivery, first match wins:
 *  1. PUBLIC_INQUIRY_ENDPOINT — the Cloudflare Worker in worker/
 *  2. Formspree form ID — site.formspreeId or PUBLIC_FORMSPREE_ID
 *  3. Email — the form opens the visitor's email app addressed to site.email
 */
const env = import.meta.env;
export const inquiryEndpoint: string = (env.PUBLIC_INQUIRY_ENDPOINT ?? "").trim();
export const turnstileSiteKey: string = (env.PUBLIC_TURNSTILE_SITE_KEY ?? "").trim();
export const formspreeId: string = ((env.PUBLIC_FORMSPREE_ID ?? "").trim() || site.formspreeId).trim();
export const representativeEmail: string =
  (env.PUBLIC_REPRESENTATIVE_EMAIL ?? "").trim() || site.email;
export const deliveryMode: "worker" | "formspree" | "email" = inquiryEndpoint
  ? "worker"
  : formspreeId
    ? "formspree"
    : "email";
/** Kept for older imports: true when messages are sent by the site itself. */
export const liveInquiries = deliveryMode !== "email";
/** Search indexing stays off until PUBLIC_ALLOW_INDEXING=true. */
export const allowIndexing = (env.PUBLIC_ALLOW_INDEXING ?? "").trim() === "true";

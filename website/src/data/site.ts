/**
 * Public business details shown on the site. Edit here (or override with the
 * PUBLIC_* build variables) — no component changes needed.
 */
export const site = {
  name: "Equator Scandinavia",
  /** Inbox for contact messages and order inquiries; shown on the contact page. */
  email: "hi@radim-theiner.com",
  /** Show the address on the site (footer, policies). Off until a neutral business address exists. */
  showEmail: false,
  region: "Denmark · Sweden · Norway",
  /**
   * Formspree form ID (the part after formspree.io/f/). Public by design.
   * Empty = forms open the visitor's email app instead.
   */
  formspreeId: "",
  /**
   * Umami Cloud website ID (free Hobby plan, cookieless visitor statistics).
   * Empty = no statistics script at all. Public by design.
   */
  umamiWebsiteId: "50f2ce70-8120-4514-815f-1961ee4fbd28",
  /**
   * Display currencies. Catalogue prices are EUR (Equator's list prices);
   * other currencies are converted at the rates below and rounded to 10.
   * Update the rates (ECB euro reference rates) when needed.
   */
  currencies: {
    EUR: 1,
    DKK: 7.475,
    SEK: 11.1765,
    NOK: 10.652,
  },
  ratesDate: "15 October 2026",
  ratesSource: "European Central Bank reference rates",
};

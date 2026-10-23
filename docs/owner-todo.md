# Owner to-do and approvals

Updated 2026-10-23. Tick items off as you answer them; tell Claude/Codex the answer and it updates the site.

## Before launch (blockers first)
1. [ ] **Form delivery (blocker).** Without a Formspree ID the contact and order forms only open the visitor's email app; people using webmail or a phone without a mail account can't send anything. Create the Formspree form and send the ID.
2. [ ] **Business identity (blocker for selling to consumers).** Danish e-commerce rules expect the seller's name, address, CVR number and email on the site; the privacy policy must name the data controller. Decide what entity sells (sole trader/company), then the footer, privacy and terms get those details. (Not legal advice; a short check with an accountant or lawyer is worth it.)
3. [ ] **Right of withdrawal and VAT.** If customers conclude the order at a distance, EU consumer law gives a 14-day right of withdrawal and prices to consumers must include VAT. Terms currently say only "inquiry, then written confirmation". Confirm with Equator who is the seller of record and add the withdrawal and VAT wording.
4. [ ] **Permission from Equator** to use their photos, logo, product texts and the line "Representing Equator Cycling" (ideally in writing).
5. [ ] **Neutral email address** (e.g. hello@yourdomain) instead of the personal one that receives forms.
6. [ ] **Domain.** The site lives at theradim.github.io/equator-scandinavia (shows your GitHub name). A custom domain is needed for robots.txt, search indexing and a professional link.
7. [ ] **Search indexing** is off (noindex). After 1–6: set PUBLIC_ALLOW_INDEXING=true, add the domain to Google Search Console and submit /sitemap.xml.
8. [ ] **Visitor statistics (Umami, free):** create an account at umami.is (Hobby plan), add the website theradim.github.io, copy its Website ID and send it to Claude (or set it as the repository variable PUBLIC_UMAMI_WEBSITE_ID). The script, cookie page and privacy wording are ready and switch on with the ID.
9. [ ] **Optional:** cookieless visitor statistics (e.g. Plausible or Cloudflare Web Analytics; the cookie page would need one sentence), a Danish/Swedish/Norwegian language version.

Done on 2026-10-23: favicons (tab, iPhone, Android), web app manifest, link previews (1200×630 image for every page with the Equator wordmark, title, description), unique page descriptions, cart/inquiry/404 pages excluded from search, organisation data for search engines, personal email no longer readable in the page source, lighter gallery thumbnails, accessibility check clean.

## Approve the wording (already live — edit or approve)
These texts replaced the old "prototype / approval pending" notes. They make no promises beyond what Equator publishes, but they speak for your business, so please read and approve or correct each one.

- [ ] **Privacy policy** (`/privacy/`): names "Equator Scandinavia" as operator with hi@radim-theiner.com; data used only to answer and arrange orders with Equator; form service processes messages on our behalf; bag stored in the browser; right to access/delete by email. → Need: your legal name/company (sole trader?) and address, if you want them shown. Is "Equator Scandinavia" a registered business name?
- [ ] **Terms / How ordering works** (`/terms/`): inquiry is not a purchase; written confirmation of price, delivery and payment; order placed when the customer accepts; EUR prices are a guide.
- [ ] **Warranty** (`/warranty/`): "covered by Equator Cycling's warranty conditions… we'll handle the contact with Equator for you." → Confirm with Equator: warranty length per product, who handles claims, and whether the Czech conditions apply to Scandinavian buyers.
- [ ] **Crash replacement** (`/crash-replacement/`): "we'll check with Equator what the programme offers for your wheel." → Ask Equator whether the programme applies to Scandinavian customers.
- [ ] **Shipping** (`/shipping/`): "We deliver to Denmark, Sweden and Norway; bikes ship from Equator in Czechia; cost and date stated in the order confirmation." → Confirm who ships (Equator direct or you), typical lead time, and how Norway (outside EU: VAT/customs) is handled.
- [ ] **FAQ** (`/faq/`) and **Cookies** (`/cookies/`).
- [ ] **About** (`/about/`), Scandinavia section: removed "Representation arrangements are being finalised". → Do you want your name/photo here ("Your contact: Radim Theiner")? It helps dealers.
- [ ] **Footer**: "© 2026 Equator Scandinavia · Representing Equator Cycling, Czech Republic". → OK to say "representing"? Is there a written agreement with Equator?

## Answer / set up
- [ ] **Public email address**: hi@radim-theiner.com is hidden everywhere on the site (`showEmail: false` in `website/src/data/site.ts`); policies point to the contact form. It is still where forms are delivered, and the email-app fallback (until Formspree is set up) addresses it. Get a neutral address (e.g. hello@equator-scandinavia.com), change `email` and set `showEmail: true`.
- [ ] **Currency rates**: DKK/SEK/NOK are converted from Equator's EUR prices at ECB rates of 15 Oct 2026 (DKK 7.475, SEK 11.1765, NOK 10.652), rounded to 10. Decide your own price policy (fixed kroner prices? margin? VAT?) and update `website/src/data/site.ts`.
- [ ] **Wheel range**: added 50C Carbon (disc €988 / rim €867), Wide 50C (€1,069), 35C (restocking, CZK price only) and 45T tubular (€847). Confirm with Equator these are current models, and the 45T rider weight limit (150 vs 105 kg).
- [ ] **Formspree**: create a free account at formspree.io with hi@radim-theiner.com, create a form, send the form ID (e.g. `xyzabcde`). Until then forms open the visitor's email app.
- [ ] **Prices**: Equator's EUR prices are shown. Are they incl. Czech VAT? Should Scandinavian customers see these, DKK/SEK/NOK, or no prices (dealer model)? Prices can be switched off site-wide with `PUBLIC_SHOW_PRICES=false`.
- [ ] **Prices for parts listed only in CZK** (seatposts, stem, spacers) — ask Equator for EUR prices; currently "Price on request".
- [ ] **Geometry values to confirm with Equator** (marked * on the site): Sensei S reach 365.5 mm (larger than M 362 mm); Raiden XL stack 590 mm and effective top tube 393 mm; Yasei XL reach 425 mm (smaller than L 428 mm).
- [ ] **Other data conflicts on Equator's site**: Wavy 35C depth (35 vs 50 mm) and weight (1,380 vs 1,480 g); Adventure fork tyre clearance (55 vs 50 mm) and steerer length (300 vs 350 mm).
- [ ] **Stock / lead times**: accessories all "restocking" at Equator; Raiden restocking; TT 88C due November 2026. Ask Equator for dates, and whether a stock feed exists.
- [ ] **Sizes**: Equator lists S geometry for Sensei, Raiden and Yasei but only offers M/L(/XL). Is S coming back?
- [ ] **Dealer material**: dealer price list / terms to share with shops (the site can get a password-free "Dealers" page later).
- [ ] **Custom domain** (e.g. equator-scandinavia.com)? Needed before turning on search indexing.
- [ ] **Search indexing**: currently off. Turn on (`PUBLIC_ALLOW_INDEXING=true`) when the texts above are approved.

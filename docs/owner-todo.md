# Owner to-do and approvals

Updated 2026-10-16. Tick items off as you answer them; tell Claude/Codex the answer and it updates the site.

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

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

2026-10-16 (owner direction):
- Owner is the Scandinavian middle man building an international storefront to sell Equator bikes and to show dealers. Site copy is now customer-facing, without prototype notices. Prices shown for now; may be hidden later for a dealer model (`PUBLIC_SHOW_PRICES`).
- Inbox: hi@radim-theiner.com. Form delivery: Formspree (owner to create form); mailto fallback until then.
- Contact/inquiry form reduced to name, email, phone, message (owner request).
- Accessories published although all are restocking at Equator, labelled "Restocking"; CZK-only prices shown as "Price on request" (no FX).
- Geometry published as Equator lists it, including sizes not currently offered (greyed); suspicious values flagged with * pending Equator confirmation.
- Size finder uses Equator's rider-height ranges; inseam ≥ 47% of height picks the larger of two overlapping sizes. Always followed by "we'll confirm your size".

2026-10-16 (owner direction, cont.):
- Currency switch EUR/DKK/SEK/NOK (owner asked for EUR, DKK, NOK; SEK added for Sweden). Conversion from EUR list prices at ECB reference rates stored in website/src/data/site.ts, rounded to 10, with a visible note; final price confirmed in the order confirmation. The representative's email includes the EUR subtotal.
- Wheel variants are specs, not products: brake type (disc/rim), freehub and tubeless setup (+€32). Equator's second listed price per wheel equals the tubeless option (stated on the 50C Disc page; 50C rim €867/€899 matches).
- Added current road wheels 50C (disc/rim), Wide 50C, 35C, 45T tubular. Equator states wheels are assembled and tested by hand in Zlín (Wavy 50C, 50C Disc, TT 88C pages); shown site-wide.
- Removed arrow glyphs from links/buttons; full-width sticky header; compact footer.
- Personal email hidden from the site until a neutral business address exists (site.showEmail=false).
- Size finder scores every offered size on height (Equator range) and inseam (vs. mid-range height × 0.46, typical inseam ratio); shows approximate saddle height (inseam × 0.883). Always followed by "we'll confirm your size".

2026-10-21 (owner direction):
- Homepage redesign on branch design/landing rejected by owner; branch deleted. The current layout stays.
- Motion kept quiet and CSS-first: tokens in global.css (--ease-out cubic-bezier(0.23,1,0.32,1), 120/160/220/280 ms UI, 640 ms scroll reveal). Hovers only on hover-capable pointers; press feedback scale(0.97); card photos zoom 3.5% on hover; links draw a full underline from a short dark stub; gallery crossfades; mobile menu drops in; bag count bumps on add; sections fade up once with a 70 ms stagger (only with JS). prefers-reduced-motion keeps fades, removes movement.
- Type scale fixed to 12 / 14 / 16 / 18 px below headings (tokens --fs-label/ui/body/lead); 8–11 px text removed except the Zlín label the owner asked to keep small.

2026-10-23:
- Favicon traced from the vector "E" of the Equator wordmark (public/logo.svg) by scripts/brand-assets.mjs. The owner's uploaded favicon.svg was a 21×12 px bitmap and would render blurry; it stays in the repo root, unused.
- Link-preview images are generated at build time (src/pages/og/[name].jpg.ts): bikes fill 1200×630, wheels/parts are centred on their own background, wordmark top left.
- Cart, inquiry, confirmation and 404 are always noindex. Form fallback inbox is encoded in the page source.

2026-10-24 (owner direction):
- Stock: a visitor's browser can't read equator-cycling.com (no CORS), so availability is read server-side. Every deploy, and every 6 hours via stock-refresh.yml on main, the deploy workflow reads Equator's product pages (Shoptet availability label and schema.org offers; product pages are allowed by Equator's robots.txt; one request at a time, identified user agent), builds with the result and publishes /stock.json. Each page view re-reads /stock.json and updates badges and availability lines. A page that can't be read keeps its last published status.
- Link underlines: none at rest; draw in from the left on hover, leave to the right.
- About page follows the owner's sketch: text and photo splits, Equator's own manufacturing film (YouTube, click-to-play, privacy-enhanced; nothing loads before play; cookie page says so), closing Scandinavia block. Story uses only facts from Equator's site (20 years of carbon wheels; frames developed, tested and assembled in CZ; prototypes on an Ore Mountains test track; titanium does not corrode).
- Wheels catalogue ordered by use, then rim depth.
- Danish translation deferred (owner); DKK prices already available.

- 2026-10-23: The YouTube embed on About is replaced by the owner-supplied film file, re-encoded to 960×540 H.264 without sound (2.5 MB, website/public/video/), playing muted on repeat as the background of the "Made in the Czech Republic" block. It loads only when scrolled to, pauses off screen, has a Pause/Play button, and doesn't autoplay for reduced motion or Save-Data. No third-party requests.

- 2026-10-23 (owner): Frames are designed and tested in the Czech Republic, manufactured elsewhere; the site never says "made in"/"manufactured in" the Czech Republic for frames. Terms page wording changed to "come from Equator Cycling, Czech Republic". Years of wheel experience: 20, as Equator's own site states ("20 let výroby karbonových zapletených kol", o-nas page, checked 23 Oct 2026); owner recalled ~15, site wording kept. About page: film as full-screen hero background, statement, three points, one photo, closing.

- 2026-10-23 (owner): About page = video hero (loop, no pause button; still frame for reduced motion/Save-Data), centred statement with facts (family-run since 2010, designed in-house, about ten people in Zlín, riders across Europe; Forbes CZ / CzechCrunch July 2026), "Tested, then tested again" split, Bikerumor quote (Cory Benson, 20 Oct 2026), "Built to keep, winter after winter" split, closing. No year count for wheels on the page: Equator's site says 20 years, press says founded 2010. Photos limited to ~560 px (1024 px originals).

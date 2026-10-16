# Product research and catalog rules

Research date: 2026-10-16. Findings below are official website observations, not independently verified specifications or Scandinavian offers. The current website brief explicitly requests versioned product research; only a concise public-product summary is versioned. Raw pages, contacts and full research remain ignored in `data/private/website-research/`.

## Bicycle families

| Family | Observed variants and EUR list prices | Selectable sizes observed | Source |
| --- | --- | --- | --- |
| Sensei Gen 4 | Frameset 2,415; GRX mechanical 4,431; GRX Di2 6,044 | M, L, XL | [Frameset](https://www.equator-cycling.com/en/equator-sensei-titanium-gen-4-ramova-sada/), [GRX](https://www.equator-cycling.com/en/equator-sensei-titanium-gen-4-shimano-grx/), [Di2](https://www.equator-cycling.com/en/equator-sensei-titanium-gen-4-shimano-grx-di2/) |
| Raiden | Frameset 3,222; SRAM Red AXS 8,060 | M, L | [Frameset](https://www.equator-cycling.com/en/equator-raiden-titanium/), [complete bike](https://www.equator-cycling.com/en/equator-raiden-titanium-ramova-sada/) |
| Yasei | Frameset 2,415; Apex 4,431; Force XPLR AXS 6,044 | M, L | [Frameset](https://www.equator-cycling.com/en/equator-yasei-titanium-ramova-sada/), [Apex](https://www.equator-cycling.com/en/equator-yasei-titanium-sram-apex/), [Force](https://www.equator-cycling.com/en/equator-yasei-titanium/) |

Sensei and Yasei selectors say in stock; Raiden says stock expected soon. These observations must carry their date. Yasei is actively listed, described as third generation; do not exclude it merely for its generation. Search results still expose older Sensei products: use Gen 4 URLs explicitly. Geometry tables include sizes not currently selectable; do not infer availability from geometry.

Verified factory pairings: Sensei GRX 2x12 with DT Swiss G540/Equator hubs; Sensei Di2 2x12 with Wavy 35C; Yasei Apex mechanical 1x12 with aluminium DT Swiss/Equator wheels; Yasei Force XPLR 1x13 with Gravel 40C; Raiden Red AXS E1 2x12 with Wavy 50C. Do not infer cross-build upgrade prices from complete-bike price differences. Configurator selects these factory bundles; bespoke changes remain inquiry text, not selectable compatibility claims.

## Wheels and accessories

[Wheel catalog](https://www.equator-cycling.com/en/zapletena-kola-equator/) re-checked 2026-10-16. Published (all disc, Centre Lock, Sapim CX-Ray 24/24, 12×100/12×142, freehubs Shimano 11–12 / Microspline / SRAM XDR / Campagnolo 9–12):

| Wheelset | Category | Status observed | From (EUR) | Key specs | Source |
| --- | --- | --- | --- | --- | --- |
| Wavy 35C | Road | In stock | 1,411 | 21/28 mm, hooked TLR; depth 35 (name) vs 50 mm (dimension line) and 1,380 vs 1,480 g conflict | [page](https://www.equator-cycling.com/en/set-karbonovych-kol-equator-wavy-35c-disk/) |
| Wavy 50C | Road | In stock | 1,411 | 50 mm, 21/28 mm, 1,480 g, 125 kg, min 25 mm tyre | [page](https://www.equator-cycling.com/en/equator-wavy-50c-disk/) |
| Gravel Ultimate 40C | Gravel | Custom production | 1,310 | 40 mm, 25/28 mm hookless TLR, 1,310 g, 110 kg, min 36 mm tyre | [page](https://www.equator-cycling.com/en/set-karbonovych-kol-equator-gravel-40c-disk-ultimate/) |
| TT 88C | TT | Out of stock, expected Nov 2026 | 988 | 88 mm, 19/27 mm, 1,980 g, 115 kg, 100 mm valves, assembled in Zlín | [page](https://www.equator-cycling.com/en/set-karbonovych-kol-equator-88c-disk/) |

Added later the same day: 50C Carbon disc €988 (1,540 g, CX-Ray 24/24) and rim brake €867 (1,560 g, Sapim Race 20/24, QR), Wide 50C disc €1,069 (21/28 mm, 1,450 g, min 28 mm tyre, 120 kg), 35C disc (19/27/35, 1,430 g, 105 kg; CZK 24,499 only, restocking), 45T tubular disc €847 (45 mm, 25 mm, 1,380 g; rider limit 150 vs 105 kg conflict). Variant prices (€1,411 / €1,443 on Wavy pages) do not map clearly to freehubs, — resolved: the higher price is the tubeless setup option (+€32), so base prices are now used in the cart. Tubeless setup is a CZK-priced add-on (+790 CZK) — not offered on the site. Held: Equator 40C Disc (older gravel, restock Nov 2026), Wide 50C Disc, 50C Disc, 50C rim brake, 45T Disc (earlier generation), TT rear disc (custom), MTB wheels (out of scope). The Yasei Force XPLR spec says "Equator Gravel 40C" without naming which 40C model.

[Accessories](https://www.equator-cycling.com/en/equator-titanium/): Adventure and Gravel forks EUR 363, bottle cage EUR 77; English pages say unavailable while Czech pages say expected soon. Hold these products from the active catalog. Adventure fork copy conflicts on clearance and steerer length: do not publish those disputed values.

## Brand, policies and images

Official [home](https://www.equator-cycling.com/) and [about](https://www.equator-cycling.com/o-nas/) support Czech design/testing/assembly and globally sourced parts. Avoid implying all frame manufacturing occurs in Czechia. Years-in-business statements vary; omit exact duration.

[Terms](https://www.equator-cycling.com/obchodni-podminky/) identify the manufacturer's seller and refer readers to separate warranty conditions; [crash replacement](https://www.equator-cycling.com/crash-replacement-program/) describes wheel/rim service. Neither establishes Scandinavian terms, free replacement, lifetime warranty or delivery promises. Prototype policy pages are clearly unfinished, not legal advice or final policies.

User confirmed image reuse permission and allows temporary photographs on 2026-10-16. Use genuine model-specific images; never depict another brand as Equator. Complete-bike images may illustrate framesets, but must be labeled accordingly. Keep image source provenance; replace with approved white-background shots later.

## Inventory integration

Site runs on Shoptet. No authorized retailer API/feed was identified in inspected public pages. `robots.txt` disallows `/api/` and `/export/`; neither was accessed. No synchronization implemented. Request an authorized feed directly before integration. Until then, manually review source, variant, date and publication state; stale data is never fresh stock.

## Data contract

Permanent ID, slug, name, category, concise description, image paths/alt/provenance, specifications, factory builds, size list, price amounts in minor units by currency, availability, source URL, verification date and publication status. Unknown prices are null, never zero. Display currency defaults to EUR for source-reference estimates; no FX conversion or approved Scandinavian price is implied. Production prices remain subject to owner approval.

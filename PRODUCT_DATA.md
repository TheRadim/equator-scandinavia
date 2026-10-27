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

[Wheel catalog](https://www.equator-cycling.com/en/zapletena-kola-equator/): Wavy 35C and 50C are listed in stock, from EUR 1,411. Gravel Ultimate 40C is custom order, from EUR 1,310. TT 88C lists expected November 2026 stock, from EUR 988: hold for review. No claim that all freehub variants are available. Do not use listing presence alone as current-generation confirmation.

[Accessories](https://www.equator-cycling.com/en/equator-titanium/): Adventure and Gravel forks EUR 363, bottle cage EUR 77; English pages say unavailable while Czech pages say expected soon. Hold these products from the active catalog. Adventure fork copy conflicts on clearance and steerer length: do not publish those disputed values.

## Brand, policies and images

Official [home](https://www.equator-cycling.com/) and [about](https://www.equator-cycling.com/o-nas/) support Czech design/testing/assembly and globally sourced parts. Avoid implying all frame manufacturing occurs in Czechia. Years-in-business statements vary; omit exact duration.

[Terms](https://www.equator-cycling.com/obchodni-podminky/) identify the manufacturer's seller and refer readers to separate warranty conditions; [crash replacement](https://www.equator-cycling.com/crash-replacement-program/) describes wheel/rim service. Neither establishes Scandinavian terms, free replacement, lifetime warranty or delivery promises. Prototype policy pages are clearly unfinished, not legal advice or final policies.

User confirmed image reuse permission and allows temporary photographs on 2026-10-16. Use genuine model-specific images; never depict another brand as Equator. Complete-bike images may illustrate framesets, but must be labeled accordingly. Keep image source provenance; replace with approved white-background shots later.

## Inventory integration

Site runs on Shoptet. No authorized retailer API/feed was identified in inspected public pages. `robots.txt` disallows `/api/` and `/export/`; neither was accessed. No synchronization implemented. Request an authorized feed directly before integration. Until then, manually review source, variant, date and publication state; stale data is never fresh stock.

## Data contract

Permanent ID, slug, name, category, concise description, image paths/alt/provenance, specifications, factory builds, size list, price amounts in minor units by currency, availability, source URL, verification date and publication status. Unknown prices are null, never zero. Display currency defaults to EUR for source-reference estimates; no FX conversion or approved Scandinavian price is implied. Production prices remain subject to owner approval.

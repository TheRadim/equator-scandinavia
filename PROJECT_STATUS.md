# Equator Scandinavia website status

Updated: 2026-10-16.

## Objective and scope
Build a premium Astro bicycle storefront prototype with three bicycle families, verified factory configuration, persistent cart and explicitly simulated inquiry checkout. User clarified that this is not a final commercial product. No real customer data delivery, payments or public deployment in the current prototype stage.

## Milestones
0. Research and architecture — complete, with confirmation items recorded in PRODUCT_DATA.md.
1. Foundation — complete; build/type-check passed.
2. Homepage/layout — complete; static build passes.
3. Catalog — complete for prototype: three bikes, one wheel reference, unavailable accessories held.
4. Configurator — complete; factory bundles, dynamic reference pricing and saved selections.
5. Cart — complete; persistent line identities, quantity/removal, unknown-price totals.
6. Demo inquiry — complete; no network submission or saved customer details; live integration deferred.
7. Inventory/publication controls — complete; explicit statuses, holds and manual review guide.
8. Support pages — next.
9. QA — pending.
10. Production deployment — deferred by prototype scope.

## Completed
Inspected repository and workspace links; authenticated GitHub CLI verified private remote. Reviewed official product selectors, factory bundles, prices, image sources, policies and robots rules. Architecture and product source register documented. Logo exists at /Users/radimtheiner/Desktop/logo-equator-black.svg.

## Open decisions and credentials
Production requires approved legal operator/data controller, privacy and commercial terms, pricing, current stock/compatibility confirmation, authorized sender domain, recipient, email API secret and spam-protection configuration. No such credentials are required for the local demo. Image use permission is confirmed.

## Known limitations
Astro foundation builds successfully. Manufacturer language variants and older search results disagree; use direct model pages. Product availability is a dated observation. GitHub Pages API returned 404; Pages is not verified configured. Drive/Sheets access was not exercised or assumed.

## Continue exactly here
Read AGENTS.md, README.md, docs/roadmap.md, docs/progress-log.md, ARCHITECTURE.md, PRODUCT_DATA.md and this file. Check git status and remote. Continue homepage and layout in website/. Run npm ci and npm run build from website/. Commit and push each milestone with this file updated. Keep the prototype unpublished and clearly label simulated submissions. Raw research is in ignored data/private/website-research/ on this machine; source links in PRODUCT_DATA.md allow fresh verification elsewhere.

GitHub workflow permission limitation: foundation push was initially rejected because OAuth lacks workflow scope. Workflow files are now templates in docs/website-workflows/; install them under .github/workflows/ only with authorized credentials. No CI run or Pages setup is claimed.

## Active website workspace

User requested /Users/radimtheiner/Coding/Webs/Equator on 2026-10-16. Continue website development in this checkout, branch codex/website-prototype; Astro source is website/. The original Coding/Projects/Equator checkout is preserved for operational work. Both point to the existing private repository. Ignored research remains in the original checkout; use PRODUCT_DATA.md for portable source links.

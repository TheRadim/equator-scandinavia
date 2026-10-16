# Equator Scandinavia website status

Updated: 2026-10-16 (continuation session, Claude in Cowork).

## Objective and scope
Premium Astro storefront for Equator titanium bicycles and carbon wheels in Scandinavia: three bicycle families with a verified factory-build configurator, curated wheels, persistent cart and inquiry-based checkout (no payments). Earlier user clarification: prototype stage — no real customer-data delivery or public deployment without explicit approval. The inquiry endpoint is now implemented but **not deployed**; the site defaults to demo mode.

## Milestones
0. Research and architecture — complete (PRODUCT_DATA.md, ARCHITECTURE.md).
1. Foundation — complete.
2. Homepage/layout — complete; sticky header, icon bag/menu, Inter typeface, featured bikes + wheels, titanium and brand story.
3. Catalog — complete: 3 bikes, 4 wheelsets (Road/Gravel/TT), accessories held (honest empty state).
4. Configurator — complete: 6 steps (build type, size, groupset, included wheelset, included components, review), option tiles, size validation, saved selection.
5. Cart — complete: id-based lines, quantities, removal, wheel freehub lines, unknown-price totals.
6. Inquiry system — complete in code: `worker/` (Cloudflare Worker + Resend + Turnstile, KV idempotency/rate limit, server pricing) + live/demo client. Not deployed; needs credentials and approvals.
7. Inventory/publication — complete: statuses, dated observations, holds, manual process.
8. Supporting pages — complete; dedicated About page; policies remain clearly marked prototype notices pending approval.
9. QA — complete for this stage: 11 site tests + 8 worker tests, astro check 0 errors, Playwright sweep 375/768/1024/1440/1920 (no overflow, no console errors), axe-core 0 violations on 13 routes, end-to-end live inquiry tested locally against the Worker handler.
10. Production deployment — blocked: needs (a) GitHub token with `workflow` scope to install workflows, (b) Pages enabled, (c) explicit publication approval.

## Git / push status
Branch `codex/website-prototype` is pushed to origin (github.com/TheRadim/equator-scandinavia, private) and tracks `origin/codex/website-prototype`; pushed 2026-10-16 up to `91ad00c` plus this status update. GitHub workflows are still templates in docs/website-workflows/ (installing them needs a token with Workflows: write). No CI run or Pages deployment exists yet.

## Preview hosting
A private preview is published as a claude.ai artifact (owner-only link; share from its Share menu): https://claude.ai/artifact/EXrN2kGK448MCkWCTEBLpG. It is built with `npm run build:preview -- <outDir>` (relative links, demo inquiries) and republished from a Claude session. GitHub Pages is not used yet: the repo is private (Pages needs a public repo or a paid plan) and the token would need Pages/Workflows permissions.

## Required credentials / decisions before live inquiries
Resend API key + verified sending domain; representative inbox (`INQUIRY_RECIPIENT`); Turnstile site key + secret; Cloudflare account + KV namespace; legal operator / data controller; final privacy policy, terms, cookie text; approved Scandinavian pricing policy (currently EUR manufacturer references). Details: worker/README.md.

## Known limitations
- Photography: one photo per bike and only Wavy 35C has a wheel photo; other wheels show a typographic tile. Gallery URLs are in website/src/data/gallery-candidates.json; this session's network could not reach cdn.myshoptet.com. Run `npm run fetch-images` on the Mac, add paths to `images`, run `npm run images`.
- Yasei photo has white side bars from the source image.
- Manufacturer data conflicts (Wavy 35C depth/weight) shown as "to confirm".
- Regional availability is unconfirmed for everything; manufacturer stock text is dated.
- robots.txt only takes effect on a custom domain root.

## Continue exactly here
1. Read this file, ARCHITECTURE.md, PRODUCT_DATA.md, DECISIONS.md, docs/website-inquiries.md, worker/README.md.
2. `cd website && npm ci && npm test && npm run build`; `cd ../worker && npm test`.
3. With a token that has Workflows: write, copy docs/website-workflows/*.yml to .github/workflows/ (CI runs tests + build on push; Pages deploy stays manual).
4. Next work, in order: download gallery photos and add them; owner review of copy/prices; when approved, deploy the Worker and set `PUBLIC_INQUIRY_ENDPOINT`; replace policy pages with approved text; enable Pages and run the manual deploy (type PUBLISH); set `PUBLIC_ALLOW_INDEXING=true` only at public launch; custom domain (add `public/CNAME`, update `site`/`base` in astro.config.mjs).

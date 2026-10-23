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
10. Deployment — done: GitHub Pages live from `gh-pages`, auto-deployed by Actions. Remaining for a real launch: live inquiries, approved policies, indexing, custom domain.

## Git, hosting and deployment
- Repository is **public** (owner decision, 2026-10-16): github.com/TheRadim/equator-scandinavia. Website work is on `codex/website-prototype`.
- **Live site:** https://theradim.github.io/equator-scandinavia/ — GitHub Pages serving the `gh-pages` branch. Search indexing stays off (noindex) until `PUBLIC_ALLOW_INDEXING=true`. Inquiries are in demo mode.
- CI: `.github/workflows/website-check.yml` (tests + build on push/PR) and `website-deploy.yml` (on push to `codex/website-prototype` touching `website/`: test, build, force-push `website/dist` to `gh-pages`). Website changes pushed to that branch go live automatically.
- Private claude.ai preview (optional, built with `npm run build:preview`): https://claude.ai/artifact/EXrN2kGK448MCkWCTEBLpG
- Pushing from Claude sessions: the owner asked to keep a GitHub fine-grained token for that. It lives only in the untracked file `.git/claude-github-token` in the Mac checkout (never commit it; it has Contents + Workflows write on this repo, no Pages/Administration).

## Required credentials / decisions before live inquiries
Resend API key + verified sending domain; representative inbox (`INQUIRY_RECIPIENT`); Turnstile site key + secret; Cloudflare account + KV namespace; legal operator / data controller; final privacy policy, terms, cookie text; approved Scandinavian pricing policy (currently EUR manufacturer references). Details: worker/README.md.

## Session 2026-10-16 (late) — storefront goes "serious"
- All prototype/demo wording removed; policies rewritten in plain, non-committal business language pending owner approval (docs/owner-todo.md).
- Contact/inquiry form: name, email, phone, message. Delivery order: Worker → Formspree (site.formspreeId) → mailto hi@radim-theiner.com (current).
- Business details in website/src/data/site.ts. Prices can be hidden with PUBLIC_SHOW_PRICES=false.
- Photos: 44 official images fetched by the "Fetch product images" GitHub Action (the dev sandbox can't reach Equator's CDN); bike galleries, wheel and accessory photos live.
- Accessories: 8 products (2 forks, 2 seatposts, stem, bottle cage, seat clamp, spacers) with options; all restocking at Equator.
- Bike pages: key figures, feature stories (tyre clearance, titanium, T47, UDH, routing, mounts), size finder (height + inseam), geometry table with drawing, full spec and frameset contents. Data in website/src/data/bikes/details.ts.

## Session 2026-10-21 — motion, type and spacing polish
- Rejected homepage redesign removed (branch design/landing deleted).
- Added subtle motion and hover states site-wide (see DECISIONS.md 2026-10-21), all respecting reduced motion.
- Type scale tidied (no text below 12 px), card text and links aligned across rows, "All wheels" moved next to the wheels heading, duplicate footer tagline removed, mobile value strip stacked.

## Session 2026-10-23 — pre-launch details
- Favicons, app icons and manifest; generated 1200×630 link previews per page; full Open Graph/Twitter tags; unique descriptions; noindex on utility pages; Organization JSON-LD; email fallback encoded; WebP gallery thumbnails. axe clean, no broken links.
- Pre-launch blockers for the owner are listed at the top of docs/owner-todo.md.

## Session 2026-10-24 — live stock, links, About
- Stock read from Equator's product pages at every deploy and every 6 hours; browser refreshes from /stock.json. Parser calibrated against the first live run (see DECISIONS.md).
- Hover-only link underlines; simpler About page; wheels sorted by use and depth.

## Known limitations
- Photography: one photo per bike and only Wavy 35C has a wheel photo; other wheels show a typographic tile. Gallery URLs are in website/src/data/gallery-candidates.json; this session's network could not reach cdn.myshoptet.com. Run `npm run fetch-images` on the Mac, add paths to `images`, run `npm run images`.
- Yasei photo has white side bars from the source image.
- Manufacturer data conflicts (Wavy 35C depth/weight) shown as "to confirm".
- Regional availability is unconfirmed for everything; manufacturer stock text is dated.
- robots.txt only takes effect on a custom domain root.

## Continue exactly here
1. Read this file, ARCHITECTURE.md, PRODUCT_DATA.md, DECISIONS.md, docs/website-inquiries.md, worker/README.md.
2. `cd website && npm ci && npm test && npm run build`; `cd ../worker && npm test`.
3. Push website changes to `codex/website-prototype`; check the Actions run and the live site.
4. Next work, in order: download gallery photos and add them; owner review of copy/prices; when approved, deploy the Worker and set `PUBLIC_INQUIRY_ENDPOINT`; replace policy pages with approved text; set `PUBLIC_ALLOW_INDEXING=true` only at public launch; custom domain (add `public/CNAME`, update `site`/`base` in astro.config.mjs).

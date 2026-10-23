/**
 * Reads current availability from Equator's own product pages (Shoptet) and
 * writes src/data/stock.json, which the site uses at build time and the
 * browser reloads on every page view (/stock.json).
 *
 *   node --experimental-strip-types scripts/check-stock.mjs [--previous prev.json] [--debug]
 *
 * Polite by design: product pages only (allowed by Equator's robots.txt),
 * one request at a time with a pause, identified user agent. A page that
 * fails or can't be read keeps its previous value; nothing is ever removed.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { allBikes } from "../src/data/bikes/catalog.ts";
import { allWheels } from "../src/data/wheels/catalog.ts";
import { allAccessories } from "../src/data/accessories/catalog.ts";
import { classify } from "./stock-classify.mjs";

const args = process.argv.slice(2);
const debug = args.includes("--debug");
const prevPath = args.includes("--previous") ? args[args.indexOf("--previous") + 1] : "src/data/stock.json";
const OUT = "src/data/stock.json";
const UA = "EquatorScandinaviaStockCheck/1.0 (+https://theradim.github.io/equator-scandinavia/)";

const urls = new Set();
for (const b of allBikes) for (const build of b.builds) if (build.type === "frameset") urls.add(build.source);
for (const w of allWheels) for (const br of w.brakes) urls.add(br.source);
for (const a of allAccessories) urls.add(a.source);

const readJson = (p) => {
  try {
    return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
  } catch {
    return null;
  }
};
const previous = readJson(prevPath) ?? readJson(OUT) ?? { checkedAt: null, items: {} };

const items = { ...(previous.items ?? {}) };
let ok = 0;
for (const u of urls) {
  try {
    const res = await fetch(u, { headers: { "User-Agent": UA, "Accept-Language": "en,cs;q=0.8" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const r = classify(html);
    if (debug) console.log(JSON.stringify({ url: u, ...r }));
    if (r.status) {
      items[u] = r.note ? { status: r.status, note: r.note } : { status: r.status };
      ok++;
    } else console.warn(`Unreadable availability, kept previous: ${u}`);
  } catch (e) {
    console.warn(`Failed (${e.message}), kept previous: ${u}`);
  }
  await new Promise((r) => setTimeout(r, 1500));
}
const out = { checkedAt: ok ? new Date().toISOString() : previous.checkedAt, items };
writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`Stock checked: ${ok}/${urls.size} pages read.`);

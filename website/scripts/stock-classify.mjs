/** Reads the availability of one Equator (Shoptet) product page. See check-stock.mjs. */
const strip = (s) => s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

const czMonths = {
  ledn: "January", únor: "February", březn: "March", dubn: "April", květn: "May", červenc: "July",
  červn: "June", srpn: "August", září: "September", říjn: "October", listopad: "November", prosin: "December",
};
/** "Naskladníme v listopadu 2026" / "Delivery in April 2027" → "November 2026" / "April 2027". */
export function expectedDate(label) {
  const year = /(20\d\d)/.exec(label)?.[1];
  if (!year) return undefined;
  const en = /(January|February|March|April|May|June|July|August|September|October|November|December)/i.exec(label)?.[1];
  if (en) return `${en[0].toUpperCase()}${en.slice(1).toLowerCase()} ${year}`;
  const l = label.toLowerCase();
  const cz = Object.keys(czMonths).find((k) => l.includes(k));
  return cz ? `${czMonths[cz]} ${year}` : year;
}

/** Status of one availability label (Czech or English, as Equator writes them). */
export function labelStatus(label) {
  const t = label.toLowerCase();
  if (/in stock soon|naskladn|brzy|restock|coming soon|expected/.test(t)) return "Out of stock";
  if (/zakázkov|made to order|na objednávku|on request|delivery in|dodání|termín/.test(t)) return "Available to order";
  if (/^in stock|^skladem/.test(t)) return "In stock";
  if (/unavailable|nedostupn|vyprodáno|sold out|not available/.test(t)) return "Availability unconfirmed";
  return null;
}

/**
 * Classify a product page. Shoptet prints one availability label per variant
 * (sizes, freehubs); the product is in stock if any variant is.
 * Returns status null when nothing can be read reliably.
 */
export function classify(html) {
  // Only the product's own area: stop before related/alternative products.
  const cut = html.search(/class="[^"]*(products-related|products-alternative|product-slider|related-products)/);
  const main = cut > 0 ? html.slice(0, cut) : html;
  const offers = [...main.matchAll(/"availability"\s*:\s*"(?:https?:\/\/schema\.org\/)?([A-Za-z]+)"/g)].map((m) => m[1]);
  const labels = [...main.matchAll(/class="[^"]*availability-label[^"]*"[^>]*>([\s\S]*?)<\/span>/g)]
    .map((m) => strip(m[1]))
    .filter((l) => l && !/choose variant|zvolte variantu/i.test(l));
  const statuses = labels.map(labelStatus).filter(Boolean);
  if (offers.includes("InStock")) statuses.push("In stock");
  if (offers.some((o) => /PreOrder|BackOrder|MadeToOrder/.test(o))) statuses.push("Available to order");
  if (offers.some((o) => /OutOfStock|SoldOut/.test(o))) statuses.push("Out of stock");
  const rank = ["In stock", "Available to order", "Out of stock", "Availability unconfirmed"];
  const status = rank.find((s) => statuses.includes(s)) ?? null;
  // A restock or delivery month, when Equator states one.
  const dated = labels.find((l) => labelStatus(l) === status && /20\d\d/.test(l));
  const note = status && status !== "In stock" && dated ? expectedDate(dated) : undefined;
  return { status, note, offers, labels };
}

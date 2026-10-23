/** Reads the availability of one Equator (Shoptet) product page. See check-stock.mjs. */
const strip = (s) => s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

/** Classify one Shoptet product page. Returns null when the page can't be read reliably. */
export function classify(html) {
  // Only the product's own area: stop before related/alternative products.
  const cut = html.search(/class="[^"]*(products-related|products-alternative|product-slider|related-products)/);
  const main = cut > 0 ? html.slice(0, cut) : html;
  const offers = [...main.matchAll(/"availability"\s*:\s*"(?:https?:\/\/schema\.org\/)?([A-Za-z]+)"/g)].map((m) => m[1]);
  const labels = [...main.matchAll(/class="[^"]*availability-label[^"]*"[^>]*>([\s\S]*?)<\/span>/g)]
    .map((m) => strip(m[1]))
    .filter(Boolean);
  const label = labels[0] ?? "";
  const text = label.toLowerCase();
  let status = null;
  if (offers.includes("InStock") || /skladem|in stock/.test(text)) status = "In stock";
  else if (/brzy naskladn|restock|coming soon/.test(text)) status = "Out of stock";
  else if (offers.some((o) => /PreOrder|BackOrder|MadeToOrder/.test(o)) || /dodání|delivery|na objednávku|on request|order/.test(text))
    status = "Available to order";
  else if (offers.length && offers.every((o) => /OutOfStock|SoldOut/.test(o))) status = "Out of stock";
  else if (offers.includes("Discontinued")) status = "Availability unconfirmed";
  const note = status === "Available to order" && /\d{4}/.test(label) ? label : undefined;
  return { status, note, offers, labels };
}


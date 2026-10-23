import { test } from "node:test";
import assert from "node:assert/strict";
import { classify } from "../scripts/stock-classify.mjs";

const page = (label: string, ld = "") =>
  `<script type="application/ld+json">${ld}</script><span class="availability-label" style="color:#009901">${label}</span><div class="products-related"><span class="availability-label">Skladem</span></div>`;

test("in stock from label or schema.org", () => {
  assert.equal(classify(page("Skladem")).status, "In stock");
  assert.equal(classify(page("", '{"offers":{"availability":"https://schema.org/InStock"}}')).status, "In stock");
});
test("restocking", () => {
  assert.equal(classify(page("Brzy naskladníme")).status, "Out of stock");
});
test("made to order keeps the delivery date", () => {
  const r = classify(page("Delivery in April 2027"));
  assert.equal(r.status, "Available to order");
  assert.equal(r.note, "Delivery in April 2027");
});
test("related products don't count; unreadable returns null", () => {
  assert.equal(classify(page("")).status, null);
});

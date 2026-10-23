import { test } from "node:test";
import assert from "node:assert/strict";
import { classify } from "../scripts/stock-classify.mjs";

const label = (t: string) => `<span class="availability-label" style="color:#009901">${t}</span>`;
const page = (...labels: string[]) =>
  labels.map(label).join("") + label("Choose variant") + `<div class="products-related">${label("In Stock")}</div>`;

test("in stock, including when only one variant is", () => {
  assert.equal(classify(page("In Stock")).status, "In stock");
  assert.equal(classify(page("Brzy naskladníme.", "In Stock")).status, "In stock");
  assert.equal(classify(`<script>{"availability":"https://schema.org/InStock"}</script>`).status, "In stock");
});
test("'In stock soon' is restocking, not in stock", () => {
  assert.equal(classify(page("In stock soon", "In stock soon")).status, "Out of stock");
});
test("restock month in Czech becomes a date", () => {
  const r = classify(page("Naskladníme v listopadu 2026"));
  assert.equal(r.status, "Out of stock");
  assert.equal(r.note, "November 2026");
});
test("custom production is made to order, without the phone number", () => {
  const r = classify(page("Zakázková výroba - volejte +420 732 654 969"));
  assert.equal(r.status, "Available to order");
  assert.equal(r.note, undefined);
});
test("currently unavailable asks the customer to check", () => {
  assert.equal(classify(page("Currently unavailable")).status, "Availability unconfirmed");
});
test("related products don't count; unreadable returns null", () => {
  assert.equal(classify(page()).status, null);
});

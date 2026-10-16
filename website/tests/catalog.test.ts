import test from "node:test";
import assert from "node:assert/strict";
import {
  addLine,
  decodeCart,
  resolve,
  totals,
  validateLine,
} from "../src/lib/catalog.ts";
const choice = { productId: "sensei", buildId: "sensei-di2", size: "M" };
test("factory compatibility rejects cross-family build and unavailable size", () => {
  assert.throws(() => resolve({ ...choice, buildId: "raiden-red" }));
  assert.throws(() => resolve({ ...choice, size: "S" }));
  assert.match(resolve(choice).description, /Wavy 35C/);
});
test("frameset excludes complete-bike components", () => {
  const frame = resolve({ ...choice, buildId: "sensei-frame" });
  assert.equal(frame.price, 241500);
  assert.doesNotMatch(frame.description, /Wavy|Shimano|Brooks/);
});
test("cart identity preserves different configurations and aggregates same selection", () => {
  let lines = addLine([], choice);
  lines = addLine(lines, { ...choice, size: "L" });
  lines = addLine(lines, choice);
  assert.deepEqual(
    lines.map((l) => l.quantity),
    [2, 1],
  );
  assert.equal(totals(lines).subtotal, 1813200);
});
test("unknown price is not a free item", () => {
  const lines = addLine(addLine([], choice), {
    productId: "wavy-35",
    buildId: "inquiry",
    size: "",
  });
  assert.deepEqual(totals(lines), { subtotal: 604400, unknown: true });
});
test("corrupt storage and invalid quantities fail closed", () => {
  for (const raw of ["{", "[]", '{"version":2,"items":[]}'])
    assert.throws(() => decodeCart(raw));
  for (const quantity of [-1, 0, 1.5, 11, "2"])
    assert.throws(() => validateLine({ ...choice, quantity }));
});
test("saved price injection ignored and quantity capped", () => {
  const line = validateLine({ ...choice, quantity: 10, price: 1 });
  assert.equal(resolve(line).price, 604400);
  assert.throws(() => addLine([line], choice));
  assert.deepEqual(decodeCart(JSON.stringify({ version: 1, items: [line] })), [
    line,
  ]);
});

import { validateMetadata, isVisible } from "../src/lib/publication.ts";
import { allBikes } from "../src/data/bikes/catalog.ts";
import { allWheels } from "../src/data/wheels/catalog.ts";
test("catalog metadata validates and holds never become visible", () => {
  const all = [...allBikes, ...allWheels];
  for (const p of all) validateMetadata(p);
  assert.equal(new Set(all.map((p) => p.id)).size, all.length);
  assert.equal(
    isVisible({ publication: "review", inventoryStatus: "In stock" }),
    false,
  );
  assert.equal(
    isVisible({ publication: "prototype", inventoryStatus: "Discontinued" }),
    false,
  );
});

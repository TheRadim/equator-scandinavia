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
    productId: "carbon-35",
    buildId: "disc:shimano-hg:std",
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
import { allAccessories } from "../src/data/accessories/catalog.ts";
test("catalog metadata validates and holds never become visible", () => {
  const all = [...allBikes, ...allWheels, ...allAccessories];
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

test("wheel freehub must be a listed option; legacy inquiry lines still resolve", () => {
  const ok = resolve({ productId: "wavy-50", buildId: "sram-xdr", size: "" });
  assert.match(ok.description, /SRAM XDR/);
  assert.equal(ok.price, 141100);
  assert.throws(() =>
    resolve({ productId: "wavy-50", buildId: "made-up", size: "" }),
  );
  assert.throws(() =>
    resolve({ productId: "wavy-50", buildId: "sram-xdr", size: "M" }),
  );
  assert.match(
    resolve({ productId: "wavy-35", buildId: "inquiry", size: "" }).description,
    /to confirm/,
  );
});
test("every wheel category has at least one published wheelset", () => {
  for (const c of ["Road", "Gravel", "TT"])
    assert.ok(allWheels.some((w) => w.category === c && isVisible(w)), c);
});
test("no published product claims a zero price", () => {
  for (const b of allBikes) for (const x of b.builds) assert.notEqual(x.price, 0);
  for (const w of allWheels) assert.notEqual(w.price, 0);
});

import { existsSync } from "node:fs";
test("every catalog photograph exists with responsive WebP variants", () => {
  const paths = [
    ...allBikes.flatMap((b) => b.images),
    ...allWheels.flatMap((w) => w.images),
    ...allAccessories.flatMap((a) => a.images),
  ];
  for (const p of paths) {
    assert.ok(existsSync(`public/${p}`), p);
    const base = p.replace(/\.(jpe?g|png)$/i, "");
    for (const w of [640, 1024]) assert.ok(existsSync(`public/${base}-${w}.webp`), `${base}-${w}.webp (run npm run images)`);
  }
});

test("accessory lines need a listed option; CZK-only parts are price on request", () => {
  const stem = resolve({ productId: "stem", buildId: "90", size: "" });
  assert.match(stem.description, /90 mm/);
  assert.equal(stem.price, null);
  assert.equal(resolve({ productId: "bottle-cage", buildId: "standard", size: "" }).price, 7700);
  assert.throws(() => resolve({ productId: "stem", buildId: "150", size: "" }));
  assert.throws(() => resolve({ productId: "bottle-cage", buildId: "standard", size: "M" }));
});
test("every bike has a photo gallery", () => {
  for (const b of allBikes) assert.ok(b.images.length >= 4, b.id);
});

test("wheel brake type and tubeless are specs of one product", () => {
  const rim = resolve({ productId: "carbon-50", buildId: "rim:campagnolo:std", size: "" });
  assert.equal(rim.price, 86700);
  assert.match(rim.description, /Rim brake/);
  const discTl = resolve({ productId: "carbon-50", buildId: "disc:sram-xdr:tl", size: "" });
  assert.equal(discTl.price, 98800 + 3200);
  assert.throws(() => resolve({ productId: "wavy-50", buildId: "rim:sram-xdr:std", size: "" }));
  assert.throws(() => resolve({ productId: "tubular-45", buildId: "disc:sram-xdr:tl", size: "" }));
});

import { money } from "../src/lib/catalog.ts";
test("currency conversion uses the configured rates and rounds to 10", () => {
  assert.equal(money(241500, "EUR"), "€2,415");
  assert.equal(money(241500, "DKK"), "DKK 18,050");
  assert.equal(money(241500, "NOK"), "NOK 25,720");
  assert.equal(money(null, "SEK"), "Price on request");
});

import { addLine, decodeCart, type Line, type Selection } from "./catalog.ts";
export const cartKey = "equator-cart-v1";
export function readCart() {
  return decodeCart(localStorage.getItem(cartKey));
}
export function writeCart(items: Line[]) {
  const data = JSON.stringify({ version: 1, items });
  decodeCart(data);
  localStorage.setItem(cartKey, data);
  window.dispatchEvent(new Event("cartchange"));
}
export function addToCart(selection: Selection) {
  writeCart(addLine(readCart(), selection));
}
export function updateCount() {
  try {
    const n = readCart().reduce((sum, l) => sum + l.quantity, 0);
    document
      .querySelectorAll("[data-cart-count]")
      .forEach((e) => (e.textContent = String(n)));
  } catch {
    document
      .querySelectorAll("[data-cart-count]")
      .forEach((e) => (e.textContent = "!"));
  }
}

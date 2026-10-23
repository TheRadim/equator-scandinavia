/** Shared status wording for the badge (build time) and the live stock refresh (browser). */
import type { InventoryStatus } from "./publication.ts";
export type StockEntry = { status: InventoryStatus; note?: string };

export const statusTone = (status: string) =>
  status === "In stock" ? "ok" : status === "Available to order" ? "order" : status === "Out of stock" ? "out" : "unknown";

export const statusLabel = (status: string) =>
  status === "Out of stock"
    ? "Restocking"
    : status === "Available to order"
      ? "Made to order"
      : status === "Availability unconfirmed"
        ? "Ask for availability"
        : status;

export const checkedDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Copenhagen" });

/** Customer-facing sentence for a status read from Equator. */
export function availabilityText(entry: StockEntry, checkedAt: string) {
  const when = `checked ${checkedDate(checkedAt)}`;
  switch (entry.status) {
    case "In stock":
      return `In stock at Equator (${when}). Delivery time is confirmed with your order.`;
    case "Out of stock":
      return entry.note
        ? `Restocking at Equator, expected ${entry.note} (${when}). Order now and we'll confirm the delivery date.`
        : `New stock expected soon at Equator (${when}). Order now and we'll confirm the delivery date.`;
    case "Available to order":
      return entry.note
        ? `Made to order at Equator, delivery from ${entry.note} (${when}).`
        : `Made to order at Equator (${when}). We'll confirm the delivery time with you.`;
    default:
      return `Currently unavailable at Equator (${when}). Ask us and we'll check when it's back.`;
  }
}


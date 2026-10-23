/**
 * Live availability from Equator's product pages (see scripts/check-stock.mjs).
 * Entries are keyed by the Equator product URL. Missing entries keep the
 * catalogue's own status and text.
 */
import data from "../data/stock.json" with { type: "json" };
import type { InventoryStatus } from "./publication.ts";
import { availabilityText, type StockEntry } from "./status.ts";
export type { StockEntry };

export type StockData = { checkedAt: string | null; items: Record<string, StockEntry> };
export const stock = data as StockData;

/** Apply the latest stock reading to anything with a status and availability text. */
export function withStock<T extends { inventoryStatus: InventoryStatus; availability: string }>(item: T, source: string): T {
  const entry = stock.items[source];
  if (!entry || !stock.checkedAt) return item;
  return { ...item, inventoryStatus: entry.status, availability: availabilityText(entry, stock.checkedAt) };
}

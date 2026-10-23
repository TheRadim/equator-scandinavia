import { isVisible } from "../../lib/publication.ts";
import { families } from "../families.ts";
import { withStock } from "../../lib/stock.ts";
export type Build = {
  id: string;
  type: "frameset" | "complete";
  label: string;
  price: number | null;
  groupset?: string;
  wheels?: string;
  /** Wheel catalog id when the included wheelset has its own product page. */
  wheelId?: string;
  components?: string;
  source: string;
};
export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  image: string;
  images: string[];
  sizes: string[];
  availability: string;
  verified: string;
  publication: "prototype" | "review";
  inventoryStatus:
    | "In stock"
    | "Available to order"
    | "Out of stock"
    | "Availability unconfirmed"
    | "Discontinued";
  builds: Build[];
  specs: Record<string, string>;
};
const root = "https://www.equator-cycling.com/en/";
const frame = (id: string, price: number, path: string): Build => ({
  id,
  type: "frameset",
  label: "Frameset only",
  price,
  source: root + path + "/",
});
export const allBikes: Product[] = families.map((f) => ({
  ...f,
  verified: "2026-10-16",
  publication: "prototype",
  inventoryStatus: f.id === "raiden" ? "Out of stock" : "In stock",
  sizes: f.id === "sensei" ? ["M", "L", "XL"] : ["M", "L"],
  availability:
    f.id === "raiden"
      ? "New stock expected soon (Equator, updated 16 October 2026). Order now and we'll confirm the delivery date."
      : "In stock at Equator (updated 16 October 2026). Delivery time is confirmed with your order.",
  specs: {
    "Frame material": "Titanium 3Al-2.5V",
    "Bottom bracket": "T47",
    "Build approach": "Factory specifications; other changes by inquiry",
  },
  builds:
    f.id === "sensei"
      ? [
          frame(
            "sensei-frame",
            241500,
            "equator-sensei-titanium-gen-4-frameset",
          ),
          {
            id: "sensei-grx",
            type: "complete",
            label: "Shimano GRX",
            price: 443100,
            groupset: "Shimano GRX mechanical 2×12",
            wheels: "DT Swiss G540 / Equator hubs",
            components:
              "Equator Titanium seatpost · Zipp Service Course SL 70 XPLR · Brooks Cambium C15 Carved",
            source: root + "equator-sensei-titanium-gen-4-shimano-grx/",
          },
          {
            id: "sensei-di2",
            type: "complete",
            label: "Shimano GRX Di2",
            price: 604400,
            groupset: "Shimano GRX Di2 2×12",
            wheels: "Equator Wavy 35C",
            wheelId: "wavy-35",
            components:
              "Equator Titanium seatpost · Zipp Service Course SL 70 XPLR · Brooks Cambium C15 Carved",
            source: root + "equator-sensei-titanium-gen-4-shimano-grx-di2/",
          },
        ]
      : f.id === "raiden"
        ? [
            frame("raiden-frame", 322200, "equator-raiden-titanium"),
            {
              id: "raiden-red",
              type: "complete",
              label: "SRAM Red AXS",
              price: 806000,
              groupset: "SRAM Red AXS E1 2×12",
              wheels: "Equator Wavy 50C disc",
              wheelId: "wavy-50",
              components:
                "Equator Titanium seatpost · Zipp Service Course SL 80 · Fizik Arione R3",
              source: root + "equator-raiden-titanium-ramova-sada/",
            },
          ]
        : [
            frame("yasei-frame", 241500, "equator-yasei-titanium-ramova-sada"),
            {
              id: "yasei-apex",
              type: "complete",
              label: "SRAM Apex",
              price: 443100,
              groupset: "SRAM Apex mechanical 1×12",
              wheels: "Aluminium / DT Swiss rims and spokes / Equator hubs",
              components:
                "Equator Titanium seatpost · Zipp Service Course SL 70 XPLR · Brooks Cambium (model to confirm)",
              source: root + "equator-yasei-titanium-sram-apex/",
            },
            {
              id: "yasei-force",
              type: "complete",
              label: "SRAM Force XPLR AXS",
              price: 604400,
              groupset: "SRAM Force XPLR AXS 1×13",
              // Manufacturer copy says "Equator Gravel 40C" without saying which 40C model: not linked.
              wheels: "Equator Gravel 40C",
              components:
                "Equator Titanium seatpost · Zipp Service Course SL 70 XPLR · Brooks Cambium (model to confirm)",
              source: root + "equator-yasei-titanium/",
            },
          ],
}));

export const bikes = allBikes
  .map((b) => withStock(b, b.builds.find((x) => x.type === "frameset")?.source ?? ""))
  .filter(isVisible);

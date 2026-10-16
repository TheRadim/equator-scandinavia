import { isVisible, type InventoryStatus } from "../../lib/publication.ts";

/**
 * Wheelset catalog. Edit this file to change prices, availability or specs —
 * no UI component needs to change. Facts come from the manufacturer pages in
 * `source`; conflicting manufacturer values are shown as conflicts, never
 * silently resolved. See docs/website-catalog-maintenance.md.
 */
export type WheelCategory = "Road" | "Gravel" | "TT";
export type Freehub = { id: string; label: string };
export type Wheel = {
  id: string;
  slug: string;
  name: string;
  category: WheelCategory;
  /** Paths relative to /public. Empty array renders a typographic tile. */
  images: string[];
  /** Big number for the typographic tile (rim depth). */
  depthLabel: string;
  description: string;
  intendedUse: string;
  /** Firm estimate used for the cart. null = "Price on request". */
  price: number | null;
  /** Manufacturer "from" reference in EUR minor units, display only. */
  referenceFrom: number | null;
  verified: string;
  publication: "prototype" | "review" | "archived";
  inventoryStatus: InventoryStatus;
  availability: string;
  source: string;
  freehubs: Freehub[];
  specs: Record<string, string>;
};

/** Freehub bodies listed as selectable variants on every current Equator wheel page (16 Oct 2026). */
const standardFreehubs: Freehub[] = [
  { id: "shimano-hg", label: "Shimano 11–12 speed" },
  { id: "shimano-ms", label: "Shimano Microspline" },
  { id: "sram-xdr", label: "SRAM XDR 12 speed" },
  { id: "campagnolo", label: "Campagnolo 9–12 speed" },
];

const common = {
  verified: "2026-10-16",
  freehubs: standardFreehubs,
  price: null,
};

export const allWheels: Wheel[] = [
  {
    ...common,
    id: "wavy-35",
    slug: "wavy-35c",
    name: "Wavy 35C",
    category: "Road",
    images: ["images/wavy-35-0.jpg"],
    depthLabel: "35",
    description:
      "A lighter, lower wave-profile carbon rim for climbing, all-day road and fast gravel.",
    intendedUse: "Road · fast gravel · triathlon",
    referenceFrom: 141100,
    publication: "prototype",
    inventoryStatus: "Availability unconfirmed",
    availability:
      "Manufacturer listed in stock on 16 October 2026. Freehub variant availability to be confirmed.",
    source:
      "https://www.equator-cycling.com/en/set-karbonovych-kol-equator-wavy-35c-disk/",
    specs: {
      "Rim depth":
        "35 mm per model name (manufacturer dimension line reads 50 mm — to confirm)",
      "Rim width": "21 mm internal / 28 mm external",
      "Rim profile": "Hooked, tubeless ready",
      Weight:
        "1,380 g set (manufacturer specification table also lists 1,480 g — to confirm)",
      Hubs: "Equator Power Way, Centre Lock, Enduro sealed bearings",
      Spokes: "Sapim CX-Ray straight pull, 24 front / 24 rear",
      Axles: "12 × 100 mm front / 12 × 142 mm rear",
      Brakes: "Disc only (Centre Lock)",
      Tyres: "Tubed or tubeless, minimum 25 mm",
      "Max pressure": "8 bar",
    },
  },
  {
    ...common,
    id: "wavy-50",
    slug: "wavy-50c",
    name: "Wavy 50C",
    category: "Road",
    images: [],
    depthLabel: "50",
    description:
      "The deeper Wavy rim, specified on the Raiden SRAM Red AXS build. Made for speed on open roads.",
    intendedUse: "Road · triathlon / time trial",
    referenceFrom: 141100,
    publication: "prototype",
    inventoryStatus: "Availability unconfirmed",
    availability:
      "Manufacturer listed in stock on 16 October 2026. Freehub variant availability to be confirmed.",
    source: "https://www.equator-cycling.com/en/equator-wavy-50c-disk/",
    specs: {
      "Rim depth": "50 mm",
      "Rim width": "21 mm internal / 28 mm external",
      "Rim profile": "Hooked, tubeless ready",
      Weight: "1,480 g set",
      Hubs: "Equator Power Way, Centre Lock",
      Spokes: "Sapim CX-Ray straight pull, 24 front / 24 rear",
      Axles: "12 × 100 mm front / 12 × 142 mm rear",
      Brakes: "Disc only (Centre Lock)",
      Tyres: "Tubed or tubeless, minimum 25 mm",
      "Max pressure": "8 bar",
      "Rider weight limit": "125 kg",
    },
  },
  {
    ...common,
    id: "gravel-ultimate-40",
    slug: "gravel-ultimate-40c",
    name: "Gravel Ultimate 40C",
    category: "Gravel",
    images: [],
    depthLabel: "40",
    description:
      "A light, wide hookless carbon gravel wheelset for mixed surfaces and long days.",
    intendedUse: "Gravel · all-road",
    referenceFrom: 131000,
    publication: "prototype",
    inventoryStatus: "Available to order",
    availability:
      "Manufacturer lists this wheelset as custom production (16 October 2026). Lead time to be confirmed.",
    source:
      "https://www.equator-cycling.com/en/set-karbonovych-kol-equator-gravel-40c-disk-ultimate/",
    specs: {
      "Rim depth": "40 mm",
      "Rim width": "25 mm internal / 28 mm external",
      "Rim profile": "Hookless, tubeless ready",
      Weight: "1,310 g set",
      Hubs: "Equator Power Way, Centre Lock, Enduro sealed bearings",
      Spokes: "Sapim CX-Ray straight pull, 24 front / 24 rear",
      Axles: "12 × 100 mm front / 12 × 142 mm rear",
      Brakes: "Disc only (Centre Lock)",
      Tyres: "Minimum 36 mm (hookless rim)",
      "Max pressure": "8 bar",
      "Rider weight limit": "110 kg",
    },
  },
  {
    ...common,
    id: "tt-88",
    slug: "tt-88c",
    name: "TT 88C",
    category: "TT",
    images: [],
    depthLabel: "88",
    description:
      "A deep 88 mm aero rim for time trials and triathlon. Assembled in Zlín.",
    intendedUse: "Time trial · triathlon",
    referenceFrom: 98800,
    publication: "prototype",
    inventoryStatus: "Out of stock",
    availability:
      "Manufacturer expects new stock in November 2026 (observed 16 October 2026). Inquiries welcome; nothing is reserved.",
    source:
      "https://www.equator-cycling.com/en/set-karbonovych-kol-equator-88c-disk/",
    specs: {
      "Rim depth": "88 mm",
      "Rim width": "19 mm internal / 27 mm external",
      "Rim profile": "Hooked, tubeless ready",
      Weight: "1,980 g set",
      Hubs: "Equator Power Way, Centre Lock, Enduro sealed bearings",
      Spokes: "Sapim CX-Ray straight pull, 24 front / 24 rear",
      Axles: "12 × 100 mm front / 12 × 142 mm rear",
      Brakes: "Disc only (Centre Lock)",
      Tyres: "Tubed or tubeless, minimum 25 mm; 100 mm valves",
      "Max pressure": "8 bar",
      "Rider weight limit": "115 kg",
    },
  },
];

/** Listed by the manufacturer but deliberately not published. */
export const wheelHolds = [
  {
    name: "Equator 40C Disc (gravel)",
    category: "Gravel",
    reason:
      "Older gravel model alongside Gravel Ultimate 40C; restock November 2026. Hold until current-range status is confirmed.",
  },
  {
    name: "Wide 50C Disc / 50C Disc / 50C rim brake / 45T Disc",
    category: "Road",
    reason:
      "Earlier-generation road wheels still listed. Not published unless Equator confirms they are current.",
  },
  {
    name: "TT rear disc wheel",
    category: "TT",
    reason: "Custom production single wheel; confirm before listing.",
  },
];

export const wheelCategories: { id: WheelCategory; label: string }[] = [
  { id: "Road", label: "Road" },
  { id: "Gravel", label: "Gravel" },
  { id: "TT", label: "Time Trial / TT" },
];

export const wheels = allWheels.filter(isVisible);

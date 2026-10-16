import { isVisible, type InventoryStatus } from "../../lib/publication.ts";

/**
 * Wheelset catalog. Edit this file to change prices, availability or specs —
 * no UI component needs to change. Facts come from the Equator pages in
 * `source` (checked 16 Oct 2026); conflicting values are shown as "to confirm".
 *
 * Variants are specs, not separate products: brake type (disc / rim), freehub
 * body and optional tubeless setup. A cart line stores them in `buildId` as
 * "brake:freehub:tl|std" (see encodeWheelBuild).
 *
 * Prices are Equator's EUR prices without tubeless setup. Equator shows a
 * second price per wheel (e.g. €988 / €1,020); the 50C Disc page states the
 * difference is the tubeless tape-and-valve setup (+€32 / 790 CZK).
 */
export type WheelCategory = "Road" | "Gravel" | "TT";
export type Freehub = { id: string; label: string };
export type BrakeOption = {
  id: "disc" | "rim";
  label: string;
  /** EUR minor units; null = price on request. */
  price: number | null;
  inventoryStatus: InventoryStatus;
  availability: string;
  /** Spec rows that differ for this brake version (merged over `specs`). */
  specs: Record<string, string>;
  source: string;
};
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
  verified: string;
  publication: "prototype" | "review" | "archived";
  /** First entry is the default. */
  brakes: BrakeOption[];
  freehubs: Freehub[];
  /** Extra for tubeless tape and valves, EUR minor units; null = not offered. */
  tubelessPrice: number | null;
  /** Specs shared by every brake version. */
  specs: Record<string, string>;
  /** Copied from the default brake option (status filters, cards, tests). */
  inventoryStatus: InventoryStatus;
  availability: string;
  price: number | null;
  source: string;
};

/** Freehub bodies listed as selectable variants on every current Equator wheel page. */
const standardFreehubs: Freehub[] = [
  { id: "shimano-hg", label: "Shimano 11–12 speed" },
  { id: "shimano-ms", label: "Shimano Microspline" },
  { id: "sram-xdr", label: "SRAM XDR 12 speed" },
  { id: "campagnolo", label: "Campagnolo 9–12 speed" },
];

const inStock =
  "In stock at Equator (updated 16 October 2026). Delivery time is confirmed with your order.";
const restockSoon =
  "New stock expected soon (Equator, updated 16 October 2026). Order now and we'll confirm the date.";
const discHub = {
  Hubs: "Equator Power Way, Centre Lock, Enduro sealed bearings",
  Axles: "12 × 100 mm front / 12 × 142 mm rear",
};
const disc = (price: number | null, source: string, status: InventoryStatus = "In stock", availability = inStock): BrakeOption => ({
  id: "disc",
  label: "Disc brake",
  price,
  inventoryStatus: status,
  availability,
  specs: { Brakes: "Disc (Centre Lock)" },
  source,
});

type WheelInput = Omit<
  Wheel,
  "inventoryStatus" | "availability" | "price" | "source" | "verified" | "publication" | "freehubs"
> & Partial<Pick<Wheel, "freehubs">>;
const wheel = (w: WheelInput): Wheel => ({
  verified: "2026-10-16",
  publication: "prototype",
  freehubs: standardFreehubs,
  ...w,
  specs: {
    ...w.specs,
    "Built in": "Assembled and tested by hand in Zlín, Czech Republic (parts sourced globally)",
  },
  inventoryStatus: w.brakes[0].inventoryStatus,
  availability: w.brakes[0].availability,
  price: w.brakes[0].price,
  source: w.brakes[0].source,
});

export const allWheels: Wheel[] = [
  wheel({
    id: "wavy-35",
    slug: "wavy-35c",
    name: "Wavy 35C",
    category: "Road",
    images: ["images/wavy-35-0.jpg", "images/wavy-35-1.png", "images/wavy-35-2.png", "images/wavy-35-3.jpg"],
    depthLabel: "35",
    description:
      "Equator's wave-profile rim in its lighter, lower version, for climbing, all-day road and fast gravel.",
    intendedUse: "Road · fast gravel · triathlon",
    tubelessPrice: 3200,
    brakes: [disc(141100, "https://www.equator-cycling.com/en/set-karbonovych-kol-equator-wavy-35c-disk/")],
    specs: {
      "Rim depth": "35 mm per model name (Equator's dimension line reads 50 mm, to be confirmed)",
      "Rim width": "21 mm internal / 28 mm external",
      "Rim profile": "Hooked, tubeless ready",
      Weight: "1,380 g set (Equator's spec table also lists 1,480 g, to be confirmed)",
      ...discHub,
      Spokes: "Sapim CX-Ray straight pull, 24 front / 24 rear",
      Tyres: "Tubed or tubeless, minimum 25 mm",
      "Max pressure": "8 bar",
    },
  }),
  wheel({
    id: "wavy-50",
    slug: "wavy-50c",
    name: "Wavy 50C",
    category: "Road",
    images: ["images/wavy-50-1.png", "images/wavy-50-2.png", "images/wavy-50-3.png", "images/wavy-50-4.jpg"],
    depthLabel: "50",
    description:
      "The deeper Wavy rim, with spokes tensioned 20% higher than Equator's standard wheels. Specified on the Raiden SRAM Red AXS.",
    intendedUse: "Road · triathlon / time trial",
    tubelessPrice: 3200,
    brakes: [disc(141100, "https://www.equator-cycling.com/en/equator-wavy-50c-disk/")],
    specs: {
      "Rim depth": "50 mm",
      "Rim width": "21 mm internal / 28 mm external",
      "Rim profile": "Hooked, tubeless ready",
      Weight: "1,480 g set",
      ...discHub,
      Spokes: "Sapim CX-Ray straight pull, 24 front / 24 rear, 140 kg tension",
      Tyres: "Tubed or tubeless, minimum 25 mm",
      "Max pressure": "8 bar",
      "Rider weight limit": "125 kg",
    },
  }),
  wheel({
    id: "carbon-50",
    slug: "carbon-50c",
    name: "50C Carbon",
    category: "Road",
    images: [...[1, 2, 3].map((n) => `images/carbon-50-${n}.png`), "images/carbon-50-rim-1.png"],
    depthLabel: "50",
    description:
      "Equator's all-round 50 mm carbon road wheel, balancing weight, aerodynamics and handling. Available for disc or rim brakes.",
    intendedUse: "Road · triathlon",
    tubelessPrice: 3200,
    brakes: [
      {
        ...disc(98800, "https://www.equator-cycling.com/en/equator-50c-disc/"),
        specs: {
          Brakes: "Disc (Centre Lock)",
          Weight: "1,540 g set",
          ...discHub,
          Spokes: "Sapim CX-Ray straight pull, 24 front / 24 rear",
        },
      },
      {
        id: "rim",
        label: "Rim brake",
        price: 86700,
        inventoryStatus: "In stock",
        availability: inStock,
        specs: {
          Brakes: "Rim / caliper brakes",
          Weight: "1,560 g set",
          Hubs: "Equator, Enduro sealed bearings, quick release",
          Spokes: "Sapim Race J-bend, 20 front / 24 rear",
        },
        source: "https://www.equator-cycling.com/en/equator-50c/",
      },
    ],
    specs: {
      "Rim depth": "50 mm",
      "Rim width": "19 mm internal / 27 mm external",
      "Rim profile": "Hooked, tubeless ready",
      Tyres: "Tubed or tubeless, minimum 25 mm",
      "Max pressure": "8 bar",
      "Rider weight limit": "115 kg",
    },
  }),
  wheel({
    id: "wide-50",
    slug: "wide-50c",
    name: "Wide 50C",
    category: "Road",
    images: [1, 2, 3].map((n) => `images/wide-50-${n}.png`),
    depthLabel: "50",
    description:
      "The wide version of the 50C: 21 mm internal width and a convex sidewall, 90 g lighter than the regular 50C, for 28 mm tyres and up.",
    intendedUse: "Road · fast gravel",
    tubelessPrice: 3200,
    brakes: [disc(106900, "https://www.equator-cycling.com/en/equator-50c-wide-disk/")],
    specs: {
      "Rim depth": "50 mm (per model name)",
      "Rim width": "21 mm internal / 28 mm external",
      "Rim profile": "Hooked, tubeless ready",
      Weight: "1,450 g set",
      ...discHub,
      Spokes: "Sapim CX-Ray straight pull, 24 front / 24 rear",
      Tyres: "Tubed or tubeless, minimum 28 mm",
      "Max pressure": "8 bar",
      "Rider weight limit": "120 kg",
    },
  }),
  wheel({
    id: "carbon-35",
    slug: "carbon-35c",
    name: "35C Carbon",
    category: "Road",
    images: [1, 2, 3].map((n) => `images/carbon-35-${n}.png`),
    depthLabel: "35",
    description:
      "A light, low 35 mm carbon disc wheel for climbing and everyday riding. Equator calls it its most popular disc model.",
    intendedUse: "Road · climbing",
    tubelessPrice: 3200,
    brakes: [disc(null, "https://www.equator-cycling.com/equator-35c-disc/", "Out of stock", restockSoon)],
    specs: {
      "Rim depth": "35 mm",
      "Rim width": "19 mm internal / 27 mm external",
      "Rim profile": "Hooked, tubeless ready",
      Weight: "1,430 g set",
      ...discHub,
      Spokes: "Sapim CX-Ray straight pull, 24 front / 24 rear",
      Tyres: "Tubed or tubeless, minimum 25 mm",
      "Max pressure": "8 bar",
      "Rider weight limit": "105 kg",
    },
  }),
  wheel({
    id: "tubular-45",
    slug: "tubular-45t",
    name: "45T Tubular",
    category: "Road",
    images: [1, 2, 3].map((n) => `images/tubular-45-${n}.png`),
    depthLabel: "45",
    description:
      "A 45 mm carbon disc wheel for tubular (sew-up) tyres, light and popular with racers.",
    intendedUse: "Road racing",
    tubelessPrice: null,
    brakes: [disc(84700, "https://www.equator-cycling.com/en/equator-45t-disk/")],
    specs: {
      "Rim depth": "45 mm",
      "Rim width": "25 mm",
      "Rim type": "Tubular (sew-up tyres)",
      Weight: "1,380 g set",
      ...discHub,
      Spokes: "Sapim CX-Ray straight pull, 24 front / 24 rear",
      Tyres: "Tubular, minimum 25 mm",
      "Rider weight limit": "Equator lists both 150 kg and 105 kg, to be confirmed",
    },
  }),
  wheel({
    id: "gravel-ultimate-40",
    slug: "gravel-ultimate-40c",
    name: "Gravel Ultimate 40C",
    category: "Gravel",
    images: ["images/gravel-ultimate-40-1.png", "images/gravel-ultimate-40-2.png", "images/gravel-ultimate-40-3.png"],
    depthLabel: "40",
    description: "A light, wide hookless carbon gravel wheelset for mixed surfaces and long days.",
    intendedUse: "Gravel · all-road",
    tubelessPrice: 3200,
    brakes: [
      disc(
        131000,
        "https://www.equator-cycling.com/en/set-karbonovych-kol-equator-gravel-40c-disk-ultimate/",
        "Available to order",
        "Built to order by Equator. Lead time is confirmed with your order.",
      ),
    ],
    specs: {
      "Rim depth": "40 mm",
      "Rim width": "25 mm internal / 28 mm external",
      "Rim profile": "Hookless, tubeless ready",
      Weight: "1,310 g set",
      ...discHub,
      Spokes: "Sapim CX-Ray straight pull, 24 front / 24 rear",
      Tyres: "Minimum 36 mm (hookless rim)",
      "Max pressure": "8 bar",
      "Rider weight limit": "110 kg",
    },
  }),
  wheel({
    id: "tt-88",
    slug: "tt-88c",
    name: "TT 88C",
    category: "TT",
    images: ["images/tt-88-1.png", "images/tt-88-2.png", "images/tt-88-3.png"],
    depthLabel: "88",
    description: "A deep 88 mm aero rim for time trials and triathlon. Assembled in Zlín.",
    intendedUse: "Time trial · triathlon",
    tubelessPrice: 3200,
    brakes: [
      disc(
        98800,
        "https://www.equator-cycling.com/en/set-karbonovych-kol-equator-88c-disk/",
        "Out of stock",
        "New stock expected November 2026 (Equator, updated 16 October 2026). Order now and we'll confirm the date.",
      ),
    ],
    specs: {
      "Rim depth": "88 mm",
      "Rim width": "19 mm internal / 27 mm external",
      "Rim profile": "Hooked, tubeless ready",
      Weight: "1,980 g set",
      ...discHub,
      Spokes: "Sapim CX-Ray straight pull, 24 front / 24 rear",
      Tyres: "Tubed or tubeless, minimum 25 mm; 100 mm valves",
      "Max pressure": "8 bar",
      "Rider weight limit": "115 kg",
    },
  }),
];

/** Listed by Equator but deliberately not published. */
export const wheelHolds = [
  { name: "Equator 40C Disc (gravel)", category: "Gravel", reason: "Older gravel model next to Gravel Ultimate 40C; restock November 2026." },
  { name: "30T Disc", category: "Road", reason: "Tubular; Equator's restock date (September 2026) has passed — confirm status." },
  { name: "TT rear disc wheel", category: "TT", reason: "Custom-made single wheel; confirm before listing." },
  { name: "MTB Wide / MTB Pro Wide", category: "MTB", reason: "Outside the road/gravel focus of this store." },
];

export const wheelCategories: { id: WheelCategory; label: string }[] = [
  { id: "Road", label: "Road" },
  { id: "Gravel", label: "Gravel" },
  { id: "TT", label: "Time Trial / TT" },
];

/** Cart build id for a wheel: "brake:freehub:tl|std". */
export const encodeWheelBuild = (brake: string, freehub: string, tubeless: boolean) =>
  `${brake}:${freehub}:${tubeless ? "tl" : "std"}`;

/** Lowest listed price across brake versions (for "From" labels). */
export const wheelFromPrice = (w: Wheel) => {
  const prices = w.brakes.map((b) => b.price).filter((p): p is number => p !== null);
  return prices.length ? Math.min(...prices) : null;
};

export const wheels = allWheels.filter(isVisible);

import { isVisible, type InventoryStatus } from "../../lib/publication.ts";

/**
 * Equator accessories and components. Facts from the manufacturer pages in
 * `source` (checked 16 Oct 2026). Prices in EUR minor units; null = price on
 * request (Equator lists some parts in CZK only — never converted here).
 * Conflicting manufacturer values are shown as "to confirm".
 */
export type AccessoryCategory = "Forks" | "Cockpit & seatposts" | "Bottle cages & small parts";
export type AccessoryOption = { id: string; label: string };
export type Accessory = {
  id: string;
  slug: string;
  name: string;
  category: AccessoryCategory;
  images: string[];
  description: string;
  price: number | null;
  optionLabel?: string;
  options: AccessoryOption[];
  specs: Record<string, string>;
  verified: string;
  publication: "prototype" | "review" | "archived";
  inventoryStatus: InventoryStatus;
  availability: string;
  source: string;
};

const restock =
  "New stock expected soon (Equator, updated 16 October 2026). Order now and we'll confirm the delivery date.";
const base = {
  verified: "2026-10-16",
  publication: "prototype" as const,
  inventoryStatus: "Out of stock" as const,
  availability: restock,
};
const single: AccessoryOption[] = [{ id: "standard", label: "Standard" }];

export const allAccessories: Accessory[] = [
  {
    ...base,
    id: "fork-adventure",
    slug: "adventure-carbon-fork",
    name: "Adventure Carbon Fork",
    category: "Forks",
    images: [1, 2, 3, 4].map((n) => `images/fork-adventure-${n}.jpg`),
    description:
      "A carbon adventure fork with a flip chip for two rake settings, fender and rack mounts and a long steerer you can cut to fit.",
    price: 36300,
    options: single,
    specs: {
      Material: "Carbon",
      Steerer: 'Tapered 1 1/8" – 1 1/2"',
      "Steerer length":
        "300 mm from crown (product text also mentions 350 mm — to confirm); cut to length on request",
      Axle: "12 × 100 mm thru-axle",
      Brake: "Flat mount",
      "Tyre clearance":
        '29" × 55 mm (product text also states 28" × 50 mm — to confirm)',
      Rake: "47 or 52 mm via flip chip",
      "Axle to crown": "398 mm",
      Mounts: "Fender and rack",
      "Cable routing":
        "External, partly hidden in the left leg; internal dynamo routing",
    },
    source:
      "https://www.equator-cycling.com/en/vidlice-equator-adventure-carbon-fork/",
  },
  {
    ...base,
    id: "fork-gravel",
    slug: "gravel-carbon-fork",
    name: "Gravel Carbon Fork",
    category: "Forks",
    images: [1, 2, 3, 4].map((n) => `images/fork-gravel-${n}.jpg`),
    description:
      "A lighter-built carbon gravel fork for 50 mm tyres, with fender and rack mounts and a long steerer you can cut to fit.",
    price: 36300,
    options: single,
    specs: {
      Material: "Carbon",
      Steerer: 'Tapered 1 1/8" – 1 1/2"',
      "Steerer length": "350 mm from crown; cut to length on request",
      Axle: "12 × 100 mm thru-axle",
      Brake: "Flat mount",
      "Tyre clearance": '28" × 50 mm',
      Rake: "47 mm",
      "Axle to crown": "382 mm",
      Mounts: "Fender and rack",
      "Cable routing":
        "External, partly hidden in the left leg (not for internal frame routing)",
    },
    source: "https://www.equator-cycling.com/en/gravel-fork-equator/",
  },
  {
    ...base,
    id: "seatpost-straight",
    slug: "titanium-seatpost-straight",
    name: "Titanium Seatpost, Straight",
    category: "Cockpit & seatposts",
    images: [1, 2].map((n) => `images/seatpost-straight-${n}.jpg`),
    description:
      "A brushed titanium seatpost with visible hand-made welds. Titanium takes the edge off vibration and lasts.",
    price: null,
    optionLabel: "Diameter",
    options: [
      { id: "31-6", label: "31.6 mm" },
      { id: "27-2", label: "27.2 mm" },
    ],
    specs: {
      Material: "Titanium, brushed finish",
      Diameter: "31.6 mm or 27.2 mm",
      Length: "400 mm",
      Setback: "0 mm",
      Clamp: "Round saddle rails (oval-rail clamp on request)",
    },
    source: "https://www.equator-cycling.com/sedlovka-rovna-equator-titanium/",
  },
  {
    ...base,
    id: "seatpost-offset",
    slug: "titanium-seatpost-offset",
    name: "Titanium Seatpost, 20 mm Offset",
    category: "Cockpit & seatposts",
    images: [1, 2].map((n) => `images/seatpost-offset-${n}.jpg`),
    description:
      "The setback version of the titanium seatpost, for riders who sit further back. Brushed finish, visible welds.",
    price: null,
    optionLabel: "Diameter",
    options: [
      { id: "31-6", label: "31.6 mm" },
      { id: "27-2", label: "27.2 mm" },
    ],
    specs: {
      Material: "Titanium, brushed finish",
      Diameter: "31.6 mm or 27.2 mm",
      Length: "400 mm",
      Setback: "20 mm",
      Clamp: "Round saddle rails (oval-rail clamp on request)",
    },
    source:
      "https://www.equator-cycling.com/sedlovka-offsetova-equator-titanium/",
  },
  {
    ...base,
    id: "stem",
    slug: "titanium-stem",
    name: "Titanium Stem",
    category: "Cockpit & seatposts",
    images: ["images/stem-1.jpg"],
    description:
      "A brushed titanium stem with titanium bolts and visible, hand-made welds.",
    price: null,
    optionLabel: "Length",
    options: [70, 80, 90, 100, 110, 120].map((l) => ({
      id: `${l}`,
      label: `${l} mm`,
    })),
    specs: {
      Material: "Titanium, brushed finish; titanium bolts",
      Length: "70–120 mm in 10 mm steps",
      Angle: "6°",
      "Handlebar clamp": "31.8 mm",
      Steerer: "28.6 mm (1 1/8\")",
    },
    source: "https://www.equator-cycling.com/predstavec-equator-titanium/",
  },
  {
    ...base,
    id: "bottle-cage",
    slug: "titanium-bottle-cage",
    name: "Titanium Bottle Cage",
    category: "Bottle cages & small parts",
    images: ["images/bottle-cage-1.jpg"],
    description:
      "Shaped from hollow titanium tubing in a natural matt finish. Made for Equator frames, fits any bike.",
    price: 7700,
    options: single,
    specs: {
      Material: "Hollow titanium tubing",
      Finish: "Natural titanium, matt",
    },
    source: "https://www.equator-cycling.com/en/kosik-na-lahve-equator-titanim/",
  },
  {
    ...base,
    id: "seat-clamp",
    slug: "titanium-seat-clamp",
    name: "Titanium Seat Clamp",
    category: "Bottle cages & small parts",
    images: ["images/seat-clamp-1.jpg"],
    description:
      "A brushed titanium seatpost clamp with milled side grooves.",
    price: 2800,
    optionLabel: "Seatpost",
    options: [
      { id: "31-6", label: "For 31.6 mm" },
      { id: "27-2", label: "For 27.2 mm" },
    ],
    specs: {
      Material: "Titanium, brushed with milled grooves",
      Sizes: "For 31.6 mm or 27.2 mm seatposts",
    },
    source: "https://www.equator-cycling.com/en/objimka-equator-titanium-31-6-mm/",
  },
  {
    ...base,
    id: "spacer",
    slug: "titanium-headset-spacer",
    name: "Titanium Headset Spacer",
    category: "Bottle cages & small parts",
    images: ["images/spacer-1.jpg"],
    description:
      "Brushed titanium headset spacers to match the titanium stem and frame.",
    price: null,
    optionLabel: "Height",
    options: [5, 10, 15, 20].map((h) => ({ id: `${h}`, label: `${h} mm` })),
    specs: {
      Material: "Titanium, brushed finish",
      Heights: "5, 10, 15 or 20 mm",
    },
    source: "https://www.equator-cycling.com/spacer-equator-titanium/",
  },
];

export const accessoryCategories: AccessoryCategory[] = [
  "Forks",
  "Cockpit & seatposts",
  "Bottle cages & small parts",
];

export const accessories = allAccessories.filter(isVisible);

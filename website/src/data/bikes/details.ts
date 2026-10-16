/**
 * Frame geometry, key figures, feature stories and full frame specifications
 * per bicycle family. All values come from the Equator product pages in
 * `source` (checked 16 Oct 2026) and are quoted as published. Values that look
 * inconsistent are kept but flagged with `check: true` so they show as
 * "to confirm" until Equator verifies them.
 */
export type GeoRow = {
  label: string;
  /** Short code used in the drawing legend, e.g. "A". */
  key?: string;
  values: (string | null)[];
  /** Indexes of values that look wrong and need confirmation. */
  check?: number[];
};
export type Geometry = {
  sizes: string[];
  /** Rider height range in cm per size; null max = open-ended. */
  riderHeight: [number, number | null][];
  rows: GeoRow[];
  note?: string;
};
export type Feature = { title: string; text: string; image?: string };
export type BikeDetails = {
  tagline: string;
  intro: string;
  keyFigures: { value: string; label: string }[];
  features: Feature[];
  geometry: Geometry;
  frameSpecs: Record<string, string>;
  framesetContents: string[];
  source: string;
};

const titanium: Feature = {
  title: "Titanium, built to last",
  text: "Seamless 3Al-2.5V aerospace-grade titanium tubing. It doesn't rust, needs no paint and shrugs off scratches. A frame you keep for decades, not seasons.",
};
const t47: Feature = {
  title: "Threaded T47 bottom bracket",
  text: "A threaded T47 shell: quiet, simple to service with standard tools, and wide enough to route cables inside the frame.",
};
const udh: Feature = {
  title: "SRAM UDH, T-Type ready",
  text: "The Universal Derailleur Hanger is replaceable almost anywhere in the world and works with SRAM's hangerless T-Type Transmission.",
};

export const bikeDetails: Record<string, BikeDetails> = {
  sensei: {
    tagline: "Fast gravel, long days.",
    intro:
      "Sensei Gen 4 is Equator's gravel bike for riders who move between tarmac and trail without changing bikes. Room for 52 mm tyres, a full set of mounts and clean internal routing, wrapped in a titanium frame of 1,850 g.",
    keyFigures: [
      { value: "52 mm", label: "Tyre clearance" },
      { value: "1,850 g", label: "Frame weight (M)" },
      { value: "9.4 kg", label: "Complete bike (M)" },
      { value: "T47", label: "Threaded BB" },
    ],
    features: [
      {
        title: "Room for 52 mm tyres",
        text: "Clearance for tyres up to 52 mm wide, so the same bike runs fast slicks on the road and big volume rubber on rough gravel.",
        image: "images/sensei-3.jpg",
      },
      { ...titanium, image: "images/sensei-2.jpg" },
      { ...t47 },
      { ...udh },
      {
        title: "Clean, fully internal routing",
        text: "Cables run inside the head tube and chainstays for 1x and 2x groupsets, with a port for Di2 and internal routing for a dropper post.",
        image: "images/sensei-5.jpg",
      },
      {
        title: "Mounts for the long way round",
        text: "Seat tube and twin down-tube bottle mounts, three top-tube mounts for a bag, plus rack and fender mounts.",
      },
    ],
    geometry: {
      sizes: ["S", "M", "L", "XL"],
      riderHeight: [
        [161, 171],
        [169, 179],
        [173, 182],
        [177, 189],
      ],
      rows: [
        { label: "Stack", key: "A", values: ["576.6 mm", "585 mm", "607 mm", "626 mm"] },
        { label: "Reach", key: "B", values: ["365.5 mm", "362 mm", "379.5 mm", "398.5 mm"], check: [0] },
        { label: "Seat tube (c–t)", key: "C", values: ["470 mm", "490 mm", "530 mm", "550 mm"] },
        { label: "Effective top tube", key: "D", values: ["520 mm", "530 mm", "565 mm", "590 mm"] },
        { label: "Head tube", key: "E", values: ["150 mm", "160 mm", "180 mm", "200 mm"] },
        { label: "Head angle", key: "F", values: ["71°", "71°", "72°", "72°"] },
        { label: "Seat angle", key: "G", values: ["75°", "74°", "73°", "73°"] },
        { label: "Chainstay", key: "H", values: ["430 mm", "430 mm", "430 mm", "430 mm"] },
        { label: "BB drop", key: "I", values: ["71 mm", "70 mm", "69 mm", "69 mm"] },
      ],
    },
    frameSpecs: {
      "Frame material": "Titanium 3Al-2.5V, seamless aerospace-grade tubing",
      "Frame weight": "1,850 g (size M)",
      "Tyre clearance": "Up to 52 mm",
      "Bottom bracket": "T47 threaded",
      "Rear derailleur hanger": "SRAM UDH, T-Type compatible",
      Axles: "12 mm thru-axles",
      Brakes: "Flat mount disc",
      "Cable routing": "Fully internal; 1x and 2x, Di2 port, internal dropper routing",
      Seatpost: "31.6 mm",
      Headset: "Mortop, drop-in IS52/IS52",
      Fork: "Equator Gravel carbon, 480 g (version with 3 mounts per leg on request)",
      Mounts: "Seat tube, 2× under down tube, 3× top tube; rack and fender",
    },
    framesetContents: [
      "Titanium frame",
      "Equator Gravel carbon fork",
      "Titanium seat clamp",
      "Titanium headset spacers",
      "Mortop headset",
      "Thru-axles",
    ],
    source: "https://www.equator-cycling.com/en/equator-sensei-titanium-gen-4-ramova-sada/",
  },
  raiden: {
    tagline: "Pure road. Pure titanium.",
    intro:
      "Raiden is Equator's dedicated road bike: a titanium frame with fully internal routing, room for 38 mm tyres and a threaded T47 bottom bracket. The SRAM Red AXS build weighs 8.4 kg in size L.",
    keyFigures: [
      { value: "38 mm", label: "Tyre clearance" },
      { value: "8.4 kg", label: "Complete bike (L)" },
      { value: "T47", label: "Threaded BB" },
      { value: "UDH", label: "T-Type ready" },
    ],
    features: [
      { ...titanium, image: "images/raiden-5.jpg" },
      {
        title: "Fully internal routing",
        text: "Hoses and cables disappear into the frame for a clean front end and an uncluttered titanium silhouette.",
        image: "images/raiden-4.jpg",
      },
      {
        title: "Room for 38 mm tyres",
        text: "Modern road clearance for tyres up to 38 mm, for more comfort and grip on rough roads and long days.",
      },
      { ...t47, image: "images/raiden-6.jpg" },
      { ...udh },
    ],
    geometry: {
      sizes: ["S", "M", "L", "XL"],
      riderHeight: [
        [0, 170],
        [169, 179],
        [175, 189],
        [185, 195],
      ],
      rows: [
        { label: "Stack", key: "A", values: ["520 mm", "532 mm", "543 mm", "590 mm"], check: [3] },
        { label: "Reach", key: "B", values: ["372 mm", "380.6 mm", "386 mm", "393 mm"] },
        { label: "Seat tube (c–t)", key: "C", values: ["490 mm", "520 mm", "540 mm", "590 mm"] },
        { label: "Effective top tube", key: "D", values: ["520 mm", "533 mm", "547 mm", "393 mm"], check: [3] },
        { label: "Head tube", key: "E", values: ["120 mm", "130 mm", "140 mm", "155 mm"] },
        { label: "Head angle", key: "F", values: ["71°", "71.5°", "72°", "72.5°"] },
        { label: "Seat angle", key: "G", values: ["74.5°", "74°", "73.5°", "73°"] },
        { label: "Chainstay", key: "H", values: ["415 mm", "415 mm", "415 mm", "415 mm"] },
        { label: "BB drop", key: "I", values: ["71 mm", "71 mm", "71 mm", "71 mm"] },
      ],
    },
    frameSpecs: {
      "Frame material": "Titanium 3Al-2.5V, seamless aerospace-grade tubing",
      "Tyre clearance": "Up to 38 mm",
      "Bottom bracket": "T47 threaded",
      "Rear derailleur hanger": "SRAM UDH, T-Type compatible",
      Axles: "Thru-axles",
      "Cable routing": "Fully internal",
      Seatpost: "27.2 mm",
      Headset: "Mortop, IS52/IS52",
      Fork: "Equator Road carbon",
      "Complete bike weight": "8.4 kg (SRAM Red AXS, size L)",
    },
    framesetContents: [
      "Titanium frame",
      "Equator Road carbon fork",
      "Titanium seat clamp",
      "Titanium headset spacers",
      "Mortop headset",
      "Thru-axles",
    ],
    source: "https://www.equator-cycling.com/en/equator-raiden-titanium/",
  },
  yasei: {
    tagline: "Built for the far side of the map.",
    intro:
      "Yasei is Equator's adventure gravel bike, now in its third generation: 57 mm tyre clearance, a flip-chip carbon fork with cargo mounts and mounting points everywhere you need them for bikepacking.",
    keyFigures: [
      { value: "57 mm", label: "Tyre clearance (2.2\")" },
      { value: "1,910 g", label: "Frame weight (M)" },
      { value: "9.6 kg", label: "Complete bike (M)" },
      { value: "47/52", label: "Fork rake, flip chip" },
    ],
    features: [
      {
        title: "Big tyres, 28\" or 29\"",
        text: "Room for tyres up to 57 mm (2.2\") on 28\" or 29\" wheels, for comfort and grip when the gravel turns to rubble.",
        image: "images/yasei-1.jpg",
      },
      {
        title: "Flip-chip adventure fork",
        text: "The Equator Adventure carbon fork switches rake between 47 and 52 mm, carries up to 3 kg per leg on three mounts and has internal dynamo routing.",
        image: "images/yasei-4.jpg",
      },
      { ...titanium, image: "images/yasei-3.jpg" },
      {
        title: "Ready to load up",
        text: "Two bottle cages inside the frame or one on the down tube, another underneath, a bolt-on top-tube bag, and rack and fender mounts.",
      },
      { ...t47, image: "images/yasei-alt-14.jpg" },
      { ...udh, image: "images/yasei-alt-7.jpg" },
    ],
    geometry: {
      sizes: ["S", "M", "L", "XL"],
      riderHeight: [
        [160, 169],
        [167, 177],
        [175, 185],
        [185, null],
      ],
      rows: [
        { label: "Stack", key: "A", values: ["582 mm", "580 mm", "599 mm", "639 mm"] },
        { label: "Reach", key: "B", values: ["400 mm", "414 mm", "428 mm", "425 mm"], check: [3] },
        { label: "Seat tube (c–t)", key: "C", values: ["470 mm", "480 mm", "500 mm", "520 mm"] },
        { label: "Effective top tube", key: "D", values: ["575 mm", "585 mm", "605 mm", "620 mm"] },
        { label: "Head tube", key: "E", values: ["140 mm", "160 mm", "180 mm", "200 mm"] },
        { label: "Head angle", key: "F", values: ["70°", "70°", "70°", "70°"] },
        { label: "Seat angle", key: "G", values: ["74°", "74°", "74°", "74°"] },
        { label: "Chainstay", key: "H", values: ["440 mm", "440 mm", "440 mm", "440 mm"] },
        { label: "BB drop", key: "I", values: ["78 mm", "75 mm", "75 mm", "75 mm"] },
      ],
    },
    frameSpecs: {
      "Frame material": "Titanium 3Al-2.5V, seamless aerospace-grade tubing",
      "Frame weight": "1,910 g (size M)",
      "Tyre clearance": "Up to 57 mm (29 × 2.2\"), 28\" or 29\" wheels",
      "Bottom bracket": "T47 threaded",
      "Rear derailleur hanger": "SRAM UDH, T-Type compatible",
      Axles: "Thru-axles",
      Brakes: "Flat mount (post mount with adapter)",
      "Max chainring (1x)": "46T round, 42–44T oval",
      "Cable routing": "Internal, including dropper routing",
      Seatpost: "31.6 mm",
      Headset: "Mortop, drop-in",
      Fork: "Equator Adventure carbon, 560 g, flip chip 47/52 mm rake, 3 mounts per leg (3 kg each), internal dynamo routing",
      Mounts: "2 bottle cages inside or 1 on down tube, 1 under down tube, top-tube bag, rack and fender",
    },
    framesetContents: [
      "Titanium frame",
      "Equator Adventure carbon fork",
      "Titanium seat clamp",
      "Titanium headset spacers",
      "Mortop headset",
      "Thru-axles",
    ],
    source: "https://www.equator-cycling.com/en/equator-yasei-titanium-ramova-sada/",
  },
};

/**
 * Size suggestion from rider height and inseam using Equator's rider-height
 * ranges. Where two sizes overlap, a long inseam (≥ 47% of height) picks the
 * larger size and a short one the smaller. Only sizes currently offered are
 * suggested. Returns null when outside every range.
 */
export function suggestSize(
  geo: Geometry,
  offered: string[],
  heightCm: number,
  inseamCm?: number,
): { size: string; alternative?: string; reason: string } | null {
  const fits = geo.sizes
    .map((s, i) => ({ s, min: geo.riderHeight[i][0], max: geo.riderHeight[i][1] ?? Infinity }))
    .filter((r) => offered.includes(r.s) && heightCm >= r.min && heightCm <= r.max);
  if (!fits.length) return null;
  if (fits.length === 1) return { size: fits[0].s, reason: "Your height is in this size's range." };
  const ratio = inseamCm ? inseamCm / heightCm : null;
  const [small, large] = [fits[0], fits[fits.length - 1]];
  if (ratio === null)
    return {
      size: small.s,
      alternative: large.s,
      reason: "Your height fits two sizes. Add your inseam to choose between them.",
    };
  return ratio >= 0.47
    ? { size: large.s, alternative: small.s, reason: "Your height fits two sizes; your longer legs favour the larger one." }
    : { size: small.s, alternative: large.s, reason: "Your height fits two sizes; your inseam favours the smaller, more compact one." };
}

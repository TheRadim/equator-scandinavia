/**
 * Generates favicons and app icons from the vector "E" in public/logo.svg.
 *   node scripts/brand-assets.mjs
 * Writes: public/favicon.svg, favicon.ico (16/32/48), apple-touch-icon.png (180),
 * icon-192.png, icon-512.png, icon-maskable-512.png.
 */
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const logo = readFileSync("public/logo.svg", "utf8");
const E = / d="([^"]+)"/.exec(logo)[1].split(" M ")[0]; // first sub-path: the "E"
// E spans x 0.51–20.17, y 8–20. Square box centred on it.
const box = (pad) => {
  const size = 19.66 + pad * 2;
  return `${(10.34 - size / 2).toFixed(2)} ${(14 - size / 2).toFixed(2)} ${size.toFixed(2)} ${size.toFixed(2)}`;
};

// Browser tab icon: transparent, black E; white E in dark mode.
writeFileSync(
  "public/favicon.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box(1.2)}"><style>path{fill:#171717}@media (prefers-color-scheme:dark){path{fill:#fff}}</style><path d="${E}"/></svg>\n`,
);

// Raster icons: black E on white (visible on any tab or home screen).
const tile = (pad, bg = "#ffffff") => {
  const [x, y, s] = box(pad).split(" ").map(Number);
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${s} ${s}"><rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${bg}"/><path fill="#171717" d="${E}"/></svg>`,
  );
};
const png = (svg, size) => sharp(svg, { density: 2400 }).resize(size, size).png().toBuffer();

writeFileSync("public/apple-touch-icon.png", await png(tile(4), 180));
writeFileSync("public/icon-192.png", await png(tile(3), 192));
writeFileSync("public/icon-512.png", await png(tile(3), 512));
writeFileSync("public/icon-maskable-512.png", await png(tile(10), 512)); // safe zone

// ICO with embedded PNGs (supported by every browser that still asks for .ico).
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => png(tile(1.2), s)));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const o = 6 + i * 16;
  header.writeUInt8(s, o);
  header.writeUInt8(s, o + 1);
  header.writeUInt16LE(1, o + 4);
  header.writeUInt16LE(32, o + 6);
  header.writeUInt32LE(images[i].length, o + 8);
  header.writeUInt32LE(offset, o + 12);
  offset += images[i].length;
});
writeFileSync("public/favicon.ico", Buffer.concat([header, ...images]));
console.log("Brand assets written.");

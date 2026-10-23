/**
 * Social preview images (Facebook, LinkedIn, WhatsApp, Slack, iMessage…):
 * 1200×630 JPEGs built from the product photographs, with the Equator wordmark.
 * Bikes fill the frame; wheels and parts are shown whole on their own background.
 */
import type { APIRoute, GetStaticPaths } from "astro";
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { bikes } from "../../data/bikes/catalog";
import { wheels } from "../../data/wheels/catalog";
import { accessories } from "../../data/accessories/catalog";

const W = 1200;
const H = 630;

export const getStaticPaths: GetStaticPaths = () => {
  const entries = new Map<string, { src: string; fit: "cover" | "contain" }>();
  const add = (src: string | undefined, fit: "cover" | "contain") => {
    if (!src) return;
    const name = src.split("/").pop()!.replace(/\.(jpe?g|png)$/i, "");
    entries.set(name, { src, fit });
  };
  entries.set("default", { src: "images/sensei-0.jpg", fit: "cover" });
  bikes.forEach((b) => add(b.images[0], "cover"));
  wheels.forEach((w) => add(w.images[0], "contain"));
  accessories.forEach((a) => add(a.images[0], "contain"));
  return [...entries].map(([name, props]) => ({ params: { name }, props }));
};

export const GET: APIRoute = async ({ props }) => {
  const { src, fit } = props as { src: string; fit: "cover" | "contain" };
  const file = `public/${src}`;
  let base: ReturnType<typeof sharp>;
  if (fit === "cover") {
    base = sharp(file).resize(W, H, { fit: "cover", position: "centre" });
  } else {
    // Background = the photo's own corner colour, so the padding is invisible.
    // Trim any plain border first (some photos sit on a grey card inside a white frame).
    const trimmed = await sharp(file).flatten({ background: "#ffffff" }).trim({ threshold: 6 }).png().toBuffer();
    const { data } = await sharp(trimmed).extract({ left: 3, top: 3, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });
    const background = { r: data[0], g: data[1], b: data[2] };
    const photo = await sharp(trimmed).resize(Math.round(W * 0.7), Math.round(H * 0.8), { fit: "inside" }).toBuffer();
    base = sharp({ create: { width: W, height: H, channels: 3, background } }).composite([{ input: photo, gravity: "centre" }]);
  }
  const logo = Buffer.from(readFileSync("public/logo.svg", "utf8").replace('fill="#000000"', 'fill="#171717"'));
  const mark = await sharp(logo, { density: 300 }).resize(214).png().toBuffer();
  const body = await sharp(await base.png().toBuffer())
    .composite([{ input: mark, left: 56, top: 52 }])
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(body), { headers: { "Content-Type": "image/jpeg" } });
};

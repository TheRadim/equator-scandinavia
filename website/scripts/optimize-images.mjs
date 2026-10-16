// Generates responsive WebP variants (640w, 1024w) next to every JPG/PNG in
// public/images. Run after adding or replacing a photograph:
//   npm run images
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const dir = path.resolve("public/images");
const widths = [640, 1024];
for (const file of await readdir(dir)) {
  if (!/\.(jpe?g|png)$/i.test(file)) continue;
  const src = path.join(dir, file);
  const base = src.replace(/\.(jpe?g|png)$/i, "");
  const srcTime = (await stat(src)).mtimeMs;
  for (const w of widths) {
    const out = `${base}-${w}.webp`;
    const fresh = await stat(out).then((o) => o.mtimeMs >= srcTime, () => false);
    if (fresh) continue;
    await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out);
    console.log("wrote", path.relative(process.cwd(), out));
  }
}

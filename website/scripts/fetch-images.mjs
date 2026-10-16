// Downloads official gallery photographs listed in src/data/gallery-candidates.json
// into public/images/<product>-<n>.<ext>. Existing files are skipped.
// Afterwards: add the printed paths to the product's `images` array, run
// `npm run images`, and record provenance in src/data/image-sources.json.
import { readFile, writeFile, access } from "node:fs/promises";
const data = JSON.parse(await readFile("src/data/gallery-candidates.json", "utf8"));
for (const [id, { urls }] of Object.entries(data.products)) {
  const saved = [];
  for (const [i, u] of urls.entries()) {
    const ext = new URL(u).pathname.endsWith(".png") ? "png" : "jpg";
    const rel = `images/${id}-${i + 1}.${ext}`;
    const out = `public/${rel}`;
    if (await access(out).then(() => true, () => false)) { saved.push(rel); continue; }
    const res = await fetch(u);
    if (!res.ok) { console.error(`skip ${u}: HTTP ${res.status}`); continue; }
    await writeFile(out, Buffer.from(await res.arrayBuffer()));
    saved.push(rel);
  }
  console.log(`${id}: ${JSON.stringify(saved)}`);
}

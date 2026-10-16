// Downloads official photographs listed in src/data/gallery-candidates.json
// into public/images/<id>-<n>.<ext>. Existing files are skipped; failures are
// reported but do not stop the run. Run in CI (Fetch product images workflow)
// or locally on a machine that can reach cdn.myshoptet.com.
import { readFile, writeFile, access } from "node:fs/promises";
const data = JSON.parse(await readFile("src/data/gallery-candidates.json", "utf8"));
let failed = 0;
for (const [id, { urls }] of Object.entries(data.products)) {
  const saved = [];
  for (const [i, u] of urls.entries()) {
    const ext = new URL(u).pathname.toLowerCase().endsWith(".png") ? "png" : "jpg";
    const rel = `images/${id}-${i + 1}.${ext}`;
    const out = `public/${rel}`;
    if (await access(out).then(() => true, () => false)) { saved.push(rel); continue; }
    try {
      const res = await fetch(u, { headers: { "User-Agent": "Mozilla/5.0 (equator-scandinavia image sync)" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const type = res.headers.get("content-type") || "";
      if (!type.startsWith("image/")) throw new Error(`unexpected ${type}`);
      await writeFile(out, Buffer.from(await res.arrayBuffer()));
      saved.push(rel);
    } catch (e) {
      failed++;
      console.error(`skip ${id} #${i + 1}: ${e.message}`);
    }
  }
  console.log(`${id}: ${JSON.stringify(saved)}`);
}
if (failed) console.error(`${failed} image(s) failed`);

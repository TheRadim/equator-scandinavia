// Builds a self-contained copy of the site with relative links, for hosting
// under an arbitrary path (e.g. a private claude.ai preview link).
//   node scripts/build-preview.mjs <outDir>
// Does not change the normal GitHub Pages build.
import { execSync } from "node:child_process";
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";

const out = path.resolve(process.argv[2] || "../preview-dist");
const BASE = "/equator-scandinavia/";
execSync(`npx astro build --outDir ${JSON.stringify(out)}`, {
  stdio: "inherit",
  env: { ...process.env, PUBLIC_RELATIVE_LINKS: "true", PUBLIC_INQUIRY_ENDPOINT: "" },
});

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}
const isDir = (p) => stat(p).then((s) => s.isDirectory(), () => false);

for await (const file of walk(out)) {
  const rel = path.relative(out, file);
  if (file.endsWith(".css")) {
    // CSS lives in assets/: font and asset URLs become siblings.
    const css = await readFile(file, "utf8");
    await writeFile(file, css.replaceAll(`${BASE}assets/`, "./").replaceAll(BASE, "../"));
    continue;
  }
  if (!file.endsWith(".html")) continue;
  const depth = rel.split(path.sep).length - 1;
  const root = depth ? "../".repeat(depth) : "./";
  let html = await readFile(file, "utf8");
  // Only site-relative references (preceded by a quote, space, comma or paren); absolute https URLs stay.
  html = html.replace(/(["'(\s,])\/equator-scandinavia(\/[^"')\s,]*)?/g, (m, pre, rest = "/") => {
    let target = rest.slice(1);
    const i = target.search(/[?#]/);
    let pathname = i === -1 ? target : target.slice(0, i);
    const suffix = i === -1 ? "" : target.slice(i);
    if (pathname === "" || pathname.endsWith("/")) pathname += "index.html";
    return `${pre}${root}${pathname}${suffix}`;
  });
  await writeFile(file, html);
}
console.log(`Preview build ready in ${out}`);

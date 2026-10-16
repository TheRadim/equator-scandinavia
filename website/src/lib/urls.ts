/**
 * Internal URL helper.
 * Default: absolute paths under the GitHub Pages base (e.g. /equator-scandinavia/bikes/).
 * PUBLIC_RELATIVE_LINKS=true (preview hosting, see scripts/build-preview.mjs):
 * links point at explicit index.html files; in the browser they are made
 * relative using <html data-root>, so the site works from any folder.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const RELATIVE = import.meta.env.PUBLIC_RELATIVE_LINKS === "true";

export const url = (path = "") => {
  let p = path.replace(/^\//, "");
  if (RELATIVE) {
    const i = p.search(/[?#]/);
    const pathname = i === -1 ? p : p.slice(0, i);
    const suffix = i === -1 ? "" : p.slice(i);
    if (pathname === "" || pathname.endsWith("/")) p = `${pathname}index.html${suffix}`;
    if (typeof document !== "undefined")
      return (document.documentElement.dataset.root ?? "./") + p;
  }
  return `${BASE}/${p}`;
};

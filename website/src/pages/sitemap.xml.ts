import type { APIRoute } from "astro";
import { bikes } from "../data/bikes/catalog";
import { wheels } from "../data/wheels/catalog";
export const GET: APIRoute = ({ site }) => {
  const paths = [
    "",
    "bikes/",
    "wheels/",
    "accessories/",
    "about/",
    "contact/",
    "faq/",
    "warranty/",
    "crash-replacement/",
    "shipping/",
    "privacy/",
    "terms/",
    "cookies/",
    ...bikes.map((p) => `bikes/${p.slug}/`),
    ...wheels.map((p) => `wheels/${p.slug}/`),
  ];
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const body = paths
    .map((path) => `<url><loc>${new URL(`${base}/${path}`, site)}</loc></url>`)
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
};

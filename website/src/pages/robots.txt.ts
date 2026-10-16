import type { APIRoute } from "astro";
import { allowIndexing } from "../lib/config";
import { url } from "../lib/urls";

// Note: crawlers only read robots.txt at a domain root. On a GitHub Pages
// project URL this file is informational; it becomes effective on a custom domain.
export const GET: APIRoute = ({ site }) =>
  new Response(
    allowIndexing
      ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL(url("sitemap.xml"), site)}\n`
      : "User-agent: *\nDisallow: /\n",
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );

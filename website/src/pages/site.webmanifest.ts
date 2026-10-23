import type { APIRoute } from "astro";
import { url } from "../lib/urls";
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: "Equator Scandinavia",
      short_name: "Equator",
      start_url: url(""),
      scope: url(""),
      display: "browser",
      background_color: "#ffffff",
      theme_color: "#ffffff",
      icons: [
        { src: url("icon-192.png"), sizes: "192x192", type: "image/png" },
        { src: url("icon-512.png"), sizes: "512x512", type: "image/png" },
        { src: url("icon-maskable-512.png"), sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    }),
    { headers: { "Content-Type": "application/manifest+json" } },
  );

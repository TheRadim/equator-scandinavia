import type { APIRoute } from "astro";
import { stock } from "../lib/stock";
// Latest availability reading, re-read by the browser on every page view.
export const GET: APIRoute = () =>
  new Response(JSON.stringify(stock), { headers: { "Content-Type": "application/json" } });

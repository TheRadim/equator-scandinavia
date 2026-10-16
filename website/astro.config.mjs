import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  site: "https://theradim.github.io",
  base: "/equator-scandinavia",
  output: "static",
  // "assets" instead of "_astro": some hosts reserve names starting with "_".
  build: { assets: "assets" },
  vite: { plugins: [tailwindcss()] },
});

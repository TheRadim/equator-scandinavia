import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ site: 'https://theradim.github.io', base: '/equator-scandinavia', output: 'static', vite: { plugins: [tailwindcss()] } });

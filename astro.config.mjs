// @ts-check
import { defineConfig } from 'astro/config';

// Static output — Vercel deploys this with zero configuration.
export default defineConfig({
  // [YOUR SITE URL] — used for canonical + Open Graph URLs.
  site: 'https://your-domain.vercel.app',
  output: 'static',
  image: {
    // Game thumbnails are downloaded from Roblox at build time (src/lib/roblox.ts).
    remotePatterns: [{ protocol: 'https', hostname: '**.rbxcdn.com' }],
  },
  vite: {
    build: {
      // Three.js (~550 kB) already loads lazily in its own chunk after first paint.
      chunkSizeWarningLimit: 700,
    },
  },
});

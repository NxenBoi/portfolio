# Roblox Scripter Portfolio

An immersive, scroll-driven 3D portfolio. Scrolling flies the camera through a pastel dream-sky world built from Frutiger-Aero bubbles, Y2K/Y3K chrome, cotton-candy clouds and glossy floating islands. Frosted-glass panels hold the content at each stop.

Built with **Astro (Vite)**, **Three.js**, **GSAP + ScrollTrigger**, **Lenis**, and plain CSS custom properties. Fully static, so it deploys to Vercel with zero config.

## Run it

Requires Node 22.23+ (Node 24 works).

```bash
npm install
npm run dev       # http://localhost:4321 with hot reload
npm run build     # type-check (astro check) + static build into dist/
npm run preview   # serve the built dist/ locally
```

## The journey

| Stop | Section | 3D landmark |
| --- | --- | --- |
| Spawn | Hero | Grass island inside a giant soap bubble; glossy blocks assemble into a tower as you start scrolling |
| Games 01…n | One stop per game | Chrome-framed screen showing the game thumbnail (from Roblox), on a mini island, with blocks orbiting it |
| Promises | How you work | Chrome torus knot, sparkle stars and orbs |
| Contact | Email / Discord + footer | Cotton-candy cloud bank with a glowing portal |

The sky colour blends between zones as you travel. On wide screens a clickable journey map on the right shows where you are; click any stop to fly there.

## Edit content (no component changes needed)

All copy lives in `src/data/`:

| File | What it controls |
| --- | --- |
| `site.ts` | Name (Nxen), nav icon, Discord handle, SEO meta, hero text, zone names, section titles, contact text, footer note, 404 |
| `nav.ts` | Nav + footer links |
| `games.ts` | Roblox links of games you worked on. Each one adds a stop in the world; details come from Roblox |
| `promises.ts` | Your promise cards |

### Adding your Roblox games
1. Paste the game link into `src/data/games.ts`: `{ url: 'https://www.roblox.com/games/123/My-Game' }`.
2. That's it. At build time the site fetches the thumbnail, title, description, visits, likes and favorites from Roblox's public APIs. Thumbnails are downloaded and served from your own domain.
3. Numbers refresh on every deploy. Redeploy on Vercel (or push any commit) to update them.
4. Update tags like `[UPDATE 1]` are stripped from titles, and descriptions are cut to their first 4 lines. Add `title` or `description` to an entry to override either one.
5. If Roblox is unreachable during a build, the build still succeeds and the card shows a placeholder.

### Colours, type, spacing
Every token is in `src/styles/tokens.css`, including the sky colours of each zone (`--sky-*`). The 3D world reads those same variables, so changing them recolours the world.

## Project structure

```
src/
  layouts/BaseLayout.astro   head/SEO, fonts, world canvas, nav, loads scripts/main.ts
  pages/index.astro          composes the stops
  pages/404.astro            "fell out of the map" (scattered-block spawn)
  components/
    Stop.astro               one stop on the journey (section + panel wrapper)
    Hero, Games, Promises, Contact   the stops
    World, Hud, Nav, GlassPanel, Button, TiltCard
  data/                      ALL page copy
  styles/tokens.css          design tokens
  styles/global.css          reset + utilities
  scripts/
    main.ts                  entry: gsap.matchMedia → journey, nav, tilt
    lib/                     gsap.ts, lenis.ts, motion.ts
    animations/              journey.ts (scroll→camera, panels, HUD), nav, tilt, contact
    three/                   world.ts, landmarks.ts, sky.ts, materials.ts, palette.ts
public/                      favicon.ico, nxen-icon.png (nav badge), og-image.png
src/lib/roblox.ts            build-time Roblox API fetch (games)
```

## Add a page later

1. Create `src/pages/games.astro` and wrap its content in `<BaseLayout>`. To give it a 3D backdrop, wrap the content in `<Stop kind="hero" …>`. The world builds one landmark per `Stop` on the page.
2. In `src/data/nav.ts`, change `'/#games'` to `'/games'`.

## Motion and accessibility

- **One loop:** a single rAF loop (`gsap.ticker`) drives Lenis, ScrollTrigger, the tilt cards and the Three.js render.
- **Reversible:** all scroll motion is scrubbed, so scrolling up flies you backwards.
- **Reduced motion:** with `prefers-reduced-motion: reduce` there is no Lenis, no flying, no parallax and no tilt. Each stop shows a still 3D frame, and all panels are fully visible.
- **Phones (under 768px):** a lighter world (fewer clouds and bubbles, lower resolution), no hover effects, and no HUD map.
- **Pausing:** rendering stops when the tab is hidden, and every GPU resource is disposed on page exit.
- **No WebGL:** the CSS sky gradient stays as the backdrop and all content still works.

## Deploy to Vercel

1. Push this folder to a new GitHub repo.
2. In Vercel, choose **Add New → Project → Import** the repo. Vercel detects Astro (build `npm run build`, output `dist`). No `vercel.json` or env vars are needed.
3. Set your real URL in `astro.config.mjs` (`site:`) so canonical and Open Graph links are correct.

Not affiliated with Roblox Corporation. No Roblox logos or brand assets are used.

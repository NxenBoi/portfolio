/**
 * Site entry, loaded once by BaseLayout.
 *
 * gsap.matchMedia() re-runs the setup whenever reduced-motion or the
 * mobile/desktop breakpoint changes, and reverts every tween and
 * ScrollTrigger made inside it, so each mode starts clean.
 */
import { gsap, ScrollTrigger } from './lib/gsap';
import { startLenis, stopLenis } from './lib/lenis';
import { conditions, type MotionContext } from './lib/motion';
import { initNavMenu, initNavHide } from './animations/nav';
import { initJourney, readStops, WorldController } from './animations/journey';
import { initTilt } from './animations/tilt';
import { initCopy } from './animations/contact';

// One-time, motion-independent behaviour.
initNavMenu();
initCopy();

const { els, defs } = readStops();
const canvas = document.querySelector<HTMLCanvasElement>('[data-world-canvas]');
const world = canvas && defs.length ? new WorldController(canvas, defs) : null;

const mm = gsap.matchMedia();
mm.add(conditions, (ctx) => {
  const c = ctx.conditions as MotionContext;
  const cleanups: Array<(() => void) | void> = [];

  if (c.motion) startLenis();
  cleanups.push(initNavHide(c));
  cleanups.push(initJourney(c, els, world));
  cleanups.push(initTilt(document.body, c));

  return () => {
    stopLenis();
    cleanups.forEach((fn) => fn?.());
  };
});

// Web fonts change text metrics, so measure trigger positions again once they load.
document.fonts?.ready.then(() => ScrollTrigger.refresh());

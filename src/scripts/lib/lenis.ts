/**
 * Lenis smooth scrolling, driven by GSAP's ticker (no second rAF loop) and
 * feeding ScrollTrigger. Disabled entirely under prefers-reduced-motion.
 */
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

let lenis: Lenis | null = null;
let tick: ((time: number) => void) | null = null;

export function startLenis(): Lenis {
  if (lenis) return lenis;
  lenis = new Lenis({
    autoRaf: false,
    lerp: 0.1,
    // Let Lenis handle in-page anchor links (#work, #contact…), offset by the nav.
    anchors: { offset: 0 },
  });
  lenis.on('scroll', ScrollTrigger.update);
  tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  return lenis;
}

export function stopLenis(): void {
  if (tick) gsap.ticker.remove(tick);
  lenis?.destroy();
  lenis = null;
  tick = null;
}

export const getLenis = (): Lenis | null => lenis;

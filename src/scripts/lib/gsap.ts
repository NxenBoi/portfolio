/**
 * GSAP setup. gsap.ticker is the ONE shared requestAnimationFrame loop for
 * the whole site: Lenis, ScrollTrigger, the tilt cards and the Three.js
 * render all hang off it.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Scroll-driven work must never "catch up" after a hitch. Keep frames 1:1.
gsap.ticker.lagSmoothing(0);
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };

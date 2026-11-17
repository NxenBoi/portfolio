/**
 * The journey: maps scroll position → a fractional stop index that the 3D
 * camera follows, drives the HUD, and scrubs each content panel in from depth
 * and out past the camera. Everything is scrubbed, so scrolling back up
 * flies you backwards and every panel returns to where it was.
 */
import { gsap, ScrollTrigger } from '../lib/gsap';
import { matches, MQ, type MotionContext } from '../lib/motion';
import type { StopDef, World } from '../three/world';


export function readStops(): { els: HTMLElement[]; defs: StopDef[] } {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-stop]'));
  const defs = els.map((el) => ({
    kind: (el.dataset.stop ?? 'hero') as StopDef['kind'],
    side: (el.dataset.side ?? 'left') as StopDef['side'],
    image: el.dataset.image ?? '',
    title: el.dataset.title ?? '',
  }));
  return { els, defs };
}

/** Owns the lazily loaded world so timelines can talk to it before it exists. */
export class WorldController {
  private world: World | null = null;
  private journey = 0;
  private motion = true;
  private parallax = false;

  constructor(canvas: HTMLCanvasElement, defs: StopDef[]) {
    // Fonts first (placeholder screens draw text), then Three.js in its own chunk.
    Promise.all([document.fonts?.ready, import('../three/world')])
      .then(([, { createWorld }]) => {
        this.world = createWorld(canvas, defs, { lite: matches(MQ.mobile) });
        this.world.setMode(this.motion, this.parallax);
        this.world.setJourney(this.journey);
      })
      .catch((err: unknown) => {
        // No WebGL: the CSS sky gradient remains as the backdrop.
        console.warn('3D world disabled:', err);
      });
    window.addEventListener('pagehide', (e) => {
      if (!e.persisted) this.destroy();
    });
  }

  setJourney(j: number): void {
    this.journey = j;
    this.world?.setJourney(j);
  }

  setMode(motion: boolean, parallax: boolean): void {
    this.motion = motion;
    this.parallax = parallax;
    this.world?.setMode(motion, parallax);
  }

  destroy(): void {
    this.world?.destroy();
    this.world = null;
  }
}

export function initJourney(c: MotionContext, els: HTMLElement[], world: WorldController | null): () => void {
  const n = els.length;
  world?.setMode(c.motion, c.motion && c.finePointer);

  // ---- HUD ------------------------------------------------------------------
  const fill = document.querySelector<HTMLElement>('[data-hud-fill]');
  const hudStops = Array.from(document.querySelectorAll<HTMLElement>('[data-hud-stop]'));
  let active = -1;
  const setHud = (j: number) => {
    if (fill) gsap.set(fill, { scaleY: n > 1 ? j / (n - 1) : 1 });
    const i = Math.round(j);
    if (i === active) return;
    active = i;
    hudStops.forEach((link, k) => {
      if (k === i) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
  };

  // ---- Scroll → journey ---------------------------------------------------------
  // Stop k is "reached" when its centre crosses the middle of the viewport.
  let centers: number[] = [];
  const measure = () => {
    centers = els.map((el) => {
      const r = el.getBoundingClientRect();
      return r.top + window.scrollY + r.height / 2;
    });
  };
  // Phones: arrive while the panel is in the lower part of the screen, so the
  // landmark is framed above it.
  const focus = c.mobile ? 0.75 : 0.5;
  const journeyAt = (scroll: number) => {
    const mid = scroll + window.innerHeight * focus;
    if (!centers.length || mid <= (centers[0] ?? 0)) return 0;
    for (let k = 0; k < n - 1; k++) {
      const a = centers[k] ?? 0;
      const b = centers[k + 1] ?? a;
      if (mid <= b) return k + (b > a ? (mid - a) / (b - a) : 0);
    }
    return n - 1;
  };
  const apply = (scroll: number) => {
    let j = journeyAt(scroll);
    // Reduced motion: jump between still frames instead of flying.
    if (!c.motion) j = Math.round(j);
    world?.setJourney(j);
    setHud(j);
  };

  measure();
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => apply(self.scroll()),
    onRefresh: (self) => {
      measure();
      apply(self.scroll());
    },
  });
  apply(window.scrollY);

  if (!c.motion) return () => {};

  // ---- Panels: fly in from depth, fly out past the camera ------------------------
  els.forEach((el, k) => {
    const enter = el.querySelector<HTMLElement>('[data-enter]');
    const exit = el.querySelector<HTMLElement>('[data-exit]');
    const side = el.dataset.side;
    const turn = side === 'left' ? 1 : side === 'right' ? -1 : 0;

    if (enter && k > 0) {
      gsap.fromTo(
        enter,
        { opacity: 0, y: 140, z: -400, rotationY: turn * 22, rotationX: turn ? 0 : 14, transformPerspective: 1400 },
        {
          opacity: 1,
          y: 0,
          z: 0,
          rotationY: 0,
          rotationX: 0,
          ease: 'none',
          scrollTrigger: { trigger: enter, start: 'clamp(top 100%)', end: 'clamp(top 68%)', scrub: 0.6 },
        },
      );
    }
    if (exit && k < n - 1) {
      gsap.fromTo(
        exit,
        { opacity: 1, y: 0, scale: 1, rotationY: 0 },
        {
          opacity: 0,
          y: -120,
          scale: 1.12,
          rotationY: -turn * 16,
          transformPerspective: 1400,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: { trigger: exit, start: 'bottom 45%', end: 'bottom 0%', scrub: 0.6 },
        },
      );
    }

    // Staggered cards inside a panel (promises).
    el.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
      const items = group.querySelectorAll<HTMLElement>('[data-reveal-item]');
      if (!items.length) return;
      gsap.fromTo(
        items,
        { opacity: 0, y: 60, rotationX: -18, transformPerspective: 900 },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: group, start: 'clamp(top 92%)', end: 'clamp(top 50%)', scrub: 0.6 },
        },
      );
    });
  });

  // Scroll hint fades as soon as the journey starts.
  const hint = document.querySelector<HTMLElement>('[data-scroll-hint]');
  if (hint) {
    gsap.fromTo(hint, { opacity: 1 }, { opacity: 0, ease: 'none', scrollTrigger: { start: 0, end: 200, scrub: true } });
  }

  // Hero copy staggers in on load (time-based, once).
  const first = els[0];
  if (first) {
    gsap.fromTo(
      first.querySelectorAll('[data-load-reveal]'),
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.2 },
    );
  }

  return () => {};
}

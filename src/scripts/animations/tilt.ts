/**
 * 3D tilt + glare for [data-tilt] cards. Only on hover-capable pointers and
 * without reduced motion. Animates transforms only (the glare is a large
 * radial layer that is translated, not repainted).
 */
import { gsap } from '../lib/gsap';
import type { MotionContext } from '../lib/motion';

const MAX_DEG = 10;

export function initTilt(scope: Element, c: MotionContext): (() => void) | void {
  if (!c.motion || !c.finePointer) return;

  const cleanups: Array<() => void> = [];

  scope.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    const inner = card.querySelector<HTMLElement>('[data-tilt-inner]');
    const glare = card.querySelector<HTMLElement>('.tilt__glare');
    if (!inner) return;

    gsap.set(inner, { transformPerspective: 900 });
    const rx = gsap.quickTo(inner, 'rotationX', { duration: 0.5, ease: 'power3.out' });
    const ry = gsap.quickTo(inner, 'rotationY', { duration: 0.5, ease: 'power3.out' });
    const gx = glare ? gsap.quickTo(glare, 'xPercent', { duration: 0.4, ease: 'power3.out' }) : null;
    const gy = glare ? gsap.quickTo(glare, 'yPercent', { duration: 0.4, ease: 'power3.out' }) : null;

    const onMove = (e: PointerEvent) => {
      const r = inner.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 … 0.5
      const py = (e.clientY - r.top) / r.height - 0.5;
      rx(-py * MAX_DEG * 2);
      ry(px * MAX_DEG * 2);
      gx?.(px * 50);
      gy?.(py * 50);
    };
    const onEnter = () => card.classList.add('is-tilting');
    const onLeave = () => {
      card.classList.remove('is-tilting');
      rx(0);
      ry(0);
      gx?.(0);
      gy?.(0);
    };

    card.addEventListener('pointerenter', onEnter);
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);
    cleanups.push(() => {
      card.removeEventListener('pointerenter', onEnter);
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerleave', onLeave);
      card.classList.remove('is-tilting');
      gsap.set([inner, glare].filter(Boolean), { clearProps: 'transform' });
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

import { ScrollTrigger } from '../lib/gsap';
import type { MotionContext } from '../lib/motion';

const nav = () => document.querySelector<HTMLElement>('[data-nav]');

/** Mobile menu disclosure. Runs once, independent of motion settings. */
export function initNavMenu(): void {
  const el = nav();
  const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-nav-menu]');
  if (!el || !toggle || !menu) return;

  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    if (open) el.classList.remove('is-hidden');
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
  // Keyboard users tabbing into the nav always see it.
  el.addEventListener('focusin', () => el.classList.remove('is-hidden'));
}

/** Hide on scroll down, show on scroll up. Off under reduced motion. */
export function initNavHide(c: MotionContext): (() => void) | void {
  const el = nav();
  if (!el || !c.motion) return;

  const menuOpen = () => document.querySelector('[data-nav-menu]')?.classList.contains('is-open');

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate(self) {
      const hide = self.scroll() > 120 && self.direction === 1 && !menuOpen();
      el.classList.toggle('is-hidden', hide);
    },
  });

  return () => el.classList.remove('is-hidden');
}

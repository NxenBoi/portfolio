/** Media queries shared by every animation module. */
export const MQ = {
  reduce: '(prefers-reduced-motion: reduce)',
  motion: '(prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 767px)',
  desktop: '(min-width: 768px)',
  /** A real mouse/trackpad. Hover-only effects are gated on this. */
  finePointer: '(hover: hover) and (pointer: fine)',
} as const;

export const matches = (q: string): boolean => window.matchMedia(q).matches;

/** Conditions object passed to gsap.matchMedia().add(). */
export const conditions = {
  motion: MQ.motion,
  reduce: MQ.reduce,
  desktop: MQ.desktop,
  mobile: MQ.mobile,
  finePointer: MQ.finePointer,
};

export type MotionContext = {
  motion: boolean;
  reduce: boolean;
  desktop: boolean;
  mobile: boolean;
  finePointer: boolean;
};

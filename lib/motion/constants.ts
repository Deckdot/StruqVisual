/**
 * Struq motion constants — single source of truth for all animation timings and easings.
 *
 * Timing scale:
 *   micro   (hover / tab / icon toggle)  150ms
 *   quick   (dropdown / tooltip)         200ms
 *   base    (modal overlay / fade)       220ms
 *   content (card entry / list stagger)  280ms
 *   page    (route transition)           300ms
 *   smooth  (sheet / slide panel)        350ms
 *
 * Never use raw numbers in motion code — import from here.
 */

export const DURATION = {
  micro: 0.15,
  quick: 0.2,
  base: 0.22,
  content: 0.28,
  page: 0.3,
  smooth: 0.35,
} as const;

export const EASING = {
  out: 'easeOut',
  in: 'easeIn',
  inOut: 'easeInOut',
  /** Snappy spring-like deceleration — good for entrances */
  expo: [0.16, 1, 0.3, 1] as [number, number, number, number],
} as const;

/** Framer Motion spring preset for interactive elements (hover, tap). */
export const SPRING = {
  stiff: { type: 'spring', stiffness: 300, damping: 25 } as const,
  soft: { type: 'spring', stiffness: 120, damping: 14 } as const,
} as const;

/** Stagger gap between list/grid children. Keep ≤ 12 children for <500ms total. */
export const STAGGER_GAP = 0.04;

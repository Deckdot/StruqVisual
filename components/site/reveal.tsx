'use client';

import { createElement, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { gsap, useGSAP, EASE_OUT } from '@/components/site/motion';

interface RevealProps {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  /** Vertical travel in px. */
  y?: number;
  delay?: number;
  /** When > 0, direct children animate in sequence instead of the block. */
  stagger?: number;
  start?: string;
  id?: string;
}

/**
 * Scroll entrance: opacity + y together (never opacity alone).
 * With `stagger`, the wrapper is lifted and its direct children cascade.
 */
export function Reveal({
  as: Tag = 'div',
  className,
  style,
  children,
  y = 36,
  delay = 0,
  stagger = 0,
  start = 'top 85%',
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          motionOk: '(prefers-reduced-motion: no-preference)',
          motionOff: '(prefers-reduced-motion: reduce)',
        },
        (ctx) => {
          if (ctx.conditions?.motionOff) {
            gsap.set(el, { autoAlpha: 1 });
            return;
          }

          const targets: Element[] | HTMLElement =
            stagger > 0 ? Array.from(el.children) : el;

          if (stagger > 0) {
            gsap.set(el, { autoAlpha: 1 });
          }

          gsap.fromTo(
            targets,
            { autoAlpha: 0, y },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: EASE_OUT,
              delay,
              stagger: stagger > 0 ? stagger : 0,
              scrollTrigger: {
                trigger: el,
                start,
                once: true,
              },
            }
          );
        }
      );

      // Tear down the global matchMedia conditions on unmount so a later
      // ScrollTrigger.refresh() (curtain nav) can't re-run them against a stale DOM.
      return () => mm.revert();
    },
    { scope: ref }
  );

  // createElement keeps the polymorphic tag + ref combination type-safe.
  return createElement(
    Tag,
    { ref, id, style, className, 'data-sq-reveal': true } as Record<string, unknown>,
    children
  );
}

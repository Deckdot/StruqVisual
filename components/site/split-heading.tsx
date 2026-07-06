'use client';

import { createElement, useRef, type ElementType, type ReactNode } from 'react';
import { gsap, useGSAP, SplitText, EASE_OUT } from '@/components/site/motion';

interface SplitHeadingProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** Seconds before the line reveal starts once triggered. */
  delay?: number;
  /** ScrollTrigger start position. */
  start?: string;
  id?: string;
}

/**
 * Masked line-by-line heading reveal (SplitText).
 * The element ships hidden via [data-sq-reveal]; onSplit lifts it and slides
 * the lines out of their clip masks.
 */
export function SplitHeading({
  as: Tag = 'h2',
  className,
  children,
  delay = 0,
  start = 'top 85%',
  id,
}: SplitHeadingProps) {
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
            gsap.set(el, { opacity: 1 });
            return;
          }

          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            linesClass: 'line',
            onSplit(self) {
              gsap.set(el, { opacity: 1 });
              return gsap.from(self.lines, {
                yPercent: 115,
                duration: 1.05,
                ease: EASE_OUT,
                stagger: 0.09,
                delay,
                scrollTrigger: {
                  trigger: el,
                  start,
                  once: true,
                },
              });
            },
          });
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
    {
      ref,
      id,
      'data-sq-reveal': true,
      className: `sq-split-mask ${className ?? ''}`,
    } as Record<string, unknown>,
    children
  );
}

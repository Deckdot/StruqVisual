'use client';

// components/dashboard/dashboard-reveal.tsx
//
// Fast, premium, agency-grade staggered entrance for dashboard content. The
// curtain (DashboardEntrance) lifts to expose an already-painted page, then
// dispatches `DASHBOARD_REVEAL_EVENT`; this layer brings the content blocks up
// in a quick stagger in the curtain's wake, so the reveal reads as choreographed
// rather than a hard swap.
//
// App register: quick (each block ~0.5s, 0.06s stagger), short travel, expo-out
// so velocity is front-loaded and the settle feels expensive.
//
// Blocks to stagger are marked with `data-reveal`; if none are marked it falls
// back to the direct children of the root.

import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/components/site/motion';
import { DASHBOARD_REVEAL_EVENT, type DashboardRevealDetail } from '@/lib/handoff';

export function DashboardReveal({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const collect = () => {
        const marked = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('[data-reveal]'));
        return marked.length ? marked : gsap.utils.toArray<HTMLElement>(el.children);
      };

      const reduce = prefersReducedMotion();

      const run = () => {
        const targets = collect();
        if (!targets.length) return;
        if (reduce) {
          gsap.from(targets, { autoAlpha: 0, duration: 0.2, stagger: 0.02, clearProps: 'all' });
          return;
        }
        gsap.set(targets, { willChange: 'transform, opacity' });
        gsap.from(targets, {
          autoAlpha: 0,
          y: 18,
          duration: 0.5,
          ease: 'expo.out',
          stagger: 0.06,
          clearProps: 'all',
        });
      };

      // Hide the blocks up-front so nothing flashes before the curtain fires the
      // reveal. (Fallback timer runs the reveal even if the event never lands —
      // e.g. a direct visit where the curtain already cleared.)
      const targets = collect();
      if (targets.length && !reduce) gsap.set(targets, { autoAlpha: 0 });

      let done = false;
      const fire = () => {
        if (done) return;
        done = true;
        window.removeEventListener(DASHBOARD_REVEAL_EVENT, onReveal as EventListener);
        run();
      };
      const onReveal = (_e: CustomEvent<DashboardRevealDetail>) => fire();

      window.addEventListener(DASHBOARD_REVEAL_EVENT, onReveal as EventListener, { once: true });
      // Safety fallback: if the curtain event never arrives, reveal anyway.
      const fallback = window.setTimeout(fire, 900);

      return () => {
        window.clearTimeout(fallback);
        window.removeEventListener(DASHBOARD_REVEAL_EVENT, onReveal as EventListener);
      };
    },
    { scope: root }
  );

  return (
    <div ref={root} className="contents">
      {children}
    </div>
  );
}

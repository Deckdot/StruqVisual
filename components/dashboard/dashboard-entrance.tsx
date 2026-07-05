'use client';

// components/dashboard/dashboard-entrance.tsx
//
// The receiving half of the auth → dashboard handoff, and the guarantee that
// the dashboard is NEVER seen mid-build. It renders a full-screen curtain that
// is opaque from the very first paint (inline style, before hydration), so the
// app shell — sidebar, panels, header — assembles entirely behind it. The
// curtain only clears once the real content is painted underneath.
//
// Two entry modes:
//   • from login  → the curtain starts in the shared warm wash, seamlessly
//     taking over from auth's held bloom, then reveals with a wipe-up.
//   • direct/refresh → a short, quiet cover in the app canvas color that
//     reveals immediately, so a hard refresh on /dashboard is never a raw cut.
//
// App register: fast (≤ ~0.7s total), no parallax, no theatrics.

import { useRef, useState } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/components/site/motion';
import { consumeHandoff, HANDOFF_WASH } from '@/lib/handoff';

// The app canvas floor color (matches `--color-canvas`, light) for the
// direct-visit curtain. Concrete value: this overlay sits above themed wrappers.
const CANVAS_LIGHT = '#fbf8f2';

export function DashboardEntrance() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  // Resolve the mode once, synchronously on first render, so the initial paint
  // already carries the right curtain color (no flash between modes).
  const fromLogin = useRef<boolean | null>(null);
  if (fromLogin.current === null) {
    fromLogin.current = consumeHandoff();
  }
  const cameFromLogin = fromLogin.current;

  useGSAP(
    () => {
      const layer = root.current;
      if (!layer) return;

      const reduce = prefersReducedMotion();

      // Let the dashboard paint under the (already-opaque) curtain for a couple
      // of frames before we reveal — this is what prevents a raw/empty frame.
      const settle = cameFromLogin ? 0.18 : 0.08;

      if (reduce) {
        gsap.to(layer, {
          autoAlpha: 0,
          delay: settle,
          duration: 0.25,
          onComplete: () => setDone(true),
        });
        return;
      }

      const tl = gsap.timeline({
        delay: settle,
        onComplete: () => setDone(true),
      });

      if (cameFromLogin) {
        // Seamless takeover: hold the warm wash one more beat (the eye reads it
        // as one continuous surface from auth), then wipe up to reveal.
        tl.to(layer, { autoAlpha: 1, duration: 0.15 }); // ensure fully covering
        tl.to(layer, {
          yPercent: -100,
          duration: 0.7,
          ease: 'power4.inOut',
        });
      } else {
        // Direct visit / refresh: quick, quiet reveal — no drama on a tool.
        tl.to(layer, {
          yPercent: -100,
          duration: 0.5,
          ease: 'power3.inOut',
        });
      }
    },
    { scope: root }
  );

  if (done) return null;

  return (
    <div
      ref={root}
      className="pointer-events-none fixed inset-0 z-[9999]"
      // Opaque from the first paint — SSR-safe, hydration-safe. The shell builds
      // entirely behind this; the user never sees a wireframe or partial layout.
      style={{ background: cameFromLogin ? HANDOFF_WASH : CANVAS_LIGHT }}
      aria-hidden="true"
    />
  );
}

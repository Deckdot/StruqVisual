'use client';

// app/template.tsx
//
// Per-navigation entrance layer. `template.tsx` re-mounts on every route change
// (unlike layout.tsx), so it's where the *revealed* page gets a subtle entrance
// that overlaps the curtain reveal — content rises in the cover's wake instead
// of popping in cold.
//
// Zone-aware, because auth and the dashboard own their own choreography:
//   • marketing paths → expressive entrance (y+fade, 0.8s) + ScrollTrigger.refresh
//   • /auth           → NO entrance (the AuthClient runs its own cinematic intro)
//   • dashboard/vault → fast, functional app entrance (fade, 0.25s)
//
// The two non-obvious, load-bearing details from the page-flow spec:
//   • clearProps:"all" — a leftover transform makes this wrapper a containing
//     block for position:fixed, silently breaking ScrollTrigger pins inside.
//   • ScrollTrigger.refresh() on complete — triggers measured mid-entrance are
//     wrong; refresh re-measures against the settled layout.

import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useGSAP, gsap, ScrollTrigger, prefersReducedMotion } from '@/components/site/motion';

const APP_PREFIXES = ['/dashboard', '/vault'];

export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      // Auth owns a full cinematic intro + exit — never double-animate it.
      if (pathname.startsWith('/auth')) return;

      const el = ref.current;
      if (!el) return;

      const reduce = prefersReducedMotion();
      const isApp = APP_PREFIXES.some((p) => pathname.startsWith(p));

      if (reduce) {
        gsap.from(el, { opacity: 0, duration: 0.3, clearProps: 'all' });
        return;
      }

      if (isApp) {
        // App register: fast, functional, no travel drama.
        gsap.from(el, {
          opacity: 0,
          duration: 0.25,
          ease: 'power1.out',
          clearProps: 'all',
        });
        return;
      }

      // Marketing register: expressive, rises in the curtain's wake.
      gsap.from(el, {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'all',
        onComplete: () => ScrollTrigger.refresh(),
      });
    },
    { scope: ref, dependencies: [pathname] }
  );

  return <div ref={ref}>{children}</div>;
}

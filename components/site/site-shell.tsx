'use client';

import { useCallback, useEffect, useState } from 'react';
import { ScrollProvider } from '@/components/site/motion';
import { SiteNavbar } from '@/components/site/navbar';
import { SiteFooter } from '@/components/site/footer';
import { LoaderCounter } from '@/components/site/loaders/loader-counter';

export type SiteTheme = 'light' | 'dark';

const THEME_KEY = 'sq-theme';

/**
 * Marketing shell: scoped design tokens (.sq), light-first theme with a
 * persisted dark option, Lenis + GSAP wiring, navbar and footer.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<SiteTheme>('light');

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(THEME_KEY);
      if (stored === 'dark') setTheme('dark');
    } catch {
      // Storage unavailable: stay on light.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: SiteTheme = current === 'light' ? 'dark' : 'light';
      try {
        window.localStorage.setItem(THEME_KEY, next);
      } catch {
        // Ignore storage failures.
      }
      return next;
    });
  }, []);

  return (
    <div className="sq min-h-dvh flex flex-col" data-theme={theme === 'dark' ? 'dark' : undefined}>
      {/* First-load intro — session-gated, plays once, reveals the finished page */}
      <LoaderCounter id="intro" />
      <ScrollProvider>
        <a
          href="#sq-main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] sq-btn sq-btn-primary"
        >
          Naar inhoud
        </a>
        <SiteNavbar theme={theme} onToggleTheme={toggleTheme} />
        <main id="sq-main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </ScrollProvider>
    </div>
  );
}

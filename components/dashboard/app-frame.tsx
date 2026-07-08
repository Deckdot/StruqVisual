'use client';

import { usePathname } from 'next/navigation';
import { navItemForPath } from '@/components/dashboard/nav-items';
import { GlobalSearch } from '@/components/dashboard/global-search';

/**
 * The main workspace panel (DesignOS pattern): a floating rounded surface
 * with the page header inside it — icon + title/subtitle left, global
 * search right — and a scrolling content area below.
 */
/**
 * Routes that opt out of the centered max-w-6xl content well and render their
 * children edge-to-edge. The Recept-bouwer needs the full floor for its rail +
 * live-preview composition (handoff D7). The header stays for every route.
 */
const FULL_BLEED_ROUTES = ['/recept'];

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const item = navItemForPath(pathname);
  const Icon = item.icon;
  const fullBleed = FULL_BLEED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  return (
    <main className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
      <header className="z-30 flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-8 sm:py-5">
        <div className="flex min-w-0 items-center gap-4">
          <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-panel text-primary-text sm:flex">
            <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-medium tracking-wide text-primary-text">{item.label}</h1>
            <p className="hidden truncate text-sm text-secondary-text/80 md:block">{item.subtitle}</p>
          </div>
        </div>
        <GlobalSearch />
      </header>

      <div className="flex-1 overflow-y-auto">
        {fullBleed ? (
          <div className="h-full">{children}</div>
        ) : (
          <div className="mx-auto w-full max-w-6xl px-5 py-7 sm:px-8 sm:py-9">{children}</div>
        )}
      </div>
    </main>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';
import { NAV_ITEMS } from '@/components/dashboard/nav-items';
import { useMaturity } from '@/components/maturity-provider';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

/**
 * Slim icon-only sidebar as a floating panel (DesignOS pattern).
 * Desktop only; mobile uses BottomNav — never the same component.
 */
export function Sidebar() {
  const pathname = usePathname();
  const { canSee } = useMaturity();
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const items = NAV_ITEMS.filter((item) => !item.surface || canSee(item.surface));

  return (
    <aside
      aria-label="Dashboardnavigatie"
      className="hidden w-[4.75rem] shrink-0 flex-col items-center rounded-2xl border border-border bg-background py-6 shadow-sm lg:flex"
    >
      <Link
        href="/"
        title="Naar de site"
        className="mb-10 flex h-11 w-11 items-center justify-center rounded-xl text-xl font-semibold text-primary-text transition-transform duration-200 hover:scale-105"
      >
        s<span className="text-accent">.</span>
      </Link>

      <nav aria-label="Hoofdnavigatie" className="flex w-full flex-1 flex-col items-center gap-2 px-2">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'group flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
                active
                  ? 'border border-border bg-panel text-primary-text'
                  : 'text-secondary-text/70 hover:bg-panel-hover hover:text-primary-text'
              )}
            >
              <Icon
                className="h-5 w-5 transition-transform duration-200 group-hover:scale-105"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span className="sr-only">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          title={isDark ? 'Licht thema' : 'Donker thema'}
          aria-label={isDark ? 'Schakel naar licht thema' : 'Schakel naar donker thema'}
          className="flex h-12 w-12 items-center justify-center rounded-xl text-secondary-text/70 transition-colors duration-200 hover:bg-panel-hover hover:text-primary-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          {isDark ? <Sun className="h-5 w-5" strokeWidth={1.75} /> : <Moon className="h-5 w-5" strokeWidth={1.75} />}
        </button>

        <div className="relative" title="Gast">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-panel text-sm font-medium text-secondary-text">
            G
          </span>
          <span
            className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-accent"
            aria-hidden="true"
          />
        </div>
      </div>
    </aside>
  );
}

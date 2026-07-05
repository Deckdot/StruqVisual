'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/components/dashboard/nav-items';
import { useMaturity } from '@/components/maturity-provider';
import { cn } from '@/lib/utils';

/** Mobile navigation: fixed bottom bar, thumb-friendly ≥44px targets. */
export function BottomNav() {
  const pathname = usePathname();
  const { canSee } = useMaturity();

  const items = NAV_ITEMS.filter((item) => !item.surface || canSee(item.surface));

  return (
    <nav
      aria-label="Hoofdnavigatie"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-canvas/95 backdrop-blur-sm lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-[11px] font-medium transition-colors duration-150',
                active ? 'text-primary-text' : 'text-secondary-text/70'
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

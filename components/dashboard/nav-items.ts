import { GraduationCap, LayoutGrid, Package, Vault, type LucideIcon } from 'lucide-react';
import type { Surface } from '@/components/maturity-provider';

/**
 * Single source of truth for dashboard navigation. Sidebar, bottom nav and
 * the app-frame header all read this list; disclosure-gated items carry the
 * surface they belong to and only render once `canSee(surface)` is true.
 */
export type NavItem = {
  href: string;
  label: string;
  subtitle: string;
  icon: LucideIcon;
  /** When set, the item is hidden until the maturity provider reveals it. */
  surface?: Surface;
};

export const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Home', subtitle: 'Jouw startpunt: kies, bewaar, bouw', icon: LayoutGrid },
  { href: '/vault', label: 'Bibliotheek', subtitle: 'Paletten, typografie, secties, design systems en media', icon: Vault },
  { href: '/learn', label: 'Learn', subtitle: 'Korte lessen over smaak en bouwen met AI', icon: GraduationCap },
  { href: '/kits', label: 'Kits', subtitle: 'Bundels die je AI in één keer richting geven', icon: Package, surface: 'kits' },
];

export function navItemForPath(pathname: string): NavItem {
  return (
    NAV_ITEMS.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) ?? NAV_ITEMS[0]
  );
}

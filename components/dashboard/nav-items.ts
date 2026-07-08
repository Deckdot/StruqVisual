import { GraduationCap, LayoutGrid, Shapes, Vault, Wand2, type LucideIcon } from 'lucide-react';
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
  { href: '/canon', label: 'Canon', subtitle: 'De curated smaakcanon: recepten, kleur, typografie, iconen en meer', icon: Shapes },
  { href: '/learn', label: 'Learn', subtitle: 'Korte lessen over smaak en bouwen met AI', icon: GraduationCap },
  // Recept-bouwer: the flagship creation surface. Ships ungated (disclosure level 0) —
  // it is itself the fastest route to first value (open → beautiful site → click →
  // it reacts). It takes over the old /kits nav seat; the kits tables stay (a saved
  // recept maps 1:1 onto a future kits row). See handoff D2/D6.
  { href: '/recept', label: 'Recept', subtitle: 'Stel je richting samen en zie een site live meebewegen', icon: Wand2 },
];

export function navItemForPath(pathname: string): NavItem {
  return (
    NAV_ITEMS.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) ?? NAV_ITEMS[0]
  );
}

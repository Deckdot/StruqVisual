import type { Metadata } from 'next';
import { MaturityProvider } from '@/components/maturity-provider';
import { Sidebar } from '@/components/dashboard/sidebar';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { AppFrame } from '@/components/dashboard/app-frame';
import { DashboardEntrance } from '@/components/dashboard/dashboard-entrance';
import { SavedAssetsProvider } from '@/components/providers/saved-assets-provider';
import { getSessionUser } from '@/lib/auth/session';
import { getFavorites } from '@/lib/db/repository';

export const metadata: Metadata = {
  title: 'Dashboard | Struq',
  robots: { index: false, follow: false },
};

/**
 * App shell (app register: 120–220ms motion, no Lenis, no parallax).
 * Floating panels on the canvas floor (DesignOS pattern): slim icon sidebar
 * + workspace panel. Mobile: full-bleed panel + fixed bottom nav.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getSessionUser();
  const initialSavedIds = viewer ? await getFavorites(viewer.id) : [];

  return (
    <SavedAssetsProvider initialSavedIds={initialSavedIds} userId={viewer?.id ?? null}>
      <MaturityProvider>
        <div className="flex h-svh w-full gap-3 overflow-hidden bg-canvas p-3 pb-16 text-foreground lg:gap-4 lg:p-4 lg:pb-4">
          <Sidebar />
          <AppFrame>{children}</AppFrame>
          <BottomNav />
        </div>
        {/* Covers the shell until it's painted; reveals from the auth handoff wash. */}
        <DashboardEntrance />
      </MaturityProvider>
    </SavedAssetsProvider>
  );
}

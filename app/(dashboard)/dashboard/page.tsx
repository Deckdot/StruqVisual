import { DashboardHome } from '@/components/dashboard/dashboard-home';
import { getSessionUser } from '@/lib/auth/session';
import { getAssetsByProvenance } from '@/lib/db/repository';
import type { PaletteData } from '@/lib/vault/types';

// Reads live DB content — never prerender at build time.
export const dynamic = 'force-dynamic';

// Featured strip by stable provenance id (survives UUID churn across re-imports).
const FEATURED_PROVENANCE = [
  'canon:palette:graphite-ivory',
  'canon:typography:editorial-sans-precision',
  'canon:design_system:editorial-restrained',
  'canon:section:hero',
];

// Server component: loads the featured strip from Postgres and prop-drills it
// to the client home (no DEMO_ASSETS import).
export default async function DashboardPage() {
  const viewer = await getSessionUser();
  const featured = await getAssetsByProvenance(FEATURED_PROVENANCE, viewer?.tier ?? 'free');
  const palettes = Object.fromEntries(
    featured.filter((a) => a.type === 'palette').map((a) => [a.slug, a.data as PaletteData])
  );

  return <DashboardHome featured={featured} palettes={palettes} />;
}

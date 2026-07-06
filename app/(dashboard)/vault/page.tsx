import { Suspense } from 'react';
import { VaultBrowser } from '@/components/vault/vault-browser';
import { listAssets } from '@/lib/db/repository';
import type { PaletteData } from '@/lib/vault/types';

// Reads live DB content (and, once M5 lands, per-user saved state) — never
// prerender at build time.
export const dynamic = 'force-dynamic';

// Server component: loads the library from Postgres and prop-drills it to the
// client browser (no DEMO_ASSETS import). Media is included so the ?filter=media
// slice and search work; the browser handles the type/saved/text filtering.
export default async function VaultPage() {
  const assets = await listAssets({ includeMedia: true });
  const palettes = Object.fromEntries(
    assets.filter((a) => a.type === 'palette').map((a) => [a.slug, a.data as PaletteData])
  );

  return (
    <Suspense>
      <VaultBrowser assets={assets} palettes={palettes} />
    </Suspense>
  );
}

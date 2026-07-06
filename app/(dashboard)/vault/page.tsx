import { Suspense } from 'react';
import { VaultBrowser } from '@/components/vault/vault-browser';
import { getSessionUser } from '@/lib/auth/session';
import { getFavorites, listAssets, listVaultAssetsPage } from '@/lib/db/repository';
import type { PaletteData, VaultBrowseFilter } from '@/lib/vault/types';

// Reads live DB content (and, once M5 lands, per-user saved state) — never
// prerender at build time.
export const dynamic = 'force-dynamic';

function readFilter(value: string | string[] | undefined): VaultBrowseFilter {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === 'saved' || raw === 'all') return raw;
  if (raw === 'palette' || raw === 'typography' || raw === 'design_system' || raw === 'section' || raw === 'media') {
    return raw;
  }
  return 'all';
}

// Server component: SSRs page 1 of the library from Postgres and seeds the
// client browser with enough context to continue paginating from the API.
export default async function VaultPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const viewer = await getSessionUser();
  const params = searchParams ? await searchParams : {};
  const filter = readFilter(params.filter);
  const query = (Array.isArray(params.q) ? params.q[0] : params.q ?? '').trim();
  const savedIds = filter === 'saved' && viewer ? await getFavorites(viewer.id) : undefined;
  const initialPage =
    filter === 'saved' && !viewer
      ? null
      : await listVaultAssetsPage({
          filter,
          query,
          savedIds,
          viewerTier: viewer?.tier ?? 'free',
        });
  const paletteAssets = await listAssets({ type: 'palette', limit: 100, viewerTier: viewer?.tier ?? 'free' });
  const palettes = Object.fromEntries(
    paletteAssets.map((asset) => [asset.slug, asset.data as PaletteData])
  );

  return (
    <Suspense>
      <VaultBrowser initialFilter={filter} initialPage={initialPage} initialQuery={query} palettes={palettes} />
    </Suspense>
  );
}

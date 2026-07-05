'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AssetCard } from '@/components/vault/asset-card';
import { TypeFilter, type TypeFilterValue } from '@/components/vault/type-filter';
import { useMaturity } from '@/components/maturity-provider';
import { useSavedAssets } from '@/hooks/use-saved-assets';
import { DEMO_ASSETS } from '@/lib/vault/demo-assets';
import type { PaletteData } from '@/lib/vault/types';

/**
 * The library browse experience. Default view is the full visual gallery —
 * zero configuration needed. Search lives in the app header (GlobalSearch)
 * and arrives here as ?q=; "Bewaard" appears after the first save.
 */

const paletteLookup = (ref: string): PaletteData | undefined =>
  DEMO_ASSETS.find((a) => a.type === 'palette' && a.slug === ref)?.data as PaletteData | undefined;

export function VaultBrowser() {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<TypeFilterValue>(
    (searchParams.get('filter') as TypeFilterValue | null) ?? 'all'
  );
  const query = searchParams.get('q')?.trim().toLowerCase() ?? '';
  const { savedIds } = useSavedAssets();
  const { canSee } = useMaturity();

  // A new header search resets the type slice so results never look empty.
  useEffect(() => {
    if (query) setFilter('all');
  }, [query]);

  const showSaved = canSee('saved-view') || savedIds.length > 0;

  const assets = useMemo(() => {
    let list = DEMO_ASSETS;
    if (filter === 'saved') list = list.filter((a) => savedIds.includes(a.id));
    else if (filter !== 'all') list = list.filter((a) => a.type === filter);

    if (query) {
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query) ||
          a.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    return list;
  }, [filter, query, savedIds]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <TypeFilter value={filter} onChange={setFilter} showSaved={showSaved} savedCount={savedIds.length} />
        {query && (
          <p className="text-sm text-secondary-text/80">
            Resultaten voor &lsquo;{searchParams.get('q')}&rsquo; · {assets.length}
          </p>
        )}
      </div>

      {assets.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} paletteLookup={paletteLookup} />
          ))}
        </div>
      ) : (
        <div className="mt-20 flex flex-col items-center text-center">
          <p className="font-medium text-primary-text">
            {filter === 'saved' ? 'Nog niets bewaard' : 'Niets gevonden'}
          </p>
          <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-secondary-text/90">
            {filter === 'saved'
              ? 'Bewaar een asset met het boekenlegger-icoon en hij staat hier, klaar voor je AI.'
              : 'Probeer een andere zoekterm, of bekijk alles.'}
          </p>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className="mt-6 inline-flex h-9 items-center rounded-lg border border-border px-4 text-sm font-medium text-secondary-text transition-all duration-200 hover:border-primary-text hover:bg-primary-text hover:text-background"
          >
            Bekijk de hele bibliotheek
          </button>
        </div>
      )}
    </div>
  );
}

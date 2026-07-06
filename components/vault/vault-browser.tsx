'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AssetCard } from '@/components/vault/asset-card';
import { SignupNudge } from '@/components/vault/signup-nudge';
import { TypeFilter, type TypeFilterValue } from '@/components/vault/type-filter';
import { useMaturity } from '@/components/maturity-provider';
import { useSavedAssets } from '@/hooks/use-saved-assets';
import type { PaletteData, VaultAsset, VaultAssetsPage, VaultBrowseFilter } from '@/lib/vault/types';

type LoadState = 'idle' | 'loading' | 'loading-more';

/**
 * The library browse experience. Page 1 arrives from the server so the vault
 * paints quickly; every filter/search/load-more step after that goes through
 * the paginated route instead of shipping the whole library into the client.
 */
export function VaultBrowser({
  initialFilter,
  initialPage,
  initialQuery,
  palettes,
}: {
  initialFilter: VaultBrowseFilter;
  initialPage: VaultAssetsPage | null;
  initialQuery: string;
  palettes: Record<string, PaletteData>;
}) {
  const paletteLookup = (ref: string): PaletteData | undefined => palettes[ref];
  const searchParams = useSearchParams();
  const { savedIds, dbMode } = useSavedAssets();
  const { canSee } = useMaturity();
  const [filter, setFilter] = useState<TypeFilterValue>(initialFilter);
  const [pageData, setPageData] = useState<VaultAssetsPage | null>(initialPage);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [error, setError] = useState('');
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const seededInitialRef = useRef(false);
  const requestRef = useRef(0);

  const query = searchParams.get('q')?.trim() ?? initialQuery;
  const savedIdsKey = savedIds.join(',');
  const showSaved = canSee('saved-view') || savedIds.length > 0;
  const items = pageData?.items ?? [];
  const isLoading = loadState === 'loading';
  const isLoadingMore = loadState === 'loading-more';

  useEffect(() => {
    const requested = (searchParams.get('filter') as TypeFilterValue | null) ?? initialFilter;
    setFilter(query ? 'all' : requested);
  }, [initialFilter, query, searchParams]);

  useEffect(() => {
    const shouldSeedInitial =
      !seededInitialRef.current &&
      initialPage &&
      filter === initialFilter &&
      query === initialQuery &&
      !(filter === 'saved' && !dbMode);

    if (shouldSeedInitial) {
      seededInitialRef.current = true;
      setPageData(initialPage);
      setError('');
      setLoadState('idle');
      return;
    }

    const requestId = ++requestRef.current;
    const controller = new AbortController();
    const params = new URLSearchParams({
      filter,
      q: query,
      page: '1',
      limit: '36',
    });

    if (filter === 'saved' && !dbMode && savedIds.length > 0) {
      params.set('savedIds', savedIds.join(','));
    }

    setLoadState('loading');
    setError('');

    fetch(`/api/assets?${params.toString()}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('request failed'))))
      .then((data: VaultAssetsPage) => {
        if (requestRef.current !== requestId) return;
        setPageData(data);
        setLoadState('idle');
      })
      .catch((err: Error) => {
        if (controller.signal.aborted || requestRef.current !== requestId) return;
        setLoadState('idle');
        setError(err.message);
      });

    return () => controller.abort();
  }, [dbMode, filter, initialFilter, initialPage, initialQuery, query, savedIds, savedIdsKey]);

  const loadMore = useCallback(async () => {
    if (!pageData?.hasMore || isLoading || isLoadingMore) return;

    setLoadState('loading-more');
    const params = new URLSearchParams({
      filter,
      q: query,
      page: String(pageData.page + 1),
      limit: String(pageData.limit),
    });

    if (filter === 'saved' && !dbMode && savedIds.length > 0) {
      params.set('savedIds', savedIds.join(','));
    }

    try {
      const res = await fetch(`/api/assets?${params.toString()}`);
      if (!res.ok) throw new Error('request failed');
      const next = (await res.json()) as VaultAssetsPage;
      setPageData((current) =>
        current
          ? {
              ...next,
              items: [...current.items, ...next.items],
            }
          : next
      );
      setLoadState('idle');
    } catch {
      setLoadState('idle');
      setError('Laden lukte even niet.');
    }
  }, [dbMode, filter, isLoading, isLoadingMore, pageData, query, savedIds]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !pageData?.hasMore || isLoading || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        void loadMore();
      },
      { rootMargin: '320px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isLoading, isLoadingMore, loadMore, pageData]);

  return (
    <div>
      {!dbMode && <SignupNudge saveCount={savedIds.length} />}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <TypeFilter value={filter} onChange={setFilter} showSaved={showSaved} savedCount={savedIds.length} />
        {query && (
          <p className="text-sm text-secondary-text/80">
            Resultaten voor &lsquo;{query}&rsquo; · {pageData?.total ?? 0}
          </p>
        )}
      </div>

      {error && (
        <p className="mt-4 text-sm text-secondary-text/90">
          De bibliotheek reageert even niet. Herlaad de pagina en probeer het opnieuw.
        </p>
      )}

      {isLoading && items.length === 0 ? (
        <div className="mt-20 flex flex-col items-center text-center">
          <p className="font-medium text-primary-text">Bibliotheek laden</p>
          <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-secondary-text/90">
            We halen een nieuwe selectie voor je op.
          </p>
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((asset: VaultAsset) => (
              <AssetCard key={asset.id} asset={asset} paletteLookup={paletteLookup} />
            ))}
          </div>

          {(pageData?.hasMore || isLoadingMore) && (
            <div ref={sentinelRef} className="mt-8 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => void loadMore()}
                disabled={isLoadingMore}
                className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium text-secondary-text transition-all duration-200 hover:border-primary-text hover:bg-primary-text hover:text-background disabled:cursor-wait disabled:opacity-70"
              >
                {isLoadingMore ? 'Laden…' : 'Meer laden'}
              </button>
              <p className="text-xs text-secondary-text/75">
                {items.length} van {pageData?.total ?? items.length} assets geladen
              </p>
            </div>
          )}
        </>
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

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Bookmark, BookmarkCheck, Check, Copy, Lock } from 'lucide-react';
import { AssetVisual } from '@/components/vault/visual/asset-visual';
import { useMaturity } from '@/components/maturity-provider';
import { useSavedAssets } from '@/hooks/use-saved-assets';
import { TYPE_META, type PaletteData, type VaultAsset } from '@/lib/vault/types';
import { cn } from '@/lib/utils';

/**
 * One asset, visual first. The preview sits in a padded frame (DesignOS
 * card language); actions are quiet ink, never loud color. Pro assets stay
 * fully visible — the preview teases, only the copy payload is gated.
 *
 * `asset.locked` is server truth (the repository blanked the prompt for a free
 * viewer). When locked, copy becomes a contextual upgrade link, not a nag. When
 * unlocked, the prompt is already in props for an instant copy; we still fetch
 * the entitlement-checked route as a fallback if props were withheld.
 */
export function AssetCard({
  asset,
  paletteLookup,
}: {
  asset: VaultAsset;
  paletteLookup?: (ref: string) => PaletteData | undefined;
}) {
  const { isSaved, toggleSaved } = useSavedAssets();
  const { recordSave, recordCopy } = useMaturity();
  const [copied, setCopied] = useState(false);
  const saved = isSaved(asset.id);
  const locked = asset.locked;

  const handleCopy = async () => {
    if (locked) return;
    try {
      // Prompt is present in props for entitled viewers; fetch the gated route
      // only if it wasn't shipped, so the copy always reflects the server truth.
      const prompt = asset.prompt || (await fetchPrompt(asset.id));
      if (!prompt) return;
      await navigator.clipboard.writeText(prompt);
      recordCopy();
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard/route unavailable — button state simply stays idle
    }
  };

  const handleSave = () => {
    const nowSaved = toggleSaved(asset.id);
    if (nowSaved) recordSave();
  };

  return (
    <article className="group flex flex-col rounded-2xl border border-border bg-card p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[8/5] overflow-hidden rounded-xl border border-border/60">
        <AssetVisual asset={asset} paletteLookup={paletteLookup} />
        {asset.tier === 'pro' && (
          <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-primary-text backdrop-blur-sm">
            <Lock className="h-3 w-3" aria-hidden="true" /> Pro
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-2 pb-1.5 pt-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-meta-text">
              {TYPE_META[asset.type].label}
            </p>
            <h3 className="mt-1 truncate font-medium text-primary-text">{asset.name}</h3>
          </div>
          <button
            type="button"
            onClick={handleSave}
            aria-label={saved ? `${asset.name} verwijderen uit je vault` : `${asset.name} bewaren in je vault`}
            aria-pressed={saved}
            className={cn(
              '-mr-1 -mt-0.5 rounded-lg p-2 transition-colors duration-150 hover:bg-panel-hover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
              saved ? 'text-accent' : 'text-meta-text hover:text-primary-text'
            )}
          >
            {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </button>
        </div>

        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-secondary-text/90">{asset.description}</p>

        {locked ? (
          <Link
            href="/pro"
            className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-border/70 text-[13px] font-medium text-secondary-text transition-all duration-200 hover:border-primary-text hover:bg-primary-text hover:text-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Ontgrendel met Pro
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              'mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border text-[13px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
              copied
                ? 'border-primary-text bg-primary-text text-background'
                : 'border-border text-secondary-text hover:border-primary-text hover:bg-primary-text hover:text-background'
            )}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" aria-hidden="true" /> Gekopieerd
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden="true" /> Kopieer voor je AI
              </>
            )}
          </button>
        )}
      </div>
    </article>
  );
}

/** Entitlement-checked prompt fetch; returns '' on any refusal or error. */
async function fetchPrompt(assetId: string): Promise<string> {
  try {
    const res = await fetch(`/api/assets/${assetId}/prompt`);
    if (!res.ok) return '';
    const data = (await res.json()) as { prompt?: string };
    return data.prompt ?? '';
  } catch {
    return '';
  }
}

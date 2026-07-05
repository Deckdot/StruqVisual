'use client';

import Link from 'next/link';
import { ArrowRight, GraduationCap, Sparkles, Vault } from 'lucide-react';
import { AssetCard } from '@/components/vault/asset-card';
import { useMaturity } from '@/components/maturity-provider';
import { useSavedAssets } from '@/hooks/use-saved-assets';
import { DEMO_ASSETS } from '@/lib/vault/demo-assets';
import type { PaletteData } from '@/lib/vault/types';
import { cn } from '@/lib/utils';

/**
 * Quiet, gallery-like home (Hick's Law: exactly three destinations).
 * The featured strip makes the library the hero (Von Restorff) and puts the
 * first save within one scroll of landing (≤30s principle).
 */

const paletteLookup = (ref: string): PaletteData | undefined =>
  DEMO_ASSETS.find((a) => a.type === 'palette' && a.slug === ref)?.data as PaletteData | undefined;

const FEATURED_IDS = [
  'palette-graphite-ivory',
  'typography-editorial-sans-precision',
  'system-editorial-restrained',
  'section-hero-cinematic',
];

export function DashboardHome() {
  const { savedIds } = useSavedAssets();
  const { level } = useMaturity();

  const featured = DEMO_ASSETS.filter((a) => FEATURED_IDS.includes(a.id));

  const destinations = [
    {
      href: '/vault',
      icon: Sparkles,
      title: 'Bekijk de bibliotheek',
      body: 'Paletten, typografie, secties, design systems en media. Kies wat je mooi vindt.',
      primary: true,
    },
    {
      href: '/vault?filter=saved',
      icon: Vault,
      title: 'Je vault',
      body:
        savedIds.length > 0
          ? `${savedIds.length} bewaard${savedIds.length === 1 ? ' asset' : 'e assets'}, klaar voor je AI.`
          : 'Nog leeg. Bewaar je eerste asset en hij staat hier.',
      primary: false,
    },
    {
      href: '/learn',
      icon: GraduationCap,
      title: 'Leer het vak',
      body: 'Korte lessen over smaak, tokens en bouwen met AI. In gewoon Nederlands.',
      primary: false,
    },
  ];

  return (
    <div>
      <p className="text-sm text-meta-text">Welkom terug</p>
      <h2 className="mt-1.5 text-xl font-medium tracking-wide text-primary-text">
        Waar bouw je vandaag aan?
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {destinations.map((dest) => {
          const Icon = dest.icon;
          return (
            <Link
              key={dest.href}
              href={dest.href}
              className={cn(
                'group rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
                dest.primary
                  ? 'border-primary-text/20 bg-primary-text text-background'
                  : 'border-border bg-card'
              )}
            >
              <span
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border',
                  dest.primary ? 'border-background/25 text-background' : 'border-border bg-panel text-primary-text'
                )}
              >
                <Icon className="h-4.5 w-4.5" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <p className={cn('mt-4 flex items-center gap-1.5 font-medium', dest.primary ? '' : 'text-primary-text')}>
                {dest.title}
                <ArrowRight
                  className="h-4 w-4 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </p>
              <p className={cn('mt-1.5 text-sm leading-relaxed', dest.primary ? 'text-background/75' : 'text-secondary-text/90')}>
                {dest.body}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 flex items-end justify-between">
        <div>
          <h3 className="text-lg font-medium tracking-wide text-primary-text">Uitgelicht deze week</h3>
          <p className="mt-1 text-sm text-secondary-text/80">Vier assets die samen één richting vormen.</p>
        </div>
        <Link
          href="/vault"
          className="hidden items-center gap-1.5 text-sm font-medium text-secondary-text transition-colors duration-150 hover:text-primary-text sm:inline-flex"
        >
          Alles bekijken <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {featured.map((asset) => (
          <AssetCard key={asset.id} asset={asset} paletteLookup={paletteLookup} />
        ))}
      </div>

      {level >= 2 && (
        <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-panel p-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-medium text-primary-text">Je vault, rechtstreeks in je AI-tool</p>
            <p className="mt-1 text-sm text-secondary-text/90">
              Met Pro praat je vault via MCP met Claude Code en Cursor. Geen kopiëren meer nodig.
            </p>
          </div>
          <span className="inline-flex h-9 shrink-0 items-center rounded-lg border border-border px-4 text-sm font-medium text-meta-text">
            Binnenkort
          </span>
        </div>
      )}
    </div>
  );
}

'use client';
/* eslint-disable @next/next/no-img-element -- provider favicons are external dynamic URLs, not next/image-optimizable */

// components/dashboard/canon/tabs/icons-tab.tsx
//
// Icon systems tab — the intricate port from DesignOS IconsTab. Renders the 6
// approved canon sets + any imported candidate sets (localStorage). Each set
// renders its 12 semantic specimens through @iconify/react (one code path for all
// providers via the set's Iconify prefix). Search filters sets; the "Iconify"
// button opens the browse/import modal; clicking a card opens a preview modal with
// size/stroke inspector.

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Search, ArrowUpRight, X, Check, Library } from 'lucide-react';
import { CANON_ICON_SETS, CANONICAL_SEMANTICS } from '@/lib/canon/icons';
import type { IconSet, IconSemanticId } from '@/lib/canon/types';
import { useIconCandidates } from '@/lib/canon/use-icon-candidates';
import { IconifyBrowserModal } from './iconify-browser-modal';

const CARD_ICON_COLOR = '#2B4A56';

function domainOf(url: string) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return '';
  }
}

function iconName(set: IconSet, semanticId: IconSemanticId) {
  return `${set.iconifyPrefix}:${set.semanticMap[semanticId]}`;
}

/* --------------------------------------------------------- specimen tile --- */

function SpecimenTile({
  set,
  semanticId,
  size,
  color,
  showLabel = false,
}: {
  set: IconSet;
  semanticId: IconSemanticId;
  size: number;
  color?: string;
  showLabel?: boolean;
}) {
  const rounded = set.preview.cornerStyle === 'sharp' ? 'rounded-lg' : 'rounded-xl';
  const label = CANONICAL_SEMANTICS.find((s) => s.id === semanticId)?.label ?? semanticId;
  return (
    <div className="flex flex-col gap-2">
      <div
        className={`group flex aspect-square items-center justify-center border p-2 ${rounded}`}
        style={{ background: '#FFFFFF', borderColor: 'rgba(43,74,86,0.1)' }}
      >
        <Icon
          icon={iconName(set, semanticId)}
          width={size}
          height={size}
          style={{ color: color ?? set.preview.accent }}
          className="transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      {showLabel && (
        <span className="truncate px-0.5 text-[0.68rem] font-medium uppercase tracking-wider text-secondary-text/80">
          {label}
        </span>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- preview modal --- */

function IconPreviewModal({ set, onClose }: { set: IconSet | null; onClose: () => void }) {
  const [size, setSize] = useState(32);
  const [color, setColor] = useState(set?.preview.accent ?? '#2B4A56');

  if (!set) return null;
  const domain = domainOf(set.website);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-0 backdrop-blur-md md:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.98, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.98, y: 24, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        className="relative flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-none border-border bg-card shadow-2xl md:h-auto md:max-h-[84vh] md:rounded-3xl md:border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-6 py-5 sm:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card">
              {domain ? (
                <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt={set.provider} className="h-6 w-6 object-contain" />
              ) : (
                <Library className="h-5 w-5 text-meta-text" aria-hidden="true" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-medium tracking-wide text-primary-text">{set.name}</h2>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="rounded bg-panel px-2 py-0.5 text-[0.62rem] font-semibold tracking-wide text-meta-text">{set.provider}</span>
                <span className="rounded bg-panel px-2 py-0.5 text-[0.62rem] font-semibold tracking-wide text-meta-text">{set.license}</span>
                {set.source === 'candidate' && (
                  <span className="rounded border border-accent/20 bg-accent-wash px-2 py-0.5 text-[0.62rem] font-semibold tracking-wide text-accent">
                    Kandidaat
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Sluiten"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-primary-text shadow-sm transition-transform hover:scale-105 active:scale-95"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[1fr_320px]">
          {/* specimen gallery */}
          <div className="flex flex-col justify-center overflow-y-auto p-6 md:p-10">
            <div className="mx-auto grid w-full max-w-2xl grid-cols-3 gap-6 sm:grid-cols-4">
              {CANONICAL_SEMANTICS.map((sem) => (
                <SpecimenTile key={sem.id} set={set} semanticId={sem.id} size={Math.max(24, size)} color={color} showLabel />
              ))}
            </div>
          </div>

          {/* inspector */}
          <div className="flex flex-col gap-6 overflow-y-auto border-t border-border p-6 md:p-8 lg:border-l lg:border-t-0">
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-meta-text">Specimen aanpassen</h3>
              <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary-text/80">Optische grootte</span>
                    <span className="rounded-md border border-border px-2 py-0.5 text-xs text-meta-text tabular-nums">{size}px</span>
                  </div>
                  <input
                    type="range"
                    min={18}
                    max={48}
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="h-1 w-full cursor-pointer appearance-none rounded-full bg-border"
                    style={{ accentColor: set.preview.accent }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-primary-text/80">Kleur</span>
                  <div className="flex gap-2">
                    {[set.preview.accent, CARD_ICON_COLOR, '#111111'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        aria-label={`Kleur ${c}`}
                        className={`h-8 w-8 rounded-lg border transition-transform hover:scale-105 ${color === c ? 'ring-2 ring-accent ring-offset-1 ring-offset-card' : 'border-border'}`}
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-meta-text">Ondersteunde stijlen</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Outline', active: set.supports.outline },
                  { label: 'Filled', active: set.supports.filled },
                  { label: 'Duotone', active: set.supports.duotone },
                  { label: 'Animated', active: set.supports.animated },
                ].map(({ label, active }) => (
                  <div
                    key={label}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2 ${active ? 'border-border bg-card text-primary-text shadow-sm' : 'border-dashed border-border bg-card/50 text-meta-text'}`}
                  >
                    <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
                    {active ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} aria-hidden="true" />
                    ) : (
                      <X className="h-3 w-3 text-meta-text" strokeWidth={3} aria-hidden="true" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {set.animation.notes && (
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-meta-text">Notities</h3>
                <p className="rounded-2xl border border-border bg-card p-4 text-xs leading-relaxed text-secondary-text/80">
                  {set.animation.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* --------------------------------------------------------------- the tab --- */

export function IconsTab() {
  const { candidates, removeCandidate, addCandidate } = useIconCandidates();
  const [selected, setSelected] = useState<IconSet | null>(null);
  const [query, setQuery] = useState('');
  const [browserOpen, setBrowserOpen] = useState(false);

  const all = useMemo<IconSet[]>(() => [...CANON_ICON_SETS, ...candidates], [candidates]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (s) => s.name.toLowerCase().includes(q) || s.provider.toLowerCase().includes(q) || s.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [all, query]);

  const canon = filtered.filter((s) => s.source !== 'candidate');
  const candidateSets = filtered.filter((s) => s.source === 'candidate');
  const cardSemantics = CANONICAL_SEMANTICS.slice(0, 8);

  const renderCard = (set: IconSet) => {
    const domain = domainOf(set.website);
    const isCandidate = set.source === 'candidate';
    return (
      <div
        key={set.id}
        onClick={() => setSelected(set)}
        className="group flex cursor-pointer flex-col gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-transform group-hover:scale-105">
            {domain ? (
              <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt={set.provider} className="h-5 w-5 object-contain" />
            ) : (
              <Library className="h-4.5 w-4.5 text-meta-text" aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate font-medium text-primary-text transition-colors group-hover:text-accent">{set.name}</h3>
              {isCandidate && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Kandidaatset “${set.name}” verwijderen?`)) removeCandidate(set.id);
                  }}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-meta-text transition-colors hover:bg-red-500/10 hover:text-red-500"
                  title="Kandidaat verwijderen"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              )}
            </div>
            <p className="truncate text-[0.78rem] text-meta-text">{set.provider}</p>
          </div>
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-secondary-text/80">{set.summary}</p>

        <div className="my-0.5 grid grid-cols-4 gap-2">
          {cardSemantics.map((sem) => (
            <SpecimenTile key={sem.id} set={set} semanticId={sem.id} size={22} color={CARD_ICON_COLOR} />
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <span className="text-[0.62rem] font-medium uppercase tracking-[0.14em] text-meta-text">
            {cardSemantics.length} gedeelde iconen
          </span>
          <span className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-secondary-text transition-colors group-hover:text-primary-text">
            Bekijk
            <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-10">
      {/* search + iconify button */}
      <div className="mx-auto flex w-full max-w-xl items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-meta-text" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Zoek iconensystemen of providers..."
            className="h-14 w-full rounded-2xl border border-border bg-card py-3 pl-11 pr-4 text-primary-text shadow-sm focus:outline-none focus:ring-1 focus:ring-accent/30"
          />
        </div>
        <button
          onClick={() => setBrowserOpen(true)}
          className="flex h-14 shrink-0 items-center gap-2.5 rounded-2xl border border-border bg-card px-5 text-secondary-text shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-accent/30 hover:text-accent active:scale-[0.98]"
          title="Zoek Iconify-collecties"
        >
          <Icon icon="simple-icons:iconify" width={16} style={{ color: '#176a9f' }} />
          <span className="text-[0.62rem] font-semibold uppercase tracking-widest">Iconify</span>
        </button>
      </div>

      {/* canon */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-meta-text">Goedgekeurde canon</h3>
        {canon.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/70 py-12 text-center text-xs text-meta-text">
            Geen canonieke systemen matchen je filter
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{canon.map(renderCard)}</div>
        )}
      </div>

      {/* candidates */}
      <div className="flex flex-col gap-4 border-t border-border pt-8">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-meta-text">Geïmporteerde kandidaten</h3>
        {candidateSets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/60 py-12 text-center text-xs text-meta-text">
            Nog geen kandidaten geïmporteerd. Klik op “Iconify” om collecties te bekijken en te importeren.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{candidateSets.map(renderCard)}</div>
        )}
      </div>

      {selected && <IconPreviewModal set={selected} onClose={() => setSelected(null)} />}

      <IconifyBrowserModal
        open={browserOpen}
        onClose={() => setBrowserOpen(false)}
        onImport={(set) => {
          addCandidate(set);
          setBrowserOpen(false);
        }}
      />
    </div>
  );
}

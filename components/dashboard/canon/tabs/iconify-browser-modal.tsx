'use client';

// components/dashboard/canon/tabs/iconify-browser-modal.tsx
//
// Iconify collection browser + semantic mapper — ported from DesignOS
// IconifyBrowserModal. Fetches the Iconify PUBLIC API directly (no server routes,
// no key): the collections list, then a collection's icon list. The user maps the
// 12 canonical semantic slots to icons in the chosen collection (auto-suggested
// via fallbacks), then imports — producing an IconSet stored in localStorage.
//
// Iconify API:
//   GET https://api.iconify.design/collections            → { prefix: {...} }
//   GET https://api.iconify.design/collection?prefix=..    → { uncategorized, categories, ... }

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Search, X, Check, ArrowLeft, Wand2 } from 'lucide-react';
import { CANONICAL_SEMANTICS } from '@/lib/canon/icons';
import type { IconSemanticId, IconSet } from '@/lib/canon/types';

type CollectionSummary = {
  prefix: string;
  name: string;
  author?: string;
  license?: string;
  total?: number;
  samples?: string[];
  category?: string;
};

type CollectionDetail = {
  prefix: string;
  name: string;
  author?: string;
  license?: string;
  icons: string[];
};

const SEMANTIC_FALLBACKS: Record<IconSemanticId, string[]> = {
  search: ['search', 'magnifying-glass', 'magnifer', 'find', 'zoom'],
  mail: ['mail', 'envelope', 'email', 'letter', 'inbox'],
  phone: ['phone', 'telephone', 'call', 'handset'],
  shield: ['shield-check', 'shield', 'protect', 'guard'],
  check: ['check', 'checkmark', 'tick', 'confirm', 'ok'],
  'arrow-up-right': ['arrow-up-right', 'arrow-right-up', 'external-link', 'arrow-out'],
  globe: ['globe', 'world', 'earth', 'global', 'internet'],
  settings: ['settings', 'gear', 'cog', 'preferences'],
  folder: ['folder', 'directory', 'files'],
  database: ['database', 'server', 'storage', 'layers'],
  compass: ['compass', 'discover', 'explore', 'navigation'],
  activity: ['activity', 'pulse', 'chart', 'heartbeat'],
};

const EMPTY_MAP = (): Record<IconSemanticId, string> =>
  Object.fromEntries(CANONICAL_SEMANTICS.map((s) => [s.id, ''])) as Record<IconSemanticId, string>;

const PAGE_SIZE = 80;

function cleanName(name: string) {
  return name.replace(/\bicons?\b/gi, '').replace(/\s+/g, ' ').trim() || name;
}

export function IconifyBrowserModal({
  open,
  onClose,
  onImport,
}: {
  open: boolean;
  onClose: () => void;
  onImport: (set: IconSet) => void;
}) {
  const [collections, setCollections] = useState<CollectionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [prefix, setPrefix] = useState<string | null>(null);
  const [detail, setDetail] = useState<CollectionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [mapped, setMapped] = useState<Record<IconSemanticId, string>>(EMPTY_MAP());
  const [activeSlot, setActiveSlot] = useState<IconSemanticId>('search');
  const [iconFilter, setIconFilter] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  // Load collections when opened.
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError('');
    fetch('https://api.iconify.design/collections')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Kon collecties niet laden'))))
      .then((data: Record<string, Omit<CollectionSummary, 'prefix'>>) => {
        const list = Object.entries(data).map(([p, v]) => ({ prefix: p, ...v }));
        list.sort((a, b) => (b.total ?? 0) - (a.total ?? 0));
        setCollections(list);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [open]);

  // Load a collection's icons + auto-suggest slots.
  useEffect(() => {
    if (!prefix) {
      setDetail(null);
      return;
    }
    setDetailLoading(true);
    setError('');
    fetch(`https://api.iconify.design/collection?prefix=${prefix}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Kon collectie niet laden'))))
      .then((data: { title?: string; author?: { name?: string }; license?: { title?: string }; uncategorized?: string[]; categories?: Record<string, string[]> }) => {
        const icons = new Set<string>();
        (data.uncategorized ?? []).forEach((i) => icons.add(i));
        Object.values(data.categories ?? {}).forEach((list) => list.forEach((i) => icons.add(i)));
        const iconList = Array.from(icons);
        setDetail({
          prefix,
          name: data.title ?? prefix,
          author: data.author?.name,
          license: data.license?.title,
          icons: iconList,
        });

        // Auto-suggest.
        const next = EMPTY_MAP();
        for (const sem of CANONICAL_SEMANTICS) {
          const fallbacks = SEMANTIC_FALLBACKS[sem.id];
          let match = '';
          for (const fb of fallbacks) {
            const found = iconList.find((i) => i === fb || i === `${fb}-line` || i === `${fb}-outline` || i === `${fb}-linear`);
            if (found) {
              match = found;
              break;
            }
          }
          if (!match && fallbacks[0]) {
            match = iconList.find((i) => i.includes(fallbacks[0]!)) ?? '';
          }
          next[sem.id] = match;
        }
        setMapped(next);
        setActiveSlot(CANONICAL_SEMANTICS.find((s) => !next[s.id])?.id ?? 'search');
      })
      .catch((e) => setError(e.message))
      .finally(() => setDetailLoading(false));
  }, [prefix]);

  useEffect(() => {
    setPage(1);
  }, [activeSlot, iconFilter, prefix]);

  const filteredCollections = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = q
      ? collections.filter((c) => c.name.toLowerCase().includes(q) || c.prefix.toLowerCase().includes(q))
      : collections;
    return base.slice(0, 60);
  }, [collections, search]);

  const collectionIcons = useMemo(() => {
    if (!detail) return [];
    const q = iconFilter.trim().toLowerCase();
    return q ? detail.icons.filter((i) => i.toLowerCase().includes(q)) : detail.icons;
  }, [detail, iconFilter]);

  const totalPages = Math.max(1, Math.ceil(collectionIcons.length / PAGE_SIZE));
  const pageIcons = useMemo(
    () => collectionIcons.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [collectionIcons, page]
  );

  const mappedCount = Object.values(mapped).filter(Boolean).length;
  const complete = mappedCount === CANONICAL_SEMANTICS.length;

  const autoMatchAll = () => {
    if (!detail) return;
    const next = { ...mapped };
    for (const sem of CANONICAL_SEMANTICS) {
      if (next[sem.id]) continue;
      const fb = SEMANTIC_FALLBACKS[sem.id][0];
      if (fb) next[sem.id] = detail.icons.find((i) => i.includes(fb)) ?? '';
    }
    setMapped(next);
  };

  const doImport = () => {
    if (!detail || !complete) return;
    const set: IconSet = {
      id: `candidate.${detail.prefix}`,
      name: `${cleanName(detail.name)}`,
      providerId: detail.prefix,
      provider: detail.author ?? 'Iconify',
      website: `https://icon-sets.iconify.design/${detail.prefix}/`,
      summary: `Geïmporteerde Iconify-collectie (${detail.icons.length} iconen).`,
      license: detail.license ?? 'Open source',
      source: 'candidate',
      iconifyPrefix: detail.prefix,
      tags: ['iconify', 'candidate'],
      supports: { outline: true, filled: true, duotone: false, animated: false },
      animation: { supported: false },
      preview: { strokeWidth: 2, cornerStyle: 'rounded', accent: '#725a39', surface: '#faf9f5' },
      semanticMap: mapped,
    };
    onImport(set);
    setPrefix(null);
    setMapped(EMPTY_MAP());
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[85] flex items-center justify-center bg-black/50 p-0 backdrop-blur-md md:p-8"
        onClick={() => {
          setPrefix(null);
          onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.98, y: 24, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.98, y: 24, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="relative flex h-full w-full max-w-[1280px] flex-col overflow-hidden rounded-none border-border bg-card shadow-2xl md:h-[90vh] md:rounded-3xl md:border"
          onClick={(e) => e.stopPropagation()}
        >
          {/* header */}
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-6 py-5 sm:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card">
                <Icon icon="simple-icons:iconify" width={22} style={{ color: '#176a9f' }} />
              </div>
              <div>
                <h2 className="text-xl font-medium tracking-wide text-primary-text">
                  {prefix ? 'Iconen koppelen' : 'Iconify-collecties verkennen'}
                </h2>
                <p className="text-xs text-meta-text">
                  {prefix
                    ? `Koppel ${cleanName(detail?.name ?? prefix)} aan de 12 kernbetekenissen.`
                    : 'Blader en importeer collecties als kandidaat-specimens.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => (prefix ? setPrefix(null) : onClose())}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-primary-text shadow-sm transition-transform hover:scale-105 active:scale-95"
              aria-label={prefix ? 'Terug' : 'Sluiten'}
            >
              {prefix ? <ArrowLeft className="h-4 w-4" aria-hidden="true" /> : <X className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>

          {error && (
            <div className="flex items-center justify-between border-b border-red-500/20 bg-red-500/10 px-6 py-3 text-xs text-red-500">
              <span>{error}</span>
              <button onClick={() => setError('')} className="font-medium">Wissen</button>
            </div>
          )}

          {!prefix ? (
            /* ---- browse collections ---- */
            <div className="flex flex-1 flex-col overflow-hidden">
              <div className="border-b border-border p-4 sm:p-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-meta-text" aria-hidden="true" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Zoek collecties op naam of prefix (lucide, mdi, ph, ...)"
                    className="w-full rounded-2xl border border-border bg-card py-3 pl-11 pr-4 text-sm text-primary-text focus:outline-none focus:ring-1 focus:ring-accent/30"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="flex min-h-[300px] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-accent" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredCollections.map((c) => (
                      <motion.div
                        key={c.prefix}
                        onClick={() => setPrefix(c.prefix)}
                        className="group flex min-h-[240px] cursor-pointer flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div>
                          <h3 className="text-lg font-light tracking-wide text-primary-text transition-colors group-hover:text-accent">
                            {cleanName(c.name)}
                          </h3>
                          {c.author && <p className="mt-1 text-[0.7rem] text-meta-text">Door {c.author}</p>}
                          <div className="mt-5 grid grid-cols-6 gap-2">
                            {(c.samples ?? []).slice(0, 6).map((s) => (
                              <div key={s} className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-secondary-text/60">
                                <Icon icon={`${c.prefix}:${s}`} width={20} height={20} />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between border-t border-border pt-3">
                          <span className="text-[0.62rem] font-medium uppercase tracking-[0.14em] text-meta-text">{c.total ?? 0} iconen</span>
                          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-secondary-text transition-colors group-hover:text-primary-text">Koppel</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ---- map semantics ---- */
            <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-[300px_1fr]">
              {/* slots */}
              <div className="flex flex-col justify-between overflow-y-auto border-b border-border p-4 sm:p-6 md:border-b-0 md:border-r">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-meta-text">Betekenissen</span>
                    <span className="rounded-md bg-accent-wash px-2 py-0.5 text-[0.62rem] font-medium text-accent">{mappedCount}/12</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {CANONICAL_SEMANTICS.map((sem) => {
                      const isMapped = !!mapped[sem.id];
                      const isActive = activeSlot === sem.id;
                      return (
                        <button
                          key={sem.id}
                          onClick={() => setActiveSlot(sem.id)}
                          className={`flex items-center gap-0 overflow-hidden rounded-xl border text-left text-xs transition-all ${
                            isActive
                              ? 'border-accent/40 bg-card font-semibold text-accent shadow-sm'
                              : isMapped
                                ? 'border-border bg-card/70 text-primary-text/80'
                                : 'border-dashed border-border text-meta-text'
                          }`}
                        >
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center border-r border-border bg-card">
                            {isMapped ? (
                              <Icon icon={`${prefix}:${mapped[sem.id]}`} width={22} height={22} className={isActive ? 'text-accent' : 'text-secondary-text/70'} />
                            ) : (
                              <span className="h-2 w-2 rounded-full bg-red-500/60" />
                            )}
                          </span>
                          <span className="flex min-w-0 flex-1 flex-col gap-0.5 px-3 py-2">
                            <span className="text-[0.58rem] font-semibold uppercase tracking-wider opacity-60">{sem.label}</span>
                            <span className={`truncate text-[0.68rem] ${isMapped ? 'text-accent' : 'italic opacity-50'}`}>
                              {isMapped ? mapped[sem.id] : 'Niet toegewezen'}
                            </span>
                          </span>
                          {isMapped && <Check className="mr-3 h-3 w-3 text-emerald-500" strokeWidth={4} aria-hidden="true" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-2 border-t border-border pt-4">
                  <button
                    onClick={autoMatchAll}
                    disabled={!detail}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-accent/20 bg-card py-3 text-[0.62rem] font-semibold uppercase tracking-wider text-accent shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Wand2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Auto-koppelen
                  </button>
                  <button
                    onClick={doImport}
                    disabled={!complete}
                    className="w-full rounded-xl bg-accent py-3 text-[0.62rem] font-semibold uppercase tracking-wider text-accent-foreground shadow-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Collectie importeren
                  </button>
                </div>
              </div>

              {/* icon picker */}
              <div className="flex flex-col overflow-hidden">
                {detailLoading ? (
                  <div className="flex flex-1 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-accent" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 border-b border-border p-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-meta-text" aria-hidden="true" />
                        <input
                          type="text"
                          value={iconFilter}
                          onChange={(e) => setIconFilter(e.target.value)}
                          placeholder={`Zoek voor slot “${activeSlot}”...`}
                          className="w-full rounded-xl border border-border bg-card py-2 pl-10 pr-4 text-xs text-primary-text focus:outline-none focus:ring-1 focus:ring-accent/30"
                        />
                      </div>
                      {iconFilter && (
                        <button onClick={() => setIconFilter('')} className="text-[0.62rem] font-semibold uppercase text-meta-text hover:text-primary-text">
                          Wissen
                        </button>
                      )}
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                      {pageIcons.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-xs text-meta-text">Geen iconen gevonden</div>
                      ) : (
                        <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
                          {pageIcons.map((icon) => {
                            const isCurrent = mapped[activeSlot] === icon;
                            return (
                              <button
                                key={icon}
                                onClick={() => {
                                  setMapped((prev) => ({ ...prev, [activeSlot]: icon }));
                                  const idx = CANONICAL_SEMANTICS.findIndex((s) => s.id === activeSlot);
                                  const next = CANONICAL_SEMANTICS[idx + 1];
                                  if (next) setActiveSlot(next.id);
                                }}
                                title={icon}
                                className={`flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border p-3 transition-all ${
                                  isCurrent
                                    ? 'scale-105 border-accent bg-accent text-accent-foreground shadow-sm'
                                    : 'border-border bg-card text-secondary-text/40 hover:scale-105 hover:border-accent/20'
                                }`}
                              >
                                <Icon icon={`${prefix}:${icon}`} width={30} height={30} className={isCurrent ? 'text-accent-foreground' : 'text-secondary-text/60'} />
                                <span className="w-full truncate text-center text-[0.6rem] opacity-70">{icon}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    {collectionIcons.length > PAGE_SIZE && (
                      <div className="flex shrink-0 items-center justify-between border-t border-border px-6 py-3">
                        <span className="text-[0.62rem] text-meta-text">
                          {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, collectionIcons.length)} van {collectionIcons.length}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="rounded-lg border border-border bg-card px-3 py-1.5 text-[0.62rem] font-medium uppercase tracking-wider text-primary-text transition-colors hover:bg-panel disabled:opacity-40"
                          >
                            Vorige
                          </button>
                          <span className="text-[0.62rem] text-secondary-text">Pagina {page}/{totalPages}</span>
                          <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="rounded-lg border border-border bg-card px-3 py-1.5 text-[0.62rem] font-medium uppercase tracking-wider text-primary-text transition-colors hover:bg-panel disabled:opacity-40"
                          >
                            Volgende
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

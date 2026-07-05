'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check, Copy, X } from 'lucide-react';
import { SiteShell } from '@/components/site/site-shell';
import { SplitHeading } from '@/components/site/split-heading';
import { Reveal } from '@/components/site/reveal';
import {
  GALLERY_CATEGORIES,
  type GalleryCategoryKey,
  type GalleryItem,
} from '@/lib/gallery/curated-gallery';
import { extractAssetPaletteColors, extractFontName, isLightColor } from '@/lib/vault/visual-extract';

/**
 * /galerij — de publieke galerij (lead magnet, RFC 2026-07 Phase 7).
 * Gratis visuele assets en prompts die je direct in ChatGPT, Claude of je
 * eigen agent plakt. Elke kaart heeft twee uitgangen: kopiëren (direct
 * resultaat) of bewaren in je vault (signup — de IKEA-route).
 */

const SIGNUP_ROUTE = '/auth';

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/* --- Type-specifieke tegel-visuals ---------------------------------------- */

function PaletteTile({ item }: { item: GalleryItem }) {
  const colors = extractAssetPaletteColors(item).slice(0, 6);
  return (
    <div className="flex h-44 flex-col gap-1.5 rounded-2xl p-4" style={{ background: 'var(--sq-sunken)' }}>
      {colors.map((color) => (
        <span
          key={color}
          className="flex flex-1 items-center rounded-lg border px-3"
          style={{ background: color, borderColor: 'var(--sq-line)' }}
        >
          <span
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: isLightColor(color) ? 'rgba(20,16,10,0.62)' : 'rgba(255,252,246,0.78)' }}
          >
            {color}
          </span>
        </span>
      ))}
    </div>
  );
}

function FontTile({ item }: { item: GalleryItem }) {
  const fontName = extractFontName(item);
  return (
    <div
      className="flex h-44 flex-col justify-between rounded-2xl border p-5"
      style={{ background: 'var(--sq-raised)', borderColor: 'var(--sq-line)' }}
    >
      <p className="sq-display text-6xl leading-none">Aa</p>
      <div>
        <p className="sq-display text-xl leading-tight">{item.title}</p>
        <p className="mt-1 text-xs" style={{ color: 'var(--sq-ink-soft)' }}>
          {fontName}
        </p>
      </div>
    </div>
  );
}

function DocumentTile({ item }: { item: GalleryItem }) {
  const lines = item.body
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .slice(0, 7);
  return (
    <div
      className="flex h-44 flex-col gap-2 overflow-hidden rounded-2xl border p-5"
      style={{ background: 'var(--sq-raised)', borderColor: 'var(--sq-line)' }}
    >
      {lines.map((line, index) => {
        const isHeading = line.startsWith('#');
        return (
          <p
            key={index}
            className={isHeading ? 'truncate text-sm font-bold' : 'truncate text-xs'}
            style={{ color: isHeading ? 'var(--sq-ink)' : 'var(--sq-ink-soft)' }}
          >
            {line.replace(/^#+\s*/, '')}
          </p>
        );
      })}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-10"
        style={{ background: 'linear-gradient(to top, var(--sq-raised), transparent)' }}
        aria-hidden
      />
    </div>
  );
}

function TileVisual({ item }: { item: GalleryItem }) {
  if (item.category === 'kleuren') return <PaletteTile item={item} />;
  if (item.category === 'typografie') return <FontTile item={item} />;
  return (
    <div className="relative">
      <DocumentTile item={item} />
    </div>
  );
}

/* --- Kaart ----------------------------------------------------------------- */

function GalleryCard({ item, onOpen }: { item: GalleryItem; onOpen: () => void }) {
  const [copied, setCopied] = useState(false);

  return (
    <article
      className="group flex flex-col gap-4 rounded-3xl border p-4 transition-transform duration-200 hover:-translate-y-1"
      style={{ background: 'var(--sq-paper)', borderColor: 'var(--sq-line)' }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="cursor-pointer text-left"
        aria-label={`Bekijk ${item.title}`}
      >
        <TileVisual item={item} />
      </button>

      <div className="flex flex-1 flex-col gap-1 px-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="sq-display text-lg leading-snug">{item.title}</h3>
          <span
            className="mt-1 shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest"
            style={{ background: 'var(--sq-accent-wash)', color: 'var(--sq-accent-ink)' }}
          >
            {GALLERY_CATEGORIES.find((category) => category.key === item.category)?.label}
          </span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--sq-ink-soft)' }}>
          {item.summary}
        </p>
      </div>

      <div className="flex items-center gap-2 px-1 pb-1">
        <button
          type="button"
          onClick={() => {
            void copyText(item.body).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          className="sq-btn sq-btn-primary !h-10 flex-1 !px-4 !text-sm"
        >
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          {copied ? 'Gekopieerd' : 'Kopieer voor je AI'}
        </button>
        <Link
          href={SIGNUP_ROUTE}
          className="sq-btn sq-btn-ghost !h-10 !px-4 !text-sm whitespace-nowrap"
        >
          Bewaar
          <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}

/* --- Detail-overlay ---------------------------------------------------------- */

function GalleryDetail({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <button
        type="button"
        aria-label="Sluiten"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        style={{ background: 'rgba(20, 16, 10, 0.55)', backdropFilter: 'blur(6px)' }}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        className="relative flex max-h-[88dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border sm:rounded-3xl"
        style={{ background: 'var(--sq-paper)', borderColor: 'var(--sq-line)', boxShadow: 'var(--sq-shadow-float)' }}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-start justify-between gap-4 border-b px-6 py-5" style={{ borderColor: 'var(--sq-line)' }}>
          <div className="min-w-0">
            <p className="sq-eyebrow" style={{ color: 'var(--sq-accent)' }}>
              {GALLERY_CATEGORIES.find((category) => category.key === item.category)?.label}
            </p>
            <h2 className="sq-display mt-2 text-2xl leading-tight">{item.title}</h2>
            <p className="mt-1.5 text-sm" style={{ color: 'var(--sq-ink-soft)' }}>
              {item.summary}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Sluiten"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-opacity hover:opacity-70"
            style={{ borderColor: 'var(--sq-line)', color: 'var(--sq-ink-soft)' }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {item.category === 'kleuren' && (
            <div className="mb-5">
              <PaletteTile item={item} />
            </div>
          )}
          <div
            className="whitespace-pre-wrap rounded-2xl border p-5 text-sm leading-relaxed"
            style={{ background: 'var(--sq-sunken)', borderColor: 'var(--sq-line)', color: 'var(--sq-ink)' }}
          >
            {item.body}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t px-6 py-4 sm:flex-row sm:items-center" style={{ borderColor: 'var(--sq-line)' }}>
          <button
            type="button"
            onClick={() => {
              void copyText(item.body).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            className="sq-btn sq-btn-primary flex-1"
          >
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? 'Gekopieerd — plak in je AI' : 'Kopieer voor je AI'}
          </button>
          <Link href={SIGNUP_ROUTE} className="sq-btn sq-btn-ghost flex-1">
            Bewaar in je vault
            <ArrowUpRight className="ml-1.5 h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* --- Pagina ------------------------------------------------------------------ */

export default function GalerijClient({ items }: { items: GalleryItem[] }) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategoryKey | 'all'>('all');
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const visibleItems = useMemo(
    () => (activeCategory === 'all' ? items : items.filter((item) => item.category === activeCategory)),
    [activeCategory, items],
  );
  const openItem = items.find((item) => item.slug === openSlug) ?? null;

  const categoriesWithItems = GALLERY_CATEGORIES.filter((category) =>
    items.some((item) => item.category === category.key),
  );

  return (
    <SiteShell>
      {/* Hero */}
      <section style={{ paddingTop: 'clamp(9rem, 16vh, 13rem)', paddingBottom: 'clamp(3rem, 6vh, 5rem)' }}>
        <div className="sq-container">
          <Reveal>
            <p className="sq-eyebrow">Gratis bibliotheek</p>
          </Reveal>
          <SplitHeading as="h1" className="sq-h1 mt-7 max-w-4xl" delay={0.1} start="top 100%">
            De galerij.
          </SplitHeading>
          <Reveal delay={0.2}>
            <p className="sq-lead mt-9 max-w-xl">
              Kleurenpaletten, font-pairings en prompts die werken. Kopieer ze direct
              naar ChatGPT, Claude of je eigen agent en zie meteen resultaat — of
              bewaar ze in je eigen vault en bouw je bibliotheek op.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Filter + grid */}
      <section style={{ paddingBottom: 'clamp(6rem, 12vh, 10rem)' }}>
        <div className="sq-container-wide">
          <Reveal>
            <div className="mb-8 flex flex-wrap items-center gap-2">
              {[{ key: 'all' as const, label: 'Alles' }, ...categoriesWithItems].map((category) => {
                const isActive = activeCategory === category.key;
                return (
                  <button
                    key={category.key}
                    type="button"
                    onClick={() => setActiveCategory(category.key)}
                    aria-pressed={isActive}
                    className="cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors"
                    style={
                      isActive
                        ? { background: 'var(--sq-accent)', borderColor: 'var(--sq-accent)', color: '#fff8f2' }
                        : { background: 'var(--sq-raised)', borderColor: 'var(--sq-line)', color: 'var(--sq-ink-soft)' }
                    }
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleItems.map((item, index) => (
              <Reveal key={item.slug} y={40} delay={Math.min(index * 0.05, 0.3)}>
                <GalleryCard item={item} onOpen={() => setOpenSlug(item.slug)} />
              </Reveal>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-center gap-4 text-center">
            <p className="sq-faint max-w-md">
              Dit is een greep uit de bibliotheek. Met een gratis account bewaar je
              alles op één plek, georganiseerd en altijd klaar om te plakken.
            </p>
            <Link href={SIGNUP_ROUTE} className="sq-btn sq-btn-primary">
              Start je eigen vault — gratis
              <ArrowUpRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {openItem && <GalleryDetail item={openItem} onClose={() => setOpenSlug(null)} />}
      </AnimatePresence>
    </SiteShell>
  );
}

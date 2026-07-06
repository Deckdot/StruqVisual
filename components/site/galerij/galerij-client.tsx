'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { TransitionLink as Link } from '@/components/providers/PageTransition';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check, Copy, X } from 'lucide-react';
import { SiteShell } from '@/components/site/site-shell';
import { SplitHeading } from '@/components/site/split-heading';
import { Reveal } from '@/components/site/reveal';
import { gsap, useGSAP, ScrollTrigger, EASE_OUT, prefersReducedMotion } from '@/components/site/motion';
import {
  GALLERY_CATEGORIES,
  type GalleryCategoryKey,
  type GalleryItem,
} from '@/lib/gallery/curated-gallery';
import { GalleryPreview, buildArrivalScene, buildHoverScene } from '@/components/site/galerij/previews';
import { SlotText } from '@/components/site/slot-text';

/**
 * /galerij — de publieke galerij (lead magnet, RFC 2026-07 Phase 7).
 * Art-directed gallery wall: large per-category previews on a 12-col grid,
 * each card an exhibit with its own arrival + hover micro-scene (marketing
 * register). Two exits per asset: kopiëren (direct resultaat) of bewaren in
 * je vault (signup, de IKEA-route). Data contract, filter model and detail
 * overlay contract are unchanged.
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

function categoryLabel(key: GalleryCategoryKey): string {
  return GALLERY_CATEGORIES.find((category) => category.key === key)?.label ?? key;
}

/* --- Wall composition ---------------------------------------------------------
 * Spans keyed on (category, index-within-category) so the same rhythm holds in
 * the "Alles" wall and in every filtered view. lg = 12 cols, md = 2 cols.
 * All-view rows: kleuren 7+5 · typografie 5+7 · richting 12 · prompts 8+4 / 4+4+4.
 */

function cardSpan(category: GalleryCategoryKey, indexInCategory: number): string {
  if (category === 'kleuren') return indexInCategory === 0 ? 'lg:col-span-7' : 'lg:col-span-5';
  if (category === 'typografie') return indexInCategory === 0 ? 'lg:col-span-5' : 'lg:col-span-7';
  if (category === 'richting') return 'md:col-span-2 lg:col-span-12';
  return indexInCategory === 0 ? 'md:col-span-2 lg:col-span-8' : 'lg:col-span-4';
}

function previewHeight(category: GalleryCategoryKey): string {
  if (category === 'kleuren' || category === 'typografie') return 'min-h-[19rem] sm:min-h-[22rem]';
  if (category === 'richting') return 'min-h-[16rem] sm:min-h-[18rem]';
  return 'min-h-[15rem] sm:min-h-[16.5rem]';
}

/* --- Kaart ----------------------------------------------------------------- */

function GalleryCard({
  item,
  span,
  minHeight,
  onOpen,
}: {
  item: GalleryItem;
  span: string;
  minHeight: string;
  onOpen: () => void;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <article
      data-gp-card
      data-sq-reveal
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-2.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 ${span}`}
      style={{ background: 'var(--sq-paper)', borderColor: 'var(--sq-line)' }}
    >
      {/* Whole card opens the overlay; actions float above on z-2. */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Bekijk ${item.title}`}
        className="absolute inset-0 z-[1] cursor-pointer rounded-3xl"
      />

      <div className={`pointer-events-none relative ${minHeight}`}>
        <div className="absolute inset-0">
          <GalleryPreview item={item} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-2.5 pb-2 pt-4 sm:px-3">
        <div>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--sq-accent-ink)' }}>
            {categoryLabel(item.category)}
          </p>
          <h3 className="sq-display mt-1.5 text-xl leading-snug sm:text-2xl">{item.title}</h3>
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed" style={{ color: 'var(--sq-ink-soft)' }}>
          {item.summary}
        </p>

        <div className="relative z-[2] mt-auto flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              void copyText(item.body).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            className="sq-btn sq-btn-primary !h-11 !px-5 !text-[0.8125rem]"
          >
            {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
            <SlotText>{copied ? 'Gekopieerd' : 'Kopieer voor je AI'}</SlotText>
            <span className="sq-btn-fill" aria-hidden="true" />
          </button>
          <Link
            href={SIGNUP_ROUTE}
            className="sq-link !text-sm !font-medium whitespace-nowrap transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100"
          >
            Bewaar
          </Link>
        </div>
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

  const copyBody = () => {
    void copyText(item.body).then((ok) => {
      if (!ok) return;
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  };

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
        className="relative grid max-h-[90dvh] w-full max-w-4xl overflow-hidden rounded-t-3xl border sm:rounded-3xl lg:grid-cols-[0.9fr_1.1fr]"
        style={{ background: 'var(--sq-paper)', borderColor: 'var(--sq-line)', boxShadow: 'var(--sq-shadow-float)' }}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Groot preview-paneel: het asset blijft de held (desktop). */}
        <div className="hidden min-h-[26rem] flex-col p-4 lg:flex" style={{ background: 'var(--sq-sunken)' }}>
          <div className="min-h-0 flex-1">
            <GalleryPreview item={item} maxRail={7} />
          </div>
        </div>

        <div className="flex min-h-0 flex-col">
          <div className="flex items-start justify-between gap-4 border-b px-6 py-5" style={{ borderColor: 'var(--sq-line)' }}>
            <div className="min-w-0">
              <p className="sq-eyebrow" style={{ color: 'var(--sq-accent)' }}>
                {categoryLabel(item.category)}
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
            <div className="mb-5 h-56 lg:hidden">
              <GalleryPreview item={item} />
            </div>
            <div
              className="whitespace-pre-wrap rounded-2xl border p-5 text-sm leading-relaxed"
              style={{ background: 'var(--sq-sunken)', borderColor: 'var(--sq-line)', color: 'var(--sq-ink)' }}
            >
              {item.body}
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t px-6 py-4 sm:flex-row sm:items-center" style={{ borderColor: 'var(--sq-line)' }}>
            <button type="button" onClick={copyBody} className="sq-btn sq-btn-primary flex-1">
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              <SlotText>{copied ? 'Gekopieerd. Plak in je AI.' : 'Kopieer voor je AI'}</SlotText>
              <span className="sq-btn-fill" aria-hidden="true" />
            </button>
            <Link href={SIGNUP_ROUTE} className="sq-btn sq-btn-ghost flex-1">
              <SlotText>Bewaar in je vault</SlotText>
              <ArrowUpRight className="ml-1.5 h-4 w-4" />
              <span className="sq-btn-fill" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* --- Pagina ------------------------------------------------------------------ */

export default function GalerijClient({ items }: { items: GalleryItem[] }) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategoryKey | 'all'>('all');
  const [renderedCategory, setRenderedCategory] = useState<GalleryCategoryKey | 'all'>('all');
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const visibleItems = useMemo(
    () => (renderedCategory === 'all' ? items : items.filter((item) => item.category === renderedCategory)),
    [renderedCategory, items]
  );

  // Wall composition: span per (category, index-within-category).
  const wall = useMemo(() => {
    const perCategory = new Map<GalleryCategoryKey, number>();
    return visibleItems.map((item) => {
      const indexInCategory = perCategory.get(item.category) ?? 0;
      perCategory.set(item.category, indexInCategory + 1);
      return { item, span: cardSpan(item.category, indexInCategory), minHeight: previewHeight(item.category) };
    });
  }, [visibleItems]);
  const openItem = items.find((item) => item.slug === openSlug) ?? null;

  const categoriesWithItems = GALLERY_CATEGORIES.map((category) => ({
    ...category,
    count: items.filter((item) => item.category === category.key).length,
  })).filter((category) => category.count > 0);

  /** Filterwissel als scène: huidige wand zakt weg, de nieuwe komt gefaseerd op. */
  const changeCategory = (next: GalleryCategoryKey | 'all') => {
    if (next === activeCategory) return;
    setActiveCategory(next);

    const grid = gridRef.current;
    const cards = grid ? gsap.utils.toArray<HTMLElement>('[data-gp-card]', grid) : [];
    if (prefersReducedMotion() || cards.length === 0) {
      setRenderedCategory(next);
      return;
    }
    gsap.to(cards, {
      autoAlpha: 0,
      y: 14,
      scale: 0.99,
      duration: 0.2,
      ease: 'power2.in',
      stagger: 0.02,
      overwrite: true,
      onComplete: () => setRenderedCategory(next),
    });
  };

  // Entrances + micro-scenes for the current wall. revertOnUpdate wipes the
  // previous wall's triggers/scenes whenever the filter swaps the cards.
  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return;
      const cards = gsap.utils.toArray<HTMLElement>('[data-gp-card]', grid);
      if (cards.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          motionOk: '(prefers-reduced-motion: no-preference)',
          motionOff: '(prefers-reduced-motion: reduce)',
        },
        (ctx) => {
          if (ctx.conditions?.motionOff) {
            gsap.set(cards, { autoAlpha: 1, y: 0 });
            return;
          }

          gsap.set(cards, { autoAlpha: 0, y: 48 });
          const scenes = new Map(cards.map((card) => [card, buildArrivalScene(card)]));
          const arrivalCalls: gsap.core.Tween[] = [];

          // NB: do NOT wrap onEnter in the outer useGSAP `contextSafe`. These
          // tweens are created inside this live matchMedia context, so it already
          // tracks and reverts them. Re-entering the outer context from within
          // this child context makes the two contexts reference each other, and
          // GSAP's recursive Context.getTweens then overflows the stack on the
          // next revert()/refresh() — the desktop-only galerij nav crash.
          const batchTriggers = ScrollTrigger.batch(cards, {
            start: 'top 94%',
            once: true,
            onEnter: (batch: Element[]) => {
              gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.8, ease: EASE_OUT, stagger: 0.08, overwrite: true });
              batch.forEach((el, index) => {
                arrivalCalls.push(
                  gsap.delayedCall(0.08 * index + 0.15, () => scenes.get(el as HTMLElement)?.play())
                );
              });
            },
          });

          // The wall's height changed (filter/mount); settle triggers below it.
          ScrollTrigger.refresh();

          // Pending delayed calls, paused scene timelines, and the batch's own
          // ScrollTriggers all outlive the GSAP context revert; kill them
          // explicitly so nothing fires post-unmount (or after a curtain nav) and
          // gets re-parented onto whatever page mounts next. batch() triggers are
          // NOT owned by the matchMedia context, so they must be killed by hand.
          return () => {
            arrivalCalls.forEach((call) => call.kill());
            scenes.forEach((scene) => scene?.kill());
            batchTriggers.forEach((trigger) => trigger.kill());
          };
        }
      );

      mm.add('(hover: hover) and (prefers-reduced-motion: no-preference)', () => {
        const cleanups = cards.map((card) => {
          const hover = buildHoverScene(card);
          if (!hover) return () => undefined;
          const enter = () => hover.play();
          const leave = () => hover.reverse();
          card.addEventListener('pointerenter', enter);
          card.addEventListener('pointerleave', leave);
          return () => {
            card.removeEventListener('pointerenter', enter);
            card.removeEventListener('pointerleave', leave);
            hover.kill();
          };
        });
        return () => cleanups.forEach((cleanup) => cleanup());
      });

      // Tear down the global matchMedia conditions on unmount/filter-swap so a
      // later ScrollTrigger.refresh() (curtain nav) can't re-run them against a
      // stale DOM. revertOnUpdate already re-runs this body per filter change.
      return () => mm.revert();
    },
    { dependencies: [visibleItems], revertOnUpdate: true, scope: gridRef }
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
              Kleurenpaletten, font-pairings en prompts die werken. Kopieer ze naar
              ChatGPT, Claude of je eigen agent en zie meteen verschil. Of bewaar ze
              in je vault en bouw je eigen bibliotheek op.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="sq-faint mt-6">
              {items.length} assets · gratis te kopiëren · geen account nodig
            </p>
          </Reveal>
        </div>
      </section>

      {/* Filter + wand */}
      <section style={{ paddingBottom: 'clamp(5rem, 9vh, 8rem)' }}>
        <div className="sq-container-wide">
          <Reveal>
            <div className="mb-10 flex flex-wrap items-center gap-2.5">
              {[{ key: 'all' as const, label: 'Alles', count: items.length }, ...categoriesWithItems].map((category) => {
                const isActive = activeCategory === category.key;
                return (
                  <button
                    key={category.key}
                    type="button"
                    onClick={() => changeCategory(category.key)}
                    aria-pressed={isActive}
                    className="cursor-pointer rounded-full border px-5 py-2.5 text-sm font-medium transition-colors duration-300"
                    style={
                      isActive
                        ? { background: 'var(--sq-accent)', borderColor: 'var(--sq-accent)', color: '#fff8f2' }
                        : { background: 'var(--sq-raised)', borderColor: 'var(--sq-line)', color: 'var(--sq-ink-soft)' }
                    }
                  >
                    {category.label}
                    <span className="ml-1.5 opacity-60">{category.count}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          <div ref={gridRef} className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12">
            {wall.map(({ item, span, minHeight }) => (
              <GalleryCard
                key={item.slug}
                item={item}
                span={span}
                minHeight={minHeight}
                onOpen={() => setOpenSlug(item.slug)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Slot: de vault-uitgang */}
      <section style={{ paddingBottom: 'clamp(6rem, 12vh, 10rem)' }}>
        <div className="sq-container">
          <Reveal y={48}>
            <div
              className="relative overflow-hidden rounded-[2rem] px-7 py-12 sm:px-14 sm:py-16"
              style={{ background: 'var(--sq-inverse)', color: 'var(--sq-inverse-ink)' }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-16 -right-12 h-48 w-48 rounded-full sm:h-64 sm:w-64"
                style={{ background: 'var(--sq-accent)' }}
              />
              <p className="sq-eyebrow" style={{ color: 'var(--sq-accent)' }}>
                Jouw vault
              </p>
              <h2 className="sq-display mt-4 max-w-xl text-[clamp(1.75rem,3.4vw,2.75rem)] leading-tight">
                Dit is een greep. De rest bewaar je zelf.
              </h2>
              <p className="mt-4 max-w-md" style={{ color: 'var(--sq-inverse-soft)' }}>
                Met een gratis account staat alles op één plek, georganiseerd en
                altijd klaar om te plakken.
              </p>
              <Link href={SIGNUP_ROUTE} className="sq-btn sq-btn-accent mt-8">
                <SlotText>Start je gratis vault</SlotText>
                <ArrowUpRight className="ml-1.5 h-4 w-4" />
                <span className="sq-btn-fill" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <AnimatePresence>
        {openItem && <GalleryDetail item={openItem} onClose={() => setOpenSlug(null)} />}
      </AnimatePresence>
    </SiteShell>
  );
}

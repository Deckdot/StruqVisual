'use client';

import { ArrowUpRight } from 'lucide-react';
import { gsap, EASE_OUT } from '@/components/site/motion';
import type { GalleryItem } from '@/lib/gallery/canon-gallery';
import { isLightColor } from '@/lib/vault/visual-extract';

/**
 * Per-categorie preview-treatments voor de publieke galerij (/galerij).
 * Statisch en data-gedreven — gerenderd uit de GESTRUCTUREERDE canon-velden op
 * GalleryItem.data (geen tekst-parsing, geen live sandboxes). Markup ship in zijn
 * FINALE staat; de arrival-scenes spoelen terug via from()-tweens en de hover-
 * scenes zijn play/reverse to()-timelines (alleen transforms + opacity).
 */

/* --- Kleur-helpers ---------------------------------------------------------- */

/** Leesbaar label op een swatch — hex via visual-extract, oklch via de L-waarde. */
function inkOn(color: string): string {
  const oklch = color.match(/^oklch\(\s*([\d.]+)/i);
  const light = oklch ? parseFloat(oklch[1]) > 0.6 : isLightColor(color);
  return light ? 'rgba(20, 16, 10, 0.66)' : 'rgba(255, 252, 246, 0.82)';
}

/** Eerste familienaam uit een CSS-stack ("var(--font-sora), …" bevat geen naam). */
function familyName(stack: string): string {
  const first = stack.split(',')[0]?.trim() ?? stack;
  const named = first.replace(/^var\([^)]*\)$/, '').replace(/["']/g, '').trim();
  return named.length > 0 ? named : (stack.split(',')[1]?.replace(/["']/g, '').trim() ?? first);
}

/* --- Kleuren: editorial swatch-compositie ---------------------------------- */

function PalettePreview({ item, maxRail = 5 }: { item: GalleryItem; maxRail?: number }) {
  if (item.data.kind !== 'palette') return null;
  const { colors } = item.data.palette;
  const field = colors.background;
  const accent = colors.accent;
  const rail = [colors.surface, colors.accentAlt, colors.text]
    .filter((color): color is string => Boolean(color))
    .slice(0, maxRail);

  return (
    <div
      data-gp-scene="palette"
      className="flex h-full gap-2.5 overflow-hidden rounded-[1.4rem] p-2.5"
      style={{ background: 'var(--sq-sunken)' }}
    >
      <div
        className="relative flex flex-[1.6] items-end overflow-hidden rounded-2xl border p-4"
        style={{ background: field, borderColor: 'var(--sq-line)' }}
      >
        <span
          data-gp-disc
          aria-hidden
          className="absolute right-[10%] top-[14%] block aspect-square h-[36%] rounded-full"
          style={{ background: accent }}
        />
        <span
          data-gp-hex
          className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em]"
          style={{ color: inkOn(field) }}
        >
          {field}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5">
        {rail.map((color, index) => (
          <span
            key={`${color}-${index}`}
            data-gp-swatch
            className="flex flex-1 items-center overflow-hidden rounded-xl border px-3"
            style={{ background: color, borderColor: 'var(--sq-line)' }}
          >
            <span
              data-gp-hex
              className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em]"
              style={{ color: inkOn(color) }}
            >
              {color}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* --- Typografie: pairing-specimen ------------------------------------------ */

function TypePreview({ item }: { item: GalleryItem }) {
  if (item.data.kind !== 'typography') return null;
  const { pairing, stacks } = item.data;

  return (
    <div
      data-gp-scene="type"
      className="flex h-full flex-col justify-between overflow-hidden rounded-[1.4rem] border p-6 sm:p-7"
      style={{ background: 'var(--sq-raised)', borderColor: 'var(--sq-line)' }}
    >
      <div className="flex items-start justify-between gap-4">
        <p aria-hidden className="leading-none" style={{ fontFamily: stacks.display, fontSize: 'clamp(4.25rem, 8vw, 6.5rem)' }}>
          <span data-gp-letter className="inline-block">A</span>
          <span data-gp-letter className="inline-block">a</span>
        </p>
        <div className="mt-2 flex flex-col items-end gap-2" aria-hidden>
          {['3.5rem', '2.25rem', '1.25rem'].map((width) => (
            <span
              key={width}
              data-gp-bar
              className="block h-1 rounded-full"
              style={{ width, background: 'var(--sq-line-strong)' }}
            />
          ))}
        </div>
      </div>

      <div>
        <p data-gp-type-line className="text-2xl leading-tight sm:text-[1.75rem]" style={{ fontFamily: stacks.display }}>
          {familyName(pairing.display)}
        </p>
        <p data-gp-type-line className="mt-1 text-sm" style={{ fontFamily: stacks.body, color: 'var(--sq-ink-soft)' }}>
          {familyName(pairing.body)} voor de lopende tekst
        </p>
        <p
          data-gp-type-line
          className="mt-4 max-w-[30ch] text-[0.9375rem] leading-relaxed"
          style={{ fontFamily: stacks.body, color: 'var(--sq-ink-soft)' }}
        >
          {item.summary}
        </p>
      </div>
    </div>
  );
}

/* --- Recepten: getypte richting (palet + type + stem) ---------------------- */

function RecipePreview({ item }: { item: GalleryItem }) {
  if (item.data.kind !== 'recipe') return null;
  const { recipe, palette, stacks, voice } = item.data;
  const colors = palette?.colors ?? {
    background: 'var(--sq-inverse)',
    surface: 'var(--sq-inverse-raised)',
    text: 'var(--sq-inverse-ink)',
    accent: 'var(--sq-accent)',
  };
  const dots = Object.values(colors).filter((c): c is string => Boolean(c));

  return (
    <div
      data-gp-scene="recipe"
      className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.4rem] border p-6 sm:p-7"
      style={{ background: colors.background, borderColor: 'var(--sq-line)' }}
    >
      <div>
        <span
          data-gp-tag
          className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em]"
          style={{ color: colors.accent }}
        >
          {recipe.tags[0]?.replace(/-/g, ' ') ?? 'Richting'}
        </span>
        <p
          data-gp-recipe-name
          className="mt-2 text-2xl leading-tight sm:text-[1.75rem]"
          style={{ color: colors.text, fontFamily: stacks?.display }}
        >
          {recipe.name}
        </p>
        <span
          data-gp-accent-line
          aria-hidden
          className="mt-3 block h-0.5 w-16 origin-left rounded-full"
          style={{ background: colors.accent }}
        />
      </div>

      <div className="flex items-end justify-between gap-4">
        {voice ? (
          <p
            data-gp-voice
            className="max-w-[24ch] text-sm leading-snug"
            style={{ color: colors.text, opacity: 0.72, fontFamily: stacks?.body }}
          >
            {voice.sample ? `“${voice.sample}”` : voice.summary}
          </p>
        ) : (
          <span />
        )}
        <div className="flex shrink-0 gap-1.5">
          {dots.map((color, index) => (
            <span
              key={`${color}-${index}`}
              data-gp-dot
              className="h-5 w-5 rounded-full border"
              style={{ background: color, borderColor: 'rgba(0,0,0,0.12)' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* --- Secties: abstracte layout-wireframe ----------------------------------- */

/** Per sectie-soort een klein rijtje wireframe-blokken; het accent-blok is de held. */
const SECTION_WIRE: Record<string, Array<{ w: string; h: string; accent?: boolean }>> = {
  hero: [{ w: '55%', h: '1.5rem' }, { w: '80%', h: '0.6rem' }, { w: '38%', h: '2.25rem', accent: true }],
  proof: [{ w: '30%', h: '0.6rem' }, { w: '100%', h: '2.5rem' }, { w: '60%', h: '0.6rem', accent: true }],
  features: [{ w: '45%', h: '1.1rem' }, { w: '100%', h: '3.25rem', accent: true }, { w: '100%', h: '0.6rem' }],
  offering: [{ w: '40%', h: '1.1rem' }, { w: '100%', h: '3.75rem', accent: true }],
  process: [{ w: '35%', h: '1.1rem' }, { w: '100%', h: '0.9rem' }, { w: '82%', h: '0.9rem' }, { w: '64%', h: '0.9rem', accent: true }],
  'story-proof': [{ w: '48%', h: '1.5rem' }, { w: '90%', h: '0.6rem' }, { w: '70%', h: '2rem', accent: true }],
  gallery: [{ w: '35%', h: '1.1rem' }, { w: '100%', h: '4rem', accent: true }],
  faq: [{ w: '42%', h: '1.1rem' }, { w: '100%', h: '0.9rem' }, { w: '100%', h: '0.9rem' }, { w: '75%', h: '0.9rem', accent: true }],
  cta: [{ w: '62%', h: '1.75rem' }, { w: '85%', h: '0.6rem' }, { w: '34%', h: '2.25rem', accent: true }],
};

function SectionPreview({ item }: { item: GalleryItem }) {
  if (item.data.kind !== 'section') return null;
  const { section } = item.data;
  const rows = SECTION_WIRE[section.kind] ?? SECTION_WIRE.hero;

  return (
    <div
      data-gp-scene="section"
      className="flex h-full flex-col justify-between overflow-hidden rounded-[1.4rem] border p-6"
      style={{ background: 'var(--sq-raised)', borderColor: 'var(--sq-line)' }}
    >
      <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--sq-ink-faint)' }}>
        {item.tags[1] ?? section.category}
      </span>

      <div className="flex flex-col gap-3">
        {rows.map((row, index) => (
          <span
            key={index}
            data-gp-wire
            className="block rounded-md"
            style={{
              width: row.w,
              height: row.h,
              background: row.accent ? 'var(--sq-accent)' : 'var(--sq-line-strong)',
              opacity: row.accent ? 1 : 0.55,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* --- Public switch ---------------------------------------------------------- */

export function GalleryPreview({ item, maxRail }: { item: GalleryItem; maxRail?: number }) {
  switch (item.category) {
    case 'kleuren':
      return <PalettePreview item={item} maxRail={maxRail} />;
    case 'typografie':
      return <TypePreview item={item} />;
    case 'recepten':
      return <RecipePreview item={item} />;
    case 'secties':
      return <SectionPreview item={item} />;
    default:
      return null;
  }
}

/* --- Scenes ----------------------------------------------------------------- */

function sceneRoot(card: HTMLElement): HTMLElement | null {
  return card.querySelector<HTMLElement>('[data-gp-scene]');
}

/**
 * Entrance-microscène: spoelt de finale markup terug via from()-tweens en speelt
 * één keer af terwijl de kaart in beeld scrollt. Caller bezit playback + cleanup.
 */
export function buildArrivalScene(card: HTMLElement): gsap.core.Timeline | null {
  const root = sceneRoot(card);
  if (!root) return null;
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({ paused: true, defaults: { ease: EASE_OUT } });

  switch (root.dataset.gpScene) {
    case 'palette':
      tl.from(q('[data-gp-swatch]'), { scaleY: 0, transformOrigin: 'center bottom', duration: 0.55, stagger: 0.09 })
        .from(q('[data-gp-disc]'), { scale: 0, duration: 0.55, ease: 'back.out(2)' }, 0.12)
        .from(q('[data-gp-hex]'), { autoAlpha: 0, x: -8, duration: 0.4, stagger: 0.05 }, 0.22);
      break;
    case 'type':
      tl.from(q('[data-gp-letter]'), { yPercent: 70, autoAlpha: 0, duration: 0.7, stagger: 0.08 })
        .from(q('[data-gp-bar]'), { scaleX: 0, transformOrigin: 'right center', duration: 0.5, stagger: 0.08 }, 0.15)
        .from(q('[data-gp-type-line]'), { autoAlpha: 0, y: 12, duration: 0.55, stagger: 0.08 }, 0.25);
      break;
    case 'recipe':
      tl.from(q('[data-gp-tag]'), { autoAlpha: 0, y: 8, duration: 0.45 })
        .from(q('[data-gp-recipe-name]'), { autoAlpha: 0, y: 14, duration: 0.6 }, 0.08)
        .from(q('[data-gp-accent-line]'), { scaleX: 0, transformOrigin: 'left center', duration: 0.5 }, 0.2)
        .from(q('[data-gp-dot]'), { scale: 0, duration: 0.45, ease: 'back.out(2.2)', stagger: 0.06 }, 0.28)
        .from(q('[data-gp-voice]'), { autoAlpha: 0, y: 10, duration: 0.55 }, 0.3);
      break;
    case 'section':
      tl.from(q('[data-gp-wire]'), {
        scaleX: 0,
        transformOrigin: 'left center',
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.09,
      });
      break;
    default:
      return null;
  }
  return tl;
}

/**
 * Hover-microscène: kleine, duur-aanvoelende to()-timeline.
 * play() op pointerenter, reverse() op pointerleave.
 */
export function buildHoverScene(card: HTMLElement): gsap.core.Timeline | null {
  const root = sceneRoot(card);
  if (!root) return null;
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({ paused: true, defaults: { duration: 0.35, ease: 'power3.out' } });

  switch (root.dataset.gpScene) {
    case 'palette':
      tl.to(q('[data-gp-disc]'), { y: -6, scale: 1.07, ease: 'back.out(2)' }, 0).to(
        q('[data-gp-swatch]'),
        { x: 4, stagger: 0.04 },
        0
      );
      break;
    case 'type': {
      const letters = q('[data-gp-letter]');
      tl.to(letters[0], { x: -3 }, 0)
        .to(letters[1], { x: 6 }, 0)
        .to(q('[data-gp-bar]'), { scaleX: 1.3, transformOrigin: 'right center', stagger: 0.05 }, 0);
      break;
    }
    case 'recipe':
      tl.to(q('[data-gp-dot]'), { y: -3, scale: 1.12, ease: 'back.out(2)', stagger: 0.04 }, 0).to(
        q('[data-gp-accent-line]'),
        { scaleX: 1.5, transformOrigin: 'left center' },
        0
      );
      break;
    case 'section':
      tl.to(q('[data-gp-wire]'), { x: 5, stagger: 0.04 }, 0);
      break;
    default:
      return null;
  }
  return tl;
}

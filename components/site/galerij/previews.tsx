'use client';

import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, EASE_OUT } from '@/components/site/motion';
import type { GalleryItem } from '@/lib/gallery/curated-gallery';
import { extractAssetPaletteColors, isLightColor } from '@/lib/vault/visual-extract';

/**
 * Per-category preview treatments for the public gallery (/galerij).
 * Static, data-driven renders built from GalleryItem text only; no live
 * sandboxes. Markup ships in its FINAL state; the arrival scenes rewind via
 * from() tweens and the hover scenes are play/reverse to() timelines
 * (showcase pattern, transforms + opacity only).
 */

/* --- Text extraction (presentation-only, data layer stays frozen) --------- */

const FONT_FAMILY_ALL = /font-family\s*:\s*["']?([^;"'\n,]+)/gi;

/** Both faces of a pairing: every `font-family:` line in order, else the title split on `+`. */
export function extractFontPairing(item: GalleryItem): { display: string; text: string } {
  const names: string[] = [];
  FONT_FAMILY_ALL.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = FONT_FAMILY_ALL.exec(item.body)) !== null) {
    names.push(match[1].trim());
  }
  if (names.length >= 2) return { display: names[0], text: names[1] };

  const parts = item.title.split('+').map((part) => part.trim());
  return { display: names[0] ?? parts[0] ?? item.title, text: parts[1] ?? parts[0] ?? item.title };
}

/** Fonts we can render honestly: loaded faces resolve, unknown names fall back per role. */
const FONT_STACKS: Record<string, string> = {
  fraunces: "var(--font-fraunces), 'Fraunces', Georgia, serif",
  inter: "var(--font-inter), 'Inter', system-ui, sans-serif",
  urbanist: "var(--font-urbanist), 'Urbanist', system-ui, sans-serif",
  comfortaa: "var(--font-comfortaa), 'Comfortaa', system-ui, sans-serif",
};

function fontStack(name: string, role: 'display' | 'text'): string {
  return FONT_STACKS[name.toLowerCase()] ?? (role === 'display' ? 'Georgia, serif' : 'system-ui, sans-serif');
}

function bodyLines(item: GalleryItem): string[] {
  return item.body
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/** Bullet-dominated bodies (checklists, guardrails) get the checklist treatment. */
export function promptVariant(item: GalleryItem): 'checklist' | 'composer' {
  const lines = bodyLines(item);
  const bullets = lines.filter((line) => line.startsWith('- ')).length;
  return lines.length > 0 && bullets / lines.length > 0.6 ? 'checklist' : 'composer';
}

/** The palette's "one bold move": the most saturated color in the set. */
function pickAccentColor(colors: string[]): string | null {
  let best: string | null = null;
  let bestSpread = -1;
  for (const color of colors) {
    const hex = color.match(/^#([0-9a-f]{6})$/i)?.[1];
    if (!hex) continue;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const spread = Math.max(r, g, b) - Math.min(r, g, b);
    if (spread > bestSpread) {
      bestSpread = spread;
      best = color;
    }
  }
  return best;
}

function inkOn(color: string): string {
  return isLightColor(color) ? 'rgba(20, 16, 10, 0.66)' : 'rgba(255, 252, 246, 0.82)';
}

/* --- Kleuren: editorial swatch composition -------------------------------- */

function PalettePreview({ item, maxRail = 5 }: { item: GalleryItem; maxRail?: number }) {
  const colors = extractAssetPaletteColors(item);
  const field = colors[0] ?? 'var(--sq-sunken)';
  const rest = colors.slice(1);
  const accent = pickAccentColor(rest) ?? rest[0] ?? field;
  const rail = rest.filter((color) => color !== accent).slice(0, maxRail);

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
        {rail.map((color) => (
          <span
            key={color}
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

/* --- Typografie: pairing specimen ------------------------------------------ */

function TypePreview({ item }: { item: GalleryItem }) {
  const pairing = extractFontPairing(item);
  const displayStack = fontStack(pairing.display, 'display');
  const textStack = fontStack(pairing.text, 'text');

  return (
    <div
      data-gp-scene="type"
      className="flex h-full flex-col justify-between overflow-hidden rounded-[1.4rem] border p-6 sm:p-7"
      style={{ background: 'var(--sq-raised)', borderColor: 'var(--sq-line)' }}
    >
      <div className="flex items-start justify-between gap-4">
        <p aria-hidden className="leading-none" style={{ fontFamily: displayStack, fontSize: 'clamp(4.25rem, 8vw, 6.5rem)' }}>
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
        <p data-gp-type-line className="text-2xl leading-tight sm:text-[1.75rem]" style={{ fontFamily: displayStack }}>
          {pairing.display}
        </p>
        <p data-gp-type-line className="mt-1 text-sm" style={{ fontFamily: textStack, color: 'var(--sq-ink-soft)' }}>
          {pairing.text} voor de lopende tekst
        </p>
        <p
          data-gp-type-line
          className="mt-4 max-w-[30ch] text-[0.9375rem] leading-relaxed"
          style={{ fontFamily: textStack, color: 'var(--sq-ink-soft)' }}
        >
          {item.summary}
        </p>
      </div>
    </div>
  );
}

/* --- Visuele richting: manifesto mood card ---------------------------------- */

function extractDirection(item: GalleryItem): { rules: string[]; quote: string } {
  const lines = item.body.split('\n').map((line) => line.trim());

  const rules: string[] = [];
  let inDoen = false;
  for (const line of lines) {
    if (/^##\s*doen/i.test(line)) {
      inDoen = true;
      continue;
    }
    if (inDoen && line.startsWith('##')) break;
    if (inDoen && line.startsWith('- ')) rules.push(line.slice(2));
  }
  if (rules.length === 0) {
    rules.push(...lines.filter((line) => line.length > 0 && !line.startsWith('#')).slice(0, 3));
  }

  const quote =
    lines
      .find((line) => line.startsWith('"'))
      ?.replace(/^"|"$/g, '') ?? item.summary;

  return { rules: rules.slice(0, 3), quote };
}

function DirectionPreview({ item }: { item: GalleryItem }) {
  const { rules, quote } = extractDirection(item);

  return (
    <div
      data-gp-scene="direction"
      className="relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-[1.4rem] p-7 sm:p-9 lg:flex-row lg:items-end"
      style={{ background: 'var(--sq-inverse)', color: 'var(--sq-inverse-ink)' }}
    >
      <span
        data-gp-disc
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full sm:h-60 sm:w-60"
        style={{ background: 'var(--sq-accent)' }}
      />

      <div className="relative max-w-md space-y-3.5">
        {rules.map((rule) => (
          <div key={rule} data-gp-rule className="flex items-center gap-3">
            <span data-gp-rule-bar aria-hidden className="h-px w-8 shrink-0" style={{ background: 'var(--sq-accent)' }} />
            <p className="text-sm leading-snug" style={{ color: 'var(--sq-inverse-soft)' }}>
              {rule}
            </p>
          </div>
        ))}
      </div>

      <p data-gp-quote className="sq-display relative max-w-xl text-xl leading-snug sm:text-2xl lg:text-right">
        &bdquo;{quote}&rdquo;
      </p>
    </div>
  );
}

/* --- Prompts: composer + checklist ------------------------------------------ */

const PLACEHOLDER_PATTERN = /(\[[^\]]+\])/g;

function lineWithChips(line: string): ReactNode {
  const parts = line.split(PLACEHOLDER_PATTERN);
  if (parts.length === 1) return line;
  return parts.map((part, index) =>
    part.startsWith('[') && part.endsWith(']') ? (
      <span
        key={index}
        data-gp-chip
        className="inline-block rounded-md px-1.5 text-[0.6875rem] font-semibold leading-relaxed"
        style={{ background: 'var(--sq-accent-wash)', color: 'var(--sq-accent-ink)' }}
      >
        {part.slice(1, -1)}
      </span>
    ) : (
      <span key={index}>{part}</span>
    )
  );
}

function ComposerPreview({ item }: { item: GalleryItem }) {
  const lines = bodyLines(item).slice(0, 6);

  return (
    <div
      data-gp-scene="composer"
      className="flex h-full flex-col overflow-hidden rounded-[1.4rem] border"
      style={{ background: 'var(--sq-raised)', borderColor: 'var(--sq-line)' }}
    >
      <div className="flex items-center gap-2 border-b px-5 py-3" style={{ borderColor: 'var(--sq-line)' }}>
        <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: 'var(--sq-accent)' }} />
        <p className="text-xs font-medium" style={{ color: 'var(--sq-ink-faint)' }}>
          Klaar om te plakken
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-hidden px-5 py-4">
        {lines.map((line, index) => {
          const isHeading = line.startsWith('#') || line.endsWith(':');
          return (
            <p
              key={index}
              data-gp-line
              className="truncate text-[0.8125rem] leading-relaxed"
              style={{
                color: isHeading ? 'var(--sq-ink)' : 'var(--sq-ink-soft)',
                fontWeight: isHeading ? 600 : undefined,
              }}
            >
              {lineWithChips(line.replace(/^#+\s*/, ''))}
            </p>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t px-5 py-3" style={{ borderColor: 'var(--sq-line)' }}>
        <p className="text-xs" style={{ color: 'var(--sq-ink-faint)' }}>
          Plakken in ChatGPT of Claude
        </p>
        <span
          data-gp-send
          aria-hidden
          className="flex h-7 w-7 items-center justify-center rounded-full"
          style={{ background: 'var(--sq-accent)', color: '#fff8f2' }}
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

function ChecklistPreview({ item }: { item: GalleryItem }) {
  const steps = bodyLines(item)
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2))
    .slice(0, 6);

  return (
    <div
      data-gp-scene="checklist"
      className="flex h-full flex-col justify-center gap-3 overflow-hidden rounded-[1.4rem] border p-5 sm:p-6"
      style={{ background: 'var(--sq-raised)', borderColor: 'var(--sq-line)' }}
    >
      {steps.map((step) => (
        <div key={step} data-gp-step className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border"
            style={{ borderColor: 'var(--sq-line-strong)' }}
          >
            <span data-gp-check className="h-2 w-2 rounded-full" style={{ background: 'var(--sq-accent)' }} />
          </span>
          <p className="truncate text-sm" style={{ color: 'var(--sq-ink-soft)' }}>
            {step}
          </p>
        </div>
      ))}
    </div>
  );
}

/* --- Public switch ------------------------------------------------------------ */

export function GalleryPreview({ item, maxRail }: { item: GalleryItem; maxRail?: number }) {
  if (item.category === 'kleuren') return <PalettePreview item={item} maxRail={maxRail} />;
  if (item.category === 'typografie') return <TypePreview item={item} />;
  if (item.category === 'richting') return <DirectionPreview item={item} />;
  return promptVariant(item) === 'checklist' ? <ChecklistPreview item={item} /> : <ComposerPreview item={item} />;
}

/* --- Scenes -------------------------------------------------------------------- */

function sceneRoot(card: HTMLElement): HTMLElement | null {
  return card.querySelector<HTMLElement>('[data-gp-scene]');
}

/**
 * Entrance micro-scene: rewinds the final markup via from() tweens and plays
 * once as the card scrolls in. Caller owns playback and cleanup (useGSAP).
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
    case 'direction':
      tl.from(q('[data-gp-disc]'), { scale: 0.5, autoAlpha: 0, duration: 0.7 })
        .from(q('[data-gp-rule-bar]'), { scaleX: 0, transformOrigin: 'left center', duration: 0.45, stagger: 0.1 }, 0.15)
        .from(q('[data-gp-rule]'), { autoAlpha: 0, x: -10, duration: 0.5, stagger: 0.1 }, 0.15)
        .from(q('[data-gp-quote]'), { autoAlpha: 0, y: 10, duration: 0.6 }, 0.4);
      break;
    case 'checklist':
      tl.from(q('[data-gp-step]'), { autoAlpha: 0, x: -14, duration: 0.5, stagger: 0.07 }).from(
        q('[data-gp-check]'),
        { scale: 0, duration: 0.4, ease: 'back.out(2.5)', stagger: 0.07 },
        0.12
      );
      break;
    case 'composer':
      tl.from(q('[data-gp-line]'), { autoAlpha: 0, y: 8, duration: 0.45, stagger: 0.05 }).from(
        q('[data-gp-send]'),
        { scale: 0, duration: 0.45, ease: 'back.out(2.5)' },
        0.3
      );
      break;
    default:
      return null;
  }
  return tl;
}

/**
 * Hover micro-scene: small, expensive-feeling to() timeline.
 * play() on pointerenter, reverse() on pointerleave.
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
    case 'direction':
      tl.to(q('[data-gp-disc]'), { x: -16, y: 8, scale: 1.05, duration: 0.5 }, 0).to(
        q('[data-gp-rule-bar]'),
        { scaleX: 1.6, transformOrigin: 'left center', stagger: 0.05 },
        0
      );
      break;
    case 'checklist':
      tl.to(q('[data-gp-check]'), { scale: 1.35, duration: 0.25, ease: 'back.out(3)', stagger: 0.05 }, 0);
      break;
    case 'composer':
      tl.to(q('[data-gp-chip]'), { scale: 1.08, y: -1, duration: 0.3, stagger: 0.05 }, 0).to(
        q('[data-gp-send]'),
        { x: 2, y: -2, scale: 1.12, ease: 'back.out(2)' },
        0
      );
      break;
    default:
      return null;
  }
  return tl;
}

'use client';

// components/dashboard/recept/preview/recept-preview.tsx
//
// ⚠️ SANCTIONED EXCEPTION — DO NOT REUSE THIS PATTERN ELSEWHERE.
// Struq's hard rule is "previews are static media only, never live-rendered
// components." That rule protects vault/canon asset cards. The Recept-bouwer is the
// ONE sanctioned exception: it live-renders a reacting preview because reacting is
// the product on this surface. This exception is scoped to
// components/dashboard/recept/** only. Never reuse ReceptPreview in asset cards,
// vault tiles, galerij, or anywhere else.
//
// Technique (promoted from canon-preview-dialog): the whole subtree's visual
// identity is driven by CSS custom properties (--rb-*) set on its root plus an icon
// set. Changing a picker = new var values = the whole site re-skins in one React
// commit, with `transition: ... 200ms` on the var-consuming properties doing the
// colour crossfade for free. Every colour/font flows from the vars via inline style;
// zero Tailwind colour utilities inside the themed subtree.

import { useReducedMotion } from 'framer-motion';
import { Icon } from '@iconify/react';
import type { ResolvedRecept } from '@/lib/recept/types';
import type { IconSemanticId } from '@/lib/canon/types';
import { fontStacksFor } from '@/lib/recept/font-stacks';

/** A semantic glyph from the resolved icon set, sized by the caller. */
function Glyph({
  resolved,
  semantic,
  className,
  style,
}: {
  resolved: ResolvedRecept;
  semantic: IconSemanticId;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { iconSet } = resolved;
  const name = iconSet.semanticMap[semantic];
  return <Icon icon={`${iconSet.iconifyPrefix}:${name}`} className={className} style={style} aria-hidden="true" />;
}

export function ReceptPreview({ resolved }: { resolved: ResolvedRecept }) {
  const reduce = useReducedMotion();
  const { palette, pairing } = resolved;
  const stacks = fontStacksFor(pairing.id);
  const c = palette.colors;

  const themeVars = {
    '--rb-bg': c.background,
    '--rb-surface': c.surface,
    '--rb-text': c.text,
    '--rb-accent': c.accent,
    '--rb-accent-alt': c.accentAlt ?? c.accent,
    '--rb-display': stacks.display,
    '--rb-body': stacks.body,
    // Only the colour-consuming properties transition; fonts/icons swap on commit.
    transition: reduce ? undefined : 'background-color 200ms ease, color 200ms ease, border-color 200ms ease',
  } as React.CSSProperties;

  const hairline = 'color-mix(in srgb, var(--rb-text) 12%, transparent)';
  const muted = 'color-mix(in srgb, var(--rb-text) 65%, transparent)';

  return (
    <div
      style={{ ...themeVars, background: 'var(--rb-bg)', color: 'var(--rb-text)', fontFamily: 'var(--rb-body)' }}
    >
      {/* NAV — display font at small size, accent as interactive fill, first icon */}
      <header
        className="flex items-center justify-between px-6 py-4 sm:px-9 sm:py-5"
        style={{ borderBottom: `1px solid ${hairline}` }}
      >
        <span className="text-[0.95rem] font-semibold tracking-tight" style={{ fontFamily: 'var(--rb-display)' }}>
          Atelier Noord
        </span>
        <nav className="flex items-center gap-5 text-[0.8rem]" style={{ color: muted }}>
          <span className="hidden sm:inline">Werk</span>
          <span className="hidden sm:inline">Studio</span>
          <span className="hidden sm:inline">Journal</span>
          <Glyph resolved={resolved} semantic="search" className="h-[1.05rem] w-[1.05rem]" />
          <span
            className="rounded-full px-4 py-1.5 text-[0.72rem] font-medium"
            style={{ background: 'var(--rb-accent)', color: 'var(--rb-bg)' }}
          >
            Contact
          </span>
        </nav>
      </header>

      {/* HERO — the type pairing's whole hierarchy + the palette's core contrast */}
      <section className="px-6 py-16 sm:px-12 sm:py-24">
        <span className="text-[0.72rem] font-medium uppercase tracking-[0.22em]" style={{ color: 'var(--rb-accent)' }}>
          Studio voor merk & ruimte
        </span>
        <h1
          className="mt-5 max-w-2xl text-[clamp(2rem,5vw,3.75rem)] font-medium leading-[1.02] tracking-tight"
          style={{ fontFamily: 'var(--rb-display)' }}
        >
          Rustige ontwerpen die blijven staan.
        </h1>
        <p className="mt-6 max-w-lg text-[0.98rem] leading-relaxed" style={{ color: muted }}>
          Atelier Noord bouwt merken en interieurs met één heldere richting. Een
          combinatie van smaak en structuur die vertrouwen wekt en de aandacht op het
          werk houdt.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <span
            className="rounded-full px-6 py-3 text-[0.85rem] font-medium"
            style={{ background: 'var(--rb-accent)', color: 'var(--rb-bg)' }}
          >
            Start een project
          </span>
          <span className="inline-flex items-center gap-1.5 text-[0.85rem] font-medium" style={{ color: 'var(--rb-text)' }}>
            Bekijk het werk
            <Glyph resolved={resolved} semantic="arrow-up-right" className="h-4 w-4" />
          </span>
        </div>
      </section>

      {/* FEATURE GRID — surface vs background depth, icons as content, body readability */}
      <section
        className="grid grid-cols-1 gap-5 px-6 py-14 sm:grid-cols-3 sm:px-12"
        style={{ background: 'var(--rb-surface)' }}
      >
        {[
          { semantic: 'compass' as const, title: 'Richting', body: 'Eén heldere designtaal die elk contactmoment consistent houdt.' },
          { semantic: 'shield' as const, title: 'Ambacht', body: 'Details die kloppen, van typografie tot de kleinste interactie.' },
          { semantic: 'activity' as const, title: 'Resultaat', body: 'Werk dat presteert en waar opdrachtgevers trots op zijn.' },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl p-6"
            style={{ background: 'var(--rb-bg)', border: `1px solid ${hairline}` }}
          >
            <div
              className="mb-4 flex h-11 w-11 items-center justify-center rounded-full"
              style={{ background: 'color-mix(in srgb, var(--rb-accent) 16%, transparent)', color: 'var(--rb-accent)' }}
            >
              <Glyph resolved={resolved} semantic={card.semantic} className="h-5 w-5" />
            </div>
            <p className="text-[1.02rem] font-medium" style={{ fontFamily: 'var(--rb-display)' }}>
              {card.title}
            </p>
            <p className="mt-2 text-[0.86rem] leading-relaxed" style={{ color: muted }}>
              {card.body}
            </p>
          </div>
        ))}
      </section>

      {/* SPLIT — accentAlt, icons inline with text, editorial rhythm */}
      <section className="grid grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-2 sm:px-12 sm:py-20">
        <blockquote
          className="text-[clamp(1.3rem,2.6vw,1.9rem)] font-medium leading-snug"
          style={{ fontFamily: 'var(--rb-display)' }}
        >
          “Goed ontwerp fluistert. Het overtuigt zonder te schreeuwen.”
        </blockquote>
        <div className="flex flex-col gap-5">
          <ul className="flex flex-col gap-3 text-[0.9rem]">
            {['Merkstrategie & identiteit', 'Interieur & ruimtelijk ontwerp', 'Digitale ervaringen'].map((row) => (
              <li key={row} className="flex items-center gap-3">
                <Glyph resolved={resolved} semantic="check" className="h-[1.1rem] w-[1.1rem]" style={{ color: 'var(--rb-accent-alt)' }} />
                <span>{row}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex gap-10" style={{ borderTop: `1px solid ${hairline}`, paddingTop: '1.25rem' }}>
            <div>
              <div className="text-[1.9rem] font-medium leading-none" style={{ fontFamily: 'var(--rb-display)', color: 'var(--rb-accent-alt)' }}>
                14
              </div>
              <div className="mt-1.5 text-[0.78rem]" style={{ color: muted }}>
                jaar ervaring
              </div>
            </div>
            <div>
              <div className="text-[1.9rem] font-medium leading-none" style={{ fontFamily: 'var(--rb-display)', color: 'var(--rb-accent-alt)' }}>
                120+
              </div>
              <div className="mt-1.5 text-[0.78rem]" style={{ color: muted }}>
                projecten opgeleverd
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT STRIP — the inverted "is this direction real" test */}
      <section
        className="px-6 py-14 sm:px-12"
        style={{ background: 'var(--rb-text)', color: 'var(--rb-bg)' }}
      >
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="max-w-md text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-tight" style={{ fontFamily: 'var(--rb-display)' }}>
              Laten we iets moois maken.
            </h2>
            <div className="mt-5 flex flex-col gap-2.5 text-[0.9rem]" style={{ opacity: 0.85 }}>
              <span className="inline-flex items-center gap-2.5">
                <Glyph resolved={resolved} semantic="mail" className="h-[1.05rem] w-[1.05rem]" />
                studio@ateliernoord.nl
              </span>
              <span className="inline-flex items-center gap-2.5">
                <Glyph resolved={resolved} semantic="phone" className="h-[1.05rem] w-[1.05rem]" />
                +31 20 123 45 67
              </span>
            </div>
          </div>
          <span
            className="self-start rounded-full px-6 py-3 text-[0.85rem] font-medium sm:self-auto"
            style={{ background: 'var(--rb-accent)', color: 'var(--rb-bg)' }}
          >
            Plan een kennismaking
          </span>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="flex items-center justify-between px-6 py-6 text-[0.78rem] sm:px-12"
        style={{ color: muted }}
      >
        <span className="inline-flex items-center gap-2">
          <Glyph resolved={resolved} semantic="globe" className="h-[1rem] w-[1rem]" />
          ateliernoord.nl
        </span>
        <span style={{ fontFamily: 'var(--rb-display)' }}>Atelier Noord</span>
      </footer>
    </div>
  );
}

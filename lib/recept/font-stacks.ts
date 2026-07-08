// lib/recept/font-stacks.ts
//
// Maps a canon typography pairing id → the { display, body } CSS font stacks the
// live preview actually renders with. Each stack FRONTS the route-scoped next/font
// variable (see app/(dashboard)/recept/fonts.ts) so the real face loads — canon's
// own stacks in lib/canon/typography.ts name the families but load nothing, which
// is fine for a modal snapshot but fatal for a flagship typography surface.
//
// Known gap (codified, not hidden): Neue Haas Grotesk Text (body of
// editorial-sans-precision) is a commercial face — it falls back to Helvetica/Arial
// by design. Every other family here is Google-available and loaded route-scoped.

const SANS_FALLBACK = 'ui-sans-serif, system-ui, sans-serif';
const SERIF_FALLBACK = 'Georgia, serif';

export type FontStacks = { display: string; body: string };

/** pairingId → the loaded stacks. Keys match CANON_TYPOGRAPHY ids exactly. */
export const RECEPT_FONT_STACKS: Record<string, FontStacks> = {
  'editorial-sans-precision': {
    display: `var(--font-sora), ${SANS_FALLBACK}`,
    // Neue Haas is commercial → honest Helvetica/Arial fallback, no loaded var.
    body: '"Neue Haas Grotesk Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  'grotesk-workhorse': {
    display: `var(--font-space-grotesk), ${SANS_FALLBACK}`,
    body: `var(--font-inter), ${SANS_FALLBACK}`,
  },
  'serif-editorial': {
    display: `var(--font-fraunces), ${SERIF_FALLBACK}`,
    body: `var(--font-inter), ${SANS_FALLBACK}`,
  },
  'display-drama': {
    display: `var(--font-syne), ${SANS_FALLBACK}`,
    body: `var(--font-hanken-grotesk), ${SANS_FALLBACK}`,
  },
  'newsreader-classic': {
    display: `var(--font-newsreader), ${SERIF_FALLBACK}`,
    body: `var(--font-public-sans), ${SANS_FALLBACK}`,
  },
  'geometric-modern': {
    display: `var(--font-manrope), ${SANS_FALLBACK}`,
    body: `var(--font-figtree), ${SANS_FALLBACK}`,
  },
};

const DEFAULT_STACKS: FontStacks = {
  display: `var(--font-sora), ${SANS_FALLBACK}`,
  body: SANS_FALLBACK,
};

export function fontStacksFor(pairingId: string): FontStacks {
  return RECEPT_FONT_STACKS[pairingId] ?? DEFAULT_STACKS;
}

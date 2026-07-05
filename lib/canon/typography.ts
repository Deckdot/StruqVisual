// lib/canon/typography.ts
//
// Typography canon — the visual layer (font pairings + specimen text). Ported from
// DesignOS design-os/assets/typography.yaml, trimmed to what a specimen card needs
// to render (display/body stacks, intent). The pipeline scale/role tables are not
// ported — Struq only needs the visual pairing.

import type { FontPairing } from './types';

export const CANON_TYPOGRAPHY: FontPairing[] = [
  {
    id: 'editorial-sans-precision',
    name: 'Editorial Sans Precision',
    mood: 'quiet architectural',
    notes: 'Quiet architectural sans display with readable neutral body copy and a restrained editorial accent.',
    display: '"Sora", ui-sans-serif, system-ui, sans-serif',
    body: '"Neue Haas Grotesk Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  {
    id: 'grotesk-workhorse',
    name: 'Grotesk Workhorse',
    mood: 'clean product',
    notes: 'A neutral grotesk display over a dependable sans body — versatile for product and SaaS surfaces.',
    display: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
    body: '"Inter", ui-sans-serif, system-ui, sans-serif',
  },
  {
    id: 'serif-editorial',
    name: 'Serif Editorial',
    mood: 'luxury restraint',
    notes: 'Light serif display with a calm sans body — premium, quiet, fashion-led interfaces.',
    display: '"Fraunces", Georgia, serif',
    body: '"Inter", ui-sans-serif, system-ui, sans-serif',
  },
  {
    id: 'display-drama',
    name: 'Display Drama',
    mood: 'expressive campaign',
    notes: 'Larger jumps and tighter display leading for expressive landing and campaign pages.',
    display: '"Syne", ui-sans-serif, system-ui, sans-serif',
    body: '"Hanken Grotesk", ui-sans-serif, system-ui, sans-serif',
  },
  {
    id: 'newsreader-classic',
    name: 'Newsreader Classic',
    mood: 'editorial warmth',
    notes: 'A warm reading serif paired with a clean sans — long-form and editorial directions.',
    display: '"Newsreader", Georgia, serif',
    body: '"Public Sans", ui-sans-serif, system-ui, sans-serif',
  },
  {
    id: 'geometric-modern',
    name: 'Geometric Modern',
    mood: 'confident modern',
    notes: 'Geometric display with an even, humanist body — confident, contemporary product brands.',
    display: '"Manrope", ui-sans-serif, system-ui, sans-serif',
    body: '"Figtree", ui-sans-serif, system-ui, sans-serif',
  },
];

/** Specimen strings reused across typography cards. */
export const TYPOGRAPHY_SPECIMEN = {
  eyebrow: 'Aa Bb Cc — 0123456789',
  display: 'Van smaak naar structuur.',
  body: 'Herbruikbare front-ends van hoog niveau, direct bruikbaar in elke AI-tool. Kies een richting en bouw verder.',
};

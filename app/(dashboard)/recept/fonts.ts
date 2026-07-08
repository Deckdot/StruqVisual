// app/(dashboard)/recept/fonts.ts
//
// Route-scoped Google fonts for the Recept-bouwer preview. The canon preview dialog
// names font stacks but loads nothing, so today's previews silently render system
// fallbacks — fatal for a flagship typography surface. These are the ~10 families
// across all 6 canon pairings; each exposes a CSS variable that lib/recept/font-stacks
// fronts. Weights limited (400/500/600), display:'swap', no FOIT.
//
// Neue Haas Grotesk Text (body of editorial-sans-precision) is commercial and NOT
// loaded here — font-stacks.ts codifies its Helvetica/Arial fallback.
//
// ~10 families on one route is the cost of the surface's entire point; it is
// route-scoped so no other page pays it.

import {
  Sora,
  Space_Grotesk,
  Inter,
  Fraunces,
  Syne,
  Hanken_Grotesk,
  Newsreader,
  Public_Sans,
  Manrope,
  Figtree,
} from 'next/font/google';

const sora = Sora({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-sora', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-space-grotesk', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const fraunces = Fraunces({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-fraunces', display: 'swap' });
const syne = Syne({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-syne', display: 'swap' });
const hankenGrotesk = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-hanken-grotesk', display: 'swap' });
const newsreader = Newsreader({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-newsreader', display: 'swap' });
const publicSans = Public_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-public-sans', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-manrope', display: 'swap' });
const figtree = Figtree({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-figtree', display: 'swap' });

/** All preview-font variables, attached to the recept page root. */
export const RECEPT_FONT_VARS = [
  sora.variable,
  spaceGrotesk.variable,
  inter.variable,
  fraunces.variable,
  syne.variable,
  hankenGrotesk.variable,
  newsreader.variable,
  publicSans.variable,
  manrope.variable,
  figtree.variable,
].join(' ');

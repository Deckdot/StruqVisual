import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import GalerijClient from '@/components/site/galerij/galerij-client';
import { CURATED_GALLERY } from '@/lib/gallery/curated-gallery';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

// Route-scoped specimen faces: the typografie-cards render their real pairing
// (Fraunces + Inter); Urbanist/Comfortaa come from the root layout already.
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-fraunces',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = generateSEOMetadata({
  title: 'Gratis galerij: paletten, fonts en prompts voor je AI',
  description:
    'Blader door gratis kleurenpaletten, font-pairings en prompts die werken. Kopieer ze direct naar ChatGPT of Claude en zie meteen resultaat, of bewaar ze in je eigen Struq-vault.',
  url: 'https://struq.nl/galerij',
});

export default function GalerijPage() {
  return (
    <div className={`${fraunces.variable} ${inter.variable}`}>
      <GalerijClient items={CURATED_GALLERY} />
    </div>
  );
}

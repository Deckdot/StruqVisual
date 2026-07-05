import type { Metadata } from 'next';
import GalerijClient from '@/components/site/galerij/galerij-client';
import { CURATED_GALLERY } from '@/lib/gallery/curated-gallery';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Gratis galerij: paletten, fonts en prompts voor je AI',
  description:
    'Blader door gratis kleurenpaletten, font-pairings en prompts die werken. Kopieer ze direct naar ChatGPT of Claude en zie meteen resultaat — of bewaar ze in je eigen Struq-vault.',
  url: 'https://struq.nl/galerij',
});

export default function GalerijPage() {
  return <GalerijClient items={CURATED_GALLERY} />;
}

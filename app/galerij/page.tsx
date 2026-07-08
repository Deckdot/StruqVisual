import type { Metadata } from 'next';
import GalerijClient from '@/components/site/galerij/galerij-client';
import { CANON_GALLERY } from '@/lib/gallery/canon-gallery';
import { RECEPT_FONT_VARS } from '@/app/(dashboard)/recept/fonts';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

// Route-scoped specimen faces: de typografie- en recept-kaarten renderen hun
// echte pairing (Sora/Syne/Newsreader/…). RECEPT_FONT_VARS laadt de ~10 canon-
// families één keer, route-scoped, zodat geen andere pagina die kosten betaalt.

export const metadata: Metadata = generateSEOMetadata({
  title: 'Gratis galerij: kleurenpaletten, typografie en design systems',
  description:
    'Blader door gratis kleurenpaletten, font-pairings, recepten en secties. Kopieer de specs direct naar ChatGPT, Claude of je eigen agent, of bewaar ze in je Struq-vault.',
  url: 'https://struq.nl/galerij',
});

export default function GalerijPage() {
  return (
    <div className={RECEPT_FONT_VARS}>
      <GalerijClient items={CANON_GALLERY} />
    </div>
  );
}

import type { Metadata } from 'next';
import VisueelClient from '@/components/site/visueel/visueel-client';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Dit ga jij maken: visuele front-ends met AI',
  description:
    'Bekijk wat je met Struq bouwt: hero-secties met karakter, kleursystemen, scroll-animaties en micro-interacties. Zonder kosten vooraf, zonder designdiploma. Je AI bouwt het, jij leert onderweg.',
  url: 'https://struq.nl/visueel',
});

export default function VisueelPage() {
  return <VisueelClient />;
}

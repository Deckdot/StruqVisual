import type { Metadata } from 'next';
import MethodeClient from '@/components/site/methode/methode-client';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateSEOMetadata({
  title: 'De methode: waarom je AI beter bouwt met context',
  description:
    'Waarom bouwt de één prachtige pagina’s met AI en krijgt de ander steeds hetzelfde grijze sjabloon? Het verschil is context. Leer in gewoon Nederlands hoe context-bestanden, regels en smaak je AI laten bouwen als een topstudio.',
  url: 'https://struq.nl/methode',
});

export default function MethodePage() {
  return <MethodeClient />;
}

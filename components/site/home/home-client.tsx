'use client';

import { SiteShell } from '@/components/site/site-shell';
import { Hero } from '@/components/site/home/hero';
import { ProofMarquee } from '@/components/site/home/proof-marquee';
import { Problem } from '@/components/site/home/problem';
import { Insight } from '@/components/site/home/insight';
import { FourForms } from '@/components/site/home/four-forms';
import { Showcase } from '@/components/site/home/showcase';
import { HowItWorks } from '@/components/site/home/how-it-works';
import { Vault } from '@/components/site/home/vault';
import { MemoryField } from '@/components/site/home/memory-field';
import { Pricing } from '@/components/site/home/pricing';
import { Faq } from '@/components/site/home/faq';

/**
 * Homepage flow (elke sectie heeft één psychologisch doel):
 *  1. Hero          — power fantasy: "dat wil ik kunnen maken"
 *  2. Marquee       — momentum: er staat hier veel klaar
 *  3. Problem       — pijnherkenning: gepind theater waarin het grijze
 *                     AI-gemiddelde instort en smaak ervoor terugkomt
 *  4. Insight       — belief shift: het ligt niet aan jou; AI mist smaak
 *  5. FourForms     — taxonomie voelbaar: één silhouet morpht door
 *                     prompt, skill, context en kit (MorphSVG-pin)
 *  6. Showcase      — verlangen: de gepinde horizontale galerij
 *  7. HowItWorks    — gemak: drie stappen, geen jargon
 *  8. Vault         — tastbaarheid: het serieuze gereedschap erachter
 *  9. MemoryField   — crescendo: Three.js-chaos trekt samen tot geheugen
 * 10. Pricing       — risico weg: gratis is een echt plan
 * 11. Faq           — bezwaren weg, footer sluit af met de laatste CTA
 *
 * Blueprint (smaak.md build-along) is temporarily hidden — see blueprint.tsx.
 */
export default function HomeClient() {
  return (
    <SiteShell>
      <Hero />
      <ProofMarquee />
      <Problem />
      <Insight />
      <FourForms />
      <Showcase />
      <HowItWorks />
      <Vault />
      <MemoryField />
      <Pricing />
      <Faq />
    </SiteShell>
  );
}

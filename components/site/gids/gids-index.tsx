'use client';

import { TransitionLink as Link } from '@/components/providers/PageTransition';
import { ArrowUpRight } from 'lucide-react';
import { SiteShell } from '@/components/site/site-shell';
import { SplitHeading } from '@/components/site/split-heading';
import { Reveal } from '@/components/site/reveal';
import { GUIDES } from '@/lib/gids/guides';

/**
 * /gids — de indexhub van de evergreen gidsen. Klein en indexeerbaar:
 * een korte introductie en de gidsen op leesvolgorde (begrip -> methode ->
 * gereedschap), elk met de vraag als titel.
 */

export function GidsIndex() {
  return (
    <SiteShell>
      <section style={{ paddingTop: 'clamp(9rem, 16vh, 13rem)', paddingBottom: 'clamp(3rem, 6vh, 5rem)' }}>
        <div className="sq-container">
          <Reveal>
            <p className="sq-eyebrow">Gids</p>
          </Reveal>
          <SplitHeading as="h1" className="sq-h1 mt-7 max-w-4xl" delay={0.1} start="top 100%">
            Bouwen met AI, zonder ruis.
          </SplitHeading>
          <Reveal delay={0.2}>
            <p className="sq-lead mt-9 max-w-xl">
              Nederlandse antwoorden op de vragen die elke builder aan zijn AI stelt.
              Geen jargon, wel concrete waarden die je direct kunt gebruiken.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ paddingBottom: 'clamp(6rem, 12vh, 10rem)' }}>
        <div className="sq-container">
          <div className="grid max-w-4xl gap-5">
            {GUIDES.map((guide, index) => (
              <Reveal key={guide.slug} y={36} delay={Math.min(index * 0.08, 0.24)}>
                <Link
                  href={`/gids/${guide.slug}`}
                  className="group flex flex-col gap-4 rounded-3xl border p-7 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 sm:flex-row sm:items-center sm:justify-between sm:p-9"
                  style={{ background: 'var(--sq-raised)', borderColor: 'var(--sq-line)' }}
                >
                  <div className="min-w-0">
                    <h2 className="sq-display text-2xl leading-snug sm:text-[1.75rem]">{guide.question}</h2>
                    <p className="mt-2.5 max-w-xl text-[0.9375rem] leading-relaxed" style={{ color: 'var(--sq-ink-soft)' }}>
                      {guide.intro}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-1.5"
                    style={{ background: 'var(--sq-accent)', color: '#fff8f2' }}
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="sq-faint mt-12 max-w-md">
              Liever direct aan de slag? De gratis galerij staat vol paletten,
              font-pairings en prompts die je meteen in je AI plakt.{' '}
              <Link href="/galerij" className="sq-link !text-sm">
                Open de galerij
              </Link>
            </p>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}

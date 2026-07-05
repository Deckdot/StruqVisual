'use client';

import { useRef } from 'react';
import { TransitionLink as Link } from '@/components/providers/PageTransition';
import { gsap, useGSAP } from '@/components/site/motion';
import { SplitHeading } from '@/components/site/split-heading';
import { Reveal } from '@/components/site/reveal';

/**
 * Section 4 — The insight.
 * Goal: belief shift. "Het ligt niet aan jou en niet aan je AI" neemt de
 * schaamte weg en herkadert Struq als het ontbrekende ingrediënt: smaak.
 */
export function Insight() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-taste-ring] path',
          { drawSVG: '0% 0%' },
          {
            drawSVG: '0% 100%',
            duration: 1.1,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: '[data-taste-ring]',
              start: 'top 75%',
              once: true,
            },
          }
        );
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('[data-taste-ring] path', { drawSVG: '0% 100%' });
      });
    },
    { scope: root }
  );

  return (
    <div ref={root}>
      <section
        className="relative overflow-hidden"
        style={{
          background: 'var(--sq-inverse)',
          color: 'var(--sq-inverse-ink)',
          paddingBlock: 'clamp(8rem, 18vh, 15rem)',
        }}
      >
        <div className="sq-container">
          <Reveal>
            <p className="sq-eyebrow" style={{ color: 'var(--sq-accent)' }}>
              De omslag
            </p>
          </Reveal>

          <SplitHeading className="sq-display mt-8 max-w-5xl text-[clamp(2.25rem,5.5vw,5.25rem)] leading-[1.08] tracking-tight">
            Het ligt niet aan jou. En ook niet aan je AI.
          </SplitHeading>

          <div className="mt-16 grid gap-12 md:grid-cols-[1fr_1fr] md:gap-20">
            <Reveal delay={0.1}>
              <p className="text-[clamp(1.125rem,1.6vw,1.375rem)] leading-relaxed" style={{ color: 'var(--sq-inverse-soft)' }}>
                AI is een versterker. Geef je vage input, dan krijg je het grijze
                gemiddelde van het hele internet terug. Geef je regels, voorbeelden en{' '}
                <span data-taste-ring className="relative inline-block px-1">
                  <span className="relative z-10 font-bold" style={{ color: 'var(--sq-inverse-ink)' }}>
                    smaak
                  </span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 120 52"
                    fill="none"
                    className="absolute -inset-x-3 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1.5rem)]"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M8 26 C 10 10, 50 4, 78 7 C 106 10, 118 20, 112 32 C 106 44, 60 50, 32 46 C 10 43, 4 34, 8 24"
                      stroke="var(--sq-accent)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                , dan bouwt je AI alsof er een art director meekijkt.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <p className="text-[clamp(1.125rem,1.6vw,1.375rem)] leading-relaxed" style={{ color: 'var(--sq-inverse-soft)' }}>
                Die regels, die voorbeelden en die smaak, precies dat is Struq. Een
                bibliotheek vol visuele kennis die je AI direct begrijpt, en die van jou
                elke week een betere bouwer maakt.
              </p>
              <Link
                href="/methode"
                className="sq-link mt-8 inline-block text-base"
                style={{ color: 'var(--sq-inverse-ink)' }}
              >
                Lees hoe de methode werkt
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

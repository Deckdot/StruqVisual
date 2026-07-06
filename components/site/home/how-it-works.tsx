'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/components/site/motion';
import { SplitHeading } from '@/components/site/split-heading';
import { Reveal } from '@/components/site/reveal';

/**
 * Section 6 — How it works.
 * Goal: perceived ease. Drie stappen, geen jargon; de getekende lijn die
 * met je scroll meegroeit maakt de flow letterlijk voelbaar.
 */

const STEPS = [
  {
    title: 'Kies wat je mooi vindt',
    body: 'Blader door paletten, typografie, secties en media. Je ziet altijd eerst hoe het eruitziet, pas daarna wat erachter zit.',
  },
  {
    title: 'Geef het aan je AI',
    body: 'Eén klik kopieert het asset als context die je AI begrijpt. Plak het in Claude Code, Cursor of welke tool je ook gebruikt.',
  },
  {
    title: 'Zie je pagina veranderen',
    body: 'Je AI bouwt met smaak in plaats van te gokken. En omdat elk recept uitlegt waarom het werkt, word jij er elke keer beter van.',
  },
];

export function HowItWorks() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const path = root.current?.querySelector<SVGPathElement>('[data-flow-path]');
        const walker = root.current?.querySelector<SVGCircleElement>('[data-flow-walker]');
        if (!path || !walker) return;

        // The route draws itself while the dot walks it, both tied to scroll.
        gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top 60%',
            end: 'bottom 70%',
            scrub: 1,
          },
        })
          .fromTo(path, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 1 }, 0)
          .to(walker, {
            motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
            duration: 1,
          }, 0);
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('[data-flow-path]', { drawSVG: '0% 100%' });
      });

      // Tear down the global matchMedia conditions on unmount so a later
      // ScrollTrigger.refresh() (curtain nav) can't re-run them against a stale DOM.
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} style={{ paddingBlock: 'clamp(7rem, 14vh, 12rem)' }}>
      <div className="sq-container">
        <div className="max-w-2xl">
          <Reveal>
            <p className="sq-eyebrow">Zo werkt het</p>
          </Reveal>
          <SplitHeading className="sq-h2 mt-6">
            Van saai naar stunning in drie stappen.
          </SplitHeading>
        </div>

        <div className="relative mt-20">
          {/* Connector path, drawn while scrolling (desktop) */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 hidden h-full w-full md:block"
            viewBox="0 0 1000 900"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              data-flow-path
              d="M 160 90 C 500 130, 780 180, 800 330 C 815 450, 400 420, 300 560 C 220 670, 520 740, 760 800"
              stroke="var(--sq-accent)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle data-flow-walker cx="160" cy="90" r="9" fill="var(--sq-accent)" />
          </svg>

          <div className="relative space-y-16 md:space-y-28">
            {STEPS.map((step, index) => (
              <Reveal
                key={step.title}
                y={48}
                className={`max-w-md ${
                  index === 1 ? 'md:ml-[52%]' : index === 2 ? 'md:ml-[14%]' : ''
                }`}
              >
                <div className="sq-panel p-8 md:p-10" style={{ boxShadow: 'var(--sq-shadow-float)' }}>
                  <span
                    className="sq-display inline-flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold"
                    style={{ background: 'var(--sq-accent-wash)', color: 'var(--sq-accent-ink)' }}
                  >
                    {index + 1}
                  </span>
                  <h3 className="sq-h3 mt-6">{step.title}</h3>
                  <p className="sq-muted mt-3 leading-relaxed">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

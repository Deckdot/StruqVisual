'use client';

import { useRef } from 'react';
import { TransitionLink } from '@/components/providers/PageTransition';
import { gsap, useGSAP, EASE_OUT } from '@/components/site/motion';
import { SplitHeading } from '@/components/site/split-heading';
import { Magnetic } from '@/components/site/magnetic';

/**
 * Section 1 — Hero.
 * Goal: plant the power fantasy in one glance. The visitor must think
 * "dat wil ik kunnen maken" before reading a single feature.
 */
export function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Entrance choreography for everything around the headline.
        const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });

        tl.fromTo(
          '[data-hero-fade]',
          { autoAlpha: 0, y: 32 },
          { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 },
          0.45
        );

        tl.fromTo(
          '[data-hero-card]',
          { autoAlpha: 0, y: 64, rotate: (i: number) => (i % 2 === 0 ? 4 : -5) },
          {
            autoAlpha: 1,
            y: 0,
            rotate: (i: number) => (i % 2 === 0 ? -3 : 2.5),
            duration: 1.2,
            stagger: 0.14,
          },
          0.65
        );

        // Squiggle draws itself once the headline has landed.
        tl.fromTo(
          '[data-hero-squiggle] path',
          { drawSVG: '0% 0%' },
          { drawSVG: '0% 100%', duration: 0.8, ease: 'power2.inOut' },
          1.1
        );

        // Gentle parallax on the floating cards while scrolling away.
        gsap.utils.toArray<HTMLElement>('[data-hero-card]').forEach((card, index) => {
          gsap.to(card, {
            yPercent: index % 2 === 0 ? -22 : -38,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1,
            },
          });
        });
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(['[data-hero-fade]', '[data-hero-card]'], { autoAlpha: 1 });
        gsap.set('[data-hero-squiggle] path', { drawSVG: '0% 100%' });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative overflow-hidden"
      style={{ paddingTop: 'clamp(9rem, 16vh, 13rem)', paddingBottom: 'clamp(6rem, 12vh, 11rem)' }}
    >
      <div className="sq-container relative">
        <div className="relative z-10 max-w-3xl">
          <p data-hero-fade data-sq-reveal className="sq-eyebrow">
            De visuele bibliotheek voor AI-builders
          </p>

          <SplitHeading as="h1" className="sq-h1 mt-7" delay={0.15} start="top 100%">
            Bouw front-ends die niemand van je verwacht.
          </SplitHeading>

          {/* Hand-drawn squiggle under the headline */}
          <svg
            data-hero-squiggle
            aria-hidden="true"
            viewBox="0 0 320 24"
            className="mt-5 h-5 w-56 md:w-72"
            fill="none"
          >
            <path
              d="M4 16 C 40 4, 70 22, 106 12 S 170 4, 208 14 S 284 20, 316 8"
              stroke="var(--sq-accent)"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>

          <p data-hero-fade data-sq-reveal className="sq-lead mt-9 max-w-xl">
            Kant-en-klare visuele recepten, prompts en context waarmee jouw AI opeens
            vormgeeft als een topstudio. Jij kiest wat je mooi vindt, je AI bouwt het,
            en onderweg leer je waarom het werkt.
          </p>

          <div data-hero-fade data-sq-reveal className="mt-11 flex flex-wrap items-center gap-5">
            <Magnetic>
              <TransitionLink href="/auth" className="sq-btn sq-btn-accent !px-9 !py-[1.2rem] !text-base">
                Start gratis
              </TransitionLink>
            </Magnetic>
            <TransitionLink href="/visueel" className="sq-link text-base">
              Bekijk wat je kunt maken
            </TransitionLink>
          </div>

          <p data-hero-fade data-sq-reveal className="sq-faint mt-10">
            Gratis starten · Werkt met Claude Code, Cursor en Copilot · In het Nederlands
          </p>
        </div>

        {/* Floating asset cards — the product speaks before the copy does. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 top-8 hidden w-[26rem] lg:block xl:-right-4 xl:w-[30rem]"
        >
          {/* Mini hero mock */}
          <div
            data-hero-card
            className="sq-panel-inverse relative z-10 rotate-[-3deg] p-7"
            style={{ boxShadow: 'var(--sq-shadow-float)' }}
          >
            <p className="sq-eyebrow" style={{ color: 'var(--sq-accent)' }}>
              Hero-sectie · 12
            </p>
            <p className="sq-display mt-4 text-3xl leading-tight" style={{ color: 'var(--sq-inverse-ink)' }}>
              Groots, rustig en vol karakter
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span
                className="inline-block h-9 w-28 rounded-full"
                style={{ background: 'var(--sq-accent)' }}
              />
              <span
                className="inline-block h-9 w-9 rounded-full border"
                style={{ borderColor: 'color-mix(in srgb, var(--sq-inverse-ink) 30%, transparent)' }}
              />
            </div>
          </div>

          {/* Palette card */}
          <div
            data-hero-card
            className="sq-panel relative z-20 -mt-8 ml-24 w-64 rotate-[2.5deg] p-5"
            style={{ boxShadow: 'var(--sq-shadow-float)' }}
          >
            <p className="sq-faint font-semibold">Kleursysteem · Warm papier</p>
            <div className="mt-3 flex gap-2">
              {['#fbf8f2', '#ece5d6', '#e4572e', '#5c5546', '#221d15'].map((swatch) => (
                <span
                  key={swatch}
                  className="h-12 flex-1 rounded-lg border"
                  style={{ background: swatch, borderColor: 'var(--sq-line)' }}
                />
              ))}
            </div>
          </div>

          {/* Motion recipe card */}
          <div
            data-hero-card
            className="sq-panel relative z-30 -mt-6 w-72 rotate-[-3deg] p-5"
            style={{ boxShadow: 'var(--sq-shadow-float)' }}
          >
            <p className="sq-faint font-semibold">Animatie-recept · Zachte entree</p>
            <svg viewBox="0 0 240 80" className="mt-3 w-full" fill="none" aria-hidden="true">
              <path
                d="M8 72 C 60 72, 60 8, 232 8"
                stroke="var(--sq-accent)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="232" cy="8" r="6" fill="var(--sq-accent)" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

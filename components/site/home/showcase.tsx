'use client';

import { useRef } from 'react';
import { TransitionLink as Link } from '@/components/providers/PageTransition';
import { gsap, useGSAP } from '@/components/site/motion';
import { Reveal } from '@/components/site/reveal';

/**
 * Section 5 — The showcase (showpiece section).
 * Goal: desire. Een gepinde horizontale galerij laat voelen hoeveel visueel
 * materiaal er klaarstaat. Desktop krijgt de pin + scrub; mobiel een native
 * snap-carrousel.
 */

function CardHero() {
  return (
    <div
      className="flex h-full flex-col justify-between rounded-2xl p-7"
      style={{ background: 'var(--sq-inverse)', color: 'var(--sq-inverse-ink)' }}
    >
      <p className="sq-eyebrow" style={{ color: 'var(--sq-accent)' }}>
        Nieuw seizoen
      </p>
      <div>
        <p className="sq-display text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.05]">
          Stilte, ruimte en één goed woord
        </p>
        <div className="mt-5 flex items-center gap-3">
          <span className="h-8 w-24 rounded-full" style={{ background: 'var(--sq-accent)' }} />
          <span
            className="h-8 w-8 rounded-full border"
            style={{ borderColor: 'color-mix(in srgb, var(--sq-inverse-ink) 35%, transparent)' }}
          />
        </div>
      </div>
    </div>
  );
}

function CardScroll() {
  return (
    <div
      className="relative h-full overflow-hidden rounded-2xl p-7"
      style={{ background: 'var(--sq-sunken)' }}
    >
      <div className="absolute left-1/2 top-7 bottom-7 w-1 -translate-x-1/2 rounded-full" style={{ background: 'var(--sq-line-strong)' }} />
      {[0, 1, 2].map((frame) => (
        <div
          key={frame}
          className="sq-panel relative mx-auto mb-4 flex h-[26%] w-[70%] items-center justify-center"
          style={{
            transform: `translateY(${frame * 6}px) rotate(${frame % 2 === 0 ? -1.5 : 1.5}deg)`,
          }}
        >
          <span className="h-2 w-1/2 rounded-full" style={{ background: frame === 1 ? 'var(--sq-accent)' : 'var(--sq-line-strong)' }} />
        </div>
      ))}
      <span
        className="absolute left-1/2 top-9 h-4 w-4 -translate-x-1/2 rounded-full border-4"
        style={{ borderColor: 'var(--sq-accent)', background: 'var(--sq-paper)' }}
      />
    </div>
  );
}

function CardColor() {
  return (
    <div className="flex h-full flex-col gap-3 rounded-2xl p-7" style={{ background: 'var(--sq-accent-wash)' }}>
      {[
        { name: 'Papier', value: '#fbf8f2' },
        { name: 'Inkt', value: '#221d15' },
        { name: 'Vlam', value: '#e4572e' },
        { name: 'Leem', value: '#5c5546' },
      ].map((swatch) => (
        <div key={swatch.name} className="flex flex-1 items-center gap-4">
          <span
            className="h-full w-20 rounded-xl border"
            style={{ background: swatch.value, borderColor: 'var(--sq-line)' }}
          />
          <div>
            <p className="font-bold" style={{ color: 'var(--sq-accent-ink)' }}>
              {swatch.name}
            </p>
            <p className="sq-faint">{swatch.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CardMicro() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 rounded-2xl p-7" style={{ background: 'var(--sq-raised)', border: '1px solid var(--sq-line)' }}>
      <p className="sq-faint">Ga er maar met je muis overheen</p>
      <span className="sq-btn sq-btn-accent pointer-events-auto !px-9 !py-4 hover:!scale-105">
        Voelt goed, toch?
      </span>
      <div className="flex gap-3">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="h-3 w-3 rounded-full transition-transform hover:scale-150"
            style={{ background: 'var(--sq-line-strong)' }}
          />
        ))}
      </div>
    </div>
  );
}

function CardContext() {
  return (
    <div className="flex h-full flex-col rounded-2xl p-7" style={{ background: 'var(--sq-raised)', border: '1px solid var(--sq-line)' }}>
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full" style={{ background: 'var(--sq-accent)' }} />
        <p className="font-bold">design-system.md</p>
      </div>
      <div className="mt-5 space-y-3">
        {[86, 62, 74, 40, 68, 52].map((width, index) => (
          <span
            key={index}
            className="block h-2.5 rounded-full"
            style={{
              width: `${width}%`,
              background: index === 3 ? 'var(--sq-accent)' : 'var(--sq-line-strong)',
            }}
          />
        ))}
      </div>
      <p className="sq-faint mt-auto">
        De regels die je AI van grijs naar gedurfd brengen.
      </p>
    </div>
  );
}

const SHOWCASE_CARDS = [
  {
    title: 'Hero-secties',
    promise: 'Eerste indrukken die blijven hangen, klaar om te kopiëren.',
    visual: <CardHero />,
  },
  {
    title: 'Scroll-regie',
    promise: 'Gepinde scènes en reveals die je pagina een verhaal geven.',
    visual: <CardScroll />,
  },
  {
    title: 'Kleursystemen',
    promise: 'Complete paletten met regels, zodat niets meer vloekt.',
    visual: <CardColor />,
  },
  {
    title: 'Micro-interacties',
    promise: 'Knoppen en details die duur aanvoelen.',
    visual: <CardMicro />,
  },
  {
    title: 'Design systems',
    promise: 'De onzichtbare helft: het systeem dat je AI smaak geeft.',
    visual: <CardContext />,
  },
];

export function Showcase() {
  const root = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
        () => {
          const track = trackRef.current;
          const section = root.current;
          if (!track || !section) return;

          const distance = () => track.scrollWidth - window.innerWidth;

          gsap.to(track, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              pin: true,
              scrub: 1,
              start: 'top top',
              end: () => `+=${distance()}`,
              invalidateOnRefresh: true,
            },
          });
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="flex flex-col justify-center overflow-hidden lg:h-svh"
      style={{ background: 'var(--sq-paper)', paddingBlock: 'clamp(6rem, 10vh, 8rem)' }}
    >
      <div className="sq-container mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal>
            <p className="sq-eyebrow">De bibliotheek</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="sq-h2 mt-5 max-w-xl">Dit staat voor je klaar.</h2>
          </Reveal>
        </div>
        <Reveal delay={0.16}>
          <p className="sq-lead max-w-sm">
            Geen losse plaatjes, maar recepten: elk asset komt met de context die je AI
            nodig heeft om het écht zo te bouwen.
          </p>
        </Reveal>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-[max(1.25rem,calc((100vw-78rem)/2+1.25rem))] pb-6 lg:snap-none lg:overflow-x-visible lg:pb-0"
      >
        {SHOWCASE_CARDS.map((card) => (
          <article
            key={card.title}
            className="flex w-[min(80vw,26rem)] shrink-0 snap-center flex-col"
          >
            <div className="aspect-[4/4.4] w-full">{card.visual}</div>
            <h3 className="sq-h3 mt-6">{card.title}</h3>
            <p className="sq-muted mt-2 max-w-xs text-[0.9375rem] leading-relaxed">
              {card.promise}
            </p>
          </article>
        ))}

        {/* Closing CTA card */}
        <article className="flex w-[min(80vw,26rem)] shrink-0 snap-center flex-col">
          <Link
            href="/visueel"
            className="group flex aspect-[4/4.4] w-full flex-col justify-between rounded-2xl border-2 border-dashed p-8 transition-colors"
            style={{ borderColor: 'var(--sq-line-strong)' }}
          >
            <p className="sq-eyebrow">En elke week meer</p>
            <div>
              <p className="sq-display text-3xl leading-tight">
                Bekijk de hele collectie
              </p>
              <span
                className="mt-6 inline-flex h-12 w-12 items-center justify-center rounded-full text-xl transition-transform group-hover:translate-x-2"
                style={{ background: 'var(--sq-accent)', color: '#fff8f2' }}
                aria-hidden="true"
              >
                →
              </span>
            </div>
          </Link>
        </article>
      </div>
    </section>
  );
}

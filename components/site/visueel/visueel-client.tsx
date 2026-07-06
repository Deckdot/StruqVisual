'use client';

import { useRef } from 'react';
import { TransitionLink as Link } from '@/components/providers/PageTransition';
import { gsap, useGSAP } from '@/components/site/motion';
import { SiteShell } from '@/components/site/site-shell';
import { SplitHeading } from '@/components/site/split-heading';
import { Reveal } from '@/components/site/reveal';
import { SlotText } from '@/components/site/slot-text';

/**
 * /visueel — De power fantasy pagina.
 * Doel: verlangen concreet maken. De bezoeker moet zichzelf hier zien bouwen:
 * "dit kan ik maken, vandaag nog, zonder kosten vooraf". De galerij draagt de
 * pagina; de copy houdt het klein en haalbaar.
 */

/* --- Galerij-visuals (pure CSS/SVG, geen afbeeldingen) ------------------- */

function TileEditorialHero() {
  return (
    <div
      className="flex h-full flex-col justify-between rounded-3xl p-8"
      style={{ background: 'var(--sq-inverse)', color: 'var(--sq-inverse-ink)' }}
    >
      <p className="sq-eyebrow" style={{ color: 'var(--sq-accent)' }}>
        Bakkerij Noord
      </p>
      <div>
        <p className="sq-display text-[clamp(1.9rem,3vw,3rem)] leading-[1.04]">
          Brood zoals het bedoeld is
        </p>
        <p className="mt-4 max-w-[16rem] text-sm leading-relaxed" style={{ color: 'var(--sq-inverse-soft)' }}>
          Elke ochtend om zes uur. Zuurdesem, geduld en niets anders.
        </p>
        <span className="mt-6 inline-block h-9 w-32 rounded-full" style={{ background: 'var(--sq-accent)' }} />
      </div>
    </div>
  );
}

function TileTypeSpecimen() {
  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border p-7" style={{ background: 'var(--sq-raised)', borderColor: 'var(--sq-line)' }}>
      <p className="sq-faint font-semibold">Typografie-schaal</p>
      <div>
        <p className="sq-display text-6xl leading-none">Aa</p>
        <p className="sq-display mt-3 text-2xl">Comfortaa</p>
        <p className="mt-1 text-sm" style={{ color: 'var(--sq-ink-soft)' }}>
          Rond, warm en zelfverzekerd
        </p>
      </div>
    </div>
  );
}

function TilePalette() {
  return (
    <div className="flex h-full flex-col gap-2 rounded-3xl p-7" style={{ background: 'var(--sq-accent-wash)' }}>
      <p className="font-bold" style={{ color: 'var(--sq-accent-ink)' }}>
        Palet · Nazomer
      </p>
      <div className="mt-2 flex flex-1 flex-col gap-2">
        {['#fbf8f2', '#e4572e', '#5c5546', '#221d15'].map((color) => (
          <span key={color} className="flex-1 rounded-xl border" style={{ background: color, borderColor: 'var(--sq-line)' }} />
        ))}
      </div>
    </div>
  );
}

function TileMotion() {
  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border p-7" style={{ background: 'var(--sq-raised)', borderColor: 'var(--sq-line)' }}>
      <p className="sq-faint font-semibold">Scroll-reveal · Gewogen entree</p>
      <svg viewBox="0 0 240 110" className="w-full" fill="none" aria-hidden="true">
        <path d="M10 100 C 70 100, 70 10, 230 10" stroke="var(--sq-accent)" strokeWidth="5" strokeLinecap="round" />
        <circle cx="230" cy="10" r="7" fill="var(--sq-accent)" />
        <path d="M10 100 L 230 100" stroke="var(--sq-line-strong)" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function TileButtons() {
  return (
    <div className="flex h-full flex-col items-start justify-center gap-4 rounded-3xl p-8" style={{ background: 'var(--sq-sunken)' }}>
      <p className="sq-faint font-semibold">Micro-interacties</p>
      <span className="sq-btn sq-btn-primary pointer-events-auto">
        <SlotText>Reserveer een tafel</SlotText>
        <span className="sq-btn-fill" aria-hidden="true" />
      </span>
      <span className="sq-btn sq-btn-ghost pointer-events-auto">
        <SlotText>Bekijk de kaart</SlotText>
        <span className="sq-btn-fill" aria-hidden="true" />
      </span>
    </div>
  );
}

function TileDepth() {
  return (
    <div className="relative h-full overflow-hidden rounded-3xl" style={{ background: 'var(--sq-inverse)' }}>
      {[
        { size: '13rem', x: '58%', y: '18%', mix: 26 },
        { size: '9rem', x: '18%', y: '42%', mix: 55 },
        { size: '5.5rem', x: '52%', y: '58%', mix: 100 },
      ].map((circle, index) => (
        <span
          key={index}
          className="absolute rounded-full"
          style={{
            width: circle.size,
            height: circle.size,
            left: circle.x,
            top: circle.y,
            background: `color-mix(in srgb, var(--sq-accent) ${circle.mix}%, var(--sq-inverse))`,
          }}
        />
      ))}
      <p className="sq-eyebrow absolute bottom-6 left-7" style={{ color: 'var(--sq-inverse-soft)' }}>
        Diepte & lagen
      </p>
    </div>
  );
}

/* --- Roadmap -------------------------------------------------------------- */

const ROADMAP = [
  {
    label: 'Nu al',
    title: 'Visuele assets met context',
    body: 'Hero-secties, kleursystemen, animatie-recepten en de context-bestanden erachter. Kopieer, plak, bouw.',
  },
  {
    label: 'Binnenkort',
    title: 'Complete templates',
    body: 'Hele pagina-opzetten die je AI in één keer neerzet, van eerste indruk tot footer.',
  },
  {
    label: 'Daarna',
    title: 'Leren op jouw tempo',
    body: 'Een leerpad dat meegroeit: van je eerste .md-bestand tot scroll-regie waar bureaus jaloers op zijn.',
  },
];

export default function VisueelClient() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const roadmapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        // Columns drift at different speeds for depth.
        gsap.utils.toArray<HTMLElement>('[data-gallery-col]').forEach((col, index) => {
          gsap.to(col, {
            yPercent: index === 1 ? -8 : index === 0 ? -2 : -5,
            ease: 'none',
            scrollTrigger: {
              trigger: galleryRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          });
        });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-roadmap-line]',
          { drawSVG: '0% 0%' },
          {
            drawSVG: '0% 100%',
            ease: 'none',
            scrollTrigger: {
              trigger: roadmapRef.current,
              start: 'top 65%',
              end: 'bottom 80%',
              scrub: 1,
            },
          }
        );
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('[data-roadmap-line]', { drawSVG: '0% 100%' });
      });

      // Tear down the global matchMedia conditions on unmount so a later
      // ScrollTrigger.refresh() (curtain nav) can't re-run them against a stale DOM.
      return () => mm.revert();
    },
    { scope: galleryRef }
  );

  return (
    <SiteShell>
      {/* Hero */}
      <section style={{ paddingTop: 'clamp(9rem, 16vh, 13rem)', paddingBottom: 'clamp(4rem, 8vh, 7rem)' }}>
        <div className="sq-container">
          <Reveal>
            <p className="sq-eyebrow">Wat je gaat maken</p>
          </Reveal>
          <SplitHeading as="h1" className="sq-h1 mt-7 max-w-4xl" delay={0.1} start="top 100%">
            Dit ga jij maken.
          </SplitHeading>
          <Reveal delay={0.2}>
            <p className="sq-lead mt-9 max-w-xl">
              Geen moodboard van andermans werk, maar patronen die je vandaag al met je
              eigen AI neerzet. Zonder kosten vooraf, zonder designdiploma. En terwijl
              je bouwt, leer je precies waarom het werkt.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Galerij */}
      <section ref={galleryRef} style={{ paddingBottom: 'clamp(6rem, 12vh, 10rem)' }}>
        <div className="sq-container-wide grid gap-6 lg:grid-cols-3">
          <div data-gallery-col className="flex flex-col gap-6">
            <Reveal y={56} className="aspect-[4/5]">
              <TileEditorialHero />
            </Reveal>
            <Reveal y={56} className="aspect-[4/3]">
              <TileMotion />
            </Reveal>
          </div>
          <div data-gallery-col className="flex flex-col gap-6 lg:mt-16">
            <Reveal y={56} className="aspect-[4/3]">
              <TileTypeSpecimen />
            </Reveal>
            <Reveal y={56} className="aspect-[4/5]">
              <TileDepth />
            </Reveal>
          </div>
          <div data-gallery-col className="flex flex-col gap-6 lg:mt-8">
            <Reveal y={56} className="aspect-[4/4]">
              <TilePalette />
            </Reveal>
            <Reveal y={56} className="aspect-[4/3.2]">
              <TileButtons />
            </Reveal>
          </div>
        </div>
        <div className="sq-container mt-10">
          <Reveal>
            <p className="sq-faint">
              Alles hierboven is gebouwd met dezelfde assets die in de bibliotheek staan.
              Geen screenshots, geen mockups.
            </p>
          </Reveal>
        </div>
      </section>

      {/* De belofte / pivot */}
      <section
        style={{
          background: 'var(--sq-inverse)',
          color: 'var(--sq-inverse-ink)',
          paddingBlock: 'clamp(7rem, 15vh, 13rem)',
        }}
      >
        <div className="sq-container">
          <Reveal>
            <p className="sq-eyebrow" style={{ color: 'var(--sq-accent)' }}>
              Waar Struq heen gaat
            </p>
          </Reveal>
          <SplitHeading className="sq-h2 mt-6 max-w-3xl">
            Visueel eerst. Vanaf nu.
          </SplitHeading>
          <Reveal delay={0.12}>
            <p className="mt-7 max-w-xl text-[clamp(1.0625rem,1.5vw,1.25rem)] leading-relaxed" style={{ color: 'var(--sq-inverse-soft)' }}>
              Struq begon als een slimme plek voor prompts en context. Dat blijft het
              fundament, maar de voorkant verandert: alles wat je hier vindt, kun je
              eerst zíen. Want niemand droomt van een prompt. Iedereen droomt van het
              resultaat.
            </p>
          </Reveal>

          <div ref={roadmapRef} className="relative mt-20 max-w-2xl">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-[0.4375rem] top-2 h-[calc(100%-1rem)] w-4"
              viewBox="0 0 16 600"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                data-roadmap-line
                d="M8 4 L 8 596"
                stroke="var(--sq-accent)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="space-y-14 pl-12">
              {ROADMAP.map((milestone) => (
                <Reveal key={milestone.title} y={40}>
                  <div className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute -left-12 top-1.5 h-4 w-4 rounded-full border-4"
                      style={{ borderColor: 'var(--sq-accent)', background: 'var(--sq-inverse)' }}
                    />
                    <p className="sq-eyebrow" style={{ color: 'var(--sq-inverse-soft)' }}>
                      {milestone.label}
                    </p>
                    <h3 className="sq-h3 mt-2">{milestone.title}</h3>
                    <p className="mt-2 leading-relaxed" style={{ color: 'var(--sq-inverse-soft)' }}>
                      {milestone.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Slot-CTA */}
      <section style={{ paddingBlock: 'clamp(7rem, 14vh, 12rem)' }}>
        <div className="sq-container">
          <div className="max-w-2xl">
            <SplitHeading className="sq-h2">
              Je eerste mooie pagina staat een avond verderop.
            </SplitHeading>
            <Reveal delay={0.12}>
              <p className="sq-lead mt-7">
                Maak een gratis account, pak een asset dat je mooi vindt en geef het aan
                je AI. Meer is het niet. De rest leer je onderweg, les voor les.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-12 flex flex-wrap items-center gap-6">
              <Link href="/vault" className="sq-btn sq-btn-accent !px-9 !py-[1.15rem] !text-base">
                <SlotText>Bekijk de bibliotheek</SlotText>
                <span className="sq-btn-fill" aria-hidden="true" />
              </Link>
              <Link href="/methode" className="sq-link text-base">
                Eerst begrijpen hoe het werkt
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

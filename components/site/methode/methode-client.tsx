'use client';

import { useRef } from 'react';
import { TransitionLink as Link } from '@/components/providers/PageTransition';
import { gsap, useGSAP } from '@/components/site/motion';
import { SiteShell } from '@/components/site/site-shell';
import { SplitHeading } from '@/components/site/split-heading';
import { Reveal } from '@/components/site/reveal';
import { Magnetic } from '@/components/site/magnetic';

/**
 * /methode — Waarom je AI beter bouwt met context.
 * Doel van de pagina: autoriteit + educatie. De bezoeker begrijpt na het
 * lezen waarom context het verschil maakt, en ziet Struq als de kortste weg
 * daarnaartoe. Elke sectie eindigt dichter bij de tool.
 */

/* --- Sectie 2 visual: wat je AI ziet ----------------------------------- */

function ChatMock({ variant }: { variant: 'vague' | 'rich' }) {
  const isRich = variant === 'rich';
  return (
    <div className="sq-panel flex h-full flex-col gap-4 p-6" style={{ boxShadow: 'var(--sq-shadow-float)' }}>
      <div
        className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-3 text-sm font-medium"
        style={{ background: 'var(--sq-accent-wash)', color: 'var(--sq-accent-ink)' }}
      >
        {isRich
          ? 'Maak de hero-sectie. Gebruik design-context.md: warm papier, Comfortaa, veel witruimte, één accentkleur.'
          : 'Maak een mooie website voor mijn koffiebar'}
      </div>
      <div
        className="max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-3"
        style={{ background: 'var(--sq-sunken)' }}
      >
        {isRich ? (
          <div>
            <p className="sq-display text-xl leading-snug">Koffie die je dag draagt</p>
            <span
              className="mt-3 inline-block h-7 w-24 rounded-full"
              style={{ background: 'var(--sq-accent)' }}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <span className="block h-2.5 w-32 rounded-full bg-[#c4c4c4]" />
            <div className="flex gap-2 pt-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-10 w-14 rounded-md border border-[#dcdcdc] bg-white" />
              ))}
            </div>
            <span className="mt-1 inline-block h-6 w-20 rounded bg-[#3b82f6]" />
          </div>
        )}
      </div>
      <p className="sq-faint mt-auto">
        {isRich ? 'Met context: jouw smaak, elke keer' : 'Zonder context: het internet-gemiddelde'}
      </p>
    </div>
  );
}

/* --- Sectie 3: de drie lagen -------------------------------------------- */

const LAYERS = [
  {
    name: 'De vraag',
    detail: 'Wat je wilt hebben. "Maak een hero-sectie." Dit is het enige dat de meeste mensen hun AI geven.',
  },
  {
    name: 'De regels',
    detail: 'Jouw kleuren, fonts, toon en grenzen. Vastgelegd in een context-bestand, zodat je het nooit opnieuw hoeft uit te leggen.',
  },
  {
    name: 'De smaak',
    detail: 'Voorbeelden van wat goed is. Een AI die ziet wat jij mooi vindt, bouwt in die richting verder.',
  },
];

export default function MethodeClient() {
  const layersRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-layer-line]',
          { drawSVG: '0% 0%' },
          {
            drawSVG: '0% 100%',
            ease: 'none',
            scrollTrigger: {
              trigger: layersRef.current,
              start: 'top 70%',
              end: 'bottom 75%',
              scrub: 1,
            },
          }
        );
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('[data-layer-line]', { drawSVG: '0% 100%' });
      });

      // Tear down the global matchMedia conditions on unmount so a later
      // ScrollTrigger.refresh() (curtain nav) can't re-run them against a stale DOM.
      return () => mm.revert();
    },
    { scope: layersRef }
  );

  return (
    <SiteShell>
      {/* Hero */}
      <section style={{ paddingTop: 'clamp(9rem, 16vh, 13rem)', paddingBottom: 'clamp(5rem, 10vh, 9rem)' }}>
        <div className="sq-container">
          <Reveal>
            <p className="sq-eyebrow">De methode</p>
          </Reveal>
          <SplitHeading as="h1" className="sq-h1 mt-7 max-w-4xl" delay={0.1} start="top 100%">
            Je AI is zo goed als wat je het vertelt.
          </SplitHeading>
          <Reveal delay={0.2}>
            <p className="sq-lead mt-9 max-w-xl">
              Waarom bouwt de één prachtige pagina&apos;s met AI en krijgt de ander steeds
              hetzelfde grijze sjabloon? Het verschil is geen talent. Het is context.
              Hier lees je precies hoe dat werkt, in gewoon Nederlands.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Wat je AI ziet */}
      <section style={{ background: 'var(--sq-sunken)', paddingBlock: 'clamp(6rem, 12vh, 10rem)' }}>
        <div className="sq-container">
          <div className="max-w-2xl">
            <SplitHeading className="sq-h2">
              Je AI kent jou niet. Nog niet.
            </SplitHeading>
            <Reveal delay={0.12}>
              <p className="sq-lead mt-7">
                Zie je AI als een briljante nieuwe collega op dag één. Die kan alles
                bouwen, maar weet niets van jouw project, jouw stijl of jouw publiek.
                Vraag je alleen om &quot;iets moois&quot;, dan krijg je het veiligste antwoord
                dat het internet kent. Vertel je wie je bent, dan bouwt diezelfde
                collega ineens precies wat jij bedoelt.
              </p>
            </Reveal>
          </div>
          <Reveal stagger={0.14} className="mt-16 grid gap-6 md:grid-cols-2">
            <ChatMock variant="vague" />
            <ChatMock variant="rich" />
          </Reveal>
        </div>
      </section>

      {/* De drie lagen */}
      <section style={{ paddingBlock: 'clamp(7rem, 14vh, 12rem)' }}>
        <div className="sq-container">
          <div className="max-w-2xl">
            <Reveal>
              <p className="sq-eyebrow">De opbouw</p>
            </Reveal>
            <SplitHeading className="sq-h2 mt-6">
              Goede AI-output heeft drie lagen.
            </SplitHeading>
          </div>

          <div ref={layersRef} className="relative mt-16">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-6 top-4 hidden h-[calc(100%-2rem)] w-8 md:block"
              viewBox="0 0 40 600"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                data-layer-line
                d="M20 10 C 30 150, 10 250, 20 300 C 30 350, 10 480, 20 590"
                stroke="var(--sq-accent)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="1 12"
              />
            </svg>

            <div className="space-y-10 md:pl-24">
              {LAYERS.map((layer, index) => (
                <Reveal key={layer.name} y={44}>
                  <div className="sq-panel max-w-2xl p-8 md:p-10">
                    <p className="sq-eyebrow !normal-case !tracking-normal !text-[0.8125rem]">
                      Laag {index + 1}
                    </p>
                    <h3 className="sq-h3 mt-3">{layer.name}</h3>
                    <p className="sq-muted mt-3 leading-relaxed">{layer.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Het .md-bestand */}
      <section
        style={{
          background: 'var(--sq-inverse)',
          color: 'var(--sq-inverse-ink)',
          paddingBlock: 'clamp(7rem, 15vh, 13rem)',
        }}
      >
        <div className="sq-container grid items-center gap-14 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="sq-eyebrow" style={{ color: 'var(--sq-accent)' }}>
                Het geheim is klein
              </p>
            </Reveal>
            <SplitHeading className="sq-h2 mt-6">
              Eén tekstbestand verandert alles.
            </SplitHeading>
            <Reveal delay={0.12}>
              <p className="mt-7 text-[clamp(1.0625rem,1.5vw,1.25rem)] leading-relaxed" style={{ color: 'var(--sq-inverse-soft)' }}>
                Een .md-bestand is niets engs: gewoon een tekstbestand met een duidelijke
                structuur. Daarin zet je één keer je kleuren, je fonts, je toon en je
                regels. Elke AI-tool leest het mee, bij elke opdracht. Het is het
                inwerkdocument voor je digitale collega.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-10">
              <Link href="/learn/context-bestanden-en-agent-regels" className="sq-link" style={{ color: 'var(--sq-inverse-ink)' }}>
                Volg de gratis les over context-bestanden
              </Link>
            </Reveal>
          </div>

          <Reveal y={56}>
            <div
              className="rounded-3xl p-8"
              style={{ background: 'var(--sq-inverse-raised)', boxShadow: 'var(--sq-shadow-float)' }}
            >
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: 'var(--sq-accent)' }} />
                <p className="font-bold" style={{ color: 'var(--sq-inverse-ink)' }}>
                  design-context.md
                </p>
              </div>
              <dl className="mt-6 space-y-5">
                {[
                  { term: 'Kleuren', desc: 'Warm papier, donkere inkt, één vlam-oranje accent. Nooit gradients.' },
                  { term: 'Typografie', desc: 'Comfortaa voor koppen, groot en rustig. Nunito Sans voor lopende tekst.' },
                  { term: 'Toon', desc: 'Warm, direct, Nederlands. Geen jargon, geen uitroeptekens.' },
                  { term: 'Beweging', desc: 'Zachte entrees van onder, nooit alleen een fade. Alles voelt gewogen.' },
                ].map((row) => (
                  <div key={row.term}>
                    <dt className="text-sm font-bold" style={{ color: 'var(--sq-accent)' }}>
                      {row.term}
                    </dt>
                    <dd className="mt-1 text-[0.9375rem] leading-relaxed" style={{ color: 'var(--sq-inverse-soft)' }}>
                      {row.desc}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Waar Struq past + CTA */}
      <section style={{ paddingBlock: 'clamp(7rem, 14vh, 12rem)' }}>
        <div className="sq-container">
          <div className="max-w-2xl">
            <Reveal>
              <p className="sq-eyebrow">De kortste weg</p>
            </Reveal>
            <SplitHeading className="sq-h2 mt-6">
              Je kunt dit zelf opbouwen. Of vandaag beginnen.
            </SplitHeading>
            <Reveal delay={0.12}>
              <p className="sq-lead mt-7">
                Alles wat je hierboven las kun je zelf uitzoeken, verzamelen en
                bijhouden. Struq doet precies dat voor je: bewezen context-bestanden,
                visuele recepten en een vault die je smaak onthoudt. Jij hoeft alleen
                nog te kiezen wat je mooi vindt.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="mt-14 flex flex-wrap items-center gap-6">
            <Magnetic>
              <Link href="/auth" className="sq-btn sq-btn-accent !px-9 !py-[1.15rem] !text-base">
                Start gratis met Struq
              </Link>
            </Magnetic>
            <Link href="/visueel" className="sq-link text-base">
              Eerst zien wat je kunt maken
            </Link>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}

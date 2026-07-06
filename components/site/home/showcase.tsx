'use client';

import { useRef } from 'react';
import { TransitionLink as Link } from '@/components/providers/PageTransition';
import { gsap, useGSAP, ScrollTrigger, EASE_OUT } from '@/components/site/motion';
import { Reveal } from '@/components/site/reveal';
import { SlotText } from '@/components/site/slot-text';

/**
 * Section 5 — The showcase: "de galerij" (showpiece section).
 * Goal: desire. The pinned horizontal wall is a row of living exhibits: each
 * card performs its own micro-scene as it arrives (palette pours, frames
 * scroll, type kerns itself, the button ghost-hovers, the context file types),
 * while an accent rail tracks progress. Desktop pins + scrubs; mobile keeps
 * the native snap carousel with play-once scenes. Card markup ships in its
 * FINAL state; scenes rewind via from() tweens.
 */

function CardHero() {
  return (
    <div
      className="flex h-full flex-col justify-between overflow-clip rounded-2xl p-7"
      style={{ background: 'var(--sq-inverse)', color: 'var(--sq-inverse-ink)' }}
    >
      <p data-sc-eyebrow className="sq-eyebrow" style={{ color: 'var(--sq-accent)' }}>
        Nieuw seizoen
      </p>
      <div>
        <span className="block overflow-clip py-[0.08em] my-[-0.08em]">
          <span data-sc-line className="sq-display block text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.05]">
            Stilte, ruimte
          </span>
        </span>
        <span className="block overflow-clip py-[0.08em] my-[-0.08em]">
          <span data-sc-line className="sq-display block text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.05]">
            en één goed woord
          </span>
        </span>
        <div className="mt-5 flex items-center gap-3">
          <span data-sc-pill className="h-8 w-24 rounded-full" style={{ background: 'var(--sq-accent)' }} />
          <span
            data-sc-ring
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
      <div
        className="absolute left-1/2 top-7 bottom-7 w-1 -translate-x-1/2 rounded-full"
        style={{ background: 'var(--sq-line-strong)' }}
      />
      {[0, 1, 2].map((frame) => (
        <div
          key={frame}
          data-sc-frame
          className="sq-panel relative mx-auto mb-4 flex h-[26%] w-[70%] items-center justify-center"
          style={{
            transform: `translateY(${frame * 6}px) rotate(${frame % 2 === 0 ? -1.5 : 1.5}deg)`,
          }}
        >
          <span
            className="relative h-2 w-1/2 overflow-clip rounded-full"
            style={{ background: 'var(--sq-line-strong)' }}
          >
            {frame === 1 && (
              <span
                data-sc-sweep
                className="absolute inset-0 origin-left rounded-full"
                style={{ background: 'var(--sq-accent)' }}
              />
            )}
          </span>
        </div>
      ))}
      <span
        data-sc-raildot
        className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-4"
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
            data-sc-chip
            className="h-full w-20 rounded-xl border"
            style={{ background: swatch.value, borderColor: 'var(--sq-line)' }}
          />
          <div data-sc-chip-label>
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
    <div
      className="flex h-full flex-col items-center justify-center gap-6 rounded-2xl p-7"
      style={{ background: 'var(--sq-raised)', border: '1px solid var(--sq-line)' }}
    >
      <p className="sq-faint">Ga er maar met je muis overheen</p>
      <span data-sc-btn className="inline-block">
        <span className="sq-btn sq-btn-accent pointer-events-auto !px-9 !py-4">
          <SlotText>Voelt goed, toch?</SlotText>
        </span>
      </span>
      <div className="flex gap-3">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            data-sc-dot
            className="h-3 w-3 rounded-full"
            style={{ background: 'var(--sq-line-strong)' }}
          />
        ))}
      </div>
    </div>
  );
}

function CardContext() {
  return (
    <div
      className="flex h-full flex-col rounded-2xl p-7"
      style={{ background: 'var(--sq-raised)', border: '1px solid var(--sq-line)' }}
    >
      <div className="flex items-center gap-2">
        <span data-sc-filedot className="h-3 w-3 rounded-full" style={{ background: 'var(--sq-accent)' }} />
        <p className="font-bold">design-system.md</p>
      </div>
      <div className="mt-5 space-y-3">
        {[86, 62, 74, 40, 68, 52].map((width, index) => (
          <span
            key={index}
            data-sc-bar
            className="block h-2.5 rounded-full"
            style={{
              width: `${width}%`,
              background: index === 3 ? 'var(--sq-accent)' : 'var(--sq-line-strong)',
            }}
          />
        ))}
      </div>
      <p data-sc-footer className="sq-faint mt-auto">
        De regels die je AI van grijs naar gedurfd brengen.
      </p>
    </div>
  );
}

const SHOWCASE_CARDS = [
  {
    scene: 'hero',
    title: 'Hero-secties',
    promise: 'Eerste indrukken die blijven hangen, klaar om te kopiëren.',
    visual: <CardHero />,
  },
  {
    scene: 'scroll',
    title: 'Scroll-regie',
    promise: 'Gepinde scènes en reveals die je pagina een verhaal geven.',
    visual: <CardScroll />,
  },
  {
    scene: 'color',
    title: 'Kleursystemen',
    promise: 'Complete paletten met regels, zodat niets meer vloekt.',
    visual: <CardColor />,
  },
  {
    scene: 'micro',
    title: 'Micro-interacties',
    promise: 'Knoppen en details die duur aanvoelen.',
    visual: <CardMicro />,
  },
  {
    scene: 'context',
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
      const section = root.current;
      const track = trackRef.current;
      if (!section || !track) return;

      // Per-exhibit micro-scene, rewound via from() (markup ships final).
      const buildScene = (card: HTMLElement) => {
        const q = gsap.utils.selector(card);
        const tl = gsap.timeline({ paused: true, defaults: { ease: EASE_OUT } });

        switch (card.dataset.scScene) {
          case 'hero':
            tl.from(q('[data-sc-eyebrow]'), { autoAlpha: 0, y: 10, duration: 0.5 })
              .from(q('[data-sc-line]'), { yPercent: 115, duration: 0.75, stagger: 0.1 }, 0.05)
              .from(
                q('[data-sc-pill]'),
                { scaleX: 0, transformOrigin: 'left center', duration: 0.55, ease: 'power3.inOut' },
                0.5
              )
              .from(q('[data-sc-ring]'), { scale: 0, duration: 0.45, ease: 'back.out(2.5)' }, 0.7);
            break;
          case 'scroll':
            tl.from(q('[data-sc-frame]'), { y: 28, autoAlpha: 0, stagger: 0.14, duration: 0.6 })
              .from(q('[data-sc-raildot]'), { y: -44, duration: 0.9, ease: 'power2.inOut' }, 0)
              .from(
                q('[data-sc-sweep]'),
                { scaleX: 0, transformOrigin: 'left center', duration: 0.5, ease: 'power3.inOut' },
                0.55
              );
            break;
          case 'color':
            tl.from(q('[data-sc-chip]'), {
              scaleY: 0,
              transformOrigin: 'center bottom',
              duration: 0.55,
              stagger: 0.12,
            }).from(q('[data-sc-chip-label]'), { autoAlpha: 0, x: -10, duration: 0.45, stagger: 0.12 }, 0.08);
            break;
          case 'micro':
            tl.from(q('[data-sc-btn]'), { scale: 0.82, autoAlpha: 0, duration: 0.5, ease: 'back.out(2)' }).from(
              q('[data-sc-dot]'),
              { scale: 0, stagger: 0.07, duration: 0.4, ease: 'back.out(2.5)' },
              0.15
            );
            break;
          case 'context':
            tl.from(q('[data-sc-filedot]'), { scale: 0, duration: 0.4, ease: 'back.out(2.5)' })
              .from(
                q('[data-sc-bar]'),
                { scaleX: 0, transformOrigin: 'left center', duration: 0.5, stagger: 0.07 },
                0.1
              )
              .from(q('[data-sc-footer]'), { autoAlpha: 0, y: 8, duration: 0.5 }, 0.55);
            break;
        }
        return tl;
      };

      // The autonomous "ghost hover": the button demonstrates itself at center.
      const buildPulse = (card: HTMLElement) => {
        const q = gsap.utils.selector(card);
        return gsap
          .timeline({ paused: true })
          .to(q('[data-sc-btn]'), { scale: 1.06, y: -3, duration: 0.28, ease: 'power2.out' })
          .to(q('[data-sc-btn]'), { scale: 1, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.5)' }, 0.3)
          .to(q('[data-sc-dot]'), { scale: 1.45, duration: 0.22, stagger: 0.06, ease: 'power2.out' }, 0.05)
          .to(q('[data-sc-dot]'), { scale: 1, duration: 0.4, stagger: 0.06, ease: 'power2.inOut' }, 0.35);
      };

      const mm = gsap.matchMedia();

      mm.add(
        '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
        () => {
          const cards = gsap.utils.toArray<HTMLElement>('[data-sc-scene]', track);
          const visuals = gsap.utils.toArray<HTMLElement>('[data-sc-visual]', track);
          const captions = gsap.utils.toArray<HTMLElement>('[data-sc-caption]', track);

          // Cached geometry — refreshed on resize, never read per frame.
          let dist = 0;
          let viewportW = 0;
          let centers: number[] = [];
          const measure = () => {
            dist = track.scrollWidth - window.innerWidth;
            viewportW = window.innerWidth;
            centers = visuals.map((el) => {
              const article = el.closest('article') as HTMLElement | null;
              return (article?.offsetLeft ?? 0) + (article?.offsetWidth ?? 0) / 2;
            });
          };
          measure();

          const railSet = gsap.quickSetter('[data-sc-rail]', 'scaleX');
          const scaleSetters = visuals.map((el) => gsap.quickSetter(el, 'scale'));
          const captionSetters = captions.map((el) => gsap.quickSetter(el, 'opacity'));

          // Museum lighting: the centered exhibit stands at full size, the
          // edges recede slightly. Pure math + quickSetters per frame.
          const applyHud = (progress: number) => {
            railSet(progress);
            const centerX = progress * dist + viewportW / 2;
            visuals.forEach((_, i) => {
              const d = Math.min(1, Math.abs(centers[i] - centerX) / (viewportW * 0.55));
              scaleSetters[i](1 - 0.045 * d);
              captionSetters[i]?.(1 - 0.5 * d);
            });
          };

          const scrollTween = gsap.to(track, {
            x: () => -dist,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              pin: true,
              scrub: 1,
              start: 'top top',
              end: () => `+=${dist}`,
              invalidateOnRefresh: true,
              onRefresh: (self) => {
                measure();
                applyHud(self.progress);
              },
              onUpdate: (self) => applyHud(self.progress),
            },
          });

          // Exhibit scenes fire as each card travels into view of the pin.
          cards.forEach((card) => {
            const scene = buildScene(card);
            if (card.dataset.scScene === 'scroll') {
              // The scroll-story exhibit is itself scrubbed: meta-scrollytelling.
              ScrollTrigger.create({
                trigger: card,
                containerAnimation: scrollTween,
                start: 'left 95%',
                end: 'center 45%',
                scrub: 1,
                animation: scene,
              });
            } else {
              ScrollTrigger.create({
                trigger: card,
                containerAnimation: scrollTween,
                start: 'left 82%',
                once: true,
                onEnter: () => scene.play(),
              });
            }
            if (card.dataset.scScene === 'micro') {
              const pulse = buildPulse(card);
              ScrollTrigger.create({
                trigger: card,
                containerAnimation: scrollTween,
                start: 'center 62%',
                end: 'center 38%',
                onToggle: (self) => {
                  if (self.isActive) pulse.restart();
                },
              });
            }
          });
        }
      );

      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-sc-scene]', track);
        cards.forEach((card) => {
          const scene = buildScene(card);
          ScrollTrigger.create({
            trigger: card,
            scroller: track,
            horizontal: true,
            start: 'left 92%',
            once: true,
            onEnter: () => scene.play(),
          });
        });
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        // No pin: make the wall a plain horizontal scroller on any width.
        track.style.overflowX = 'auto';
        return () => {
          track.style.overflowX = '';
        };
      });

      // Tear down the global matchMedia conditions on unmount so a later
      // ScrollTrigger.refresh() (curtain nav) can't re-run them against a stale DOM.
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative flex flex-col justify-center overflow-hidden lg:h-svh"
      style={{ background: 'var(--sq-paper)', paddingBlock: 'clamp(6rem, 10vh, 8rem)' }}
    >
      <div className="sq-container relative z-10 mb-6 flex flex-wrap items-end justify-between gap-6">
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

      {/* Progress rail */}
      <div className="sq-container relative z-10 mb-10 hidden items-center gap-6 lg:flex">
        <div
          className="relative h-[2px] flex-1 overflow-clip rounded-full"
          style={{ background: 'var(--sq-line)' }}
        >
          <span
            data-sc-rail
            className="absolute inset-0 origin-left rounded-full"
            style={{ background: 'var(--sq-accent)', transform: 'scaleX(0)' }}
          />
        </div>
      </div>

      <div
        ref={trackRef}
        className="relative z-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-[max(1.25rem,calc((100vw-78rem)/2+1.25rem))] pb-6 lg:snap-none lg:overflow-x-visible lg:pb-0"
      >
        {SHOWCASE_CARDS.map((card) => (
          <article
            key={card.title}
            data-sc-scene={card.scene}
            className="flex w-[min(80vw,26rem)] shrink-0 snap-center flex-col"
          >
            <div data-sc-visual className="aspect-[4/4.4] w-full">
              {card.visual}
            </div>
            <div data-sc-caption>
              <h3 className="sq-h3 mt-6">{card.title}</h3>
              <p className="sq-muted mt-2 max-w-xs text-[0.9375rem] leading-relaxed">
                {card.promise}
              </p>
            </div>
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

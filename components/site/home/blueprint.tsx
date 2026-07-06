'use client';

import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger, SplitText } from '@/components/site/motion';
import { SplitHeading } from '@/components/site/split-heading';
import { Reveal } from '@/components/site/reveal';

/**
 * Section 6b — De blauwdruk (pinned split-screen build-along).
 * Goal: make the mechanism tangible. Links typt een context-bestand zichzelf
 * regel voor regel (SplitText chars, door scroll aangedreven); rechts bouwt
 * een artboard zich in hetzelfde tempo om: koud grijs wordt warm papier, de
 * spookbalken wijken voor echte typografie en de blauwe rechthoek morpht
 * (MorphSVG) naar een ronde inkt-knop. Jij schrijft smaak, je AI bouwt het.
 */

const EDITOR_LINES = [
  '# smaak.md',
  'kleur: warm papier, één vlam van oranje',
  'letters: groot, rond en rustig',
  'knoppen: zacht en rond, nooit blauw',
  'ritme: veel lucht, één schuine kaart',
  'detail: iets kleins dat beweegt',
];

// Blue default rectangle → rounded pill, same coordinate space.
const BTN_RECT = 'M10 8 L210 8 L210 56 L10 56 Z';
const BTN_PILL =
  'M38 6 L182 6 C 200 6 214 17 214 32 C 214 47 200 58 182 58 L38 58 C 20 58 6 47 6 32 C 6 17 20 6 38 6 Z';

export function Blueprint() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const buildTimeline = () => {
        const lines = gsap.utils.toArray<HTMLElement>('[data-bp-line]');
        const splits = lines.map((line) => SplitText.create(line, { type: 'chars' }));

        // Initial frame: editor + artboard hidden, artboard in AI-default state.
        gsap.set(['[data-bp-editor]', '[data-bp-board]'], { autoAlpha: 0, y: 70 });
        splits.forEach((split) => gsap.set(split.chars, { autoAlpha: 0 }));
        gsap.set('[data-bp-marker]', { autoAlpha: 0 });
        gsap.set('[data-bp-canvas]', { backgroundColor: '#eef0f2' });
        gsap.set('[data-bp-dot]', { scale: 0 });
        gsap.set('[data-bp-headline] > *', { yPercent: 115 });
        gsap.set('[data-bp-ghost]', { autoAlpha: 1 });
        gsap.set('[data-bp-btn-path]', { morphSVG: BTN_RECT, fill: '#3b82f6' });
        gsap.set('[data-bp-btn-label-a]', { autoAlpha: 1 });
        gsap.set('[data-bp-btn-label-b]', { autoAlpha: 0 });
        gsap.set('[data-bp-card]', { autoAlpha: 0, y: 48, rotation: 0 });
        gsap.set('[data-bp-spark] path', { drawSVG: '0% 0%' });
        gsap.set('[data-bp-chip]', { scale: 0, autoAlpha: 0 });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // A line of context "types", the previous one dims.
        const typeLine = (index: number, label: string) => {
          if (index > 0) {
            tl.to(lines[index - 1], { opacity: 0.55, duration: 0.3, ease: 'none' }, label);
          }
          tl.to(`[data-bp-marker="${index}"]`, { autoAlpha: 1, duration: 0.15, ease: 'none' }, label);
          tl.to(splits[index].chars, {
            autoAlpha: 1,
            duration: 0.01,
            ease: 'none',
            stagger: { each: 0.045 },
          }, `${label}+=0.1`);
        };

        // — Boot: both panels rise; the artboard shows the koude AI-default.
        tl.addLabel('boot')
          .to('[data-bp-editor]', { autoAlpha: 1, y: 0, duration: 0.9 }, 'boot')
          .to('[data-bp-board]', { autoAlpha: 1, y: 0, duration: 0.9 }, 'boot+=0.15');
        typeLine(0, 'boot+=0.5');

        // — kleur: the canvas thaws from cold grey to warm paper.
        tl.addLabel('kleur', '+=0.5');
        typeLine(1, 'kleur');
        tl.to('[data-bp-canvas]', { backgroundColor: '#fbf8f2', duration: 1.1, ease: 'power2.inOut' }, 'kleur+=0.7')
          .to('[data-bp-dot]', {
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: 'back.out(2.5)',
          }, 'kleur+=0.9');

        // — letters: ghost bars leave, real typography rises through masks.
        tl.addLabel('letters', '+=0.4');
        typeLine(2, 'letters');
        tl.to('[data-bp-ghost]', { autoAlpha: 0, y: -18, duration: 0.5, stagger: 0.08, ease: 'power2.in' }, 'letters+=0.6')
          .to('[data-bp-headline] > *', { yPercent: 0, duration: 0.9, stagger: 0.12 }, 'letters+=1');

        // — knoppen: the blue rectangle morphs into a rounded ink pill.
        tl.addLabel('knoppen', '+=0.4');
        typeLine(3, 'knoppen');
        tl.to('[data-bp-btn-path]', {
          morphSVG: BTN_PILL,
          fill: '#221d15',
          duration: 0.9,
          ease: 'power2.inOut',
        }, 'knoppen+=0.8')
          .to('[data-bp-btn-label-a]', { autoAlpha: 0, duration: 0.3, ease: 'none' }, 'knoppen+=0.8')
          .to('[data-bp-btn-label-b]', { autoAlpha: 1, duration: 0.3, ease: 'none' }, 'knoppen+=1.2');

        // — ritme: cards settle in, deliberately just off-grid.
        tl.addLabel('ritme', '+=0.4');
        typeLine(4, 'ritme');
        tl.to('[data-bp-card="a"]', { autoAlpha: 1, y: 0, rotation: -2, duration: 0.9 }, 'ritme+=0.7')
          .to('[data-bp-card="b"]', { autoAlpha: 1, y: 0, rotation: 2.5, duration: 0.9 }, 'ritme+=0.9');

        // — detail: a sparkle draws itself and signs the page off.
        tl.addLabel('detail', '+=0.4');
        typeLine(5, 'detail');
        tl.to('[data-bp-spark] path', {
          drawSVG: '0% 100%',
          duration: 0.5,
          stagger: 0.1,
          ease: 'power1.inOut',
        }, 'detail+=0.8')
          .to('[data-bp-chip]', { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'back.out(2)' }, 'detail+=1.1')
          .to({}, { duration: 0.8 });

        return tl;
      };

      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const tl = buildTimeline();
        ScrollTrigger.create({
          animation: tl,
          trigger: section,
          start: 'top top',
          end: '+=340%',
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        });
      });

      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        const tl = buildTimeline();
        tl.pause().timeScale(1.25);
        ScrollTrigger.create({
          trigger: section,
          start: 'top 65%',
          once: true,
          onEnter: () => tl.play(),
        });
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(['[data-bp-editor]', '[data-bp-board]'], { autoAlpha: 1, y: 0 });
        gsap.set('[data-bp-canvas]', { backgroundColor: '#fbf8f2' });
        gsap.set('[data-bp-dot], [data-bp-chip]', { scale: 1, autoAlpha: 1 });
        gsap.set('[data-bp-headline] > *', { yPercent: 0 });
        gsap.set('[data-bp-ghost]', { autoAlpha: 0 });
        gsap.set('[data-bp-marker]', { autoAlpha: 1 });
        gsap.set('[data-bp-btn-path]', { morphSVG: BTN_PILL, fill: '#221d15' });
        gsap.set('[data-bp-btn-label-a]', { autoAlpha: 0 });
        gsap.set('[data-bp-btn-label-b]', { autoAlpha: 1 });
        gsap.set('[data-bp-card]', { autoAlpha: 1, y: 0 });
        gsap.set('[data-bp-spark] path', { drawSVG: '0% 100%' });
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
      className="overflow-hidden lg:h-svh"
      style={{ background: 'var(--sq-inverse)', color: 'var(--sq-inverse-ink)' }}
    >
      <div
        className="sq-container flex flex-col justify-center lg:h-full"
        style={{ paddingBlock: 'clamp(6rem, 10vh, 8rem)' }}
      >
        <div className="max-w-2xl">
          <Reveal>
            <p className="sq-eyebrow" style={{ color: 'var(--sq-accent)' }}>
              De blauwdruk
            </p>
          </Reveal>
          <SplitHeading className="sq-h2 mt-5">
            Jij schrijft smaak. Je AI bouwt het.
          </SplitHeading>
        </div>

        <div className="relative mt-10 grid gap-6 lg:mt-14 lg:grid-cols-2 lg:gap-14">
          {/* Editor: the context file that types itself */}
          <div
            data-bp-editor
            data-sq-reveal
            className="rounded-2xl p-6 md:p-8"
            style={{
              background: 'var(--sq-inverse-raised)',
              border: '1px solid color-mix(in srgb, var(--sq-inverse-ink) 12%, transparent)',
            }}
          >
            <div className="flex items-center gap-2">
              {['var(--sq-accent)', 'color-mix(in srgb, var(--sq-inverse-ink) 25%, transparent)', 'color-mix(in srgb, var(--sq-inverse-ink) 25%, transparent)'].map(
                (dot, index) => (
                  <span key={index} className="h-2.5 w-2.5 rounded-full" style={{ background: dot }} />
                )
              )}
              <span className="ml-3 text-xs font-semibold" style={{ color: 'var(--sq-inverse-soft)' }}>
                smaak.md
              </span>
            </div>

            <div
              className="mt-6 space-y-3.5 text-[0.8125rem] leading-relaxed md:text-sm"
              style={{ fontFamily: "ui-monospace, 'Cascadia Code', 'JetBrains Mono', monospace" }}
            >
              {EDITOR_LINES.map((line, index) => (
                <div key={line} className="flex gap-4">
                  <span
                    className="w-4 shrink-0 select-none text-right"
                    style={{ color: 'color-mix(in srgb, var(--sq-inverse-soft) 55%, transparent)' }}
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <span data-bp-marker={index} className="shrink-0" style={{ color: 'var(--sq-accent)' }} aria-hidden="true">
                    »
                  </span>
                  <p
                    data-bp-line
                    style={{
                      color: index === 0 ? 'var(--sq-accent)' : 'var(--sq-inverse-ink)',
                      fontWeight: index === 0 ? 700 : 400,
                    }}
                  >
                    {line}
                  </p>
                </div>
              ))}
            </div>

            <p className="sq-faint mt-7" style={{ color: 'var(--sq-inverse-soft)' }}>
              Eén bestand uit je vault. Elke regel is een beslissing die je nooit meer
              hoeft te herhalen.
            </p>
          </div>

          {/* Artboard: the page that rebuilds itself per typed rule */}
          <div data-bp-board data-sq-reveal className="relative">
            <div
              data-bp-canvas
              className="relative h-full min-h-[24rem] overflow-hidden rounded-2xl p-6 md:p-8"
              style={{ boxShadow: 'var(--sq-shadow-float)' }}
            >
              {/* Palette dots (kleur) */}
              <div className="absolute right-6 top-6 flex gap-2">
                {['#fbf8f2', '#ece5d6', '#e4572e', '#221d15'].map((swatch) => (
                  <span
                    key={swatch}
                    data-bp-dot
                    className="h-4 w-4 rounded-full border"
                    style={{ background: swatch, borderColor: '#d8cfba' }}
                  />
                ))}
              </div>

              {/* Ghost skeleton: the AI default before taste arrives */}
              <div className="absolute left-6 top-14 space-y-3 md:left-8" aria-hidden="true">
                <span data-bp-ghost className="block h-5 w-48 rounded" style={{ background: '#d3d8dc' }} />
                <span data-bp-ghost className="block h-5 w-32 rounded" style={{ background: '#d3d8dc' }} />
                <span data-bp-ghost className="block h-3 w-56 rounded" style={{ background: '#e2e6e9' }} />
              </div>

              {/* Real typography (letters) */}
              <div data-bp-headline className="relative mt-8 max-w-xs">
                <span className="block overflow-clip py-[0.06em] my-[-0.06em]">
                  <span
                    className="sq-display block text-[clamp(1.6rem,2.6vw,2.25rem)] leading-[1.08]"
                    style={{ color: '#221d15' }}
                  >
                    Brood met
                  </span>
                </span>
                <span className="block overflow-clip py-[0.06em] my-[-0.06em]">
                  <span
                    className="sq-display block text-[clamp(1.6rem,2.6vw,2.25rem)] leading-[1.08]"
                    style={{ color: '#221d15' }}
                  >
                    een eigen <span style={{ color: '#e4572e' }}>wil</span>
                  </span>
                </span>
              </div>

              {/* Sparkle (detail) */}
              <svg
                data-bp-spark
                aria-hidden="true"
                viewBox="0 0 60 60"
                className="absolute right-8 top-16 h-10 w-10 md:right-12"
                fill="none"
              >
                {['M30 6 L30 22', 'M30 38 L30 54', 'M6 30 L22 30', 'M38 30 L54 30'].map((d) => (
                  <path key={d} d={d} stroke="#e4572e" strokeWidth="5" strokeLinecap="round" />
                ))}
              </svg>

              {/* Cards (ritme) */}
              <div className="mt-7 flex max-w-sm items-start gap-4">
                <div
                  data-bp-card="a"
                  className="flex h-28 w-3/5 flex-col justify-end rounded-2xl p-4 md:h-32"
                  style={{ background: '#221d15' }}
                >
                  <p className="sq-display text-sm" style={{ color: '#f4efe4' }}>Desem van dinsdag</p>
                </div>
                <div
                  data-bp-card="b"
                  className="mt-5 flex h-20 w-2/5 flex-col justify-end rounded-2xl p-4 md:h-24"
                  style={{ background: '#f9e7de' }}
                >
                  <p className="sq-display text-sm" style={{ color: '#9a3312' }}>Nog warm</p>
                </div>
              </div>

              {/* Button (knoppen): blue rectangle morphs into a rounded pill */}
              <div className="relative mt-6 h-14 w-52">
                <svg viewBox="0 0 220 64" className="h-full w-full" aria-hidden="true">
                  <path data-bp-btn-path d={BTN_RECT} fill="#3b82f6" />
                </svg>
                <span
                  data-bp-btn-label-a
                  className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white"
                >
                  Learn more
                </span>
                <span
                  data-bp-btn-label-b
                  className="sq-display absolute inset-0 flex items-center justify-center text-sm font-semibold"
                  style={{ color: '#fbf8f2' }}
                >
                  Proef de ochtend
                </span>
              </div>

              <span
                data-bp-chip
                className="absolute bottom-6 right-6 rounded-full px-3.5 py-1.5 text-xs font-bold"
                style={{ background: '#f9e7de', color: '#9a3312' }}
              >
                Gebouwd door je AI
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

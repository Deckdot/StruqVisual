'use client';

import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger, SplitText } from '@/components/site/motion';

/**
 * Section 3 — The problem, staged as a pinned three-act theater.
 * Goal: pain recognition. Act 1 assembles the grey AI-cliché (three cards,
 * a blue button) with deliberately flat fades. Act 2 strikes it through and
 * lets it collapse under gravity, while the word "grijs." in the headline
 * falls apart char by char. Act 3 raises the designed version out of clip
 * masks and lifts "gedurfd." into the gap. Scroll drives every frame.
 */

const GREY_CARDS = ['Feature one', 'Feature two', 'Feature three'];

export function Problem() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      const buildTimeline = () => {
        const wordGray = root.current?.querySelector('[data-word-gray]');
        const wordDesigned = root.current?.querySelector('[data-word-designed]');
        if (!wordGray || !wordDesigned) return null;

        const grayChars = SplitText.create(wordGray, { type: 'chars' }).chars;
        const designedSplit = SplitText.create(wordDesigned, { type: 'chars', mask: 'chars' });

        // Initial states, set explicitly so scrubbing backwards always lands
        // on a coherent frame. Eyebrow, heading and the grey mockup are all
        // present from the very first frame, so nothing reads as a blank
        // intro while scrolling in; only the verdict onward is scroll-driven.
        gsap.set('[data-pr-note]', { autoAlpha: 0 });
        gsap.set(['[data-pr-eyebrow]', '[data-pr-stage]'], { autoAlpha: 1, y: 0 });
        gsap.set('[data-pr-line]', { yPercent: 0 });
        gsap.set('[data-pr-head]', { autoAlpha: 1 });
        gsap.set(grayChars, { autoAlpha: 1 });
        gsap.set(designedSplit.chars, { yPercent: 120 });
        gsap.set('[data-gray-item]', { autoAlpha: 1 });
        gsap.set('[data-gray-layer]', { autoAlpha: 1 });
        gsap.set('[data-scribble] path', { drawSVG: '0% 0%' });
        gsap.set('[data-d-mask] > *', { yPercent: 115 });
        gsap.set('[data-d-pop]', { scale: 0, autoAlpha: 0 });
        gsap.set('[data-designed-layer]', { autoAlpha: 0 });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // — Act 2: the verdict. A marker strike, then gravity.
        tl.addLabel('verdict')
          // Free the falling chars from the heading's line mask.
          .set('[data-pr-mask]', { overflow: 'visible' }, 'verdict')
          .to('[data-scribble] path', {
            drawSVG: '0% 100%',
            duration: 0.55,
            stagger: 0.3,
            ease: 'power1.inOut',
          }, 'verdict')
          .to('[data-pr-stage]', { rotation: -1.4, duration: 0.6, ease: 'power2.inOut' }, 'verdict');

        tl.addLabel('collapse', '+=0.1')
          .to('[data-gray-item]', {
            y: () => gsap.utils.random(380, 560),
            rotation: () => gsap.utils.random(-28, 28),
            autoAlpha: 0,
            duration: 0.9,
            ease: 'power2.in',
            stagger: { each: 0.05, from: 'random' },
          }, 'collapse')
          .to(grayChars, {
            y: () => gsap.utils.random(60, 110),
            rotation: () => gsap.utils.random(-40, 40),
            autoAlpha: 0,
            duration: 0.7,
            ease: 'power2.in',
            stagger: { each: 0.03, from: 'random' },
          }, 'collapse+=0.1')
          .to('[data-scribble] path', { autoAlpha: 0, duration: 0.35, ease: 'none' }, 'collapse+=0.35')
          .to('[data-pr-stage]', { rotation: 0, duration: 0.7, ease: 'power2.inOut' }, 'collapse+=0.2')
          .set('[data-gray-layer]', { autoAlpha: 0 }, 'collapse+=0.85');

        // — Act 3: same content, other context.
        tl.addLabel('rebuild', 'collapse+=0.6')
          .set('[data-designed-layer]', { autoAlpha: 1 }, 'rebuild')
          .to('[data-d-mask] > *', { yPercent: 0, duration: 0.8, stagger: 0.1 }, 'rebuild')
          .to(designedSplit.chars, { yPercent: 0, duration: 0.7, stagger: 0.04 }, 'rebuild+=0.12')
          .to('[data-d-pop]', {
            scale: 1,
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(2)',
          }, 'rebuild+=0.35');

        // — Rest: let the point sink in before the pin releases.
        tl.addLabel('rest', '+=0.15')
          .to('[data-pr-note]', { autoAlpha: 1, y: 0, duration: 0.5 }, 'rest')
          .to({}, { duration: 0.35 });

        return tl;
      };

      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const tl = buildTimeline();
        if (!tl) return;
        ScrollTrigger.create({
          animation: tl,
          trigger: root.current,
          start: 'top top',
          end: '+=320%',
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        });
      });

      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        const tl = buildTimeline();
        if (!tl) return;
        tl.pause().timeScale(1.35);
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top 62%',
          once: true,
          onEnter: () => tl.play(),
        });
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          ['[data-pr-eyebrow]', '[data-pr-head]', '[data-pr-stage]', '[data-pr-note]', '[data-designed-layer]'],
          { autoAlpha: 1 }
        );
        gsap.set('[data-pr-line]', { yPercent: 0 });
        gsap.set('[data-gray-layer]', { autoAlpha: 0 });
        gsap.set('[data-d-mask] > *', { yPercent: 0 });
        gsap.set('[data-d-pop]', { scale: 1, autoAlpha: 1 });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="lg:h-svh" style={{ background: 'var(--sq-paper)' }}>
      <div
        className="sq-container flex flex-col justify-center lg:h-full"
        style={{ paddingBlock: 'clamp(5rem, 9vh, 7rem)' }}
      >
        <div className="max-w-3xl">
          <p data-pr-eyebrow data-sq-reveal className="sq-eyebrow">
            Herken je dit?
          </p>
          <h2 data-pr-head data-sq-reveal className="sq-h2 mt-5">
            <span data-pr-mask className="block overflow-clip py-[0.08em] my-[-0.08em]">
              <span data-pr-line className="block">
                Je vraagt om mooi.
              </span>
            </span>
            <span data-pr-mask className="block overflow-clip py-[0.08em] my-[-0.08em]">
              <span data-pr-line className="block">
                Je krijgt{' '}
                <span className="relative inline-block align-baseline whitespace-nowrap">
                  <span data-word-designed style={{ color: 'var(--sq-accent)' }}>
                    gedurfd.
                  </span>
                  <span
                    data-word-gray
                    aria-hidden="true"
                    className="absolute left-0 top-0"
                    style={{ color: 'var(--sq-ink-faint)' }}
                  >
                    grijs.
                  </span>
                </span>
              </span>
            </span>
          </h2>
        </div>

        {/* The stage: a fake browser where the grey average falls and taste rises. */}
        <div
          data-pr-stage
          data-sq-reveal
          className="sq-panel relative mx-auto mt-10 w-full max-w-4xl translate-y-[90px] overflow-hidden lg:mt-12"
          style={{ boxShadow: 'var(--sq-shadow-float)' }}
        >
          {/* Browser chrome */}
          <div
            className="flex items-center gap-2 border-b px-5 py-3.5"
            style={{ borderColor: 'var(--sq-line)' }}
          >
            {['#e4572e', '#d8cfba', '#d8cfba'].map((dot, index) => (
              <span key={index} className="h-2.5 w-2.5 rounded-full" style={{ background: dot }} />
            ))}
            <span
              className="ml-3 rounded-full px-4 py-1 text-xs font-semibold"
              style={{ background: 'var(--sq-sunken)', color: 'var(--sq-ink-faint)' }}
            >
              jouwkoffiezaak.nl
            </span>
            <span
              data-d-pop
              className="ml-auto rounded-full border px-3.5 py-1.5 text-xs font-bold"
              style={{ borderColor: 'var(--sq-accent)', color: 'var(--sq-accent-ink)' }}
            >
              Met Struq-context
            </span>
          </div>

          <div className="relative h-[24rem] md:h-[27rem]">
            {/* Layer 1: the grey average */}
            <div
              data-gray-layer
              className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center md:p-10"
            >
              <span
                data-gray-item
                className="rounded-full border px-3.5 py-1.5 text-xs font-semibold"
                style={{ borderColor: '#e5e5e5', color: '#9ca3af' }}
              >
                Zonder context
              </span>
              <p data-gray-item className="text-xl font-semibold text-[#6b7280] md:text-2xl">
                Welkom op onze website
              </p>
              <p data-gray-item className="max-w-sm text-sm text-[#9ca3af]">
                Wij bieden kwaliteit, service en de beste oplossingen voor al uw wensen.
              </p>
              <div className="flex w-full max-w-lg gap-4">
                {GREY_CARDS.map((card) => (
                  <div
                    key={card}
                    data-gray-item
                    className="flex h-20 flex-1 flex-col items-center justify-center gap-2 rounded-lg border bg-white md:h-24"
                    style={{ borderColor: '#e5e5e5' }}
                  >
                    <span className="h-2 w-10 rounded-full bg-[#e5e7eb]" />
                    <span className="text-xs text-[#9ca3af]">{card}</span>
                  </div>
                ))}
              </div>
              <span
                data-gray-item
                className="rounded-md bg-[#3b82f6] px-5 py-2.5 text-sm font-medium text-white"
              >
                Learn more
              </span>
            </div>

            {/* The marker strike across the grey layer */}
            <svg
              data-scribble
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 h-full w-full"
              viewBox="0 0 800 420"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M96 118 C 260 190, 470 210, 704 128"
                stroke="var(--sq-accent)"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d="M120 300 C 300 232, 520 226, 688 296"
                stroke="var(--sq-accent)"
                strokeWidth="7"
                strokeLinecap="round"
              />
            </svg>

            {/* Layer 2: same content, other context */}
            <div data-designed-layer className="absolute inset-0 p-6 md:p-10">
              <div data-d-mask className="max-w-md overflow-clip py-[0.08em] my-[-0.08em]">
                <p className="sq-display text-[clamp(1.75rem,3.4vw,2.875rem)] leading-[1.06]">
                  Koffie die je dag <span style={{ color: 'var(--sq-accent)' }}>draagt</span>
                </p>
              </div>

              <span
                data-d-pop
                className="absolute right-6 top-6 inline-block rounded-full px-4 py-2 text-sm font-bold md:right-10 md:top-10"
                style={{ background: 'var(--sq-accent-wash)', color: 'var(--sq-accent-ink)' }}
              >
                Sinds 1998
              </span>

              <div className="mt-7 flex max-w-xl items-start gap-5">
                <div data-d-mask className="w-3/5 overflow-clip">
                  <div
                    className="flex h-36 rotate-[-1.5deg] flex-col justify-end rounded-3xl p-5 md:h-44"
                    style={{ background: 'var(--sq-inverse)' }}
                  >
                    <p className="sq-display text-lg" style={{ color: 'var(--sq-inverse-ink)' }}>
                      Single origin
                    </p>
                  </div>
                </div>
                <div data-d-mask className="mt-6 w-2/5 overflow-clip">
                  <div
                    className="flex h-28 rotate-[2deg] flex-col justify-end rounded-3xl p-5 md:h-36"
                    style={{ background: 'var(--sq-accent-wash)' }}
                  >
                    <p className="sq-display text-lg" style={{ color: 'var(--sq-accent-ink)' }}>
                      Slow brew
                    </p>
                  </div>
                </div>
              </div>

              <span
                data-d-pop
                className="absolute bottom-16 right-10 hidden h-16 w-16 rounded-full md:block"
                style={{ background: 'var(--sq-accent)' }}
                aria-hidden="true"
              />

              <div data-d-mask className="mt-7 inline-block overflow-clip">
                <span
                  className="inline-block rounded-full px-7 py-3.5 text-sm font-bold"
                  style={{ background: 'var(--sq-ink)', color: 'var(--sq-paper)' }}
                >
                  Proef het verschil
                </span>
              </div>
            </div>
          </div>
        </div>

        <p
          data-pr-note
          data-sq-reveal
          className="sq-lead mx-auto mt-8 max-w-2xl translate-y-4 text-center"
        >
          Zelfde inhoud, andere context. Niet omdat jouw AI het niet kan, maar omdat
          niemand hem heeft verteld wat smaak is.
        </p>
      </div>
    </section>
  );
}

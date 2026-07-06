'use client';

import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger, SplitText } from '@/components/site/motion';
import { SplitHeading } from '@/components/site/split-heading';
import { Reveal } from '@/components/site/reveal';

/**
 * Section 4b — One library, three forms (MorphSVG theater).
 * Goal: make the visual asset taxonomy physical. One ink silhouette morphs
 * from druppel (palet) naar letter (typografie) naar zeshoek (design system)
 * while the pinned scroll drives the morph, the word swap and a slowly
 * drawing orbit ring. Mobile gets the same choreography as an ambient loop
 * instead of a pin.
 */

const PHASES = [
  {
    word: 'Palet.',
    desc: 'Kleuren met karakter, klaar als tokens. Je AI kent opeens meer dan standaardblauw.',
  },
  {
    word: 'Typografie.',
    desc: 'Lettercombinaties met spanning. Display, body en accent die samen kloppen.',
  },
  {
    word: 'Design system.',
    desc: 'Tokens, regels en ritme in één systeem. Je AI volgt het in elk scherm.',
  },
];

// Three silhouettes in the same 400x400 space, all single closed paths so
// MorphSVG can interpolate them cleanly.
const SHAPE_DROP =
  'M200 52 C 200 52 92 176 92 252 C 92 316 140 356 200 356 C 260 356 308 316 308 252 C 308 176 200 52 200 52 Z';
const SHAPE_LETTER =
  'M200 48 L338 352 L266 352 L200 200 L134 352 L62 352 Z';
const SHAPE_SYSTEM = 'M200 52 L324 118 L324 268 L200 334 L76 268 L76 118 Z';

export function FourForms() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const css = getComputedStyle(section);
      const readToken = (token: string, fallback: string) =>
        css.getPropertyValue(token).trim() || fallback;
      const fills = [
        readToken('--sq-ink', '#221d15'),
        readToken('--sq-accent', '#e4572e'),
        readToken('--sq-accent-deep', '#b23c17'),
      ];
      const shapes = [SHAPE_DROP, SHAPE_LETTER, SHAPE_SYSTEM];

      const buildTimeline = (loop: boolean) => {
        const words = gsap.utils.toArray<HTMLElement>('[data-ff-word]');
        const splits = words.map((word) =>
          SplitText.create(word, { type: 'chars', mask: 'chars' })
        );

        gsap.set('[data-ff-word-box], [data-ff-desc-box]', { autoAlpha: 1 });
        splits.forEach((split, index) => {
          gsap.set(split.chars, { yPercent: index === 0 ? 0 : 120 });
        });
        gsap.set('[data-ff-desc]', {
          autoAlpha: (index: number) => (index === 0 ? 1 : 0),
          y: (index: number) => (index === 0 ? 0 : 14),
        });
        gsap.set('[data-ff-detail]', { autoAlpha: 0 });
        gsap.set('[data-ff-detail="0"]', { autoAlpha: 1 });
        gsap.set('[data-ff-shape]', { fill: fills[0] });
        gsap.set('[data-ff-ring] circle', { drawSVG: loop ? '0% 100%' : '0% 2%' });
        gsap.set('[data-ff-tick]', {
          background: (index: number) => (index === 0 ? fills[1] : 'transparent'),
        });

        const tl = gsap.timeline({ defaults: { ease: 'sine.inOut' } });

        const stepCount = loop ? PHASES.length : PHASES.length - 1;
        for (let step = 0; step < stepCount; step += 1) {
          const from = step % PHASES.length;
          const to = (step + 1) % PHASES.length;
          const label = `phase${step}`;
          tl.addLabel(label, step === 0 ? '+=0.9' : '+=1.1');

          // Silhouette: one long, even morph with a barely-there breathe.
          tl.to('[data-ff-shape]', {
            morphSVG: { shape: shapes[to], type: 'rotational' },
            fill: fills[to],
            duration: 1.8,
          }, label)
            .to('[data-ff-stage]', {
              rotation: to % 2 === 0 ? -4 : 4,
              duration: 1.8,
              svgOrigin: '200 200',
            }, label)
            .to('[data-ff-stage]', { scale: 0.975, duration: 0.9, svgOrigin: '200 200' }, label)
            .to('[data-ff-stage]', { scale: 1, duration: 0.9, svgOrigin: '200 200' }, `${label}+=0.9`);

          // Cut-out details dissolve out early and fade in once the new
          // silhouette has mostly settled.
          tl.to(`[data-ff-detail="${from}"]`, { autoAlpha: 0, duration: 0.45, ease: 'sine.out' }, label)
            .to(`[data-ff-detail="${to}"]`, { autoAlpha: 1, duration: 0.6, ease: 'sine.in' }, `${label}+=1.25`);

          // The word leaves upward through its mask, the next rises in.
          tl.to(splits[from].chars, {
            yPercent: -120,
            duration: 0.9,
            stagger: 0.04,
            ease: 'sine.in',
          }, label)
            .fromTo(
              splits[to].chars,
              { yPercent: 120 },
              { yPercent: 0, duration: 1, stagger: 0.05, ease: 'power2.out' },
              `${label}+=0.7`
            );

          // Description and progress ticks follow.
          tl.to(`[data-ff-desc]:nth-child(${from + 1})`, { autoAlpha: 0, y: -14, duration: 0.6 }, label)
            .fromTo(
              `[data-ff-desc]:nth-child(${to + 1})`,
              { autoAlpha: 0, y: 14 },
              { autoAlpha: 1, y: 0, duration: 0.8 },
              `${label}+=0.8`
            )
            .to(`[data-ff-tick]:nth-child(${from + 1})`, { background: 'transparent', duration: 0.5 }, label)
            .to(`[data-ff-tick]:nth-child(${to + 1})`, { background: fills[1], duration: 0.5 }, `${label}+=0.8`);

          // Counter flips through its own little mask (strip is 5 lines tall).
          tl.to('[data-ff-count]', { yPercent: (-100 / PHASES.length) * to, duration: 0.9, ease: 'power2.inOut' }, `${label}+=0.45`);
        }

        tl.to({}, { duration: loop ? 1.4 : 1.2 });

        // The orbit spans the full choreography, linearly with scroll.
        if (!loop) {
          tl.to('[data-ff-ring] circle', { drawSVG: '0% 100%', ease: 'none', duration: tl.duration() }, 0);
        }
        tl.to('[data-ff-ring]', { rotation: 120, ease: 'none', duration: tl.duration(), svgOrigin: '200 200' }, 0);

        return tl;
      };

      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const tl = buildTimeline(false);
        ScrollTrigger.create({
          animation: tl,
          trigger: section,
          start: 'top top',
          end: '+=260%',
          pin: true,
          scrub: 1.6,
          invalidateOnRefresh: true,
        });
      });

      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        const tl = buildTimeline(true);
        tl.pause().repeat(-1).repeatDelay(0.9);
        ScrollTrigger.create({
          trigger: section,
          start: 'top 85%',
          end: 'bottom 15%',
          onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
        });
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('[data-ff-word-box], [data-ff-desc-box]', { autoAlpha: 1 });
        gsap.set('[data-ff-word]', { autoAlpha: (index: number) => (index === 0 ? 1 : 0) });
        gsap.set('[data-ff-desc]', { autoAlpha: (index: number) => (index === 0 ? 1 : 0) });
        gsap.set('[data-ff-detail="0"]', { autoAlpha: 1 });
        gsap.set('[data-ff-ring] circle', { drawSVG: '0% 100%' });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="overflow-hidden lg:h-svh"
      style={{ background: 'var(--sq-sunken)' }}
    >
      <div
        className="sq-container grid items-center gap-14 lg:h-full lg:grid-cols-[5fr_7fr] lg:gap-20"
        style={{ paddingBlock: 'clamp(6rem, 11vh, 9rem)' }}
      >
        <div>
          <Reveal>
            <p className="sq-eyebrow">De bouwstenen</p>
          </Reveal>
          <SplitHeading className="sq-h2 mt-6">
            Eén bibliotheek. Elke vorm smaak.
          </SplitHeading>
          <Reveal delay={0.12}>
            <p className="sq-lead mt-7 max-w-md">
              Palet, typografie, design system, en meer. Scroll en zie hoe de ene
              vorm in de andere overgaat.
            </p>
          </Reveal>

          {/* Active phase description (stacked, swapped by the timeline) */}
          <div data-ff-desc-box data-sq-reveal className="relative mt-10 min-h-[5.5rem] max-w-md">
            {PHASES.map((phase) => (
              <p key={phase.word} data-ff-desc className="absolute inset-x-0 top-0 sq-muted leading-relaxed">
                {phase.desc}
              </p>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-6">
            {/* Counter through a mask */}
            <div className="flex items-baseline gap-2">
              <span className="sq-display inline-block h-[1.15em] overflow-clip text-4xl">
                <span data-ff-count className="block">
                  {PHASES.map((phase, index) => (
                    <span key={phase.word} className="block leading-[1.15]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  ))}
                </span>
              </span>
              <span className="sq-faint">/ 03</span>
            </div>
            <div className="flex gap-2.5" aria-hidden="true">
              {PHASES.map((phase) => (
                <span
                  key={phase.word}
                  data-ff-tick
                  className="h-2.5 w-2.5 rounded-full border"
                  style={{ borderColor: 'var(--sq-line-strong)' }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* The morph theater */}
        <div className="relative mx-auto w-full max-w-[30rem]">
          <svg viewBox="0 0 400 400" className="w-full" fill="none" aria-hidden="true">
            {/* Orbit ring, drawn by scroll */}
            <g data-ff-ring>
              <circle
                cx="200"
                cy="200"
                r="186"
                stroke="var(--sq-line-strong)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="3 12"
              />
            </g>

            <g data-ff-stage>
              <path data-ff-shape d={SHAPE_DROP} fill="var(--sq-ink)" />

              {/* Cut-out details per vorm, in the section background colour */}
              {/* Palet: drie swatch-stippen in de druppel */}
              <g data-ff-detail="0">
                {[152, 200, 248].map((cx) => (
                  <circle key={cx} cx={cx} cy="268" r="11" fill="var(--sq-sunken)" />
                ))}
              </g>
              {/* Typografie: de dwarsbalk van de A */}
              <g data-ff-detail="1">
                <line
                  x1="158"
                  x2="242"
                  y1="286"
                  y2="286"
                  stroke="var(--sq-sunken)"
                  strokeWidth="9"
                  strokeLinecap="round"
                />
              </g>
              {/* Design system: de kubusribben van de zeshoek */}
              <g data-ff-detail="2">
                <path
                  d="M76 118 L200 184 L324 118 M200 184 L200 334"
                  stroke="var(--sq-sunken)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            </g>
          </svg>

          {/* The word under the shape, swapped through char masks */}
          <div
            data-ff-word-box
            data-sq-reveal
            className="pointer-events-none relative mx-auto mt-2 h-[1.3em] w-full text-center"
          >
            {PHASES.map((phase) => (
              <p
                key={phase.word}
                data-ff-word
                className="sq-display absolute inset-x-0 top-0 text-[clamp(2rem,3.6vw,3rem)] leading-[1.15]"
              >
                {phase.word}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

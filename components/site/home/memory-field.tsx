'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { TransitionLink as Link } from '@/components/providers/PageTransition';
import { gsap, useGSAP, ScrollTrigger, SplitText, prefersReducedMotion } from '@/components/site/motion';

const MemoryCanvas = dynamic(() => import('./memory-canvas'), { ssr: false });

/**
 * Section 9b — Het geheugen (Three.js crescendo).
 * Goal: alles komt samen vlak voor pricing. Een puntenwolk van duizenden
 * deeltjes hangt als chaos in het donker en trekt, aangedreven door je
 * scroll, samen tot een geordend geheugenrooster, terwijl drie regels copy
 * elkaar door woordmaskers afwisselen. Chaos is elke nieuwe chat; het
 * rooster is jouw vault.
 */

const PHASES = [
  {
    head: 'Elke nieuwe chat begint bij nul.',
    sub: 'Je AI is briljant, en vergeet alles wat jullie samen uitvonden.',
  },
  {
    head: 'Tenzij jij het geheugen meebrengt.',
    sub: 'Je regels, je smaak, je manier van bouwen. Vastgelegd, herbruikbaar.',
  },
  {
    head: 'Struq onthoudt. Jij schaalt.',
    sub: '',
  },
];

export function MemoryField() {
  const root = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [canvasReady, setCanvasReady] = useState(false);

  // Mount the WebGL layer just before the section scrolls into reach.
  useEffect(() => {
    const section = root.current;
    if (!section || prefersReducedMotion()) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCanvasReady(true);
          io.disconnect();
        }
      },
      { rootMargin: '150%' }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const buildTimeline = () => {
        const heads = gsap.utils.toArray<HTMLElement>('[data-mf-head]');
        const splits = heads.map((head) =>
          SplitText.create(head, { type: 'words', mask: 'words' })
        );

        gsap.set('[data-mf-phase]', { autoAlpha: 1 });
        gsap.set(heads, { autoAlpha: 1 });
        splits.forEach((split) => gsap.set(split.words, { yPercent: 120 }));
        gsap.set('[data-mf-sub]', { autoAlpha: 0, y: 18 });
        gsap.set('[data-mf-cta]', { autoAlpha: 0, y: 26, scale: 0.94 });
        gsap.set('[data-mf-hint]', { autoAlpha: 0 });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        const phaseIn = (index: number, position: number) => {
          tl.to(splits[index].words, { yPercent: 0, duration: 0.9, stagger: 0.07 }, position);
          tl.to(`[data-mf-sub="${index}"]`, { autoAlpha: 1, y: 0, duration: 0.7 }, position + 0.3);
        };
        const phaseOut = (index: number, position: number) => {
          tl.to(splits[index].words, {
            yPercent: -120,
            duration: 0.6,
            stagger: 0.05,
            ease: 'power2.in',
          }, position);
          tl.to(`[data-mf-sub="${index}"]`, { autoAlpha: 0, y: -14, duration: 0.4 }, position);
        };

        // De wolk trekt samen in drie versnellingen, synchroon met de copy.
        tl.to(progressRef, { current: 0.16, duration: 2.6, ease: 'none' }, 0)
          .to(progressRef, { current: 0.85, duration: 3.6, ease: 'none' }, 2.6)
          .to(progressRef, { current: 1, duration: 1.8, ease: 'none' }, 6.2);

        tl.to('[data-mf-hint]', { autoAlpha: 1, duration: 0.5 }, 0.2)
          .to('[data-mf-hint]', { autoAlpha: 0, duration: 0.5 }, 2.2);

        phaseIn(0, 0.35);
        phaseOut(0, 2.5);
        phaseIn(1, 3.1);
        phaseOut(1, 5.9);
        phaseIn(2, 6.6);
        tl.to('[data-mf-cta]', {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.6)',
        }, 7.4);
        tl.to({}, { duration: 1 });

        return tl;
      };

      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const tl = buildTimeline();
        ScrollTrigger.create({
          animation: tl,
          trigger: section,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        });
      });

      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        const tl = buildTimeline();
        tl.pause().timeScale(1.15);
        ScrollTrigger.create({
          trigger: section,
          start: 'top 55%',
          once: true,
          onEnter: () => tl.play(),
        });
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        progressRef.current = 1;
        gsap.set('[data-mf-phase]', { autoAlpha: 0 });
        gsap.set('[data-mf-phase="2"]', { autoAlpha: 1 });
        gsap.set('[data-mf-cta]', { autoAlpha: 1, y: 0, scale: 1 });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} style={{ paddingBlock: 'clamp(3rem, 6vh, 5rem)' }}>
      <div className="sq-container-wide">
        <div
          className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem]"
          style={{ background: 'var(--sq-inverse)', color: 'var(--sq-inverse-ink)' }}
        >
          {canvasReady ? <MemoryCanvas progressRef={progressRef} /> : null}

          <div className="relative z-10 flex min-h-[34rem] flex-col items-center justify-center px-6 text-center md:px-12 lg:h-[min(84svh,54rem)]">
        <p data-mf-hint data-sq-reveal className="sq-eyebrow" style={{ color: 'var(--sq-accent)' }}>
          Het geheugen
        </p>

        <div className="relative mt-6 w-full max-w-4xl">
          {PHASES.map((phase, index) => (
            <div
              key={phase.head}
              data-mf-phase={index}
              className="absolute inset-x-0 top-0"
            >
              <h2
                data-mf-head
                data-sq-reveal
                className="sq-display text-[clamp(2rem,5vw,4.25rem)] leading-[1.1] tracking-tight"
              >
                {phase.head}
              </h2>
              {phase.sub ? (
                <p
                  data-mf-sub={index}
                  data-sq-reveal
                  className="mx-auto mt-6 max-w-xl text-[clamp(1.05rem,1.5vw,1.3rem)] leading-relaxed"
                  style={{ color: 'var(--sq-inverse-soft)' }}
                >
                  {phase.sub}
                </p>
              ) : null}
            </div>
          ))}
          {/* Spacer that gives the stacked phases their height */}
          <div className="invisible" aria-hidden="true">
            <p className="sq-display text-[clamp(2rem,5vw,4.25rem)] leading-[1.1]">
              Elke nieuwe chat begint bij nul.
            </p>
            <p className="mt-6 text-[clamp(1.05rem,1.5vw,1.3rem)]">&nbsp;</p>
          </div>
        </div>

            <div data-mf-cta data-sq-reveal className="mt-4 flex flex-col items-center gap-5">
              <Link href="/auth" className="sq-btn sq-btn-accent !px-10 !py-[1.25rem] !text-base">
                Start gratis met onthouden
              </Link>
              <p className="sq-faint" style={{ color: 'var(--sq-inverse-soft)' }}>
                Gratis plan · Geen creditcard · Direct in Claude Code en Cursor
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

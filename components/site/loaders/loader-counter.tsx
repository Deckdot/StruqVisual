'use client';

// components/site/loaders/loader-counter.tsx
//
// First-load intro loader — the "cover" phase with no swap: it starts closed
// over the already-rendered (SSR) home page and clears once real assets are in.
//
// Mechanic (deck-design "Counter" preset):
//   1. Warm cream layer covers the screen; `struq` wordmark reveals via
//      SplitText mask (chars rise from a clipped baseline).
//   2. A big count 0→100 ties to real asset load (fonts + images) with a
//      minimum on-screen time so it never just flashes.
//   3. The whole layer slides up (yPercent:-100, power4.inOut) to reveal the
//      finished, already-painted home hero underneath — no FOUC, no spinner.
//
// SSR-safe: sits on top of rendered HTML and reveals it. Session-gated by `id`
// so it plays once per session and never stacks on the route curtain.

import { useRef, useState } from 'react';
import { gsap, useGSAP, SplitText, prefersReducedMotion } from '@/components/site/motion';
import { loaderSeen, markLoaderSeen } from './use-first-visit';

// Concrete marketing-light tokens — the overlay lives at the root, outside the
// `.sq` scope, so scoped CSS vars aren't available here.
const PAPER = '#fbf8f2';
const INK = '#221d15';
const INK_FAINT = '#8b8371';
const ACCENT = '#e4572e';

export function LoaderCounter({
  id = 'intro',
  minDuration = 1.6,
}: {
  id?: string;
  minDuration?: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);
  // Start hidden on the server so a session revisit never flashes the loader.
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      // Revisit this session → hide before paint, never run.
      if (loaderSeen(id)) {
        setDone(true);
        return;
      }
      markLoaderSeen(id);

      const layer = root.current;
      if (!layer) return;

      const reduce = prefersReducedMotion();
      const start = performance.now();

      // Lock scroll while the loader is up so the page can't move underneath it.
      const prevOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      const unlock = () => {
        document.documentElement.style.overflow = prevOverflow;
      };

      // --- Real-ish progress: fonts + above-the-fold images ---
      const fontsReady =
        (document as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve();
      const imagesReady = Array.from(document.images).map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((res) => {
              img.addEventListener('load', () => res(), { once: true });
              img.addEventListener('error', () => res(), { once: true });
            })
      );
      const assetsReady = Promise.all([fontsReady, ...imagesReady]);

      // --- Wordmark reveal (SplitText mask: chars rise from clipped baseline) ---
      const word = layer.querySelector('[data-loader-word]') as HTMLElement | null;
      let split: SplitText | null = null;
      const tl = gsap.timeline();

      if (word && !reduce) {
        split = SplitText.create(word, { type: 'chars', mask: 'chars' });
        gsap.set(split.chars, { yPercent: 120 });
        tl.to(split.chars, {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.05,
          ease: 'power4.out',
        });
        // Accent dot pops after the word settles.
        tl.from(
          '[data-loader-dot]',
          { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2)' },
          '-=0.3'
        );
      }

      // --- Counter tied to a tween, gated on real assets ---
      const counter = { v: 0 };
      const countTween = gsap.to(counter, {
        v: 100,
        duration: reduce ? 0.3 : minDuration,
        ease: 'power1.inOut',
        onUpdate: () => setPct(Math.round(counter.v)),
      });

      Promise.all([assetsReady, countTween]).then(() => {
        const elapsed = (performance.now() - start) / 1000;
        const wait = Math.max(0, minDuration - elapsed);
        gsap.delayedCall(reduce ? 0 : wait, () => {
          setPct(100);
          if (reduce) {
            gsap.to(layer, {
              autoAlpha: 0,
              duration: 0.3,
              onComplete: () => {
                unlock();
                setDone(true);
              },
            });
            return;
          }
          // Reveal: the whole layer slides up out of frame, uncovering the hero.
          gsap.to(layer, {
            yPercent: -100,
            duration: 0.9,
            ease: 'power4.inOut',
            onComplete: () => {
              unlock();
              setDone(true);
            },
          });
        });
      });

      return () => {
        countTween.kill();
        tl.kill();
        split?.revert();
        unlock();
      };
    },
    { scope: root }
  );

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[10001] flex flex-col items-center justify-center"
      style={{ background: PAPER, color: INK }}
      aria-hidden="true"
    >
      {/* Brand wordmark — the hero of the loader */}
      <div className="flex items-end leading-none">
        <span
          data-loader-word
          className="sq-display text-[clamp(3rem,12vw,9rem)] font-semibold tracking-tight"
          style={{ color: INK }}
        >
          struq
        </span>
        <span
          data-loader-dot
          className="mb-[0.18em] ml-[0.06em] inline-block text-[clamp(3rem,12vw,9rem)] font-semibold leading-none sq-display"
          style={{ color: ACCENT }}
        >
          .
        </span>
      </div>

      {/* Count-up — bottom-right, tied to real asset load */}
      <div
        className="pointer-events-none absolute bottom-[var(--sq-section-px,2rem)] right-[var(--sq-section-px,2rem)] flex items-baseline gap-1 tabular-nums"
        style={{ color: INK_FAINT }}
      >
        <span className="sq-display text-[clamp(1.5rem,4vw,2.5rem)] font-medium" style={{ color: INK }}>
          {pct}
        </span>
        <span className="text-sm font-medium">%</span>
      </div>
    </div>
  );
}

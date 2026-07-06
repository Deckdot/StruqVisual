'use client';

/**
 * Live artifact: the finished prompt asset as a physical object.
 * Used by Het Lab as opening reveal and finale showpiece: the learner sees
 * the exact asset they will own, typed out line by line.
 */

import { useRef } from 'react';
import { gsap, useGSAP, EASE_OUT } from '@/components/site/motion';
import type { ArtifactProps } from '@/lib/learn/artifacts/types';

const PROMPT_LINES = [
  { label: 'Rol', text: 'Je bent een senior brand-designer met sterke eigen smaak.' },
  { label: 'Context', text: 'Warm, hand-gemaakt gevoel. Publiek: makers, geen managers.' },
  { label: 'Opdracht', text: 'Schrijf 3 hero-koppen die nieuwsgierig maken, max 8 woorden.' },
  { label: 'Grenzen', text: 'Geen jargon, geen uitroeptekens, geen beloftes met cijfers.' },
  { label: 'Vorm', text: 'Toon per kop ook waarom die werkt, in één zin.' },
];

export function LabPromptCardArtifact({ replayKey = 0, compact }: ArtifactProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-art-line]',
          { autoAlpha: 0, x: -18 },
          { autoAlpha: 1, x: 0, duration: 0.7, ease: EASE_OUT, stagger: 0.12, delay: 0.15 }
        );
        gsap.fromTo(
          '[data-art-stamp]',
          { autoAlpha: 0, scale: 1.4, rotate: -14 },
          { autoAlpha: 1, scale: 1, rotate: -8, duration: 0.5, ease: 'back.out(2)', delay: 0.95 }
        );
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(['[data-art-line]', '[data-art-stamp]'], { autoAlpha: 1 });
      });

      // Tear down the global matchMedia conditions on unmount so a later
      // ScrollTrigger.refresh() (curtain nav) can't re-run them against a stale DOM.
      return () => mm.revert();
    },
    { scope: root, dependencies: [replayKey] }
  );

  return (
    <div
      ref={root}
      className="sq-panel-inverse relative overflow-hidden"
      style={{
        padding: compact ? 'clamp(1.25rem, 3vw, 1.75rem)' : 'clamp(1.5rem, 4vw, 2.5rem)',
        boxShadow: 'var(--sq-shadow-float)',
      }}
    >
      <p className="sq-eyebrow" style={{ color: 'var(--sq-accent)' }}>
        Prompt-asset · Herbruikbaar
      </p>

      <div className="mt-5 space-y-3.5">
        {PROMPT_LINES.slice(0, compact ? 3 : PROMPT_LINES.length).map((line) => (
          <div key={line.label} data-art-line className="flex gap-3">
            <span
              className="mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider"
              style={{
                background: 'color-mix(in srgb, var(--sq-accent) 22%, transparent)',
                color: 'var(--sq-accent)',
              }}
            >
              {line.label}
            </span>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--sq-inverse-soft)' }}>
              {line.text}
            </p>
          </div>
        ))}
      </div>

      <span
        data-art-stamp
        aria-hidden="true"
        className="absolute rounded-full border-2 px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
        style={{
          right: '1.25rem',
          bottom: '1.1rem',
          borderColor: 'var(--sq-accent)',
          color: 'var(--sq-accent)',
          transform: 'rotate(-8deg)',
        }}
      >
        Van jou
      </span>
    </div>
  );
}

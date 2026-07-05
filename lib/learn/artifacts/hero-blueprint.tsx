'use client';

/**
 * Live artifact: a miniature hero section in the Struq design language.
 * Every lesson control manipulates THIS component, so the learner sees a
 * real hero respond, not a screenshot.
 *
 * Layers:  layout · typografie · kleur  (motion is driven via replay)
 * Tokens:  --art-accent · --art-radius · --art-space
 */

import { useRef } from 'react';
import { gsap, useGSAP, EASE_OUT } from '@/components/site/motion';
import type { ArtifactProps } from '@/lib/learn/artifacts/types';

export function HeroBlueprintArtifact({
  tokens,
  motion,
  layers,
  replayKey = 0,
  compact,
}: ArtifactProps) {
  const root = useRef<HTMLDivElement>(null);

  const layoutOn = layers?.layout !== false;
  const typeOn = layers?.typografie !== false;
  const colorOn = layers?.kleur !== false;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          defaults: { ease: motion?.ease ?? EASE_OUT },
        });

        tl.fromTo(
          '[data-art-fade]',
          { autoAlpha: 0, y: motion?.distance ?? 26 },
          {
            autoAlpha: 1,
            y: 0,
            duration: motion?.duration ?? 0.8,
            stagger: motion?.stagger ?? 0.1,
          },
          0.1
        );

        tl.fromTo(
          '[data-art-squiggle] path',
          { drawSVG: '0% 0%' },
          { drawSVG: '0% 100%', duration: 0.7, ease: 'power2.inOut' },
          '-=0.35'
        );

        tl.fromTo(
          '[data-art-card]',
          { autoAlpha: 0, y: (motion?.distance ?? 26) * 1.4, rotate: 5 },
          {
            autoAlpha: 1,
            y: 0,
            rotate: 2.5,
            duration: (motion?.duration ?? 0.8) * 1.2,
          },
          0.3
        );
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(['[data-art-fade]', '[data-art-card]'], { autoAlpha: 1 });
        gsap.set('[data-art-squiggle] path', { drawSVG: '0% 100%' });
      });
    },
    // Re-run the entrance whenever the replay key or motion params change.
    { scope: root, dependencies: [replayKey, motion?.duration, motion?.stagger, motion?.distance, motion?.ease] }
  );

  const accent = colorOn ? 'var(--art-accent, var(--sq-accent))' : 'var(--sq-ink-faint)';
  const space = layoutOn ? 'calc(1rem * var(--art-space, 1))' : '0.35rem';

  return (
    <div
      ref={root}
      className="sq-panel relative overflow-hidden"
      style={{
        ...tokens,
        padding: compact ? 'clamp(1.25rem, 3vw, 1.75rem)' : 'clamp(1.5rem, 4vw, 2.75rem)',
        borderRadius: 'var(--art-radius, 1.5rem)',
        filter: colorOn ? undefined : 'grayscale(1)',
        transition: 'filter 0.5s ease',
      }}
    >
      <div style={{ maxWidth: layoutOn ? '75%' : '100%' }}>
        <p
          data-art-fade
          className={typeOn ? 'sq-eyebrow' : 'text-xs'}
          style={{ color: accent, marginBottom: space }}
        >
          De visuele bibliotheek
        </p>

        <p
          data-art-fade
          className={typeOn ? 'sq-display' : ''}
          style={{
            fontSize: typeOn ? (compact ? 'clamp(1.35rem, 2.6vw, 1.9rem)' : 'clamp(1.6rem, 3.2vw, 2.5rem)') : '1rem',
            lineHeight: typeOn ? 1.1 : 1.5,
            letterSpacing: typeOn ? '-0.02em' : '0',
          }}
        >
          Bouw iets dat niemand van je verwacht.
        </p>

        <svg
          data-art-squiggle
          aria-hidden="true"
          viewBox="0 0 220 18"
          fill="none"
          style={{ width: compact ? '7rem' : '9rem', height: '0.9rem', marginTop: space }}
        >
          <path
            d="M4 12 C 30 3, 52 16, 80 9 S 128 3, 156 11 S 196 14, 216 6"
            stroke={accent}
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        <p
          data-art-fade
          className="sq-muted"
          style={{
            marginTop: space,
            fontSize: typeOn ? '0.9375rem' : '1rem',
            maxWidth: layoutOn ? '24rem' : 'none',
          }}
        >
          Kant-en-klare recepten waarmee jouw AI opeens vormgeeft als een studio.
        </p>

        <div data-art-fade className="flex items-center gap-3" style={{ marginTop: `calc(${space} * 1.4)` }}>
          <span
            className="inline-flex items-center px-5 py-2.5 text-sm font-semibold"
            style={{
              background: accent,
              color: 'var(--sq-paper)',
              borderRadius: 'calc(var(--art-radius, 1.5rem) * 2)',
              fontFamily: typeOn ? 'var(--font-comfortaa), Comfortaa, sans-serif' : 'inherit',
            }}
          >
            Start gratis
          </span>
          <span className="sq-faint">Geen creditcard</span>
        </div>
      </div>

      {/* Floating mini card, hidden when the layout layer is stripped. */}
      {layoutOn && !compact && (
        <div
          data-art-card
          className="sq-panel-inverse absolute p-4"
          style={{
            right: 'clamp(0.75rem, 3vw, 2rem)',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 'clamp(7rem, 22%, 10rem)',
            borderRadius: 'calc(var(--art-radius, 1.5rem) * 0.75)',
            boxShadow: 'var(--sq-shadow-float)',
          }}
        >
          <p className="text-[0.6rem] font-bold uppercase tracking-widest" style={{ color: accent }}>
            Asset
          </p>
          <div className="mt-2 space-y-1.5">
            <span className="block h-1.5 w-full rounded-full" style={{ background: 'color-mix(in srgb, var(--sq-inverse-ink) 30%, transparent)' }} />
            <span className="block h-1.5 w-3/4 rounded-full" style={{ background: 'color-mix(in srgb, var(--sq-inverse-ink) 30%, transparent)' }} />
            <span className="block h-1.5 w-1/2 rounded-full" style={{ background: accent }} />
          </div>
        </div>
      )}
    </div>
  );
}

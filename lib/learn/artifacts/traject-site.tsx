'use client';

/**
 * Live artifact: a miniature browser window with a finished, deployed site.
 * Het Traject opens with this: the end state exists before the first step,
 * so the whole traject is walking toward something you have already seen.
 */

import { useRef } from 'react';
import { gsap, useGSAP, EASE_OUT } from '@/components/site/motion';
import type { ArtifactProps } from '@/lib/learn/artifacts/types';

export function TrajectSiteArtifact({ replayKey = 0, compact }: ArtifactProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
        tl.fromTo(
          '[data-art-window]',
          { autoAlpha: 0, y: 34, rotate: -1.5 },
          { autoAlpha: 1, y: 0, rotate: 0, duration: 0.9 }
        );
        tl.fromTo(
          '[data-art-el]',
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.09 },
          '-=0.4'
        );
        tl.fromTo(
          '[data-art-live]',
          { scale: 0 },
          { scale: 1, duration: 0.4, ease: 'back.out(2.5)' },
          '-=0.2'
        );
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(['[data-art-window]', '[data-art-el]', '[data-art-live]'], {
          autoAlpha: 1,
          scale: 1,
        });
      });
    },
    { scope: root, dependencies: [replayKey] }
  );

  return (
    <div ref={root}>
      <div
        data-art-window
        className="sq-panel overflow-hidden"
        style={{ boxShadow: 'var(--sq-shadow-float)' }}
      >
        {/* Browser chrome */}
        <div
          className="flex items-center gap-2 border-b px-4 py-2.5"
          style={{ borderColor: 'var(--sq-line)', background: 'var(--sq-sunken)' }}
        >
          <span className="flex gap-1.5" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: 'var(--sq-line-strong)' }}
              />
            ))}
          </span>
          <span
            className="ml-2 flex-1 truncate rounded-full px-3 py-1 text-xs font-medium"
            style={{ background: 'var(--sq-raised)', color: 'var(--sq-ink-faint)' }}
          >
            jouw-idee.vercel.app
          </span>
          <span
            data-art-live
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider"
            style={{ background: 'var(--sq-accent-wash)', color: 'var(--sq-accent-ink)' }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--sq-accent)' }} />
            Live
          </span>
        </div>

        {/* Finished mini landing page */}
        <div style={{ padding: compact ? '1.25rem' : 'clamp(1.5rem, 4vw, 2.25rem)' }}>
          <p data-art-el className="sq-eyebrow">Jouw project</p>
          <p
            data-art-el
            className="sq-display mt-2"
            style={{ fontSize: compact ? '1.3rem' : 'clamp(1.4rem, 2.8vw, 2rem)', lineHeight: 1.15 }}
          >
            Dit stond gister nog niet online.
          </p>
          <p data-art-el className="sq-muted mt-2 max-w-sm text-sm">
            Vandaag wel. Gebouwd met een AI-agent, goede context en jouw smaak.
          </p>
          <div data-art-el className="mt-4 flex items-center gap-3">
            <span
              className="rounded-full px-4 py-2 text-xs font-bold"
              style={{ background: 'var(--sq-ink)', color: 'var(--sq-paper)' }}
            >
              Bekijk het
            </span>
            <span className="sq-faint text-xs">Van lege map tot hier: 1 traject</span>
          </div>

          {!compact && (
            <div className="mt-5 grid grid-cols-3 gap-2.5">
              {['Context', 'Regels', 'Deploy'].map((label) => (
                <div
                  key={label}
                  data-art-el
                  className="sq-panel-sunken px-3 py-2.5"
                  style={{ borderRadius: '0.75rem' }}
                >
                  <span className="block h-1 w-6 rounded-full" style={{ background: 'var(--sq-accent)' }} />
                  <span className="mt-1.5 block text-[0.7rem] font-semibold">{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

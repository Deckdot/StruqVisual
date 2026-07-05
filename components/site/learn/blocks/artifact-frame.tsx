'use client';

/**
 * Shared stage for live artifacts: a sunken workbench surface so the artifact
 * reads as the object being worked on, plus an optional replay control.
 */

import type { ReactNode } from 'react';

export function ArtifactFrame({
  children,
  caption,
  onReplay,
}: {
  children: ReactNode;
  caption?: string;
  onReplay?: () => void;
}) {
  return (
    <figure className="m-0">
      <div
        className="sq-panel-sunken relative"
        style={{ padding: 'clamp(1rem, 3vw, 2rem)' }}
      >
        {children}
        {onReplay && (
          <button
            type="button"
            onClick={onReplay}
            className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-transform hover:scale-105 active:scale-95"
            style={{
              background: 'var(--sq-raised)',
              borderColor: 'var(--sq-line-strong)',
              color: 'var(--sq-ink-soft)',
            }}
          >
            <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" aria-hidden="true">
              <path
                d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 1.5v3h-3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Opnieuw
          </button>
        )}
      </div>
      {caption && (
        <figcaption className="sq-faint mt-3 text-center">{caption}</figcaption>
      )}
    </figure>
  );
}

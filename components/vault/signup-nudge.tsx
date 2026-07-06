'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { TransitionLink } from '@/components/providers/PageTransition';

/**
 * Contextual signup nudge (psychology: loss aversion, honest, dismissible).
 * Anonymous-only, appears after the first save, escalates once at the
 * existing Level 2 threshold (>=3 saves). Dismissal is per-level and sticky:
 * once a level is dismissed it never reappears (no regression, no nagging).
 */

const STORAGE_KEY = 'struq_signup_nudge_dismissed_v1';

type DismissLevel = 1 | 2;

function readDismissed(): DismissLevel | 0 {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? Number(raw) : 0;
    return parsed === 1 || parsed === 2 ? parsed : 0;
  } catch {
    return 0;
  }
}

export function SignupNudge({ saveCount }: { saveCount: number }) {
  const [dismissed, setDismissed] = useState<DismissLevel | 0>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDismissed(readDismissed());
    setMounted(true);
  }, []);

  if (!mounted || saveCount < 1) return null;

  const level: DismissLevel = saveCount >= 3 ? 2 : 1;
  if (dismissed >= level) return null;

  const dismiss = () => {
    setDismissed(level);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(level));
    } catch {
      // non-fatal
    }
  };

  return (
    <div
      data-sq-reveal
      className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-200 sm:items-center"
    >
      <p className="text-sm leading-relaxed text-secondary-text/90">
        {level === 2 ? (
          <>
            Je hebt al {saveCount} assets bewaard. Ze staan alleen in deze browser.{' '}
            <span className="font-medium text-primary-text">
              Maak een gratis account en je vault gaat overal mee.
            </span>
          </>
        ) : (
          <>
            Je vault leeft nu alleen in deze browser. Een gratis account bewaart hem overal.
          </>
        )}
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <TransitionLink
          href="/auth?next=/vault"
          className="inline-flex h-9 items-center whitespace-nowrap rounded-lg border border-border px-4 text-[13px] font-medium text-secondary-text transition-all duration-200 hover:border-primary-text hover:bg-primary-text hover:text-background"
        >
          Gratis account maken
        </TransitionLink>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Melding sluiten"
          className="rounded-lg p-2 text-meta-text transition-colors duration-150 hover:bg-panel-hover hover:text-primary-text"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

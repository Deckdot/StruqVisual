'use client';

// components/dashboard/recept/preview/preview-toolbar.tsx
//
// The slim action row above the preview panel. All existing button idioms
// (border-border, bg-card, hover:brightness-110, no glow). Copy/Bewaar feed the
// maturity disclosure system (recordCopy/recordSave) — the bouwer is a first-class
// source of the milestones that unlock later surfaces.

import { useState } from 'react';
import { Monitor, Smartphone, Dices, Check, Copy, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Viewport = 'desktop' | 'mobile';

type PreviewToolbarProps = {
  viewport: Viewport;
  onViewport: (v: Viewport) => void;
  onShuffle: () => void;
  onCopy: () => Promise<boolean>;
  onSave: () => void;
  /** Mobile hides the viewport toggle (you already see the mobile rendering). */
  showViewportToggle?: boolean;
  compact?: boolean;
};

export function PreviewToolbar({
  viewport,
  onViewport,
  onShuffle,
  onCopy,
  onSave,
  showViewportToggle = true,
  compact = false,
}: PreviewToolbarProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopy = async () => {
    const ok = await onCopy();
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1100);
  };

  const handleSave = () => {
    onSave();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1100);
  };

  const iconBtn =
    'flex h-9 items-center justify-center rounded-lg border border-border bg-card text-secondary-text transition hover:brightness-110 hover:text-primary-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent';

  return (
    <div className="flex items-center justify-between gap-3">
      {showViewportToggle ? (
        <div className="flex items-center gap-1 rounded-lg border border-border bg-panel/70 p-1">
          {([
            { id: 'desktop' as const, label: 'Desktop', Icon: Monitor },
            { id: 'mobile' as const, label: 'Mobiel', Icon: Smartphone },
          ]).map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onViewport(id)}
              aria-pressed={viewport === id}
              title={label}
              className={cn(
                'flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[0.75rem] font-medium transition',
                viewport === id ? 'bg-card text-primary-text shadow-sm' : 'text-meta-text hover:text-primary-text',
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      ) : (
        <span aria-hidden="true" />
      )}

      <div className="flex items-center gap-2">
        <button type="button" onClick={onShuffle} title="Verras me" aria-label="Verras me" className={cn(iconBtn, 'w-9')}>
          <Dices className="h-4 w-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={handleCopy}
          title="Kopieer prompt"
          aria-label="Kopieer prompt"
          className={cn(iconBtn, compact ? 'w-9' : 'gap-2 px-3.5 text-[0.8rem] font-medium')}
        >
          {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          {!compact && <span>{copied ? 'Gekopieerd' : 'Kopieer prompt'}</span>}
        </button>

        <button
          type="button"
          onClick={handleSave}
          title="Bewaar recept"
          aria-label="Bewaar recept"
          className={cn(
            'flex h-9 items-center justify-center gap-2 rounded-lg border border-border px-3.5 text-[0.8rem] font-medium transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
            'bg-accent text-white',
            compact && 'w-9 px-0',
          )}
        >
          {saved ? <Check className="h-4 w-4" aria-hidden="true" /> : <Bookmark className="h-4 w-4" aria-hidden="true" />}
          {!compact && <span>{saved ? 'Bewaard' : 'Bewaar'}</span>}
        </button>
      </div>
    </div>
  );
}

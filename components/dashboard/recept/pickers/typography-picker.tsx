'use client';

// components/dashboard/recept/pickers/typography-picker.tsx
// 6 pairing rows: an "Aa" specimen rendered in the real display font (all faces are
// loaded route-wide) + name + mood.

import { Check } from 'lucide-react';
import { CANON_TYPOGRAPHY } from '@/lib/canon/typography';
import { fontStacksFor } from '@/lib/recept/font-stacks';
import { cn } from '@/lib/utils';

export function TypographyPicker({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  return (
    <ul className="flex flex-col gap-1" role="listbox" aria-label="Typografie">
      {CANON_TYPOGRAPHY.map((pairing) => {
        const active = pairing.id === selectedId;
        const stacks = fontStacksFor(pairing.id);
        return (
          <li key={pairing.id}>
            <button
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => onSelect(pairing.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition',
                active ? 'border-accent ring-1 ring-accent bg-panel' : 'border-transparent hover:bg-panel-hover',
              )}
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-[1.35rem] leading-none text-primary-text"
                style={{ fontFamily: stacks.display }}
              >
                Aa
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-primary-text">{pairing.name}</span>
                {pairing.mood && <span className="block truncate text-[0.75rem] capitalize text-meta-text">{pairing.mood}</span>}
              </span>
              {active && <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

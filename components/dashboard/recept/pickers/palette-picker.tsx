'use client';

// components/dashboard/recept/pickers/palette-picker.tsx
// 29 palette rows: a 5-dot swatch strip + mood label. Rows, not cards — the rail is
// narrow and the canon-card grids stay in Canon. Scanning swatches is perception,
// not deliberation, so no search/groups in v1. Raw palette values render via inline
// style (palette-renderer exception).

import { Check } from 'lucide-react';
import { CANON_PALETTES } from '@/lib/canon/palettes';
import { cn } from '@/lib/utils';

export function PalettePicker({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  return (
    <ul className="flex flex-col gap-1" role="listbox" aria-label="Kleurpalet">
      {CANON_PALETTES.map((palette) => {
        const active = palette.id === selectedId;
        return (
          <li key={palette.id}>
            <button
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => onSelect(palette.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition',
                active ? 'border-accent ring-1 ring-accent bg-panel' : 'border-transparent hover:bg-panel-hover',
              )}
            >
              <span className="flex shrink-0 items-center">
                {Object.values(palette.colors).map((color, i) => (
                  <span
                    key={i}
                    className="h-5 w-5 rounded-full border border-border/60"
                    style={{ backgroundColor: color, marginLeft: i === 0 ? 0 : '-0.4rem' }}
                  />
                ))}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium capitalize text-primary-text">
                  {palette.id.replace(/-/g, ' ')}
                </span>
                <span className="block truncate text-[0.75rem] capitalize text-meta-text">{palette.mood}</span>
              </span>
              {active && <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

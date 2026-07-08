'use client';

// components/dashboard/recept/pickers/iconset-picker.tsx
// 6 canon icon-set rows + any imported candidates (IKEA effect: a user's own
// imports feel like theirs). Each row shows 3 real sample glyphs + the set name.

import { Check } from 'lucide-react';
import { Icon } from '@iconify/react';
import { CANON_ICON_SETS } from '@/lib/canon/icons';
import { useIconCandidates } from '@/lib/canon/use-icon-candidates';
import type { IconSemanticId } from '@/lib/canon/types';
import { cn } from '@/lib/utils';

const SAMPLE: IconSemanticId[] = ['compass', 'shield', 'activity'];

export function IconsetPicker({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  const { candidates } = useIconCandidates();
  const sets = [...CANON_ICON_SETS, ...candidates];

  return (
    <ul className="flex flex-col gap-1" role="listbox" aria-label="Iconenset">
      {sets.map((set) => {
        const active = set.id === selectedId;
        return (
          <li key={set.id}>
            <button
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => onSelect(set.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition',
                active ? 'border-accent ring-1 ring-accent bg-panel' : 'border-transparent hover:bg-panel-hover',
              )}
            >
              <span className="flex shrink-0 items-center gap-1.5 text-secondary-text">
                {SAMPLE.map((semantic) => (
                  <Icon
                    key={semantic}
                    icon={`${set.iconifyPrefix}:${set.semanticMap[semantic]}`}
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                ))}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-primary-text">{set.name}</span>
                <span className="block truncate text-[0.75rem] text-meta-text">
                  {set.source === 'candidate' ? 'Jouw import' : set.provider}
                </span>
              </span>
              {active && <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

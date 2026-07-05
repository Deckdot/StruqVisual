'use client';

import { ASSET_TYPES, TYPE_META, type AssetType } from '@/lib/vault/types';
import { cn } from '@/lib/utils';

export type TypeFilterValue = AssetType | 'all' | 'saved';

/**
 * Visual group chips — the primary (and for new users, only) way to slice
 * the library. "Bewaard" appears once the user has earned the saved view.
 */
export function TypeFilter({
  value,
  onChange,
  showSaved,
  savedCount,
}: {
  value: TypeFilterValue;
  onChange: (value: TypeFilterValue) => void;
  showSaved: boolean;
  savedCount: number;
}) {
  const options: Array<{ key: TypeFilterValue; label: string }> = [
    { key: 'all', label: 'Alles' },
    ...ASSET_TYPES.map((type) => ({ key: type as TypeFilterValue, label: TYPE_META[type].labelPlural })),
    ...(showSaved ? [{ key: 'saved' as TypeFilterValue, label: `Bewaard · ${savedCount}` }] : []),
  ];

  return (
    <div role="tablist" aria-label="Filter op soort asset" className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {options.map((option) => {
        const active = value === option.key;
        return (
          <button
            key={option.key}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(option.key)}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
              active
                ? 'bg-primary-text text-background'
                : 'border border-border bg-card text-secondary-text hover:bg-panel-hover'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

'use client';

// components/dashboard/recept/control-rail.tsx
//
// The desktop control rail: a quiet floating panel left of the preview. Recipe name
// (quiet text → inline input), a strict accordion of three IngredientSections (Kleur
// / Typografie / Iconen — exactly one open, or all collapsed; default all collapsed),
// and "Mijn recepten" (rendered only when ≥1 saved recipe exists — disclosure by
// usage, no empty shelf).
//
// The rail must never compete with the preview (Von Restorff): no fills, no accent
// surfaces at rest.

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { ResolvedRecept, SavedRecept } from '@/lib/recept/types';
import type { IconSet } from '@/lib/canon/types';
import { CANON_PALETTES } from '@/lib/canon/palettes';
import { IngredientSection } from './ingredient-section';
import { PaletteChip, TypographyChip, IconSetChip } from './summary-chips';
import { PalettePicker } from './pickers/palette-picker';
import { TypographyPicker } from './pickers/typography-picker';
import { IconsetPicker } from './pickers/iconset-picker';

type Section = 'kleur' | 'typografie' | 'iconen' | null;

type ControlRailProps = {
  resolved: ResolvedRecept;
  name: string;
  saved: SavedRecept[];
  candidates: readonly IconSet[];
  onSetName: (name: string) => void;
  onSelectPalette: (id: string) => void;
  onSelectTypography: (id: string) => void;
  onSelectIconSet: (id: string) => void;
  onLoadSaved: (id: string) => void;
  onDeleteSaved: (id: string) => void;
};

export function ControlRail({
  resolved,
  name,
  saved,
  onSetName,
  onSelectPalette,
  onSelectTypography,
  onSelectIconSet,
  onLoadSaved,
  onDeleteSaved,
}: ControlRailProps) {
  const [open, setOpen] = useState<Section>(null);
  const [editingName, setEditingName] = useState(false);

  const toggle = (section: Exclude<Section, null>) => setOpen((cur) => (cur === section ? null : section));

  const displayName = name.trim() || 'Naamloos recept';

  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-background p-4 shadow-sm">
      {/* Recipe name — quiet text that becomes an inline input on click. Never required. */}
      <div className="px-1">
        {editingName ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => onSetName(e.target.value)}
            onBlur={() => setEditingName(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Escape') setEditingName(false);
            }}
            placeholder="Geef je recept een naam"
            aria-label="Receptnaam"
            className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm text-primary-text outline-none focus-visible:ring-1 focus-visible:ring-accent"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditingName(true)}
            className="w-full truncate text-left text-sm font-medium text-primary-text transition hover:text-accent"
            title="Naam wijzigen"
          >
            {displayName}
          </button>
        )}
      </div>

      {/* Three ingredients — strict accordion */}
      <div className="flex flex-col gap-2.5">
        <IngredientSection
          label="Kleur"
          chip={<PaletteChip palette={resolved.palette} />}
          summary={resolved.palette.mood}
          open={open === 'kleur'}
          onToggle={() => toggle('kleur')}
        >
          <PalettePicker selectedId={resolved.palette.id} onSelect={onSelectPalette} />
        </IngredientSection>

        <IngredientSection
          label="Typografie"
          chip={<TypographyChip pairing={resolved.pairing} />}
          summary={resolved.pairing.name}
          open={open === 'typografie'}
          onToggle={() => toggle('typografie')}
        >
          <TypographyPicker selectedId={resolved.pairing.id} onSelect={onSelectTypography} />
        </IngredientSection>

        <IngredientSection
          label="Iconen"
          chip={<IconSetChip iconSet={resolved.iconSet} />}
          summary={resolved.iconSet.name}
          open={open === 'iconen'}
          onToggle={() => toggle('iconen')}
        >
          <IconsetPicker selectedId={resolved.iconSet.id} onSelect={onSelectIconSet} />
        </IngredientSection>
      </div>

      {/* Mijn recepten — only when ≥1 exists */}
      {saved.length > 0 && (
        <div className="mt-1 flex min-h-0 flex-1 flex-col gap-2">
          <span className="px-1 text-[0.7rem] font-medium uppercase tracking-widest text-meta-text">Mijn recepten</span>
          <ul className="flex flex-col gap-1 overflow-y-auto">
            {saved.map((entry) => {
              const palette = CANON_PALETTES.find((p) => p.id === entry.paletteId);
              return (
                <li key={entry.id} className="group flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-panel-hover">
                  <button
                    type="button"
                    onClick={() => onLoadSaved(entry.id)}
                    className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                    title="Laad dit recept"
                  >
                    {palette && (
                      <span className="flex shrink-0 items-center">
                        {Object.values(palette.colors).map((color, i) => (
                          <span
                            key={i}
                            className="h-3.5 w-3.5 rounded-full border border-border/60"
                            style={{ backgroundColor: color, marginLeft: i === 0 ? 0 : '-0.3rem' }}
                          />
                        ))}
                      </span>
                    )}
                    <span className="min-w-0 truncate text-[0.8rem] text-primary-text">{entry.name}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteSaved(entry.id)}
                    aria-label={`Verwijder ${entry.name}`}
                    title="Verwijderen"
                    className="shrink-0 text-meta-text opacity-0 transition hover:text-primary-text group-hover:opacity-100 focus-visible:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

'use client';

// components/dashboard/recept/mobile/recept-mobile.tsx
//
// Mobile composition — the preview IS the screen, controls are a thumb deck. Inverts
// the desktop hierarchy rather than squeezing it. No viewport toggle (you're already
// looking at the mobile rendering). Chip bar sits directly above the dashboard
// BottomNav (the shell reserves pb-16); tapping a chip opens the bottom sheet with
// the same recognition language as the desktop rail.

import { useState } from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import type { ResolvedRecept } from '@/lib/recept/types';
import type { IconSet } from '@/lib/canon/types';
import type { ReceptDraftApi } from '@/lib/recept/use-recept-draft';
import { CANON_PALETTES } from '@/lib/canon/palettes';
import { PreviewToolbar } from '../preview/preview-toolbar';
import { ReceptPreview } from '../preview/recept-preview';
import { PaletteChip, TypographyChip, IconSetChip } from '../summary-chips';
import { PickerSheet } from './picker-sheet';
import { PalettePicker } from '../pickers/palette-picker';
import { TypographyPicker } from '../pickers/typography-picker';
import { IconsetPicker } from '../pickers/iconset-picker';

type Sheet = 'kleur' | 'typografie' | 'iconen' | 'recepten' | null;

type ReceptMobileProps = {
  api: ReceptDraftApi;
  candidates: readonly IconSet[];
  resolved: ResolvedRecept;
  onShuffle: () => void;
  onCopy: () => Promise<boolean>;
  onSave: () => void;
};

export function ReceptMobile({ api, resolved, onShuffle, onCopy, onSave }: ReceptMobileProps) {
  const [sheet, setSheet] = useState<Sheet>(null);
  const close = () => setSheet(null);

  const chipBtn =
    'flex min-h-[44px] flex-1 flex-col items-center justify-center gap-1 rounded-lg border border-border bg-background px-1 py-1.5 transition hover:bg-panel-hover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent';

  return (
    <div className="flex h-full flex-col">
      {/* Compact toolbar */}
      <div className="shrink-0 px-3 py-2">
        <PreviewToolbar
          viewport="mobile"
          onViewport={() => {}}
          onShuffle={onShuffle}
          onCopy={onCopy}
          onSave={onSave}
          showViewportToggle={false}
          compact
        />
      </div>

      {/* Preview fills the space above the chip bar */}
      <div className="min-h-0 flex-1 overflow-hidden px-3">
        <div className="h-full overflow-y-auto rounded-xl border border-border shadow-md">
          <ReceptPreview resolved={resolved} />
        </div>
      </div>

      {/* Chip bar — directly above the dashboard BottomNav (shell reserves pb-16) */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-canvas/95 px-3 py-2 backdrop-blur-sm">
        <div className="mx-auto flex max-w-md items-stretch gap-2">
          <button type="button" onClick={() => setSheet('kleur')} className={chipBtn} aria-label="Kies kleur">
            <PaletteChip palette={resolved.palette} />
            <span className="text-[0.65rem] font-medium text-meta-text">Kleur</span>
          </button>
          <button type="button" onClick={() => setSheet('typografie')} className={chipBtn} aria-label="Kies typografie">
            <TypographyChip pairing={resolved.pairing} />
            <span className="text-[0.65rem] font-medium text-meta-text">Type</span>
          </button>
          <button type="button" onClick={() => setSheet('iconen')} className={chipBtn} aria-label="Kies iconen">
            <IconSetChip iconSet={resolved.iconSet} />
            <span className="text-[0.65rem] font-medium text-meta-text">Iconen</span>
          </button>
          {api.saved.length > 0 && (
            <button
              type="button"
              onClick={() => setSheet('recepten')}
              className="flex min-h-[44px] w-12 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-border bg-background transition hover:bg-panel-hover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              aria-label="Mijn recepten"
            >
              <Bookmark className="h-[1.05rem] w-[1.05rem] text-secondary-text" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Sheets */}
      <PickerSheet open={sheet === 'kleur'} title="Kleur" onClose={close}>
        <PalettePicker selectedId={resolved.palette.id} onSelect={api.setPalette} />
      </PickerSheet>
      <PickerSheet open={sheet === 'typografie'} title="Typografie" onClose={close}>
        <TypographyPicker selectedId={resolved.pairing.id} onSelect={api.setTypography} />
      </PickerSheet>
      <PickerSheet open={sheet === 'iconen'} title="Iconen" onClose={close}>
        <IconsetPicker selectedId={resolved.iconSet.id} onSelect={api.setIconSet} />
      </PickerSheet>
      <PickerSheet open={sheet === 'recepten'} title="Mijn recepten" onClose={close}>
        <ul className="flex flex-col gap-1">
          {api.saved.map((entry) => {
            const palette = CANON_PALETTES.find((p) => p.id === entry.paletteId);
            return (
              <li key={entry.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5">
                <button
                  type="button"
                  onClick={() => {
                    api.loadSaved(entry.id);
                    close();
                  }}
                  className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                >
                  {palette && (
                    <span className="flex shrink-0 items-center">
                      {Object.values(palette.colors).map((color, i) => (
                        <span
                          key={i}
                          className="h-4 w-4 rounded-full border border-border/60"
                          style={{ backgroundColor: color, marginLeft: i === 0 ? 0 : '-0.35rem' }}
                        />
                      ))}
                    </span>
                  )}
                  <span className="min-w-0 truncate text-sm text-primary-text">{entry.name}</span>
                </button>
                <button
                  type="button"
                  onClick={() => api.deleteSaved(entry.id)}
                  aria-label={`Verwijder ${entry.name}`}
                  className="shrink-0 p-1 text-meta-text transition hover:text-primary-text"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      </PickerSheet>
    </div>
  );
}

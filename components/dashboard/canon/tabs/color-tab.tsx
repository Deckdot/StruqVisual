'use client';

// components/dashboard/canon/tabs/color-tab.tsx
// Ported from DesignOS ColorTab — palette cards with gradient strip, copyable
// swatches, and an applied mini-preview. Token-remapped to Struq's app register.

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Check } from 'lucide-react';
import { CANON_PALETTES } from '@/lib/canon/palettes';
import type { Palette as PaletteType } from '@/lib/canon/types';
import { CanonPreviewDialog } from '../preview/canon-preview-dialog';

const ROLE_LABELS: Record<string, string> = {
  background: 'Achtergrond',
  surface: 'Oppervlak',
  text: 'Tekst',
  accent: 'Accent',
  accentAlt: 'Accent 2',
};

function Swatch({ name, color }: { name: string; color: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(color);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1100);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group/swatch flex flex-col gap-2 text-left focus:outline-none"
      aria-label={`Kopieer ${color}`}
      title={`Kopieer ${color}`}
    >
      <div
        style={{ backgroundColor: color }}
        className="relative h-14 w-full rounded-xl border border-border shadow-sm transition-transform duration-300 group-hover/swatch:scale-[1.03]"
      >
        <span
          className={`absolute inset-0 flex items-center justify-center rounded-xl bg-black/25 transition-opacity duration-200 ${copied ? 'opacity-100' : 'opacity-0'}`}
        >
          <Check className="h-4 w-4 text-white" aria-hidden="true" />
        </span>
      </div>
      <div className="flex flex-col gap-0.5 px-0.5">
        <span className="text-[0.78rem] font-light leading-tight text-primary-text">{ROLE_LABELS[name] ?? name}</span>
        <span className="text-[0.72rem] uppercase tracking-[0.06em] text-meta-text tabular-nums">{color}</span>
      </div>
    </button>
  );
}

export function ColorTab() {
  const [selected, setSelected] = useState<PaletteType | null>(null);

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {CANON_PALETTES.map((palette) => {
          const entries = Object.entries(palette.colors) as [string, string][];
          return (
            <motion.div
              key={palette.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(palette)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelected(palette);
                }
              }}
              className="flex cursor-pointer flex-col gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[1.1rem] font-light capitalize leading-tight text-primary-text">
                    {palette.id.replace(/-/g, ' ')}
                  </h3>
                  <span className="text-[0.8rem] capitalize leading-tight text-secondary-text/70">{palette.mood}</span>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-panel text-accent">
                  <Palette className="h-4.5 w-4.5" strokeWidth={1.5} aria-hidden="true" />
                </div>
              </div>

              {/* gradient strip */}
              <div className="flex h-24 w-full overflow-hidden rounded-2xl border border-border">
                {entries.map(([name, color]) => (
                  <div key={name} style={{ backgroundColor: color }} className="flex-1" />
                ))}
              </div>

              {/* copyable swatches */}
              <div className="grid grid-cols-3 gap-x-4 gap-y-4">
                {entries.map(([name, color]) => (
                  <Swatch key={name} name={name} color={color} />
                ))}
              </div>

              {/* applied preview */}
              <div
                className="mt-auto flex flex-col gap-3.5 rounded-2xl border border-border p-5 shadow-sm"
                style={{ backgroundColor: palette.colors.background }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[0.7rem] font-light uppercase tracking-[0.14em]"
                    style={{ color: palette.colors.text, opacity: 0.55 }}
                  >
                    Preview
                  </span>
                  <div style={{ backgroundColor: palette.colors.accent }} className="h-6 w-6 rounded-full" />
                </div>
                <div className="space-y-2">
                  <div style={{ backgroundColor: palette.colors.text }} className="h-2.5 w-full rounded-full opacity-15" />
                  <div style={{ backgroundColor: palette.colors.text }} className="h-2.5 w-3/4 rounded-full opacity-10" />
                </div>
                <div
                  className="mt-1 self-start rounded-full px-3.5 py-1.5 text-[0.7rem] font-light tracking-[0.04em]"
                  style={{ backgroundColor: palette.colors.accent, color: palette.colors.background }}
                >
                  Call to action
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <CanonPreviewDialog
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected ? selected.id.replace(/-/g, ' ') : ''}
        subtitle={selected?.mood}
        paletteId={selected?.id}
      />
    </div>
  );
}

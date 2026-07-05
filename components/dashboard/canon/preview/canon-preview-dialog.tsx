'use client';

// components/dashboard/canon/preview/canon-preview-dialog.tsx
//
// The live-preview seam. In DesignOS the LibraryPreviewDialog renders a full
// themed mini-page (header/hero/cards/footer) via the TasteSandbox — that whole
// iframe sandbox is FUTURE work. For now this dialog shows a static themed
// mini-page driven by the selected palette's colors + type pairing (CSS vars),
// echoing the sandbox look.
//
// Prop shape mirrors DesignOS's LibraryPreviewDialog (paletteId / typographyId /
// title / subtitle) so the real iframe sandbox can drop in here later with no
// call-site changes.

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { CANON_PALETTES } from '@/lib/canon/palettes';
import { CANON_TYPOGRAPHY } from '@/lib/canon/typography';
import type { PaletteColors } from '@/lib/canon/types';

type CanonPreviewDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  paletteId?: string;
  typographyId?: string;
};

const FALLBACK: PaletteColors = {
  background: '#f3f0e8',
  surface: '#e8e1d5',
  text: '#353634',
  accent: '#9c532c',
  accentAlt: '#2b4a56',
};

export function CanonPreviewDialog({
  open,
  onClose,
  title,
  subtitle,
  paletteId,
  typographyId,
}: CanonPreviewDialogProps) {
  const palette = CANON_PALETTES.find((p) => p.id === paletteId)?.colors ?? FALLBACK;
  const pairing = CANON_TYPOGRAPHY.find((t) => t.id === typographyId) ?? CANON_TYPOGRAPHY[0];

  const themeVars = {
    '--pv-bg': palette.background,
    '--pv-surface': palette.surface,
    '--pv-text': palette.text,
    '--pv-accent': palette.accent,
    '--pv-accent-alt': palette.accentAlt ?? palette.accent,
    '--pv-display': pairing.display,
    '--pv-body': pairing.body,
  } as React.CSSProperties;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-0 backdrop-blur-md md:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.98, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: 24, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-none border-border bg-card shadow-2xl md:h-auto md:max-h-[84vh] md:rounded-3xl md:border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dialog chrome */}
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-6 py-4 sm:px-8">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-medium capitalize tracking-wide text-primary-text">
                  {title}
                </h2>
                {subtitle && <p className="truncate text-sm capitalize text-secondary-text/70">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                aria-label="Sluiten"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary-text shadow-sm transition-transform hover:scale-105 active:scale-95"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Themed static preview (sandbox seam) */}
            <div className="flex-1 overflow-y-auto" style={themeVars}>
              <div style={{ background: 'var(--pv-bg)', color: 'var(--pv-text)', fontFamily: 'var(--pv-body)' }}>
                {/* header */}
                <div
                  className="flex items-center justify-between px-8 py-5"
                  style={{ borderBottom: '1px solid color-mix(in srgb, var(--pv-text) 12%, transparent)' }}
                >
                  <span className="text-sm font-semibold tracking-tight" style={{ fontFamily: 'var(--pv-display)' }}>
                    Atelier
                  </span>
                  <div className="flex items-center gap-6 text-[0.8rem]" style={{ opacity: 0.7 }}>
                    <span>Werk</span>
                    <span>Studio</span>
                    <span
                      className="rounded-full px-3.5 py-1.5 text-[0.72rem] font-medium"
                      style={{ background: 'var(--pv-accent)', color: 'var(--pv-bg)' }}
                    >
                      Contact
                    </span>
                  </div>
                </div>

                {/* hero */}
                <div className="px-8 py-16 sm:px-12 sm:py-24">
                  <span
                    className="text-[0.72rem] font-medium uppercase tracking-[0.2em]"
                    style={{ color: 'var(--pv-accent)' }}
                  >
                    Premium service
                  </span>
                  <h1
                    className="mt-5 max-w-2xl text-[clamp(2rem,5vw,3.75rem)] leading-[1.02] tracking-tight"
                    style={{ fontFamily: 'var(--pv-display)' }}
                  >
                    Van smaak naar structuur, in één richting.
                  </h1>
                  <p className="mt-6 max-w-lg text-[0.95rem] leading-relaxed" style={{ opacity: 0.72 }}>
                    Een rustige, editorial richting die vertrouwen uitstraalt en de aandacht
                    op het werk houdt — precies zoals deze combinatie bedoeld is.
                  </p>
                  <div className="mt-8 flex items-center gap-4">
                    <span
                      className="rounded-full px-6 py-3 text-[0.85rem] font-medium"
                      style={{ background: 'var(--pv-accent)', color: 'var(--pv-bg)' }}
                    >
                      Start een project
                    </span>
                    <span className="text-[0.85rem]" style={{ opacity: 0.6 }}>
                      Bekijk het werk →
                    </span>
                  </div>
                </div>

                {/* cards */}
                <div
                  className="grid grid-cols-1 gap-5 px-8 py-14 sm:grid-cols-3 sm:px-12"
                  style={{ background: 'var(--pv-surface)' }}
                >
                  {['Richting', 'Ambacht', 'Resultaat'].map((t, i) => (
                    <div
                      key={t}
                      className="rounded-2xl p-6"
                      style={{ background: 'var(--pv-bg)', border: '1px solid color-mix(in srgb, var(--pv-text) 10%, transparent)' }}
                    >
                      <div
                        className="mb-4 h-9 w-9 rounded-full"
                        style={{ background: i === 0 ? 'var(--pv-accent)' : 'var(--pv-accent-alt)', opacity: 0.9 }}
                      />
                      <p className="text-[0.98rem] font-medium" style={{ fontFamily: 'var(--pv-display)' }}>
                        {t}
                      </p>
                      <p className="mt-2 text-[0.85rem] leading-relaxed" style={{ opacity: 0.65 }}>
                        Een korte toelichting die laat zien hoe body-tekst zich in deze
                        richting leest.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-border px-6 py-3 text-center text-[0.72rem] text-meta-text sm:px-8">
              Statische preview — de live sandbox komt binnenkort.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

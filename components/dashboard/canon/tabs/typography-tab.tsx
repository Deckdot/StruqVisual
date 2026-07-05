'use client';

// components/dashboard/canon/tabs/typography-tab.tsx
// Font-pairing specimen cards. Ported from DesignOS TypographyTab (visual layer).

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CANON_TYPOGRAPHY, TYPOGRAPHY_SPECIMEN } from '@/lib/canon/typography';
import type { FontPairing } from '@/lib/canon/types';
import { CanonPreviewDialog } from '../preview/canon-preview-dialog';

function familyName(stack: string) {
  return stack.split(',')[0]?.replace(/"/g, '').trim() ?? stack;
}

export function TypographyTab() {
  const [selected, setSelected] = useState<FontPairing | null>(null);

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {CANON_TYPOGRAPHY.map((pairing) => (
          <motion.div
            key={pairing.id}
            role="button"
            tabIndex={0}
            onClick={() => setSelected(pairing)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelected(pairing);
              }
            }}
            className="flex cursor-pointer flex-col gap-6 rounded-3xl border border-border bg-card p-7 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <div className="flex items-start justify-between border-b border-border pb-5">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-[1.15rem] font-medium tracking-wide text-primary-text">{pairing.name}</h3>
                <span className="text-[0.82rem] capitalize text-secondary-text/70">{pairing.mood}</span>
              </div>
              <div className="flex flex-col items-end gap-1 text-right">
                <span className="text-[0.72rem] uppercase tracking-wider text-meta-text">Display</span>
                <span className="text-sm text-primary-text" style={{ fontFamily: pairing.display }}>
                  {familyName(pairing.display)}
                </span>
              </div>
            </div>

            {/* specimen */}
            <div className="flex flex-col gap-3">
              <span className="text-[0.7rem] uppercase tracking-[0.14em] text-meta-text" style={{ fontFamily: pairing.body }}>
                {TYPOGRAPHY_SPECIMEN.eyebrow}
              </span>
              <p className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.05] tracking-tight text-primary-text" style={{ fontFamily: pairing.display }}>
                {TYPOGRAPHY_SPECIMEN.display}
              </p>
              <p className="max-w-md text-[0.95rem] leading-relaxed text-secondary-text/90" style={{ fontFamily: pairing.body }}>
                {TYPOGRAPHY_SPECIMEN.body}
              </p>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-[0.78rem] text-secondary-text/80">
              <span style={{ fontFamily: pairing.body }}>Body: {familyName(pairing.body)}</span>
              <span className="text-meta-text">{pairing.notes}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <CanonPreviewDialog
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ''}
        subtitle={selected?.mood}
        typographyId={selected?.id}
      />
    </div>
  );
}

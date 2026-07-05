'use client';

// components/dashboard/canon/tabs/recipes-tab.tsx
// Full-site recipe cards — a palette + type pairing + layout/category combination.
// Ported from DesignOS RecipesTab (visual layer). Opens the themed preview.

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { CANON_RECIPES } from '@/lib/canon/recipes';
import { CANON_PALETTES } from '@/lib/canon/palettes';
import { CANON_TYPOGRAPHY } from '@/lib/canon/typography';
import type { Recipe } from '@/lib/canon/types';
import { CanonPreviewDialog } from '../preview/canon-preview-dialog';

export function RecipesTab() {
  const [selected, setSelected] = useState<Recipe | null>(null);

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {CANON_RECIPES.map((recipe) => {
          const palette = CANON_PALETTES.find((p) => p.id === recipe.paletteId)?.colors;
          const pairing = CANON_TYPOGRAPHY.find((t) => t.id === recipe.typographyId);
          const colors = palette ?? { background: '#f3f0e8', surface: '#e8e1d5', text: '#353634', accent: '#9c532c' };
          return (
            <motion.div
              key={recipe.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(recipe)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelected(recipe);
                }
              }}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              {/* themed swatch header */}
              <div className="relative h-32 overflow-hidden" style={{ background: colors.background }}>
                <div className="absolute inset-0 flex flex-col justify-center gap-2 px-6">
                  <span
                    className="text-[0.7rem] font-medium uppercase tracking-[0.16em]"
                    style={{ color: colors.accent }}
                  >
                    {recipe.tags[0]?.replace(/-/g, ' ')}
                  </span>
                  <span
                    className="text-lg leading-tight tracking-tight"
                    style={{ color: colors.text, fontFamily: pairing?.display }}
                  >
                    {recipe.name}
                  </span>
                </div>
                <div className="absolute bottom-3 right-4 flex gap-1.5">
                  {Object.values(colors).map((c, i) => (
                    <span key={i} className="h-5 w-5 rounded-full border border-black/10" style={{ background: c }} />
                  ))}
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-5">
                <p className="text-[0.88rem] leading-relaxed text-secondary-text/90">{recipe.summary}</p>
                <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
                  <span className="text-[0.72rem] uppercase tracking-[0.12em] text-meta-text">
                    {recipe.tags[1]?.replace(/-/g, ' ')}
                  </span>
                  <span className="flex items-center gap-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-secondary-text transition-colors group-hover:text-primary-text">
                    Preview
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <CanonPreviewDialog
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ''}
        subtitle={selected ? selected.tags.join(' / ').replace(/-/g, ' ') : ''}
        paletteId={selected?.paletteId}
        typographyId={selected?.typographyId}
      />
    </div>
  );
}

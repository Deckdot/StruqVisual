'use client';

// components/dashboard/canon/tabs/sections-tab.tsx
// Structural section kinds grouped by category. Ported from DesignOS SectionsTab
// (visual layer — the category + kind browser, not the pipeline variant contracts).

import { motion } from 'framer-motion';
import { CANON_SECTIONS, SECTION_CATEGORIES } from '@/lib/canon/sections';

export function SectionsTab() {
  return (
    <div className="flex flex-col gap-10">
      {SECTION_CATEGORIES.map((category) => {
        const kinds = CANON_SECTIONS.filter((s) => s.category === category);
        if (!kinds.length) return null;
        return (
          <div key={category} className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-meta-text">{category}</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {kinds.map((section) => (
                <motion.div
                  key={section.kind}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-[1rem] font-medium text-primary-text">{section.name}</h4>
                    <span className="rounded-md bg-panel px-2 py-0.5 text-[0.68rem] font-medium uppercase tracking-wide text-meta-text">
                      {section.kind}
                    </span>
                  </div>
                  <p className="text-[0.85rem] leading-relaxed text-secondary-text/90">{section.purpose}</p>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

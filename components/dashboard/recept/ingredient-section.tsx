'use client';

// components/dashboard/recept/ingredient-section.tsx
//
// A collapsible section in the control rail: a header row (meta label + collapsed
// summary chip + selection name + chevron, the whole row is the button, ≥44px) and
// a height-animated body. Strict accordion behaviour is enforced by the parent
// (exactly one open at a time). Motion is app-register: 180ms with the repo's
// [0.25, 1, 0.5, 1] ease; reduced-motion collapses to an instant toggle.

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

type IngredientSectionProps = {
  label: string;
  /** Visual summary chip for the current selection (recognition over recall). */
  chip: React.ReactNode;
  /** Name of the current selection, shown beside the chip. */
  summary: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

const EASE = [0.25, 1, 0.5, 1] as [number, number, number, number];

export function IngredientSection({ label, chip, summary, open, onToggle, children }: IngredientSectionProps) {
  const reduce = useReducedMotion();

  return (
    <div className="rounded-xl border border-border bg-background">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex min-h-[3rem] w-full items-center gap-3 px-3.5 py-2.5 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-xl"
      >
        <span className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="text-[0.7rem] font-medium uppercase tracking-widest text-meta-text">{label}</span>
          <span className="flex items-center gap-2.5">
            {chip}
            <span className="min-w-0 truncate text-sm text-primary-text">{summary}</span>
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-meta-text transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="max-h-[50vh] overflow-y-auto border-t border-border px-2 py-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

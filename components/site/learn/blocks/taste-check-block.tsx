'use client';

/**
 * Taste check: a design choice, not a quiz. Every option is pickable and
 * every option shows its consequence; the resolution explains what the pros
 * would do and why. Nobody is ever "fout".
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TasteCheckBlock } from '@/lib/learn/schema';

export function TasteCheck({
  block,
  onEngage,
}: {
  block: TasteCheckBlock;
  onEngage: () => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className="sq-panel-sunken p-6 md:p-8">
      <p className="sq-eyebrow">Smaakmoment</p>
      <p className="sq-h3 mt-3">{block.question}</p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {block.options.map((option) => {
          const isPicked = picked === option.id;
          return (
            <motion.button
              key={option.id}
              type="button"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                onEngage();
                setPicked(option.id);
              }}
              className="rounded-2xl border px-5 py-4 text-left transition-colors"
              style={{
                background: isPicked ? 'var(--sq-raised)' : 'var(--sq-raised)',
                borderColor: isPicked ? 'var(--sq-accent)' : 'var(--sq-line)',
                boxShadow: isPicked ? 'var(--sq-shadow-float)' : undefined,
              }}
            >
              <span className="font-semibold">{option.label}</span>
              <AnimatePresence>
                {isPicked && (
                  <motion.span
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="mt-2 block text-sm leading-relaxed"
                    style={{ color: 'var(--sq-ink-soft)' }}
                  >
                    {option.consequence}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {picked && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.5 }}
            className="mt-6 rounded-2xl px-5 py-4 text-sm leading-relaxed"
            style={{ background: 'var(--sq-accent-wash)', color: 'var(--sq-accent-ink)' }}
          >
            {block.resolution}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

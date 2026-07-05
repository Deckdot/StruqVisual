'use client';

/**
 * Predict-first probe: challenge what the learner already thinks BEFORE the
 * concept is taught. Right answer: instant competence. Wrong answer: the
 * surprise makes the correction stick (hypercorrection effect). Never framed
 * as a test; there is no score anywhere.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PredictBlock } from '@/lib/learn/schema';

export function Predict({
  block,
  onEngage,
}: {
  block: PredictBlock;
  onEngage: () => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);

  const pickedOption = block.options.find((o) => o.id === picked);

  return (
    <div
      className="sq-panel p-6 md:p-8"
      style={{ borderColor: 'var(--sq-line-strong)' }}
    >
      <p className="sq-eyebrow">Wat denk jij?</p>
      <p className="sq-h3 mt-3">{block.prompt}</p>

      <div className="mt-6 flex flex-col gap-3">
        {block.options.map((option) => {
          const isPicked = picked === option.id;
          const revealed = picked !== null;
          return (
            <motion.button
              key={option.id}
              type="button"
              disabled={revealed}
              whileHover={revealed ? undefined : { x: 4 }}
              whileTap={revealed ? undefined : { scale: 0.99 }}
              onClick={() => {
                if (picked) return;
                onEngage();
                setPicked(option.id);
              }}
              className="rounded-2xl border px-5 py-4 text-left transition-colors"
              style={{
                borderColor: revealed
                  ? option.correct
                    ? 'var(--sq-accent)'
                    : 'var(--sq-line)'
                  : 'var(--sq-line)',
                background: revealed
                  ? option.correct
                    ? 'var(--sq-accent-wash)'
                    : isPicked
                      ? 'var(--sq-sunken)'
                      : 'var(--sq-raised)'
                  : 'var(--sq-raised)',
                opacity: revealed && !option.correct && !isPicked ? 0.55 : 1,
                cursor: revealed ? 'default' : 'pointer',
              }}
            >
              <span className="flex items-start justify-between gap-4">
                <span className="font-semibold" style={{ color: 'var(--sq-ink)' }}>
                  {option.label}
                </span>
                {revealed && (option.correct || isPicked) && (
                  <span
                    className="shrink-0 rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider"
                    style={{
                      background: option.correct ? 'var(--sq-accent)' : 'var(--sq-line-strong)',
                      color: option.correct ? 'var(--sq-paper)' : 'var(--sq-ink-soft)',
                    }}
                  >
                    {option.correct ? 'Dit dus' : 'Jouw gok'}
                  </span>
                )}
              </span>
              <AnimatePresence>
                {revealed && (option.correct || isPicked) && (
                  <motion.span
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="mt-2 block text-sm leading-relaxed"
                    style={{ color: 'var(--sq-ink-soft)' }}
                  >
                    {option.feedback}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {pickedOption && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.35 }}
            className="mt-6 rounded-2xl px-5 py-4"
            style={{ background: 'var(--sq-inverse)', color: 'var(--sq-inverse-ink)' }}
          >
            <p className="text-[0.65rem] font-bold uppercase tracking-widest" style={{ color: 'var(--sq-accent)' }}>
              {pickedOption.correct ? 'Goed gevoel' : 'Verrassing, en die blijft hangen'}
            </p>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--sq-inverse-soft)' }}>
              {block.reveal}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

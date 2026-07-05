'use client';

/**
 * Prompt anatomy: the prompt is a machine with removable parts. Toggle a
 * segment off and the simulated output degrades; the learner discovers
 * which parts carry the quality instead of being told.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PromptAnatomyBlock } from '@/lib/learn/schema';

export function PromptAnatomy({
  block,
  onEngage,
}: {
  block: PromptAnatomyBlock;
  onEngage: () => void;
}) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(block.segments.map((s) => [s.id, true]))
  );
  const [activeExplanation, setActiveExplanation] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const enabledCount = block.segments.filter((s) => enabled[s.id]).length;

  const outputState = [...block.outputStates]
    .sort((a, b) => a.minSegments - b.minSegments)
    .reduce((winner, state) => (enabledCount >= state.minSegments ? state : winner), block.outputStates[0]);

  const toggle = (id: string) => {
    onEngage();
    setTouched(true);
    setActiveExplanation(id);
    setEnabled((current) => ({ ...current, [id]: !current[id] }));
  };

  const explanation = block.segments.find((s) => s.id === activeExplanation);

  return (
    <div>
      <p className="sq-muted max-w-2xl">{block.intro}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-start">
        {/* The prompt, segment by segment */}
        <div className="sq-panel-inverse p-6" style={{ boxShadow: 'var(--sq-shadow-float)' }}>
          <p className="sq-eyebrow" style={{ color: 'var(--sq-accent)' }}>
            De prompt · Klik een onderdeel uit of aan
          </p>
          <div className="mt-4 flex flex-col gap-2.5">
            {block.segments.map((segment) => {
              const on = enabled[segment.id];
              return (
                <button
                  key={segment.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(segment.id)}
                  className="rounded-xl border px-4 py-3 text-left transition-all"
                  style={{
                    borderColor: on
                      ? 'color-mix(in srgb, var(--sq-accent) 55%, transparent)'
                      : 'color-mix(in srgb, var(--sq-inverse-soft) 25%, transparent)',
                    background: on
                      ? 'color-mix(in srgb, var(--sq-accent) 10%, transparent)'
                      : 'transparent',
                    opacity: on ? 1 : 0.45,
                  }}
                >
                  <span
                    className="text-[0.65rem] font-bold uppercase tracking-widest"
                    style={{ color: on ? 'var(--sq-accent)' : 'var(--sq-inverse-soft)' }}
                  >
                    {segment.label} {on ? '' : '· uit'}
                  </span>
                  <span
                    className="mt-1 block text-sm leading-relaxed"
                    style={{
                      color: 'var(--sq-inverse-soft)',
                      textDecoration: on ? 'none' : 'line-through',
                    }}
                  >
                    {segment.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* The output responds */}
        <div className="lg:sticky lg:top-24">
          <div className="sq-panel p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="sq-eyebrow">Wat de AI teruggeeft</p>
              <AnimatePresence mode="wait">
                <motion.span
                  key={outputState.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="rounded-full px-3 py-1 text-xs font-bold"
                  style={{
                    background:
                      enabledCount === block.segments.length
                        ? 'var(--sq-accent-wash)'
                        : 'var(--sq-sunken)',
                    color:
                      enabledCount === block.segments.length
                        ? 'var(--sq-accent-ink)'
                        : 'var(--sq-ink-faint)',
                  }}
                >
                  {outputState.label}
                </motion.span>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={outputState.body}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="mt-4 text-sm leading-relaxed"
                style={{
                  color:
                    enabledCount <= 1 ? 'var(--sq-ink-faint)' : 'var(--sq-ink-soft)',
                }}
              >
                {outputState.body}
              </motion.p>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {explanation && (
              <motion.p
                key={explanation.id + String(enabled[explanation.id])}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 rounded-2xl px-5 py-4 text-sm leading-relaxed"
                style={{ background: 'var(--sq-accent-wash)', color: 'var(--sq-accent-ink)' }}
              >
                {explanation.explanation}
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {touched && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="sq-faint mt-4"
              >
                {block.insight}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

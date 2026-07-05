'use client';

/**
 * Token playground: swatches and sliders bound to CSS custom properties on
 * the live artifact. The insight line only appears after the learner has
 * actually played, so the takeaway lands on top of a felt experience.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PlaygroundTokensBlock, TokenControl } from '@/lib/learn/schema';
import { resolveArtifact } from '@/lib/learn/artifacts/registry';
import { ArtifactFrame } from '@/components/site/learn/blocks/artifact-frame';

function controlValue(control: TokenControl, raw: string): string {
  return control.unit ? `${raw}${control.unit}` : raw;
}

export function PlaygroundTokens({
  block,
  onEngage,
}: {
  block: PlaygroundTokensBlock;
  onEngage: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(block.controls.map((c) => [c.id, c.defaultValue]))
  );
  const [touched, setTouched] = useState(false);

  const Artifact = resolveArtifact(block.artifact);
  if (!Artifact) return null;

  const setValue = (control: TokenControl, raw: string) => {
    setTouched(true);
    onEngage();
    setValues((current) => ({ ...current, [control.id]: raw }));
  };

  const tokens = Object.fromEntries(
    block.controls.map((c) => [c.cssVar, controlValue(c, values[c.id])])
  );

  return (
    <div>
      <p className="sq-muted max-w-2xl">{block.intro}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <ArtifactFrame>
            <Artifact tokens={tokens} />
          </ArtifactFrame>
        </div>

        <div className="flex flex-col gap-6">
          {block.controls.map((control) => (
            <div key={control.id}>
              <p className="text-sm font-bold">{control.label}</p>

              {control.type === 'swatch' && control.options && (
                <div className="mt-2.5 flex flex-wrap gap-2.5">
                  {control.options.map((option) => {
                    const selected = values[control.id] === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        title={option.label}
                        aria-pressed={selected}
                        onClick={() => setValue(control, option.value)}
                        className="h-10 w-10 rounded-full border-2 transition-transform hover:scale-110 active:scale-95"
                        style={{
                          background: option.value,
                          borderColor: selected ? 'var(--sq-ink)' : 'var(--sq-line)',
                          boxShadow: selected ? '0 0 0 3px var(--sq-paper), 0 0 0 5px var(--sq-ink)' : undefined,
                        }}
                      >
                        <span className="sr-only">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {control.type === 'range' && (
                <div className="mt-2.5 flex items-center gap-4">
                  <input
                    type="range"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={Number(values[control.id])}
                    onChange={(e) => setValue(control, e.target.value)}
                    className="sq-learn-range flex-1"
                    aria-label={control.label}
                  />
                  <span className="sq-faint w-16 text-right tabular-nums">
                    {values[control.id]}
                    {control.unit ?? ''}
                  </span>
                </div>
              )}
            </div>
          ))}

          <AnimatePresence>
            {touched && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: 0.4 }}
                className="rounded-2xl px-5 py-4 text-sm leading-relaxed"
                style={{ background: 'var(--sq-accent-wash)', color: 'var(--sq-accent-ink)' }}
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

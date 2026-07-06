'use client';

/**
 * Motion playground: the entrance timeline of the artifact becomes the
 * teaching material. The learner changes duration, stagger, travel or ease
 * and replays the timeline until motion stops being abstract.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PlaygroundMotionBlock, MotionControl } from '@/lib/learn/schema';
import type { ArtifactMotionParams } from '@/lib/learn/artifacts/types';
import { resolveArtifact } from '@/lib/learn/artifacts/registry';
import { ArtifactFrame } from '@/components/site/learn/blocks/artifact-frame';
import { SlotText } from '@/components/site/slot-text';

export function PlaygroundMotion({
  block,
  onEngage,
}: {
  block: PlaygroundMotionBlock;
  onEngage: () => void;
}) {
  const [values, setValues] = useState<Record<string, number | string>>(() =>
    Object.fromEntries(block.controls.map((c) => [c.id, c.defaultValue]))
  );
  const [replayKey, setReplayKey] = useState(0);
  const [touched, setTouched] = useState(false);

  const Artifact = resolveArtifact(block.artifact);
  if (!Artifact) return null;

  const setValue = (control: MotionControl, raw: number | string) => {
    setTouched(true);
    onEngage();
    setValues((current) => ({ ...current, [control.id]: raw }));
  };

  const motionParams: ArtifactMotionParams = {
    duration: typeof values.duration === 'string' ? Number(values.duration) : (values.duration as number | undefined),
    stagger: typeof values.stagger === 'string' ? Number(values.stagger) : (values.stagger as number | undefined),
    distance: typeof values.distance === 'string' ? Number(values.distance) : (values.distance as number | undefined),
    ease: typeof values.ease === 'string' ? values.ease : undefined,
  };

  return (
    <div>
      <p className="sq-muted max-w-2xl">{block.intro}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <ArtifactFrame onReplay={() => { onEngage(); setReplayKey((k) => k + 1); }}>
            <Artifact motion={motionParams} replayKey={replayKey} />
          </ArtifactFrame>
        </div>

        <div className="flex flex-col gap-6">
          {block.controls.map((control) => (
            <div key={control.id}>
              <p className="text-sm font-bold">{control.label}</p>

              {control.type === 'range' && (
                <div className="mt-2.5 flex items-center gap-4">
                  <input
                    type="range"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={Number(values[control.id])}
                    onChange={(e) => setValue(control, Number(e.target.value))}
                    className="sq-learn-range flex-1"
                    aria-label={control.label}
                  />
                  <span className="sq-faint w-16 text-right tabular-nums">
                    {values[control.id]}
                    {control.unit ?? ''}
                  </span>
                </div>
              )}

              {control.type === 'choice' && control.options && (
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {control.options.map((option) => {
                    const selected = values[control.id] === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setValue(control, option.value)}
                        className="rounded-full border px-4 py-2 text-sm font-semibold transition-colors"
                        style={{
                          background: selected ? 'var(--sq-ink)' : 'var(--sq-raised)',
                          color: selected ? 'var(--sq-paper)' : 'var(--sq-ink-soft)',
                          borderColor: selected ? 'var(--sq-ink)' : 'var(--sq-line)',
                        }}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => { onEngage(); setReplayKey((k) => k + 1); }}
            className="sq-btn sq-btn-accent self-start !px-6 !py-3 !text-sm"
          >
            <SlotText>Speel opnieuw af</SlotText>
          </button>

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

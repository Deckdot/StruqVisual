'use client';

/**
 * Deconstruction: strip and restore the visual layers of the live artifact.
 * The learner FEELS what each layer contributes because the artifact
 * degrades in real time when a layer is turned off.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DeconstructLayersBlock } from '@/lib/learn/schema';
import { resolveArtifact } from '@/lib/learn/artifacts/registry';
import { ArtifactFrame } from '@/components/site/learn/blocks/artifact-frame';

export function DeconstructLayers({
  block,
  onEngage,
}: {
  block: DeconstructLayersBlock;
  onEngage: () => void;
}) {
  const [layers, setLayers] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(block.layers.map((l) => [l.id, true]))
  );
  const [active, setActive] = useState<string | null>(null);

  const Artifact = resolveArtifact(block.artifact);
  if (!Artifact) return null;

  const toggle = (id: string) => {
    onEngage();
    setActive(id);
    setLayers((current) => ({ ...current, [id]: !current[id] }));
  };

  const activeLayer = block.layers.find((l) => l.id === active);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
      <div className="lg:sticky lg:top-24">
        <ArtifactFrame>
          <Artifact layers={layers} />
        </ArtifactFrame>
      </div>

      <div>
        <p className="sq-muted">{block.intro}</p>

        <div className="mt-5 flex flex-col gap-2.5">
          {block.layers.map((layer) => {
            const on = layers[layer.id];
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => toggle(layer.id)}
                aria-pressed={on}
                className="flex items-center justify-between rounded-2xl border px-5 py-3.5 text-left transition-colors"
                style={{
                  background: on ? 'var(--sq-raised)' : 'var(--sq-sunken)',
                  borderColor: active === layer.id ? 'var(--sq-accent)' : 'var(--sq-line)',
                }}
              >
                <span
                  className="font-semibold"
                  style={{ color: on ? 'var(--sq-ink)' : 'var(--sq-ink-faint)' }}
                >
                  {layer.label}
                </span>
                <span
                  className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors"
                  style={{ background: on ? 'var(--sq-accent)' : 'var(--sq-line-strong)' }}
                  aria-hidden="true"
                >
                  <motion.span
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                    className="absolute h-4.5 w-4.5 rounded-full"
                    style={{
                      background: 'var(--sq-raised)',
                      height: '1.125rem',
                      width: '1.125rem',
                      left: on ? 'calc(100% - 1.375rem)' : '0.25rem',
                    }}
                  />
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {activeLayer && (
            <motion.p
              key={activeLayer.id + String(layers[activeLayer.id])}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="mt-5 rounded-2xl px-5 py-4 text-sm leading-relaxed"
              style={{ background: 'var(--sq-accent-wash)', color: 'var(--sq-accent-ink)' }}
            >
              {activeLayer.description}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

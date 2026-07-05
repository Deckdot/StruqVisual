'use client';

/**
 * The lighter blocks: prose, artifact stage, compare, code reveal, secret
 * and do-this. Small enough to live together; each still carries one clear
 * psychological job.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type {
  ProseBlock,
  ArtifactStageBlock,
  CompareBlock,
  CodeRevealBlock,
  SecretBlock,
  DoThisBlock,
} from '@/lib/learn/schema';
import { resolveArtifact } from '@/lib/learn/artifacts/registry';
import { ArtifactFrame } from '@/components/site/learn/blocks/artifact-frame';

/* ---------------------------------------------------------------- prose */

export function Prose({ block }: { block: ProseBlock }) {
  return (
    <div className="max-w-2xl space-y-5">
      {block.paragraphs.map((paragraph, index) => (
        <p key={index} className="leading-relaxed" style={{ color: 'var(--sq-ink-soft)' }}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}

/* -------------------------------------------------------- artifact stage */

export function ArtifactStage({
  block,
  onEngage,
}: {
  block: ArtifactStageBlock;
  onEngage: () => void;
}) {
  const [replayKey, setReplayKey] = useState(0);
  const Artifact = resolveArtifact(block.artifact);
  if (!Artifact) return null;

  return (
    <ArtifactFrame
      caption={block.caption}
      onReplay={() => {
        onEngage();
        setReplayKey((k) => k + 1);
      }}
    >
      <Artifact replayKey={replayKey} />
    </ArtifactFrame>
  );
}

/* --------------------------------------------------------------- compare */

export function Compare({ block }: { block: CompareBlock }) {
  return (
    <figure className="m-0">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="sq-panel-sunken p-6" style={{ opacity: 0.8 }}>
          <p className="text-[0.65rem] font-bold uppercase tracking-widest" style={{ color: 'var(--sq-ink-faint)' }}>
            {block.left.label}
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--sq-ink-faint)' }}>
            {block.left.body}
          </p>
        </div>
        <div className="sq-panel p-6" style={{ borderColor: 'var(--sq-accent)', boxShadow: 'var(--sq-shadow-float)' }}>
          <p className="text-[0.65rem] font-bold uppercase tracking-widest" style={{ color: 'var(--sq-accent-ink)' }}>
            {block.right.label}
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--sq-ink-soft)' }}>
            {block.right.body}
          </p>
        </div>
      </div>
      <figcaption className="sq-faint mt-3">{block.caption}</figcaption>
    </figure>
  );
}

/* ----------------------------------------------------------- code reveal */

export function CodeReveal({
  block,
  onEngage,
}: {
  block: CodeRevealBlock;
  onEngage: () => void;
}) {
  const [stage, setStage] = useState(0);
  const current = block.stages[stage];
  const isLast = stage === block.stages.length - 1;

  return (
    <div>
      <p className="sq-muted max-w-2xl">{block.intro}</p>
      <div className="sq-panel-inverse mt-5 overflow-hidden">
        <div
          className="flex items-center justify-between border-b px-5 py-3"
          style={{ borderColor: 'color-mix(in srgb, var(--sq-inverse-soft) 20%, transparent)' }}
        >
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--sq-inverse-soft)' }}>
            {block.language} · {stage + 1} van {block.stages.length}
          </span>
          {!isLast && (
            <button
              type="button"
              onClick={() => {
                onEngage();
                setStage((s) => Math.min(s + 1, block.stages.length - 1));
              }}
              className="rounded-full px-4 py-1.5 text-xs font-bold transition-transform hover:scale-105 active:scale-95"
              style={{ background: 'var(--sq-accent)', color: 'var(--sq-paper)' }}
            >
              Volgende laag
            </button>
          )}
        </div>
        <AnimatePresence mode="wait">
          <motion.pre
            key={stage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-x-auto p-5 font-mono text-[0.8125rem] leading-relaxed"
            style={{ color: 'var(--sq-inverse-ink)' }}
          >
            <code>{current.code}</code>
          </motion.pre>
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={stage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-4 rounded-2xl px-5 py-4 text-sm leading-relaxed"
          style={{ background: 'var(--sq-accent-wash)', color: 'var(--sq-accent-ink)' }}
        >
          {current.note}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------------- secret */

export function Secret({
  block,
  onOpen,
}: {
  block: SecretBlock;
  onOpen: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="my-2">
      {!open ? (
        <motion.button
          type="button"
          whileHover={{ scale: 1.01, rotate: -0.4 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => {
            onOpen();
            setOpen(true);
          }}
          className="w-full rounded-2xl border-2 border-dashed px-6 py-5 text-left"
          style={{ borderColor: 'var(--sq-line-strong)', background: 'var(--sq-sunken)' }}
        >
          <span className="sq-eyebrow">Atelier-geheim gevonden</span>
          <span className="mt-1.5 block font-semibold" style={{ color: 'var(--sq-ink-soft)' }}>
            {block.teaser}
          </span>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="rounded-2xl px-6 py-5"
          style={{ background: 'var(--sq-inverse)', color: 'var(--sq-inverse-ink)', boxShadow: 'var(--sq-shadow-float)' }}
        >
          <p className="text-[0.65rem] font-bold uppercase tracking-widest" style={{ color: 'var(--sq-accent)' }}>
            Atelier-geheim · {block.title}
          </p>
          <p className="mt-2.5 text-sm leading-relaxed" style={{ color: 'var(--sq-inverse-soft)' }}>
            {block.body}
          </p>
        </motion.div>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- do this */

export function DoThis({
  block,
  onEngage,
}: {
  block: DoThisBlock;
  onEngage: () => void;
}) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const allDone = block.actions.every((a) => done[a.id]);

  return (
    <div className="sq-panel p-6 md:p-8" style={{ borderColor: 'var(--sq-line-strong)' }}>
      <p className="sq-eyebrow">Nu jij</p>
      <p className="sq-muted mt-3 max-w-2xl">{block.intro}</p>

      <div className="mt-5 flex flex-col gap-2.5">
        {block.actions.map((action) => {
          const isDone = done[action.id];
          return (
            <button
              key={action.id}
              type="button"
              aria-pressed={isDone}
              onClick={() => {
                onEngage();
                setDone((current) => ({ ...current, [action.id]: !current[action.id] }));
              }}
              className="flex items-start gap-3.5 rounded-2xl border px-5 py-3.5 text-left transition-colors"
              style={{
                borderColor: isDone ? 'var(--sq-accent)' : 'var(--sq-line)',
                background: isDone ? 'var(--sq-accent-wash)' : 'var(--sq-raised)',
              }}
            >
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                style={{
                  borderColor: isDone ? 'var(--sq-accent)' : 'var(--sq-line-strong)',
                  background: isDone ? 'var(--sq-accent)' : 'transparent',
                }}
                aria-hidden="true"
              >
                {isDone && (
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
                    <path d="M2.5 6.5 5 9l4.5-6" stroke="var(--sq-paper)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span>
                <span className="block font-semibold" style={{ color: isDone ? 'var(--sq-accent-ink)' : 'var(--sq-ink)' }}>
                  {action.label}
                </span>
                {action.detail && (
                  <span className="mt-0.5 block text-sm" style={{ color: 'var(--sq-ink-soft)' }}>
                    {action.detail}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {allDone && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="mt-5 rounded-2xl px-5 py-4 text-sm font-semibold leading-relaxed"
            style={{ background: 'var(--sq-inverse)', color: 'var(--sq-inverse-ink)' }}
          >
            {block.verify}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

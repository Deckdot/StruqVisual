'use client';

import { useState, useCallback } from 'react';
import type { SequencingScene, SequencingBlock } from '@/lib/learning/types';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, RotateCcw, ArrowRight, GripVertical } from 'lucide-react';

interface SequencingSceneViewProps {
  scene: SequencingScene;
  className?: string;
  onNext?: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function SequencingSceneView({ scene, className, onNext }: SequencingSceneViewProps) {
  const [pool, setPool] = useState<SequencingBlock[]>(() =>
    shuffle(scene.blocks.filter((b) => !scene.correctOrder.slice(0, 0).includes(b.id))),
  );
  const [sequence, setSequence] = useState<SequencingBlock[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);

  const addToSequence = useCallback((block: SequencingBlock) => {
    if (submitted) return;
    setPool((p) => p.filter((b) => b.id !== block.id));
    setSequence((s) => [...s, block]);
  }, [submitted]);

  const removeFromSequence = useCallback((block: SequencingBlock) => {
    if (submitted) return;
    setSequence((s) => s.filter((b) => b.id !== block.id));
    setPool((p) => [...p, block]);
  }, [submitted]);

  const handleSubmit = () => {
    const isCorrect = sequence.map((b) => b.id).join(',') === scene.correctOrder.join(',');
    setCorrect(isCorrect);
    setSubmitted(true);
  };

  const handleReset = () => {
    setPool(shuffle(scene.blocks));
    setSequence([]);
    setSubmitted(false);
    setCorrect(false);
  };

  const canSubmit = sequence.length === scene.blocks.length;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Instructions */}
      <p className="text-secondary-text text-sm">{scene.instructions}</p>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Block pool */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-meta-text uppercase tracking-wider">
            Beschikbare blokken
          </p>
          <div className="min-h-[120px] rounded-xl border border-dashed border-border bg-canvas p-3 space-y-2">
            {pool.length === 0 && (
              <p className="text-xs text-meta-text text-center pt-4">
                Alle blokken zijn geplaatst
              </p>
            )}
            {pool.map((block) => (
              <button
                key={block.id}
                onClick={() => addToSequence(block)}
                disabled={submitted}
                className={cn(
                  'w-full text-left flex items-start gap-2 px-3 py-2.5 rounded-lg border border-border bg-panel text-sm text-primary-text transition-all',
                  !submitted && 'hover:border-accent/50 hover:bg-panel-hover cursor-pointer',
                  submitted && 'cursor-default',
                )}
              >
                <GripVertical className="w-4 h-4 text-meta-text shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">{block.label}</span>
                  {block.code && (
                    <code className="block text-xs font-mono text-accent mt-0.5">{block.code}</code>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sequence drop zone */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-meta-text uppercase tracking-wider">
            Jouw volgorde
          </p>
          <div className="min-h-[120px] rounded-xl border border-dashed border-accent/30 bg-canvas p-3 space-y-2">
            {sequence.length === 0 && (
              <p className="text-xs text-meta-text text-center pt-4">
                Klik op een blok om het hier te plaatsen
              </p>
            )}
            {sequence.map((block, i) => {
              const isCorrectPos = submitted && scene.correctOrder[i] === block.id;
              const isWrongPos = submitted && scene.correctOrder[i] !== block.id;
              return (
                <button
                  key={block.id}
                  onClick={() => removeFromSequence(block)}
                  disabled={submitted}
                  className={cn(
                    'w-full text-left flex items-start gap-2 px-3 py-2.5 rounded-lg border text-sm text-primary-text transition-all',
                    !submitted && 'border-accent/30 bg-accent/5 hover:border-red-400/50 hover:bg-red-400/5 cursor-pointer',
                    isCorrectPos && 'border-emerald-500/40 bg-emerald-500/10 cursor-default',
                    isWrongPos && 'border-red-400/40 bg-red-400/10 cursor-default',
                  )}
                >
                  <span className={cn(
                    'w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5',
                    !submitted && 'bg-accent/20 text-accent',
                    isCorrectPos && 'bg-emerald-500/20 text-emerald-400',
                    isWrongPos && 'bg-red-400/20 text-red-400',
                  )}>
                    {i + 1}
                  </span>
                  <div>
                    <span className="font-medium">{block.label}</span>
                    {block.code && (
                      <code className="block text-xs font-mono text-accent mt-0.5">{block.code}</code>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit / reset controls */}
      {!submitted && (
        <div className="flex items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all',
              canSubmit
                ? 'bg-accent text-white hover:bg-accent/90'
                : 'bg-panel border border-border text-meta-text cursor-not-allowed',
            )}
          >
            Controleer volgorde
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs text-meta-text hover:text-secondary-text hover:border-accent/30 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      )}

      {/* Result */}
      {submitted && (
        <div className="space-y-4">
          <div className={cn(
            'flex items-start gap-3 rounded-xl border p-4',
            correct
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-red-400/30 bg-red-400/10 text-red-400',
          )}>
            {correct
              ? <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              : <XCircle className="w-5 h-5 shrink-0 mt-0.5" />}
            <div>
              <p className="font-semibold text-sm">
                {correct ? 'Correct! Perfecte volgorde.' : 'Niet helemaal. Probeer opnieuw.'}
              </p>
              {correct && (
                <p className="text-secondary-text text-xs mt-1">{scene.executionPreview}</p>
              )}
            </div>
          </div>

          {correct ? (
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 flex items-start gap-3">
              <span className="text-accent text-lg">💡</span>
              <p className="text-secondary-text text-sm">{scene.insight}</p>
            </div>
          ) : null}

          <div className="flex items-center gap-3">
            {!correct && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-secondary-text text-sm font-medium hover:text-primary-text hover:border-accent/40 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Opnieuw proberen
              </button>
            )}
            {correct && onNext && (
              <button
                onClick={onNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-all"
              >
                Volgende
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

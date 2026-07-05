'use client';

import { useState } from 'react';
import type { ErrorIterationScene, ErrorIteration } from '@/lib/learning/types';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle, ChevronRight, Heart } from 'lucide-react';

interface ErrorIterationSceneViewProps {
  scene: ErrorIterationScene;
  className?: string;
}

export function ErrorIterationSceneView({ scene, className }: ErrorIterationSceneViewProps) {
  const [step, setStep] = useState<'error' | 'diagnosis' | 'fix' | 'result'>('error');
  const [iterIndex, setIterIndex] = useState(0);

  const iter: ErrorIteration = scene.iterations[iterIndex];
  const isLast = iterIndex === scene.iterations.length - 1;

  function nextIter() {
    if (!isLast) {
      setIterIndex((i) => i + 1);
      setStep('error');
    }
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Setup */}
      <p className="text-secondary-text text-sm leading-relaxed">{scene.setup}</p>

      {/* Iteration progress */}
      {scene.iterations.length > 1 && (
        <div className="flex items-center gap-1.5">
          {scene.iterations.map((it, i) => (
            <div
              key={it.id}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-all',
                i < iterIndex ? 'bg-emerald-500' : i === iterIndex ? 'bg-amber-400/60' : 'bg-border',
              )}
            />
          ))}
          <span className="text-xs text-meta-text ml-1 shrink-0 tabular-nums">
            Iteratie {iterIndex + 1}/{scene.iterations.length}
          </span>
        </div>
      )}

      {/* Error display */}
      <div className="space-y-3">
        {/* Error terminal */}
        <div className="rounded-xl border border-red-400/30 bg-red-400/5 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-red-400/20 bg-red-400/10">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/40" />
            </div>
            <span className="text-xs text-meta-text font-mono">terminal</span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 ml-auto" />
          </div>
          <pre className="p-4 text-sm font-mono text-red-400 whitespace-pre-wrap leading-relaxed">
            {iter.errorMessage}
          </pre>
        </div>

        {/* Step-through reveal */}
        <div className="space-y-3">
          {/* Diagnosis */}
          <button
            onClick={() => step === 'error' && setStep('diagnosis')}
            disabled={step !== 'error'}
            className={cn(
              'w-full text-left rounded-xl border p-4 transition-all',
              step === 'error'
                ? 'border-accent/30 bg-accent/5 hover:bg-accent/10 cursor-pointer'
                : 'border-border bg-panel cursor-default',
            )}
          >
            <div className="flex items-center gap-2">
              <span className={cn(
                'w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0',
                step !== 'error' ? 'bg-accent/20 text-accent' : 'bg-border text-meta-text',
              )}>1</span>
              <p className={cn(
                'text-sm font-medium',
                step !== 'error' ? 'text-primary-text' : 'text-meta-text',
              )}>
                {step === 'error' ? 'Wat betekent deze fout?' : 'Diagnose'}
              </p>
              {step === 'error' && <ChevronRight className="w-4 h-4 text-accent ml-auto" />}
            </div>
            {step !== 'error' && (
              <p className="text-secondary-text text-xs mt-2 ml-7">{iter.diagnosis}</p>
            )}
          </button>

          {/* Fix */}
          <button
            onClick={() => step === 'diagnosis' && setStep('fix')}
            disabled={step !== 'diagnosis'}
            className={cn(
              'w-full text-left rounded-xl border p-4 transition-all',
              step === 'diagnosis'
                ? 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 cursor-pointer'
                : step === 'error'
                  ? 'border-border bg-panel opacity-40 cursor-default'
                  : 'border-border bg-panel cursor-default',
            )}
          >
            <div className="flex items-center gap-2">
              <span className={cn(
                'w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0',
                step === 'fix' || step === 'result' ? 'bg-amber-500/20 text-amber-400' : 'bg-border text-meta-text',
              )}>2</span>
              <p className={cn(
                'text-sm font-medium',
                step === 'fix' || step === 'result' ? 'text-primary-text' : 'text-meta-text',
              )}>
                {step === 'diagnosis' ? 'Wat is de oplossing?' : 'De fix'}
              </p>
              {step === 'diagnosis' && <ChevronRight className="w-4 h-4 text-amber-400 ml-auto" />}
            </div>
            {(step === 'fix' || step === 'result') && (
              <p className="text-secondary-text text-xs mt-2 ml-7">{iter.fix}</p>
            )}
          </button>

          {/* Result */}
          <button
            onClick={() => step === 'fix' && setStep('result')}
            disabled={step !== 'fix'}
            className={cn(
              'w-full text-left rounded-xl border p-4 transition-all',
              step === 'fix'
                ? 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 cursor-pointer'
                : step === 'result'
                  ? 'border-emerald-500/30 bg-emerald-500/5 cursor-default'
                  : 'border-border bg-panel opacity-40 cursor-default',
            )}
          >
            <div className="flex items-center gap-2">
              <span className={cn(
                'w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0',
                step === 'result' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-border text-meta-text',
              )}>3</span>
              <p className={cn(
                'text-sm font-medium',
                step === 'result' ? 'text-emerald-400' : 'text-meta-text',
              )}>
                {step === 'fix' ? 'Resultaat na de fix' : step === 'result' ? 'Opgelost ✓' : 'Resultaat'}
              </p>
              {step === 'fix' && <CheckCircle className="w-4 h-4 text-emerald-400 ml-auto" />}
            </div>
            {step === 'result' && (
              <pre className="text-xs font-mono text-emerald-400 mt-2 ml-7 whitespace-pre-wrap">
                {iter.fixedResult}
              </pre>
            )}
          </button>
        </div>
      </div>

      {/* After completing an iteration */}
      {step === 'result' && (
        <div className="space-y-4">
          {/* Reassurance */}
          <div className="rounded-xl border border-border bg-panel p-4 flex items-start gap-3">
            <Heart className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <p className="text-secondary-text text-sm">{scene.reassurance}</p>
          </div>

          {isLast ? (
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
              <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">💡 Inzicht</p>
              <p className="text-secondary-text text-sm">{scene.insight}</p>
            </div>
          ) : (
            <button
              onClick={nextIter}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-all"
            >
              Volgende fout
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

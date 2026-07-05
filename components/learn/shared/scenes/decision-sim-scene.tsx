'use client';

import { useState } from 'react';
import type { DecisionSimScene, DecisionRound, DecisionChoice } from '@/lib/learning/types';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, RotateCcw, ArrowRight, ChevronRight } from 'lucide-react';

interface DecisionSimSceneViewProps {
  scene: DecisionSimScene;
  className?: string;
  onNext?: () => void;
}

export function DecisionSimSceneView({ scene, className, onNext }: DecisionSimSceneViewProps) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [choiceLog, setChoiceLog] = useState<{ roundId: string; choice: DecisionChoice }[]>([]);
  const [finished, setFinished] = useState(false);

  const round: DecisionRound | undefined = scene.rounds[roundIndex];
  const madeChoice = choiceLog.find((l) => l.roundId === round?.id);

  function choose(choice: DecisionChoice) {
    if (madeChoice || !round) return;
    setChoiceLog((prev) => [...prev, { roundId: round.id, choice }]);
  }

  function next() {
    if (roundIndex < scene.rounds.length - 1) {
      setRoundIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  }

  function restart() {
    setRoundIndex(0);
    setChoiceLog([]);
    setFinished(false);
  }

  const optimalCount = choiceLog.filter((l) => l.choice.isOptimal).length;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Setup */}
      <div className="rounded-xl border border-border bg-canvas px-5 py-4">
        <p className="text-xs font-semibold text-meta-text uppercase tracking-wider mb-2">Scenario</p>
        <p className="text-secondary-text text-sm leading-relaxed">{scene.setup}</p>
      </div>

      {/* Round progress */}
      <div className="flex items-center gap-1.5">
        {scene.rounds.map((r, i) => {
          const log = choiceLog.find((l) => l.roundId === r.id);
          return (
            <div
              key={r.id}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-all',
                i < roundIndex ? (log?.choice.isOptimal ? 'bg-emerald-500' : 'bg-red-400') : i === roundIndex ? 'bg-accent/40' : 'bg-border',
              )}
            />
          );
        })}
        <span className="text-xs text-meta-text ml-1 tabular-nums shrink-0">
          {roundIndex + 1}/{scene.rounds.length}
        </span>
      </div>

      {!finished && round && (
        <div className="space-y-5">
          {/* Scenario text */}
          <div className="rounded-2xl border border-border bg-panel p-5">
            <p className="text-primary-text font-medium leading-relaxed">{round.scenarioText}</p>
          </div>

          {/* Choices */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-meta-text uppercase tracking-wider">Wat doe je?</p>
            {round.choices.map((choice) => {
              const isSelected = madeChoice?.choice.id === choice.id;
              const isOther = madeChoice && madeChoice.choice.id !== choice.id;
              const showResult = !!madeChoice;
              return (
                <button
                  key={choice.id}
                  onClick={() => choose(choice)}
                  disabled={!!madeChoice}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-xl border text-sm transition-all',
                    !madeChoice && 'border-border text-secondary-text hover:border-accent/50 hover:bg-panel-hover cursor-pointer',
                    isSelected && choice.isOptimal && 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 cursor-default',
                    isSelected && !choice.isOptimal && 'border-red-400/40 bg-red-400/10 text-red-400 cursor-default',
                    isOther && 'border-border text-meta-text opacity-50 cursor-default',
                  )}
                >
                  <div className="flex items-start gap-3">
                    {showResult && isSelected && (
                      choice.isOptimal
                        ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        : <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    )}
                    {(!showResult || isOther) && (
                      <ChevronRight className="w-4 h-4 shrink-0 mt-0.5 text-meta-text" />
                    )}
                    <span className={cn(!showResult && 'text-primary-text')}>{choice.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Consequence + reasoning after choice */}
          {madeChoice && (
            <div className="space-y-3">
              <div className={cn(
                'rounded-xl border p-4 space-y-2',
                madeChoice.choice.isOptimal
                  ? 'border-emerald-500/20 bg-emerald-500/5'
                  : 'border-red-400/20 bg-red-400/5',
              )}>
                <p className="text-xs font-semibold text-meta-text uppercase tracking-wider">Consequentie</p>
                <p className="text-secondary-text text-sm">{madeChoice.choice.consequence}</p>
              </div>

              <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
                <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Redenering</p>
                <p className="text-secondary-text text-sm">{madeChoice.choice.reasoning}</p>
              </div>

              <p className="text-xs text-meta-text italic">{round.outcomeExplanation}</p>

              <button
                onClick={next}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-all"
              >
                {roundIndex < scene.rounds.length - 1 ? 'Volgende ronde' : 'Zie eindresultaat'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Final result */}
      {finished && (
        <div className="space-y-4">
          <div className={cn(
            'rounded-2xl border p-6 text-center space-y-2',
            optimalCount === scene.rounds.length
              ? 'border-emerald-500/40 bg-emerald-500/10'
              : optimalCount >= scene.rounds.length / 2
                ? 'border-accent/30 bg-accent/5'
                : 'border-amber-500/30 bg-amber-500/5',
          )}>
            <p className="text-2xl font-bold text-primary-text">
              {optimalCount}/{scene.rounds.length}
            </p>
            <p className="text-secondary-text text-sm">optimale keuzes gemaakt</p>
          </div>

          <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
            <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">💡 Inzicht</p>
            <p className="text-secondary-text text-sm">{scene.insight}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={restart}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-secondary-text text-sm font-medium hover:text-primary-text hover:border-accent/40 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Opnieuw spelen
            </button>
            {onNext && (
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

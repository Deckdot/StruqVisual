'use client';

import { useState } from 'react';
import type { QuizScene, QuizQuestion, QuizChoice } from '@/lib/learning/types';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizSceneViewProps {
  scene: QuizScene;
  className?: string;
  onNext?: () => void;
}

interface QuestionState {
  selectedChoices: string[];
  shortAnswer: string;
  submitted: boolean;
  correct: boolean;
}

function getInitialState(questions: QuizQuestion[]): Record<string, QuestionState> {
  return Object.fromEntries(
    questions.map((q) => [
      q.id,
      { selectedChoices: [], shortAnswer: '', submitted: false, correct: false },
    ]),
  );
}

function checkAnswer(q: QuizQuestion, state: QuestionState): boolean {
  if (q.type === 'single_choice') {
    return (
      state.selectedChoices.length === 1 &&
      q.choices?.find((c) => c.id === state.selectedChoices[0])?.isCorrect === true
    );
  }
  if (q.type === 'multiple_choice') {
    const correctIds = (q.choices ?? []).filter((c) => c.isCorrect).map((c) => c.id).sort();
    const selectedSorted = [...state.selectedChoices].sort();
    return JSON.stringify(correctIds) === JSON.stringify(selectedSorted);
  }
  if (q.correctAnswer) {
    return state.shortAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
  }
  // No correct answer defined — treat as self-check, always mark correct when non-empty
  return state.shortAnswer.trim().length > 0;
}

export function QuizSceneView({ scene, className, onNext }: QuizSceneViewProps) {
  const [states, setStates] = useState<Record<string, QuestionState>>(
    () => getInitialState(scene.questions),
  );
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  const totalPoints = scene.questions.reduce((s, q) => s + q.points, 0);

  function toggleChoice(qId: string, choiceId: string, multi: boolean) {
    setStates((prev) => {
      const cur = prev[qId];
      if (cur.submitted) return prev;
      const next = multi
        ? cur.selectedChoices.includes(choiceId)
          ? cur.selectedChoices.filter((c) => c !== choiceId)
          : [...cur.selectedChoices, choiceId]
        : [choiceId];
      return { ...prev, [qId]: { ...cur, selectedChoices: next } };
    });
  }

  function submitQuestion(q: QuizQuestion) {
    setStates((prev) => {
      const cur = prev[q.id];
      if (cur.submitted) return prev;
      const correct = checkAnswer(q, cur);
      return { ...prev, [q.id]: { ...cur, submitted: true, correct } };
    });
  }

  function finishQuiz() {
    const earned = scene.questions.reduce((acc, q) => {
      const s = states[q.id];
      return acc + (s.submitted && s.correct ? q.points : 0);
    }, 0);
    setScore(earned);
    setFinished(true);
  }

  const allSubmitted = scene.questions.every((q) => states[q.id].submitted);
  const pct = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
  const passed = pct >= scene.passingScore;

  return (
    <div className={cn('space-y-6', className)}>
      {scene.instructions && (
        <p className="text-secondary-text text-sm">{scene.instructions}</p>
      )}

      {scene.questions.map((q) => {
        const state = states[q.id];
        return (
          <div key={q.id} className="rounded-2xl border border-border bg-panel p-5 space-y-4">
            <p className="text-primary-text font-medium">{q.question}</p>

            {(q.type === 'single_choice' || q.type === 'multiple_choice') && q.choices && (
              <div className="space-y-2">
                {q.choices.map((c: QuizChoice) => {
                  const isSelected = state.selectedChoices.includes(c.id);
                  let ringClass = 'border-border';
                  if (state.submitted && isSelected) {
                    ringClass = c.isCorrect ? 'border-emerald-500 bg-emerald-500/10' : 'border-red-400 bg-red-400/10';
                  } else if (!state.submitted && isSelected) {
                    ringClass = 'border-accent bg-accent/10';
                  }
                  return (
                    <button
                      key={c.id}
                      onClick={() => toggleChoice(q.id, c.id, q.type === 'multiple_choice')}
                      disabled={state.submitted}
                      className={cn(
                        'w-full text-left px-4 py-3 rounded-xl border text-sm text-primary-text transition-colors',
                        ringClass,
                        !state.submitted && 'hover:border-accent/50 hover:bg-panel-hover cursor-pointer',
                        state.submitted && 'cursor-default',
                      )}
                    >
                      {c.text}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === 'short_answer' && (
              <textarea
                className="w-full rounded-xl border border-border bg-canvas text-primary-text text-sm px-4 py-3 placeholder:text-meta-text resize-none focus:outline-none focus:border-accent/60 transition-colors"
                rows={3}
                placeholder="Typ je antwoord…"
                disabled={state.submitted}
                value={state.shortAnswer}
                onChange={(e) => setStates((prev) => ({ ...prev, [q.id]: { ...prev[q.id], shortAnswer: e.target.value } }))}
              />
            )}

            {!state.submitted && (
              <button
                onClick={() => submitQuestion(q)}
                className="px-4 py-2 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent/90 transition-colors"
              >
                Antwoord indienen
              </button>
            )}

            {state.submitted && (
              <div className={cn('flex items-start gap-3 rounded-xl p-4 text-sm', state.correct ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-400/10 text-red-400')}>
                {state.correct ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <XCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                <div>
                  <p className="font-semibold mb-1">{state.correct ? 'Correct!' : 'Niet helemaal.'}</p>
                  <p className="text-secondary-text text-xs">{q.explanation}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {allSubmitted && !finished && (
        <button
          onClick={finishQuiz}
          className="w-full py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-colors"
        >
          Zie resultaten
        </button>
      )}

      {finished && (
        <div className={cn(
          'rounded-2xl border p-6 text-center space-y-4',
          passed ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-red-400/40 bg-red-400/10',
        )}>
          <p className="text-2xl font-bold text-primary-text">{pct}%</p>
          <p className="text-secondary-text text-sm">
            {score}/{totalPoints} punten — {passed ? '✓ Geslaagd' : `Je hebt ${scene.passingScore}% nodig`}
          </p>
          {onNext && passed && (
            <button
              onClick={onNext}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors"
            >
              Volgende scene →
            </button>
          )}
          {!passed && (
            <button
              onClick={() => {
                setStates(getInitialState(scene.questions));
                setFinished(false);
                setScore(0);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-secondary-text text-sm font-medium hover:text-primary-text hover:border-accent/40 transition-colors"
            >
              Opnieuw proberen
            </button>
          )}
        </div>
      )}
    </div>
  );
}

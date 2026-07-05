'use client';

import { useState, useCallback, useEffect } from 'react';
import type { LessonScene, PublishedLesson } from '@/lib/learning/types';
import { LessonProgressBar } from './lesson-progress-bar';
import { LessonSceneRenderer } from './lesson-scene-renderer';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { markLessonComplete } from '@/lib/learning/progress';

interface LessonNavigatorProps {
  lesson: PublishedLesson;
  className?: string;
}

export function LessonNavigator({ lesson, className }: LessonNavigatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = lesson.scenes.length;
  const scene = lesson.scenes[currentIndex];

  // Mark complete when lesson_complete scene is reached
  useEffect(() => {
    if (scene?.type === 'lesson_complete') {
      markLessonComplete(lesson.slug);
    }
  }, [scene?.type, lesson.slug]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, total - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const restart = useCallback(() => {
    setCurrentIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Progress bar */}
      <LessonProgressBar current={currentIndex} total={total} />

      {/* Scene card */}
      <div className="rounded-2xl border border-border bg-panel p-6 md:p-8 min-h-[420px] flex flex-col">
        <LessonSceneRenderer
          scene={scene}
          index={currentIndex}
          total={total}
          onNext={goNext}
          className="flex-1"
        />
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={goPrev}
          disabled={isFirst}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all',
            isFirst
              ? 'border-border text-meta-text cursor-not-allowed opacity-40'
              : 'border-border text-secondary-text hover:border-accent/50 hover:text-primary-text hover:bg-panel-hover',
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          Vorige
        </button>

        <div className="flex items-center gap-2">
          {isLast && (
            <button
              onClick={restart}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs text-meta-text hover:text-secondary-text hover:border-accent/30 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Opnieuw
            </button>
          )}
          <button
            onClick={goNext}
            disabled={isLast}
            className={cn(
              'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all',
              isLast
                ? 'bg-panel border border-border text-meta-text cursor-not-allowed opacity-40'
                : 'bg-accent text-white hover:bg-accent/90',
            )}
          >
            {isLast ? 'Klaar' : 'Volgende'}
            {!isLast && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

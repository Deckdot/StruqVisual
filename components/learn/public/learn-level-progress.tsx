'use client';

import type { LessonCard } from '@/lib/learning/types';
import type { LevelMeta } from '@/lib/learning/types';
import { useLessonProgress } from '@/hooks/use-lesson-progress';
import { cn } from '@/lib/utils';
import { Trophy, Lock } from 'lucide-react';

const LEVEL_STYLES: Record<1 | 2 | 3, {
  bar: string;
  text: string;
  milestone: string;
  milestoneUnlocked: string;
}> = {
  1: {
    bar: 'bg-emerald-500',
    text: 'text-emerald-400',
    milestone: 'border-border text-meta-text bg-canvas',
    milestoneUnlocked: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  },
  2: {
    bar: 'bg-violet-500',
    text: 'text-violet-400',
    milestone: 'border-border text-meta-text bg-canvas',
    milestoneUnlocked: 'bg-violet-500/10 border-violet-500/30 text-violet-400',
  },
  3: {
    bar: 'bg-amber-500',
    text: 'text-amber-400',
    milestone: 'border-border text-meta-text bg-canvas',
    milestoneUnlocked: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  },
};

interface LearnLevelProgressProps {
  meta: LevelMeta;
  lessons: LessonCard[];
  compact?: boolean;
}

export function LearnLevelProgress({ meta, lessons, compact = false }: LearnLevelProgressProps) {
  const { getLevelProgress, isMilestoneUnlocked } = useLessonProgress();
  const { completed, total, percentage } = getLevelProgress(lessons);
  const unlocked = isMilestoneUnlocked(lessons);
  const styles = LEVEL_STYLES[meta.level];

  if (total === 0) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-canvas border border-border overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-500', styles.bar)}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={cn('text-xs font-semibold shrink-0', styles.text)}>
          {completed}/{total}
        </span>
        {unlocked && <Trophy className={cn('w-3.5 h-3.5 shrink-0', styles.text)} />}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-meta-text">
          <span>{completed} van {total} lessen voltooid</span>
          <span className={cn('font-semibold', styles.text)}>{percentage}%</span>
        </div>
        <div className="h-2 rounded-full bg-canvas border border-border overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-500', styles.bar)}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Milestone badge */}
      <div className={cn(
        'flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm',
        unlocked ? styles.milestoneUnlocked : styles.milestone,
      )}>
        {unlocked
          ? <Trophy className="w-4 h-4 shrink-0" />
          : <Lock className="w-4 h-4 shrink-0 opacity-60" />
        }
        <p className="italic text-sm leading-snug">{meta.milestone}</p>
      </div>
    </div>
  );
}

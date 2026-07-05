'use client';

import { useState, useEffect, useCallback } from 'react';
import type { LessonCard } from '@/lib/learning/types';
import {
  getLessonProgress,
  markLessonComplete as markComplete,
} from '@/lib/learning/progress';

interface LevelProgress {
  completed: number;
  total: number;
  percentage: number;
}

interface UseLessonProgressReturn {
  progress: Record<string, boolean>;
  markLessonComplete: (slug: string) => void;
  getLevelProgress: (lessons: LessonCard[]) => LevelProgress;
  isMilestoneUnlocked: (lessons: LessonCard[]) => boolean;
  isComplete: (slug: string) => boolean;
}

export function useLessonProgress(): UseLessonProgressReturn {
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  // Hydrate from localStorage after mount (SSR-safe)
  useEffect(() => {
    setProgress(getLessonProgress());
  }, []);

  const markLessonComplete = useCallback((slug: string) => {
    markComplete(slug);
    setProgress(getLessonProgress());
  }, []);

  const getLevelProgressCb = useCallback(
    (lessons: LessonCard[]): LevelProgress => {
      // Use current in-memory progress for reactive updates
      const total = lessons.length;
      const completed = lessons.filter((l) => progress[l.slug] === true).length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { completed, total, percentage };
    },
    [progress],
  );

  const isMilestoneUnlockedCb = useCallback(
    (lessons: LessonCard[]): boolean => {
      if (lessons.length === 0) return false;
      return lessons.every((l) => progress[l.slug] === true);
    },
    [progress],
  );

  const isComplete = useCallback(
    (slug: string): boolean => progress[slug] === true,
    [progress],
  );

  return {
    progress,
    markLessonComplete,
    getLevelProgress: getLevelProgressCb,
    isMilestoneUnlocked: isMilestoneUnlockedCb,
    isComplete,
  };
}

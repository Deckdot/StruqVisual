// ============================================================
// Struq Learn — LocalStorage Progress Tracking
// ============================================================
// SSR-safe helpers for reading and writing lesson completion state.
// Storage key: struq_learn_progress
// Format: Record<slug, boolean>

import type { LessonCard } from './types';

const STORAGE_KEY = 'struq_learn_progress';

function isClient(): boolean {
  return typeof window !== 'undefined';
}

export function getLessonProgress(): Record<string, boolean> {
  if (!isClient()) return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return {};
  }
}

export function markLessonComplete(slug: string): void {
  if (!isClient()) return;
  const progress = getLessonProgress();
  progress[slug] = true;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Silently fail if storage is unavailable
  }
}

export function isLessonComplete(slug: string): boolean {
  return getLessonProgress()[slug] === true;
}

export function getProgressForLevel(
  lessons: LessonCard[],
): { completed: number; total: number; percentage: number } {
  const progress = getLessonProgress();
  const total = lessons.length;
  const completed = lessons.filter((l) => progress[l.slug] === true).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
}

export function isMilestoneUnlocked(lessons: LessonCard[]): boolean {
  if (lessons.length === 0) return false;
  const progress = getLessonProgress();
  return lessons.every((l) => progress[l.slug] === true);
}

export function clearProgress(): void {
  if (!isClient()) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail
  }
}

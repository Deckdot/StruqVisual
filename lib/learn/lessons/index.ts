/**
 * Lesson index: the single source of truth for which lessons exist.
 * Pure data, safe to import from server components, client components,
 * the sitemap and metadata generators alike.
 */

import type { LessonManifest } from '@/lib/learn/schema';
import { heroBlauwdruk } from '@/lib/learn/lessons/hero-blauwdruk';
import { promptLabSaaieOutput } from '@/lib/learn/lessons/prompt-lab-saaie-output';
import { trajectLegeMap } from '@/lib/learn/lessons/traject-lege-map';

/** Ordered by lane: beginner -> gevorderd -> expert. */
export const LESSONS: LessonManifest[] = [
  trajectLegeMap,
  promptLabSaaieOutput,
  heroBlauwdruk,
];

export function getLessonManifest(slug: string): LessonManifest | null {
  return LESSONS.find((lesson) => lesson.slug === slug) ?? null;
}

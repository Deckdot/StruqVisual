import fs from 'fs';
import path from 'path';
import type { PublishedLesson, LessonCard } from './types';
import { PublishedLessonSchema } from './schemas';
import { CONTENT_LEARN_DIR } from './constants';

const lessonsDirectory = path.join(
  /* turbopackIgnore: true */ process.cwd(),
  CONTENT_LEARN_DIR,
);

function ensureDir() {
  if (!fs.existsSync(lessonsDirectory)) {
    fs.mkdirSync(lessonsDirectory, { recursive: true });
  }
}

function toCard(lesson: PublishedLesson): LessonCard {
  return {
    slug: lesson.slug,
    title: lesson.title,
    subtitle: lesson.subtitle,
    description: lesson.description,
    tags: lesson.tags,
    category: lesson.category,
    difficulty: lesson.difficulty,
    level: lesson.level,
    estimatedMinutes: lesson.estimatedMinutes,
    publishedAt: lesson.publishedAt,
    updatedAt: lesson.updatedAt,
    featured: lesson.featured,
    lang: lesson.lang,
    sceneCount: lesson.scenes.length,
    sceneTypes: [...new Set(lesson.scenes.map((s) => s.type))],
  };
}

export async function getLessons(): Promise<LessonCard[]> {
  ensureDir();

  const files = fs.readdirSync(lessonsDirectory);
  const jsonFiles = files.filter((f) => f.endsWith('.json'));

  if (jsonFiles.length === 0) return [];

  const lessons: LessonCard[] = [];

  for (const filename of jsonFiles) {
    try {
      const filePath = path.join(lessonsDirectory, filename);
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = PublishedLessonSchema.safeParse(JSON.parse(raw));
      if (parsed.success) {
        lessons.push(toCard(parsed.data));
      } else {
        console.warn(`[learn] Skipping invalid lesson file: ${filename}`);
      }
    } catch {
      console.warn(`[learn] Failed to read lesson file: ${filename}`);
    }
  }

  return lessons.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getLesson(slug: string): Promise<PublishedLesson | null> {
  ensureDir();

  try {
    const filePath = path.join(lessonsDirectory, `${slug}.json`);
    if (!fs.existsSync(filePath)) return null;

    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = PublishedLessonSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      console.error(`[learn] Invalid lesson schema for: ${slug}`, parsed.error.flatten());
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

export async function getLessonsByTag(tag: string): Promise<LessonCard[]> {
  const lessons = await getLessons();
  return lessons.filter((l) => l.tags.includes(tag));
}

export async function getLessonsByCategory(category: string): Promise<LessonCard[]> {
  const lessons = await getLessons();
  return lessons.filter((l) => l.category === category);
}

export async function getFeaturedLessons(limit = 4): Promise<LessonCard[]> {
  const lessons = await getLessons();
  const featured = lessons.filter((l) => l.featured);
  return featured.length > 0 ? featured.slice(0, limit) : lessons.slice(0, limit);
}

export async function getAllLessonTags(): Promise<string[]> {
  const lessons = await getLessons();
  return [...new Set(lessons.flatMap((l) => l.tags))].sort();
}

export async function getAllLessonCategories(): Promise<string[]> {
  const lessons = await getLessons();
  return [...new Set(lessons.map((l) => l.category))].sort();
}

export async function getRelatedLessons(
  currentSlug: string,
  limit = 3,
): Promise<LessonCard[]> {
  const lessons = await getLessons();
  const current = lessons.find((l) => l.slug === currentSlug);
  if (!current) return lessons.slice(0, limit);

  return lessons
    .filter((l) => l.slug !== currentSlug)
    .map((l) => {
      let score = 0;
      if (l.category === current.category) score += 3;
      if (l.difficulty === current.difficulty) score += 1;
      if (l.level === current.level) score += 2;
      l.tags.forEach((t) => { if (current.tags.includes(t)) score += 1; });
      return { lesson: l, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.lesson);
}

export async function getLessonsByLevel(level: 1 | 2 | 3): Promise<LessonCard[]> {
  const lessons = await getLessons();
  return lessons.filter((l) => l.level === level);
}

export async function getLevelStats(): Promise<Record<1 | 2 | 3, { count: number; totalMinutes: number }>> {
  const lessons = await getLessons();
  const stats: Record<1 | 2 | 3, { count: number; totalMinutes: number }> = {
    1: { count: 0, totalMinutes: 0 },
    2: { count: 0, totalMinutes: 0 },
    3: { count: 0, totalMinutes: 0 },
  };
  for (const l of lessons) {
    if (l.level === 1 || l.level === 2 || l.level === 3) {
      stats[l.level].count += 1;
      stats[l.level].totalMinutes += l.estimatedMinutes;
    }
  }
  return stats;
}

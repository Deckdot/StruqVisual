'use client';

import { useState } from 'react';
import type { LessonCard } from '@/lib/learning/types';
import { LearnLessonCard } from './learn-lesson-card';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LearnIndexClientProps {
  lessons: LessonCard[];
  featured: LessonCard[];
  categories: string[];
}

export function LearnIndexClient({ lessons, featured, categories }: LearnIndexClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredLessons = activeCategory
    ? lessons.filter((l) => l.category === activeCategory)
    : lessons;

  const filteredFeatured = activeCategory
    ? featured.filter((l) => l.category === activeCategory)
    : featured;

  return (
    <div className="space-y-12">
      {/* Category filter tabs */}
      {categories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              'shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap',
              activeCategory === null
                ? 'bg-accent text-white border-accent'
                : 'border-border text-secondary-text hover:text-primary-text hover:border-accent/40 bg-panel',
            )}
          >
            Alle
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className={cn(
                'shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap',
                activeCategory === cat
                  ? 'bg-accent text-white border-accent'
                  : 'border-border text-secondary-text hover:text-primary-text hover:border-accent/40 bg-panel',
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {filteredLessons.length === 0 && filteredFeatured.length === 0 && (
        <div className="text-center py-20 space-y-3">
          <BookOpen className="w-10 h-10 text-meta-text mx-auto" />
          <p className="text-primary-text font-semibold">
            {activeCategory ? `Geen lessen in "${activeCategory}" gevonden` : 'Lessen komen binnenkort'}
          </p>
          <p className="text-secondary-text text-sm max-w-sm mx-auto">
            {activeCategory
              ? 'Probeer een andere categorie of bekijk alle lessen.'
              : 'We zijn de eerste Struq Learn lessen aan het verfijnen. Kom terug of volg ons voor updates.'}
          </p>
          {activeCategory && (
            <button
              onClick={() => setActiveCategory(null)}
              className="text-sm text-accent hover:underline"
            >
              Toon alle lessen
            </button>
          )}
        </div>
      )}

      {/* Featured */}
      {filteredFeatured.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-primary-text">Uitgelichte lessen</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFeatured.map((lesson) => (
              <LearnLessonCard key={lesson.slug} lesson={lesson} featured />
            ))}
          </div>
        </section>
      )}

      {/* All lessons */}
      {filteredLessons.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary-text">
              {activeCategory ? activeCategory : 'Alle lessen'}
            </h2>
            <span className="text-xs text-meta-text">{filteredLessons.length} les{filteredLessons.length !== 1 ? 'sen' : ''}</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLessons.map((lesson) => (
              <LearnLessonCard key={lesson.slug} lesson={lesson} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

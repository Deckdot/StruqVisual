import type { LessonCard } from '@/lib/learning/types';
import Link from 'next/link';
import { Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const DIFFICULTY_STYLES = {
  beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  intermediate: 'bg-accent/10 text-accent border-accent/25',
  advanced: 'bg-violet-500/10 text-violet-400 border-violet-500/25',
};

const DIFFICULTY_LABELS = { beginner: 'Beginner', intermediate: 'Gevorderd', advanced: 'Expert' };

const DIFFICULTY_LEFT_BAR = {
  beginner: 'bg-emerald-500',
  intermediate: 'bg-accent',
  advanced: 'bg-violet-500',
};

interface LessonCardProps {
  lesson: LessonCard;
  featured?: boolean;
  className?: string;
}

export function LearnLessonCard({ lesson, featured, className }: LessonCardProps) {
  return (
    <Link
      href={`/learn/${lesson.slug}`}
      className={cn(
        'group relative flex gap-0 rounded-xl border border-border bg-panel overflow-hidden cursor-pointer',
        'transition-all duration-200 hover:bg-panel-hover hover:border-border hover:-translate-y-px hover:shadow-md',
        featured && 'border-accent/30',
        className,
      )}
    >
      {/* Left difficulty bar */}
      <div className={cn('w-0.5 shrink-0', DIFFICULTY_LEFT_BAR[lesson.difficulty])} />

      {/* Card content */}
      <div className="flex flex-col flex-1 px-4 py-4 min-w-0">
        {/* Top row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-md border', DIFFICULTY_STYLES[lesson.difficulty])}>
            {DIFFICULTY_LABELS[lesson.difficulty]}
          </span>
          <span className="flex items-center gap-1 text-xs text-meta-text shrink-0 tabular-nums">
            <Clock className="w-3 h-3" />
            {lesson.estimatedMinutes}m
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-primary-text mb-1.5 group-hover:text-accent transition-colors duration-200 line-clamp-2 leading-snug text-sm">
          {lesson.title}
        </h3>

        {/* Description */}
        <p className="text-secondary-text text-sm leading-relaxed line-clamp-2 flex-1">
          {lesson.description}
        </p>

        {/* Footer */}
        <div className="mt-4 flex justify-end">
          <ChevronRight className="w-4 h-4 text-meta-text group-hover:text-accent transition-colors duration-200" />
        </div>
      </div>
    </Link>
  );
}

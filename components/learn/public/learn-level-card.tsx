'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { LessonCard } from '@/lib/learning/types';
import type { LevelMeta } from '@/lib/learning/types';
import { useLessonProgress } from '@/hooks/use-lesson-progress';
import { cn } from '@/lib/utils';
import { ArrowRight, Trophy } from 'lucide-react';

const LEVEL_CONFIG: Record<1 | 2 | 3, {
  accentText: string;
  accentBorder: string;
  barFill: string;
  numberTag: string;
  bgImage: string;
  imgPosition: string;
}> = {
  1: {
    accentText: 'text-emerald-300',
    accentBorder: 'border-white/10',
    barFill: 'bg-emerald-400',
    numberTag: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    bgImage: '/level1.jpeg',
    imgPosition: '30%',
  },
  2: {
    accentText: 'text-violet-300',
    accentBorder: 'border-white/10',
    barFill: 'bg-violet-400',
    numberTag: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
    bgImage: '/level2.jpeg',
    imgPosition: '0%',
  },
  3: {
    accentText: 'text-amber-300',
    accentBorder: 'border-white/10',
    barFill: 'bg-amber-400',
    numberTag: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    bgImage: '/level3.jpeg',
    imgPosition: '25%',
  },
};

interface LearnLevelCardProps {
  meta: LevelMeta;
  lessons: LessonCard[];
}

export function LearnLevelCard({ meta, lessons }: LearnLevelCardProps) {
  const { getLevelProgress, isMilestoneUnlocked } = useLessonProgress();
  const { completed, total, percentage } = getLevelProgress(lessons);
  const unlocked = isMilestoneUnlocked(lessons);
  const cfg = LEVEL_CONFIG[meta.level];
  const hasProgress = completed > 0 && total > 0;

  return (
    <Link
      href={`/learn/level/${meta.level}`}
      className={cn(
        'group relative flex flex-col rounded-2xl border overflow-hidden cursor-pointer',
        'aspect-[3/4] transition-all duration-300 hover:-translate-y-1',
        cfg.accentBorder,
        'hover:shadow-[0_8px_40px_0_rgba(0,0,0,0.4)]',
      )}
    >
      {/* Background image with aggressive bottom fade */}
      <div className="absolute inset-0 z-0">
        <Image
          src={cfg.bgImage}
          alt={`Level ${meta.level} background`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ objectPosition: `center ${cfg.imgPosition}` }}
          sizes="(max-width: 640px) 100vw, 33vw"
          priority={meta.level === 1}
        />
        {/* Aggressive fade: image visible top 40%, gone by 75% */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 35%, var(--color-panel) 72%, var(--color-panel) 100%)',
          }}
        />
      </div>

      {/* Top: level tag + completion */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-md backdrop-blur-sm', cfg.numberTag)}>
          Level {meta.level}
        </span>
        {unlocked && (
          <span className={cn('flex items-center gap-1 text-xs font-medium drop-shadow', cfg.accentText)}>
            <Trophy className="w-3 h-3" />
            Voltooid
          </span>
        )}
      </div>

      {/* Bottom: name + goal + arrow */}
      <div className="relative z-10 mt-auto px-4 pb-4 pt-2 space-y-0.5">
        <p className={cn('text-[10px] font-semibold uppercase tracking-widest', cfg.accentText)}>
          {meta.name}
        </p>
        <div className="flex items-end justify-between gap-2">
          <h3 className="text-sm font-semibold text-primary-text leading-snug">
            {meta.goal}
          </h3>
          <ArrowRight className={cn(
            'w-4 h-4 shrink-0 mb-0.5 transition-transform duration-200 group-hover:translate-x-0.5',
            cfg.accentText,
          )} />
        </div>
        {/* Thin progress bar — only shown when in progress */}
        {hasProgress && !unlocked && (
          <div className="h-px bg-white/20 overflow-hidden rounded-full mt-2">
            <div
              className={cn('h-full rounded-full transition-all duration-700', cfg.barFill)}
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}
      </div>
    </Link>
  );
}

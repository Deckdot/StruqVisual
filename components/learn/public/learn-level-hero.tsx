'use client';

import Image from 'next/image';
import type { LessonCard } from '@/lib/learning/types';
import type { LevelMeta } from '@/lib/learning/types';
import { useLessonProgress } from '@/hooks/use-lesson-progress';
import { cn } from '@/lib/utils';
import { Trophy, Target } from 'lucide-react';

const LEVEL_HEADER_IMAGE: Record<1 | 2 | 3, string> = {
  1: '/level1header.jpeg',
  2: '/level2header.jpeg',
  3: '/level3header.jpeg',
};

const LEVEL_VIGNETTE: Record<1 | 2 | 3, string> = {
  1: 'bg-gradient-to-t from-black/80 via-black/50 to-black/20',
  2: 'bg-gradient-to-t from-black/90 via-black/65 to-black/35',
  3: 'bg-gradient-to-t from-black/90 via-black/65 to-black/35',
};

const LEVEL_STYLES: Record<1 | 2 | 3, {
  badge: string;
  bar: string;
  accentText: string;
  milestoneBox: string;
  milestoneUnlocked: string;
  topBar: string;
  dot: string;
}> = {
  1: {
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    bar: 'bg-emerald-500',
    accentText: 'text-emerald-400',
    milestoneBox: 'border-border bg-canvas text-meta-text',
    milestoneUnlocked: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    topBar: 'bg-emerald-500',
    dot: 'bg-emerald-400',
  },
  2: {
    badge: 'bg-violet-500/10 text-violet-400 border-violet-500/25',
    bar: 'bg-violet-500',
    accentText: 'text-violet-400',
    milestoneBox: 'border-border bg-canvas text-meta-text',
    milestoneUnlocked: 'bg-violet-500/10 border-violet-500/30 text-violet-400',
    topBar: 'bg-violet-500',
    dot: 'bg-violet-400',
  },
  3: {
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
    bar: 'bg-amber-500',
    accentText: 'text-amber-400',
    milestoneBox: 'border-border bg-canvas text-meta-text',
    milestoneUnlocked: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    topBar: 'bg-amber-500',
    dot: 'bg-amber-400',
  },
};

const LEVEL_OUTCOMES: Record<1 | 2 | 3, string[]> = {
  1: [
    'Je kunt een volledig AI-project opstarten',
    'Je begrijpt hoe je AI betrouwbaar instrueert',
    'Je kunt je eerste AI-workflow zelfstandig draaien',
  ],
  2: [
    'Je AI-output is consistent en voorspelbaar',
    'Je hebt context- en regelstructuren op orde',
    'Je kunt chaotische AI-sessies vermijden',
  ],
  3: [
    'Je bouwt serieuze producten met AI',
    'Je hebt schaalbare workflows en CI/CD',
    'Je werkt als een professioneel AI-native team',
  ],
};

interface LearnLevelHeroProps {
  meta: LevelMeta;
  lessons: LessonCard[];
}

export function LearnLevelHero({ meta, lessons }: LearnLevelHeroProps) {
  const { getLevelProgress, isMilestoneUnlocked } = useLessonProgress();
  const { completed, total, percentage } = getLevelProgress(lessons);
  const unlocked = isMilestoneUnlocked(lessons);
  const styles = LEVEL_STYLES[meta.level];
  const outcomes = LEVEL_OUTCOMES[meta.level];
  const totalMinutes = lessons.reduce((acc, l) => acc + l.estimatedMinutes, 0);

  const headerImage = LEVEL_HEADER_IMAGE[meta.level];
  const vignette = LEVEL_VIGNETTE[meta.level];

  return (
    <div className="relative border-b border-border overflow-hidden">
      {/* Background image + vignette */}
      <div className="absolute inset-0 z-0">
        <Image
          src={headerImage}
          alt={`Level ${meta.level} header`}
          fill
          className="object-cover object-center"
          priority
        />
        {/* Match card vignette: clear top, dark bottom */}
        <div className={cn('absolute inset-0', vignette)} />
        {/* Side vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.25)_100%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Level badge + name */}
        <div className="flex items-center gap-2.5 mb-8">
          <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-md border backdrop-blur-sm', styles.badge)}>
            Level {meta.level}
          </span>
          <span className={cn('text-xs font-semibold uppercase tracking-widest', styles.accentText)}>{meta.name}</span>
        </div>

        {/* Two-column: headline + outcomes / progress + milestone */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10 mb-10">

          {/* Left */}
          <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight leading-tight drop-shadow">
              {meta.goal}
            </h1>

            <div className="space-y-2.5">
              <p className="text-xs font-medium text-white/50 uppercase tracking-widest">Wat je bereikt</p>
              <ul className="space-y-2">
                {outcomes.map((outcome, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/80 leading-relaxed">
                    <span className={cn('shrink-0 w-1.5 h-1.5 rounded-full mt-1.5', styles.dot)} aria-hidden="true" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-4 text-xs text-white/40 pt-1">
              <span>{total > 0 ? `${total} les${total !== 1 ? 'sen' : ''}` : 'Binnenkort'}</span>
              {totalMinutes > 0 && (
                <span>~{Math.round(totalMinutes / 60 * 10) / 10}u totaal</span>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="space-y-3">
            {total > 0 && (
              <div className="rounded-xl border border-white/10 bg-panel/70 backdrop-blur-sm p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60 font-medium">Voortgang</span>
                  <span className={cn('font-semibold tabular-nums', styles.accentText)}>{percentage}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-700', styles.bar)}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs text-white/40">{completed} van {total} voltooid</p>
              </div>
            )}

            <div className={cn(
              'flex items-start gap-3 rounded-xl border px-4 py-4 backdrop-blur-sm',
              unlocked ? styles.milestoneUnlocked : 'border-white/10 bg-panel/70 text-white/70',
            )}>
              <div className="shrink-0 mt-0.5">
                {unlocked
                  ? <Trophy className="w-4 h-4" />
                  : total === 0
                    ? <Target className="w-4 h-4 opacity-40" />
                    : null
                }
              </div>
              <div>
                <p className="text-xs font-semibold mb-1">
                  {unlocked ? 'Milestone behaald' : 'Level milestone'}
                </p>
                <p className="text-sm italic leading-relaxed">{meta.milestone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Topic chips */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <p className="text-xs font-medium text-white/40 uppercase tracking-widest">Onderwerpen</p>
          <div className="flex flex-wrap gap-2">
            {meta.topics.map((topic) => (
              <span
                key={topic}
                className="text-xs border border-white/10 bg-panel/60 backdrop-blur-sm text-white/70 px-3 py-1 rounded-md"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import type { LessonSceneType } from '@/lib/learning/types';
import { SCENE_TYPE_META } from '@/lib/learning/scene-type-meta';
import { cn } from '@/lib/utils';
import {
  BookOpen, Info, List, CheckSquare, Play, MessageSquare, GitBranch, Layers,
  ArrowDownUp, Crosshair, Sliders, Columns, RefreshCw, Trophy,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen, Info, List, CheckSquare, Play, MessageSquare, GitBranch, Layers,
  ArrowDownUp, Crosshair, Sliders, Columns, RefreshCw, Trophy,
};

interface SceneHeaderProps {
  type: LessonSceneType;
  title: string;
  framing?: string;
  index: number;
  total: number;
  className?: string;
}

export function SceneHeader({ type, title, framing, index, total, className }: SceneHeaderProps) {
  const meta = SCENE_TYPE_META[type];
  const Icon = ICON_MAP[meta.icon] ?? Info;

  return (
    <div className={cn('space-y-3 mb-6', className)}>
      {/* Badge row */}
      <div className="flex items-center justify-between gap-3">
        <div
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold',
            meta.colorClass,
            meta.borderClass,
            meta.bgClass,
          )}
        >
          <Icon className="w-3.5 h-3.5" />
          {meta.label}
        </div>
        <span className="text-xs text-meta-text tabular-nums">
          {index + 1} van {total}
        </span>
      </div>

      {/* Concept headline */}
      <h2 className="text-xl md:text-2xl font-semibold text-primary-text tracking-tight leading-snug">
        {title}
      </h2>

      {/* Framing text */}
      {framing && (
        <p className="text-secondary-text leading-relaxed max-w-2xl">{framing}</p>
      )}
    </div>
  );
}

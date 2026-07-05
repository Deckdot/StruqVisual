import type { LessonCompleteScene } from '@/lib/learning/types';
import { cn } from '@/lib/utils';
import { Trophy, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface LessonCompleteSceneViewProps {
  scene: LessonCompleteScene;
  className?: string;
}

export function LessonCompleteSceneView({ scene, className }: LessonCompleteSceneViewProps) {
  return (
    <div className={cn('space-y-8', className)}>
      {/* Celebration header */}
      <div className="rounded-xl border border-border bg-panel px-6 py-5 space-y-2">
        <div className="flex items-center gap-3">
          <Trophy className="w-5 h-5 text-emerald-400 shrink-0" />
          <h3 className="text-xl font-semibold text-primary-text">{scene.celebrationHeadline}</h3>
        </div>
        <p className="text-sm text-secondary-text pl-8">{scene.identityShift}</p>
      </div>

      {/* Recap — what was learned */}
      <div className="rounded-xl border border-border bg-panel p-5 space-y-3">
        <p className="text-xs font-semibold text-meta-text uppercase tracking-wider">Wat je hebt geleerd</p>
        <ul className="space-y-2.5">
          {scene.recap.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-secondary-text text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Next steps — momentum into next lesson/level */}
      {scene.nextSteps.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-meta-text uppercase tracking-wider">Ga verder</p>
          <div className="space-y-2">
            {scene.nextSteps.map((step, i) => (
              <Link
                key={i}
                href={step.href}
                className="flex items-center gap-3 rounded-xl border border-border bg-panel px-4 py-3.5 text-sm text-secondary-text hover:border-accent/40 hover:text-primary-text hover:bg-panel-hover transition-all group"
              >
                <ArrowRight className="w-4 h-4 text-meta-text group-hover:text-accent transition-colors shrink-0" />
                <span className="font-medium">{step.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

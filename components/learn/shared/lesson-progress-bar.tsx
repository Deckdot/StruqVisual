import { cn } from '@/lib/utils';

interface LessonProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function LessonProgressBar({ current, total, className }: LessonProgressBarProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex-1 flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-all duration-300',
              i < current
                ? 'bg-accent'
                : i === current
                  ? 'bg-accent/40'
                  : 'bg-border',
            )}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-meta-text shrink-0 tabular-nums">
        {current + 1} / {total}
      </span>
    </div>
  );
}

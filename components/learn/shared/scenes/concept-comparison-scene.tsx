import type { ConceptComparisonScene } from '@/lib/learning/types';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';

interface ConceptComparisonSceneViewProps {
  scene: ConceptComparisonScene;
  className?: string;
}

export function ConceptComparisonSceneView({ scene, className }: ConceptComparisonSceneViewProps) {
  const isCode = scene.comparisonType === 'code';

  return (
    <div className={cn('space-y-6', className)}>
      {/* Side by side comparison */}
      <div className="grid gap-4 md:grid-cols-2">
        {[scene.left, scene.right].map((side) => (
          <div
            key={side.label}
            className={cn(
              'rounded-xl border p-5 space-y-3',
              side.isPreferred
                ? 'border-emerald-500/30 bg-emerald-500/5'
                : 'border-red-400/30 bg-red-400/5',
            )}
          >
            {/* Side label */}
            <div className="flex items-center gap-2">
              {side.isPreferred
                ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                : <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
              <span className={cn(
                'text-xs font-semibold uppercase tracking-wider',
                side.isPreferred ? 'text-emerald-400' : 'text-red-400',
              )}>
                {side.label}
              </span>
            </div>

            {/* Content */}
            {isCode ? (
              <pre className="bg-canvas rounded-lg p-4 text-xs font-mono text-primary-text overflow-x-auto leading-relaxed whitespace-pre-wrap">
                <code>{side.content}</code>
              </pre>
            ) : (
              <p className="text-secondary-text text-sm leading-relaxed">{side.content}</p>
            )}

            {/* Annotation */}
            {side.annotation && (
              <p className={cn(
                'text-xs rounded-r-md border border-border bg-panel/60 pl-3 leading-relaxed',
                side.isPreferred
                  ? 'border-emerald-500/40 text-emerald-400/80'
                  : 'border-red-400/40 text-red-400/80',
              )}>
                {side.annotation}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Insight */}
      <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 flex items-start gap-3">
        <span className="text-accent text-base shrink-0">💡</span>
        <p className="text-secondary-text text-sm leading-relaxed">{scene.insight}</p>
      </div>

      {/* Takeaway */}
      <div className="rounded-xl border border-border bg-panel px-5 py-4">
        <p className="text-xs font-semibold text-meta-text uppercase tracking-wider mb-1">Conclusie</p>
        <p className="text-secondary-text text-sm">{scene.takeaway}</p>
      </div>
    </div>
  );
}

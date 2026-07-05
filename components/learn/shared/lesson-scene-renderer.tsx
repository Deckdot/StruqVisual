import type {
  LessonScene,
  LessonIntroScene,
  ExplanationScene,
  RulesPatternsScene,
  WorkflowBreakdownScene,
  ArchitectureReviewScene,
  ReflectionScene,
  SequencingScene,
  DecisionSimScene,
  ParameterTuningScene,
  ConceptComparisonScene,
  ErrorIterationScene,
  LessonCompleteScene,
} from '@/lib/learning/types';
import { QuizSceneView } from './scenes/quiz-scene';
import { InteractiveHtmlFrame } from './interactive-html-frame';
import { SequencingSceneView } from './scenes/sequencing-scene';
import { DecisionSimSceneView } from './scenes/decision-sim-scene';
import { ParameterTuningSceneView } from './scenes/parameter-tuning-scene';
import { ConceptComparisonSceneView } from './scenes/concept-comparison-scene';
import { ErrorIterationSceneView } from './scenes/error-iteration-scene';
import { LessonCompleteSceneView } from './scenes/lesson-complete-scene';
import { SceneHeader } from './scene-header';
import { cn } from '@/lib/utils';
import { Lightbulb, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

function Callout({ type, text }: { type: 'tip' | 'warning' | 'insight'; text: string }) {
  const styles = {
    tip: { icon: Lightbulb, cls: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
    warning: { icon: AlertTriangle, cls: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
    insight: { icon: Info, cls: 'bg-accent/10 border-accent/30 text-accent' },
  };
  const { icon: Icon, cls } = styles[type];
  return (
    <div className={cn('flex items-start gap-3 rounded-xl border p-4 text-sm mt-4', cls)}>
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <p>{text}</p>
    </div>
  );
}

function IntroScene({ scene }: { scene: LessonIntroScene }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6">
        <p className="text-lg text-primary-text font-medium leading-relaxed">{scene.hook}</p>
      </div>
      <p className="text-secondary-text leading-relaxed">{scene.overview}</p>
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-meta-text uppercase tracking-wider">Wat je leert</h4>
        <ul className="space-y-2">
          {scene.whatYouWillLearn.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-secondary-text text-sm">
              <CheckCircle className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-accent/20 bg-accent/5 px-5 py-4 flex items-start gap-3">
        <span className="text-accent text-base shrink-0">💡</span>
        <div>
          <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Waarom dit belangrijk is</p>
          <p className="text-secondary-text text-sm">{scene.whyItMatters}</p>
        </div>
      </div>
    </div>
  );
}

function ExplanScene({ scene }: { scene: ExplanationScene }) {
  return (
    <div className="space-y-5">
      <div className="text-secondary-text leading-relaxed whitespace-pre-wrap">{scene.body}</div>
      {scene.analogy && (
        <div className="rounded-xl border border-border bg-panel px-5 py-4 flex items-start gap-3">
          <span className="text-meta-text shrink-0">🔁</span>
          <div>
            <p className="text-xs font-semibold text-meta-text uppercase tracking-wider mb-1">Analogie</p>
            <p className="text-secondary-text text-sm italic">{scene.analogy}</p>
          </div>
        </div>
      )}
      {scene.codeExample && (
        <div className="rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-canvas">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-border" />
              <div className="w-2.5 h-2.5 rounded-full bg-border" />
              <div className="w-2.5 h-2.5 rounded-full bg-border" />
            </div>
            <span className="text-xs text-meta-text font-mono">voorbeeld</span>
          </div>
          <pre className="bg-canvas p-5 overflow-x-auto text-sm font-mono text-primary-text">
            <code>{scene.codeExample}</code>
          </pre>
        </div>
      )}
      {scene.keyPoints.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-meta-text uppercase tracking-wider">Kernpunten</p>
          <ul className="space-y-2.5">
            {scene.keyPoints.map((p, i) => (
              <li key={i} className="flex items-start gap-3 text-secondary-text text-sm">
                <span className="w-5 h-5 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}
      {scene.callout && <Callout type={scene.callout.type} text={scene.callout.text} />}
    </div>
  );
}

function RulesScene({ scene }: { scene: RulesPatternsScene }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {scene.rules.map((rule) => (
          <div key={rule.id} className="rounded-xl border border-border bg-panel p-4 space-y-2 ring-1 ring-accent/10">
            <p className="font-semibold text-primary-text text-sm">{rule.title}</p>
            <p className="text-secondary-text text-xs leading-relaxed">{rule.description}</p>
            {rule.example && (
              <code className="block text-xs font-mono bg-canvas rounded px-2 py-1.5 text-accent">{rule.example}</code>
            )}
          </div>
        ))}
      </div>
      {scene.antiPatterns && scene.antiPatterns.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-meta-text uppercase tracking-wider">Anti-patronen</h4>
          {scene.antiPatterns.map((ap) => (
            <div key={ap.id} className="rounded-xl border border-red-400/20 bg-red-400/5 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="font-semibold text-primary-text text-sm">{ap.title}</p>
              </div>
              <p className="text-secondary-text text-xs">{ap.problem}</p>
              <div className="flex items-start gap-2 text-emerald-400 text-xs">
                <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{ap.fix}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-secondary-text text-sm italic">{scene.summary}</p>
    </div>
  );
}

function WorkflowScene({ scene }: { scene: WorkflowBreakdownScene }) {
  return (
    <div className="space-y-6">
      <p className="text-secondary-text leading-relaxed">{scene.overview}</p>
      <div className="space-y-4">
        {scene.steps.map((step) => (
          <div key={step.id} className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-accent/20 text-accent text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
              {step.order}
            </div>
            <div className="space-y-1.5 flex-1 pt-1 pb-2 border-b border-border last:border-b-0">
              <p className="font-semibold text-primary-text text-sm">{step.title}</p>
              <p className="text-secondary-text text-xs leading-relaxed">{step.description}</p>
              {step.toolOrTechnique && (
                <span className="inline-block text-xs bg-accent/10 text-accent px-2 py-0.5 rounded">{step.toolOrTechnique}</span>
              )}
              {step.pitfall && (
                <p className="text-xs text-amber-400 flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3" />
                  {step.pitfall}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {scene.commonMistakes.length > 0 && (
          <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-4 space-y-2">
            <p className="text-xs font-semibold text-meta-text uppercase tracking-wider">Veel gemaakte fouten</p>
            <ul className="space-y-1.5">
              {scene.commonMistakes.map((m, i) => (
                <li key={i} className="text-xs text-secondary-text flex items-start gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" /> {m}
                </li>
              ))}
            </ul>
          </div>
        )}
        {scene.bestPractices.length > 0 && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
            <p className="text-xs font-semibold text-meta-text uppercase tracking-wider">Best practices</p>
            <ul className="space-y-1.5">
              {scene.bestPractices.map((b, i) => (
                <li key={i} className="text-xs text-secondary-text flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" /> {b}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {scene.tradeoffs && (
        <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 flex items-start gap-3">
          <span className="text-accent text-base shrink-0">⚖️</span>
          <div>
            <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Afwegingen</p>
            <p className="text-secondary-text text-sm">{scene.tradeoffs}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ArchScene({ scene }: { scene: ArchitectureReviewScene }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-canvas px-5 py-4">
        <p className="text-xs font-semibold text-meta-text uppercase tracking-wider mb-2">Scenario</p>
        <p className="text-secondary-text text-sm leading-relaxed">{scene.scenario}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {scene.components.map((c) => (
          <div key={c.id} className="rounded-xl border border-border bg-panel p-4 space-y-2">
            <p className="font-semibold text-primary-text text-sm">{c.name}</p>
            <p className="text-xs text-secondary-text">{c.role}</p>
            <div className="flex flex-wrap gap-1">
              {c.goodFor.map((g, i) => (
                <span key={i} className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">{g}</span>
              ))}
            </div>
            {c.watchOut && (
              <p className="text-xs text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {c.watchOut}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
          <p className="text-xs font-semibold text-meta-text uppercase tracking-wider">Goede patronen</p>
          <ul className="space-y-1.5">{scene.goodPatterns.map((p, i) => (
            <li key={i} className="text-xs text-secondary-text flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />{p}</li>
          ))}</ul>
        </div>
        <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-4 space-y-2">
          <p className="text-xs font-semibold text-meta-text uppercase tracking-wider">Slechte patronen</p>
          <ul className="space-y-1.5">{scene.badPatterns.map((p, i) => (
            <li key={i} className="text-xs text-secondary-text flex items-start gap-1.5"><XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />{p}</li>
          ))}</ul>
        </div>
      </div>
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
        <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">Conclusie</p>
        <p className="text-primary-text text-sm leading-relaxed">{scene.verdict}</p>
      </div>
      {scene.upgradeIdeas && scene.upgradeIdeas.length > 0 && (
        <div className="rounded-xl border border-border bg-panel p-4 space-y-2">
          <p className="text-xs font-semibold text-meta-text uppercase tracking-wider">Verbeterideeën</p>
          <ul className="space-y-1.5">
            {scene.upgradeIdeas.map((idea, i) => (
              <li key={i} className="text-xs text-secondary-text flex items-start gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" /> {idea}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ReflScene({ scene }: { scene: ReflectionScene }) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6">
        <p className="text-primary-text font-medium leading-relaxed">{scene.prompt}</p>
      </div>
      {scene.guidingQuestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-meta-text uppercase tracking-wider">Richtvragen</p>
          <ul className="space-y-2.5">
            {scene.guidingQuestions.map((q, i) => (
              <li key={i} className="text-sm text-secondary-text pl-4 rounded-r-md border border-border bg-panel/60">{q}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="rounded-xl border border-accent/20 bg-accent/5 px-5 py-4 flex items-start gap-3">
        <span className="text-accent text-base shrink-0">💡</span>
        <div>
          <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Conclusie</p>
          <p className="text-secondary-text text-sm">{scene.takeaway}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main renderer ────────────────────────────────────────────
interface LessonSceneRendererProps {
  scene: LessonScene;
  index: number;
  total?: number;
  showHeader?: boolean;
  onNext?: () => void;
  className?: string;
}

export function LessonSceneRenderer({ scene, index, total = 1, showHeader = true, onNext, className }: LessonSceneRendererProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {showHeader && (
        <SceneHeader
          type={scene.type}
          title={scene.title}
          index={index}
          total={total}
        />
      )}

      {scene.type === 'lesson_intro' && <IntroScene scene={scene as LessonIntroScene} />}
      {scene.type === 'explanation' && <ExplanScene scene={scene as ExplanationScene} />}
      {scene.type === 'rules_patterns' && <RulesScene scene={scene as RulesPatternsScene} />}
      {scene.type === 'quiz' && <QuizSceneView scene={scene} onNext={onNext} />}
      {scene.type === 'interactive_html' && <InteractiveHtmlFrame scene={scene} />}
      {scene.type === 'reflection' && <ReflScene scene={scene as ReflectionScene} />}
      {scene.type === 'workflow_breakdown' && <WorkflowScene scene={scene as WorkflowBreakdownScene} />}
      {scene.type === 'architecture_review' && <ArchScene scene={scene as ArchitectureReviewScene} />}
      {scene.type === 'sequencing' && <SequencingSceneView scene={scene as SequencingScene} onNext={onNext} />}
      {scene.type === 'decision_sim' && <DecisionSimSceneView scene={scene as DecisionSimScene} onNext={onNext} />}
      {scene.type === 'parameter_tuning' && <ParameterTuningSceneView scene={scene as ParameterTuningScene} />}
      {scene.type === 'concept_comparison' && <ConceptComparisonSceneView scene={scene as ConceptComparisonScene} />}
      {scene.type === 'error_iteration' && <ErrorIterationSceneView scene={scene as ErrorIterationScene} />}
      {scene.type === 'lesson_complete' && <LessonCompleteSceneView scene={scene as LessonCompleteScene} />}
    </div>
  );
}

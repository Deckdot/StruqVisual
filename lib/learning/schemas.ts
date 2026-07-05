import { z } from 'zod';

// ─── Enums ────────────────────────────────────────────────────
export const SkillLevelSchema = z.enum(['beginner', 'intermediate', 'advanced']);
export const LessonLengthSchema = z.enum(['short', 'medium', 'long']);
export const LearningModeSchema = z.enum([
  'practical',
  'visual',
  'beginner-friendly',
  'architecture-focused',
  'workflow-focused',
  'agentic',
]);

export const LessonSceneTypeSchema = z.enum([
  'lesson_intro',
  'explanation',
  'rules_patterns',
  'quiz',
  'interactive_html',
  'reflection',
  'workflow_breakdown',
  'architecture_review',
  'sequencing',
  'decision_sim',
  'parameter_tuning',
  'concept_comparison',
  'error_iteration',
  'lesson_complete',
]);

// ─── Brief input ──────────────────────────────────────────────
export const ManualSourceSchema = z.object({
  url: z.string().url().optional(),
  title: z.string().min(1),
  excerpt: z.string().optional(),
});

export const LessonBriefInputSchema = z.object({
  topic: z.string().min(3).max(200),
  skillLevel: SkillLevelSchema,
  lessonLength: LessonLengthSchema,
  learningModes: z.array(LearningModeSchema).min(1).max(6),
  sourceMaterial: z.string().max(10000).optional(),
  manualSources: z.array(ManualSourceSchema).max(10).optional(),
  researchOnlineFirst: z.boolean(),
  batchTopics: z.array(z.string().min(3).max(200)).max(10).optional(),
  editorialNotes: z.string().max(2000).optional(),
});

// ─── Research ─────────────────────────────────────────────────
export const ResearchFindingSchema = z.object({
  title: z.string(),
  url: z.string().url().optional(),
  excerpt: z.string(),
  relevanceNote: z.string().optional(),
});

export const ResearchSummarySchema = z.object({
  query: z.string(),
  findings: z.array(ResearchFindingSchema),
  synthesized: z.string(),
  cautionFlags: z.array(z.string()),
  generatedAt: z.string(),
  provider: z.string(),
});

// ─── Outline ──────────────────────────────────────────────────
export const OutlineSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  intent: z.string(),
  suggestedType: LessonSceneTypeSchema,
  estimatedMinutes: z.number().min(1).max(60),
});

export const LessonOutlineSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  summary: z.string(),
  objectives: z.array(z.string()).min(1).max(8),
  sections: z.array(OutlineSectionSchema).min(1).max(20),
  totalMinutes: z.number().min(1),
  difficulty: SkillLevelSchema,
  tags: z.array(z.string()).max(10),
});

// ─── Scenes ───────────────────────────────────────────────────
const BaseSceneSchema = z.object({
  id: z.string(),
  title: z.string(),
  learningObjectives: z.array(z.string()),
  estimatedMinutes: z.number().min(1).max(60),
});

export const LessonIntroSceneSchema = BaseSceneSchema.extend({
  type: z.literal('lesson_intro'),
  hook: z.string(),
  overview: z.string(),
  whatYouWillLearn: z.array(z.string()),
  whyItMatters: z.string(),
});

export const ExplanationSceneSchema = BaseSceneSchema.extend({
  type: z.literal('explanation'),
  body: z.string(),
  keyPoints: z.array(z.string()),
  analogy: z.string().optional(),
  codeExample: z.string().optional(),
  callout: z
    .object({ type: z.enum(['tip', 'warning', 'insight']), text: z.string() })
    .optional(),
});

export const RuleItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  example: z.string().optional(),
  category: z.string().optional(),
});

export const AntiPatternSchema = z.object({
  id: z.string(),
  title: z.string(),
  problem: z.string(),
  fix: z.string(),
});

export const RulesPatternsSceneSchema = BaseSceneSchema.extend({
  type: z.literal('rules_patterns'),
  rules: z.array(RuleItemSchema).min(1).max(12),
  antiPatterns: z.array(AntiPatternSchema).max(8).optional(),
  summary: z.string(),
});

export const QuizChoiceSchema = z.object({
  id: z.string(),
  text: z.string(),
  isCorrect: z.boolean(),
});

export const QuizQuestionSchema = z.object({
  id: z.string(),
  type: z.enum(['single_choice', 'multiple_choice', 'short_answer']),
  question: z.string(),
  choices: z.array(QuizChoiceSchema).min(2).max(6).optional(),
  correctAnswer: z.string().optional(),
  explanation: z.string(),
  points: z.number().min(1).max(10),
});

export const QuizSceneSchema = BaseSceneSchema.extend({
  type: z.literal('quiz'),
  instructions: z.string(),
  questions: z.array(QuizQuestionSchema).min(1).max(20),
  passingScore: z.number().min(0).max(100),
  showExplanationsImmediately: z.boolean(),
});

export const InteractiveHtmlSceneSchema = BaseSceneSchema.extend({
  type: z.literal('interactive_html'),
  exerciseType: z.enum([
    'matching',
    'drag-drop',
    'sequencing',
    'flashcards',
    'workflow-mapping',
    'sorting',
    'spot-the-bug',
    'fill-in-blank',
    'custom',
  ]),
  instructions: z.string(),
  htmlPayload: z.string().max(50000),
  fallbackText: z.string(),
  sandboxNote: z.string().optional(),
});

export const ReflectionSceneSchema = BaseSceneSchema.extend({
  type: z.literal('reflection'),
  prompt: z.string(),
  guidingQuestions: z.array(z.string()),
  takeaway: z.string(),
});

export const WorkflowStepSchema = z.object({
  id: z.string(),
  order: z.number(),
  title: z.string(),
  description: z.string(),
  toolOrTechnique: z.string().optional(),
  pitfall: z.string().optional(),
});

export const WorkflowBreakdownSceneSchema = BaseSceneSchema.extend({
  type: z.literal('workflow_breakdown'),
  overview: z.string(),
  steps: z.array(WorkflowStepSchema).min(2).max(15),
  commonMistakes: z.array(z.string()),
  bestPractices: z.array(z.string()),
  tradeoffs: z.string().optional(),
});

export const ArchitectureComponentSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  goodFor: z.array(z.string()),
  watchOut: z.string().optional(),
});

export const ArchitectureReviewSceneSchema = BaseSceneSchema.extend({
  type: z.literal('architecture_review'),
  scenario: z.string(),
  components: z.array(ArchitectureComponentSchema),
  goodPatterns: z.array(z.string()),
  badPatterns: z.array(z.string()),
  verdict: z.string(),
  upgradeIdeas: z.array(z.string()).optional(),
});

// ─── New interactive scene schemas ────────────────────────────

export const SequencingBlockSchema = z.object({
  id: z.string(),
  label: z.string(),
  code: z.string().optional(),
  description: z.string(),
});

export const SequencingSceneSchema = BaseSceneSchema.extend({
  type: z.literal('sequencing'),
  instructions: z.string(),
  blocks: z.array(SequencingBlockSchema).min(2).max(10),
  correctOrder: z.array(z.string()),
  executionPreview: z.string(),
  insight: z.string(),
});

export const DecisionChoiceSchema = z.object({
  id: z.string(),
  label: z.string(),
  consequence: z.string(),
  isOptimal: z.boolean(),
  reasoning: z.string(),
});

export const DecisionRoundSchema = z.object({
  id: z.string(),
  scenarioText: z.string(),
  choices: z.array(DecisionChoiceSchema).min(2).max(5),
  outcomeExplanation: z.string(),
});

export const DecisionSimSceneSchema = BaseSceneSchema.extend({
  type: z.literal('decision_sim'),
  setup: z.string(),
  rounds: z.array(DecisionRoundSchema).min(1).max(8),
  insight: z.string(),
});

export const ParameterControlSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['slider', 'toggle', 'select']),
  defaultValue: z.union([z.number(), z.boolean(), z.string()]),
  options: z.array(z.string()).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  description: z.string(),
});

export const ParameterTuningSceneSchema = BaseSceneSchema.extend({
  type: z.literal('parameter_tuning'),
  setup: z.string(),
  controls: z.array(ParameterControlSchema).min(1).max(8),
  outputTemplate: z.string(),
  insight: z.string(),
});

export const ComparisonSideSchema = z.object({
  label: z.string(),
  content: z.string(),
  annotation: z.string().optional(),
  isPreferred: z.boolean(),
});

export const ConceptComparisonSceneSchema = BaseSceneSchema.extend({
  type: z.literal('concept_comparison'),
  comparisonType: z.enum(['code', 'text', 'workflow']),
  left: ComparisonSideSchema,
  right: ComparisonSideSchema,
  insight: z.string(),
  takeaway: z.string(),
});

export const ErrorIterationSchema = z.object({
  id: z.string(),
  errorMessage: z.string(),
  diagnosis: z.string(),
  fix: z.string(),
  fixedResult: z.string(),
});

export const ErrorIterationSceneSchema = BaseSceneSchema.extend({
  type: z.literal('error_iteration'),
  setup: z.string(),
  iterations: z.array(ErrorIterationSchema).min(1).max(5),
  insight: z.string(),
  reassurance: z.string(),
});

export const LessonCompleteSceneSchema = BaseSceneSchema.extend({
  type: z.literal('lesson_complete'),
  celebrationHeadline: z.string(),
  recap: z.array(z.string()).min(1).max(10),
  identityShift: z.string(),
  nextSteps: z.array(z.object({ label: z.string(), href: z.string() })).max(5),
});

export const LessonSceneSchema = z.discriminatedUnion('type', [
  LessonIntroSceneSchema,
  ExplanationSceneSchema,
  RulesPatternsSceneSchema,
  QuizSceneSchema,
  InteractiveHtmlSceneSchema,
  ReflectionSceneSchema,
  WorkflowBreakdownSceneSchema,
  ArchitectureReviewSceneSchema,
  SequencingSceneSchema,
  DecisionSimSceneSchema,
  ParameterTuningSceneSchema,
  ConceptComparisonSceneSchema,
  ErrorIterationSceneSchema,
  LessonCompleteSceneSchema,
]);

// ─── Draft package ────────────────────────────────────────────
export const LessonDraftPackageSchema = z.object({
  id: z.string(),
  brief: LessonBriefInputSchema,
  research: ResearchSummarySchema.optional(),
  outline: LessonOutlineSchema,
  scenes: z.array(LessonSceneSchema),
  generatedAt: z.string(),
  providerUsed: z.string(),
  editorialNotes: z.string().optional(),
});

// ─── Published lesson ─────────────────────────────────────────
export const PublishedLessonSeoSchema = z.object({
  metaTitle: z.string(),
  metaDescription: z.string(),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
  keywords: z.array(z.string()),
});

export const PublishedLessonCtaSchema = z.object({
  headline: z.string(),
  body: z.string(),
  buttonText: z.string(),
  buttonHref: z.string(),
});

export const PublishedLessonSchema = z.object({
  slug: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string(),
  summary: z.string(),
  tags: z.array(z.string()),
  category: z.string(),
  difficulty: SkillLevelSchema,
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  estimatedMinutes: z.number().min(1),
  publishedAt: z.string(),
  updatedAt: z.string().optional(),
  author: z.string().optional(),
  featured: z.boolean().optional(),
  lang: z.enum(['nl', 'en']),
  seo: PublishedLessonSeoSchema,
  cta: PublishedLessonCtaSchema,
  scenes: z.array(LessonSceneSchema),
});

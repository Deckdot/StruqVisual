// ============================================================
// Struq Learn — Core Type Definitions
// ============================================================
// Shared between admin generation studio and public reader.

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export type LessonLevel = 1 | 2 | 3;

export interface LevelMeta {
  level: LessonLevel;
  name: string;
  goal: string;
  milestone: string;
  color: string;
  topics: string[];
}

export type LearningMode =
  | 'practical'
  | 'visual'
  | 'beginner-friendly'
  | 'architecture-focused'
  | 'workflow-focused'
  | 'agentic';

export type LessonLength = 'short' | 'medium' | 'long';

// ─── Admin generation input ───────────────────────────────────
export interface ManualSource {
  url?: string;
  title: string;
  excerpt?: string;
}

export interface LessonBriefInput {
  topic: string;
  skillLevel: SkillLevel;
  lessonLength: LessonLength;
  learningModes: LearningMode[];
  sourceMaterial?: string;
  manualSources?: ManualSource[];
  researchOnlineFirst: boolean;
  batchTopics?: string[];
  editorialNotes?: string;
}

// ─── Research layer ───────────────────────────────────────────
export interface ResearchFinding {
  title: string;
  url?: string;
  excerpt: string;
  relevanceNote?: string;
}

export interface ResearchSummary {
  query: string;
  findings: ResearchFinding[];
  synthesized: string;
  cautionFlags: string[];
  generatedAt: string;
  provider: string;
}

// ─── Outline ──────────────────────────────────────────────────
export type LessonSceneType =
  | 'lesson_intro'
  | 'explanation'
  | 'rules_patterns'
  | 'quiz'
  | 'interactive_html'
  | 'reflection'
  | 'workflow_breakdown'
  | 'architecture_review'
  | 'sequencing'
  | 'decision_sim'
  | 'parameter_tuning'
  | 'concept_comparison'
  | 'error_iteration'
  | 'lesson_complete';

export interface OutlineSection {
  id: string;
  title: string;
  intent: string;
  suggestedType: LessonSceneType;
  estimatedMinutes: number;
}

export interface LessonOutline {
  title: string;
  subtitle?: string;
  summary: string;
  objectives: string[];
  sections: OutlineSection[];
  totalMinutes: number;
  difficulty: SkillLevel;
  tags: string[];
}

// ─── Base scene ───────────────────────────────────────────────
export interface BaseScene {
  id: string;
  type: LessonSceneType;
  title: string;
  learningObjectives: string[];
  estimatedMinutes: number;
}

export interface LessonIntroScene extends BaseScene {
  type: 'lesson_intro';
  hook: string;
  overview: string;
  whatYouWillLearn: string[];
  whyItMatters: string;
}

export interface ExplanationScene extends BaseScene {
  type: 'explanation';
  body: string;
  keyPoints: string[];
  analogy?: string;
  codeExample?: string;
  callout?: { type: 'tip' | 'warning' | 'insight'; text: string };
}

export interface RuleItem {
  id: string;
  title: string;
  description: string;
  example?: string;
  category?: string;
}

export interface AntiPattern {
  id: string;
  title: string;
  problem: string;
  fix: string;
}

export interface RulesPatternsScene extends BaseScene {
  type: 'rules_patterns';
  rules: RuleItem[];
  antiPatterns?: AntiPattern[];
  summary: string;
}

export type QuizQuestionType = 'single_choice' | 'multiple_choice' | 'short_answer';

export interface QuizChoice {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  question: string;
  choices?: QuizChoice[];
  correctAnswer?: string;
  explanation: string;
  points: number;
}

export interface QuizScene extends BaseScene {
  type: 'quiz';
  instructions: string;
  questions: QuizQuestion[];
  passingScore: number;
  showExplanationsImmediately: boolean;
}

export type InteractiveExerciseType =
  | 'matching'
  | 'drag-drop'
  | 'sequencing'
  | 'flashcards'
  | 'workflow-mapping'
  | 'sorting'
  | 'spot-the-bug'
  | 'fill-in-blank'
  | 'custom';

export interface InteractiveHtmlScene extends BaseScene {
  type: 'interactive_html';
  exerciseType: InteractiveExerciseType;
  instructions: string;
  htmlPayload: string;
  fallbackText: string;
  sandboxNote?: string;
}

export interface ReflectionScene extends BaseScene {
  type: 'reflection';
  prompt: string;
  guidingQuestions: string[];
  takeaway: string;
}

export interface WorkflowStep {
  id: string;
  order: number;
  title: string;
  description: string;
  toolOrTechnique?: string;
  pitfall?: string;
}

export interface WorkflowBreakdownScene extends BaseScene {
  type: 'workflow_breakdown';
  overview: string;
  steps: WorkflowStep[];
  commonMistakes: string[];
  bestPractices: string[];
  tradeoffs?: string;
}

export interface ArchitectureComponent {
  id: string;
  name: string;
  role: string;
  goodFor: string[];
  watchOut?: string;
}

export interface ArchitectureReviewScene extends BaseScene {
  type: 'architecture_review';
  scenario: string;
  components: ArchitectureComponent[];
  goodPatterns: string[];
  badPatterns: string[];
  verdict: string;
  upgradeIdeas?: string[];
}

// ─── Sequencing scene ────────────────────────────────────────
export interface SequencingBlock {
  id: string;
  label: string;
  code?: string;
  description: string;
}

export interface SequencingScene extends BaseScene {
  type: 'sequencing';
  instructions: string;
  blocks: SequencingBlock[];
  correctOrder: string[];
  executionPreview: string;
  insight: string;
}

// ─── Decision simulation scene ───────────────────────────────
export interface DecisionChoice {
  id: string;
  label: string;
  consequence: string;
  isOptimal: boolean;
  reasoning: string;
}

export interface DecisionRound {
  id: string;
  scenarioText: string;
  choices: DecisionChoice[];
  outcomeExplanation: string;
}

export interface DecisionSimScene extends BaseScene {
  type: 'decision_sim';
  setup: string;
  rounds: DecisionRound[];
  insight: string;
}

// ─── Parameter tuning scene ──────────────────────────────────
export type ParameterControlType = 'slider' | 'toggle' | 'select';

export interface ParameterControl {
  id: string;
  label: string;
  type: ParameterControlType;
  defaultValue: number | boolean | string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  description: string;
}

export interface ParameterTuningScene extends BaseScene {
  type: 'parameter_tuning';
  setup: string;
  controls: ParameterControl[];
  outputTemplate: string;
  insight: string;
}

// ─── Concept comparison scene ────────────────────────────────
export interface ComparisonSide {
  label: string;
  content: string;
  annotation?: string;
  isPreferred: boolean;
}

export interface ConceptComparisonScene extends BaseScene {
  type: 'concept_comparison';
  comparisonType: 'code' | 'text' | 'workflow';
  left: ComparisonSide;
  right: ComparisonSide;
  insight: string;
  takeaway: string;
}

// ─── Error iteration scene ───────────────────────────────────
export interface ErrorIteration {
  id: string;
  errorMessage: string;
  diagnosis: string;
  fix: string;
  fixedResult: string;
}

export interface ErrorIterationScene extends BaseScene {
  type: 'error_iteration';
  setup: string;
  iterations: ErrorIteration[];
  insight: string;
  reassurance: string;
}

// ─── Lesson complete scene ───────────────────────────────────
export interface LessonCompleteScene extends BaseScene {
  type: 'lesson_complete';
  celebrationHeadline: string;
  recap: string[];
  identityShift: string;
  nextSteps: { label: string; href: string }[];
}

// ─── Scene union ─────────────────────────────────────────────
export type LessonScene =
  | LessonIntroScene
  | ExplanationScene
  | RulesPatternsScene
  | QuizScene
  | InteractiveHtmlScene
  | ReflectionScene
  | WorkflowBreakdownScene
  | ArchitectureReviewScene
  | SequencingScene
  | DecisionSimScene
  | ParameterTuningScene
  | ConceptComparisonScene
  | ErrorIterationScene
  | LessonCompleteScene;

// ─── Draft package (admin only) ───────────────────────────────
export interface LessonDraftPackage {
  id: string;
  brief: LessonBriefInput;
  research?: ResearchSummary;
  outline: LessonOutline;
  scenes: LessonScene[];
  generatedAt: string;
  providerUsed: string;
  editorialNotes?: string;
}

// ─── Published lesson (public) ────────────────────────────────
export interface PublishedLessonSeo {
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  canonicalUrl?: string;
  keywords: string[];
}

export interface PublishedLessonCta {
  headline: string;
  body: string;
  buttonText: string;
  buttonHref: string;
}

export interface PublishedLesson {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  summary: string;
  tags: string[];
  category: string;
  difficulty: SkillLevel;
  level?: LessonLevel;
  estimatedMinutes: number;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  featured?: boolean;
  lang: 'nl' | 'en';
  seo: PublishedLessonSeo;
  cta: PublishedLessonCta;
  scenes: LessonScene[];
}

export interface LessonCard {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  tags: string[];
  category: string;
  difficulty: SkillLevel;
  level?: LessonLevel;
  estimatedMinutes: number;
  publishedAt: string;
  updatedAt?: string;
  featured?: boolean;
  lang: 'nl' | 'en';
  sceneCount: number;
  sceneTypes: LessonSceneType[];
}

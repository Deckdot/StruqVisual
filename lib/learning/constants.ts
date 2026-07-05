import type { SkillLevel, LessonLength, LearningMode, LessonSceneType } from './types';

import type { LevelMeta } from './types';

export const LESSON_LENGTH_MINUTES: Record<LessonLength, { min: number; max: number; target: number }> = {
  short: { min: 5, max: 12, target: 8 },
  medium: { min: 12, max: 25, target: 18 },
  long: { min: 25, max: 50, target: 35 },
};

export const SKILL_LEVEL_LABELS: Record<SkillLevel, { en: string; nl: string; description: string }> = {
  beginner: {
    en: 'Beginner',
    nl: 'Beginner',
    description: 'New to the topic; no prior experience assumed',
  },
  intermediate: {
    en: 'Intermediate',
    nl: 'Gevorderd',
    description: 'Familiar with basics; ready for depth and nuance',
  },
  advanced: {
    en: 'Advanced',
    nl: 'Expert',
    description: 'Strong foundation; looking for edge cases and architecture patterns',
  },
};

export const LEARNING_MODE_LABELS: Record<LearningMode, { en: string; nl: string }> = {
  practical: { en: 'Practical', nl: 'Praktisch' },
  visual: { en: 'Visual', nl: 'Visueel' },
  'beginner-friendly': { en: 'Beginner-Friendly', nl: 'Beginnersvriendelijk' },
  'architecture-focused': { en: 'Architecture-Focused', nl: 'Architectuurgericht' },
  'workflow-focused': { en: 'Workflow-Focused', nl: 'Workflowgericht' },
  agentic: { en: 'Agentic', nl: 'Agentisch' },
};

export const SCENE_TYPE_LABELS: Record<LessonSceneType, string> = {
  lesson_intro: 'Intro',
  explanation: 'Explanation',
  rules_patterns: 'Rules & Patterns',
  quiz: 'Quiz',
  interactive_html: 'Interactive Exercise',
  reflection: 'Reflection',
  workflow_breakdown: 'Workflow Breakdown',
  architecture_review: 'Architecture Review',
  sequencing: 'Volgorde',
  decision_sim: 'Beslissingslab',
  parameter_tuning: 'Parameter Lab',
  concept_comparison: 'Vergelijking',
  error_iteration: 'Debuggen',
  lesson_complete: 'Les voltooid',
};

export const SCENE_TYPE_COLORS: Record<LessonSceneType, string> = {
  lesson_intro: 'accent',
  explanation: 'teal',
  rules_patterns: 'violet',
  quiz: 'orange',
  interactive_html: 'emerald',
  reflection: 'amber',
  workflow_breakdown: 'cyan',
  architecture_review: 'rose',
  sequencing: 'amber',
  decision_sim: 'violet',
  parameter_tuning: 'accent',
  concept_comparison: 'teal',
  error_iteration: 'rose',
  lesson_complete: 'emerald',
};

export const DEFAULT_CTA = {
  headline: 'Stop met herhalen. Begin met schalen.',
  body: 'Struq is je operationeel geheugen voor AI-native builders. Bewaar prompts, skills en context als herbruikbare bouwblokken.',
  buttonText: 'Probeer Struq gratis',
  buttonHref: '/auth',
};

export const MAX_HTML_PAYLOAD_BYTES = 50_000;
export const MAX_SCENES_PER_LESSON = 20;
export const MAX_BATCH_TOPICS = 10;
export const CONTENT_LEARN_DIR = 'content/learn/lessons';
export const CONTENT_LEARN_SKILLS_DIR = 'content/learn/skills';
export const CONTENT_LEARN_EXAMPLES_DIR = 'content/learn/examples';

export const LEVEL_META: Record<1 | 2 | 3, LevelMeta> = {
  1: {
    level: 1,
    name: 'Get Working',
    goal: 'Zet je eerste project op en laat AI direct voor je werken.',
    milestone: 'Ik kan een project opzetten, lokaal draaien en AI gebruiken voor eerste aanpassingen.',
    color: 'emerald',
    topics: [
      'IDE setup & extensies',
      'Lokale omgeving opzetten',
      'Commando\'s & env vars',
      'Tool installatie',
      'Eerste prompts schrijven',
      'Eerste werkflows',
      'Setup problemen debuggen',
    ],
  },
  2: {
    level: 2,
    name: 'Get Reliable',
    goal: 'Maak AI-output gestructureerd, voorspelbaar en bruikbaar.',
    milestone: 'Ik kan AI sturen met regels en context zodat het consistenter en schoner werkt.',
    color: 'violet',
    topics: [
      'Context bestanden',
      'Agent rules',
      'Canonical truth',
      'Naamconventies',
      'Documentstructuur',
      'Guardrails & verificatie',
      'Debugging loops',
      'Review systemen',
      'Consistentiepatronen',
    ],
  },
  3: {
    level: 3,
    name: 'Build at Scale',
    goal: 'Bouw serieuze, onderhoudbare AI-assisted producten en werkflows.',
    milestone: 'Ik gebruik AI in een echte productie-workflow met verificatie, samenwerking en schaal.',
    color: 'amber',
    topics: [
      'CI/CD met AI',
      'Test systemen',
      'Deployment',
      'Repo architectuur',
      'Product specs',
      'Multi-agent workflows',
      'Samenwerking',
      'Kennisbeheer',
      'Documentatiesystemen',
      'Onderhoudbaarheid',
    ],
  },
};

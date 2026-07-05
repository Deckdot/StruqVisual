import type { LessonSceneType } from './types';

export interface SceneTypeMeta {
  label: string;
  icon: string;
  colorClass: string;
  borderClass: string;
  bgClass: string;
  description: string;
}

export const SCENE_TYPE_META: Record<LessonSceneType, SceneTypeMeta> = {
  lesson_intro: {
    label: 'Introductie',
    icon: 'BookOpen',
    colorClass: 'text-accent',
    borderClass: 'border-accent/20',
    bgClass: 'bg-accent/5',
    description: 'Overzicht van wat je gaat leren',
  },
  explanation: {
    label: 'Uitleg',
    icon: 'Info',
    colorClass: 'text-accent',
    borderClass: 'border-accent/20',
    bgClass: 'bg-accent/5',
    description: 'Conceptuitleg met voorbeelden',
  },
  rules_patterns: {
    label: 'Regels & Patronen',
    icon: 'List',
    colorClass: 'text-violet-400',
    borderClass: 'border-violet-500/20',
    bgClass: 'bg-violet-500/5',
    description: 'Regels, patronen en anti-patronen',
  },
  quiz: {
    label: 'Kennischeck',
    icon: 'CheckSquare',
    colorClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/20',
    bgClass: 'bg-emerald-500/5',
    description: 'Test je begrip met vragen',
  },
  interactive_html: {
    label: 'Oefening',
    icon: 'Play',
    colorClass: 'text-accent',
    borderClass: 'border-accent/20',
    bgClass: 'bg-accent/5',
    description: 'Interactieve oefening',
  },
  reflection: {
    label: 'Reflectie',
    icon: 'MessageSquare',
    colorClass: 'text-accent',
    borderClass: 'border-accent/20',
    bgClass: 'bg-accent/5',
    description: 'Denk na over wat je hebt geleerd',
  },
  workflow_breakdown: {
    label: 'Werkproces',
    icon: 'GitBranch',
    colorClass: 'text-accent',
    borderClass: 'border-accent/20',
    bgClass: 'bg-accent/5',
    description: 'Stap-voor-stap werkproces',
  },
  architecture_review: {
    label: 'Architectuur',
    icon: 'Layers',
    colorClass: 'text-violet-400',
    borderClass: 'border-violet-500/20',
    bgClass: 'bg-violet-500/5',
    description: 'Architectuurpatronen en keuzes',
  },
  sequencing: {
    label: 'Volgorde',
    icon: 'ArrowDownUp',
    colorClass: 'text-amber-400',
    borderClass: 'border-amber-500/20',
    bgClass: 'bg-amber-500/5',
    description: 'Zet stappen in de juiste volgorde',
  },
  decision_sim: {
    label: 'Beslissingslab',
    icon: 'Crosshair',
    colorClass: 'text-violet-400',
    borderClass: 'border-violet-500/20',
    bgClass: 'bg-violet-500/5',
    description: 'Simuleer beslissingen en zie consequenties',
  },
  parameter_tuning: {
    label: 'Parameter Lab',
    icon: 'Sliders',
    colorClass: 'text-accent',
    borderClass: 'border-accent/20',
    bgClass: 'bg-accent/5',
    description: 'Pas parameters aan en zie live resultaten',
  },
  concept_comparison: {
    label: 'Vergelijking',
    icon: 'Columns',
    colorClass: 'text-accent',
    borderClass: 'border-accent/20',
    bgClass: 'bg-accent/5',
    description: 'Vergelijk twee benaderingen',
  },
  error_iteration: {
    label: 'Debuggen',
    icon: 'RefreshCw',
    colorClass: 'text-amber-400',
    borderClass: 'border-amber-500/20',
    bgClass: 'bg-amber-500/5',
    description: 'Diagnose en herstel fouten',
  },
  lesson_complete: {
    label: 'Les voltooid',
    icon: 'Trophy',
    colorClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/20',
    bgClass: 'bg-emerald-500/5',
    description: 'Gefeliciteerd! Je hebt de les voltooid',
  },
};

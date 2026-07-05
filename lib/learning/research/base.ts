import type { ResearchSummary, LessonBriefInput } from '../types';

export interface ResearchProvider {
  readonly name: string;
  research(brief: LessonBriefInput): Promise<ResearchSummary>;
}

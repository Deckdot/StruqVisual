import type { ResearchSummary, LessonBriefInput, ManualSource } from '../types';
import type { ResearchProvider } from './base';

export class ManualSourceResearchProvider implements ResearchProvider {
  readonly name = 'manual';

  async research(brief: LessonBriefInput): Promise<ResearchSummary> {
    const sources: ManualSource[] = brief.manualSources ?? [];

    const findings = sources.map((s) => ({
      title: s.title,
      url: s.url,
      excerpt: s.excerpt ?? '(no excerpt provided)',
      relevanceNote: 'Manually provided by admin',
    }));

    const sourceMaterialFindings = brief.sourceMaterial
      ? [
          {
            title: 'Pasted source material',
            excerpt: brief.sourceMaterial.slice(0, 500) + (brief.sourceMaterial.length > 500 ? '…' : ''),
            relevanceNote: 'Direct paste from admin',
          },
        ]
      : [];

    const allFindings = [...findings, ...sourceMaterialFindings];

    return {
      query: brief.topic,
      findings: allFindings,
      synthesized: allFindings.length > 0
        ? `Manual research context for "${brief.topic}" sourced from ${allFindings.length} admin-provided input(s). Review and refine before publication.`
        : `No manual sources provided for "${brief.topic}". The lesson will be generated from model knowledge only.`,
      cautionFlags: allFindings.length === 0
        ? ['No research sources provided — lesson relies on model knowledge only']
        : [],
      generatedAt: new Date().toISOString(),
      provider: 'manual',
    };
  }
}

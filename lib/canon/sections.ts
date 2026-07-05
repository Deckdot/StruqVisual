// lib/canon/sections.ts
//
// Structural section kinds — visual layer. Ported from DesignOS
// design-os/assets/sections.yaml (the 9 canonical section kinds). Struq shows the
// category + kind as browsable canon; the pipeline's variant/component contracts
// are not ported (per scope: bring the category & tab, not the pipeline content).

import type { SectionKind } from './types';

export const CANON_SECTIONS: SectionKind[] = [
  { kind: 'hero', name: 'Hero', category: 'Opening', purpose: 'Establish context and set the tone in the first screen.' },
  { kind: 'proof', name: 'Proof', category: 'Trust', purpose: 'Show evidence — logos, metrics, testimonials.' },
  { kind: 'features', name: 'Features', category: 'Offer', purpose: 'Explain what the offer is and why it matters.' },
  { kind: 'offering', name: 'Offering', category: 'Offer', purpose: 'Package the offer into clear, comparable choices.' },
  { kind: 'process', name: 'Process', category: 'Explain', purpose: 'Walk through how it works, step by step.' },
  { kind: 'story-proof', name: 'Story Proof', category: 'Trust', purpose: 'A narrative case that proves the outcome.' },
  { kind: 'gallery', name: 'Gallery', category: 'Work', purpose: 'Show the work — a visual grid or showcase.' },
  { kind: 'faq', name: 'FAQ', category: 'Explain', purpose: 'Handle objections before they become blockers.' },
  { kind: 'cta', name: 'Call to Action', category: 'Closing', purpose: 'Capture intent with a single clear next step.' },
];

export const SECTION_CATEGORIES = ['Opening', 'Offer', 'Explain', 'Trust', 'Work', 'Closing'] as const;

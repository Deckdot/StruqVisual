// lib/canon/voices.ts
//
// Voice archetypes — visual layer. Ported from DesignOS design-os/assets/voices.yaml,
// trimmed to what a voice card shows (name, summary, a few traits, a sample line).
// The pipeline's toneRules / bannedLanguage tables are not ported.

import type { VoiceArchetype } from './types';

export const CANON_VOICES: VoiceArchetype[] = [
  {
    id: 'measured-editorial',
    name: 'Measured Editorial',
    summary: 'Quiet, architectural, and precise. Restraint as a signal of quality for premium service providers.',
    traits: ['architectural', 'precision', 'restraint'],
    sample: 'We build fewer things, and we build them properly.',
  },
  {
    id: 'executive-authority',
    name: 'Executive Authority',
    summary: 'Dense, high-status, and uncompromising. Enterprise-level trust and institutional strength.',
    traits: ['institutional', 'authority', 'governance'],
    sample: 'The standard the market measures itself against.',
  },
  {
    id: 'founder-led-trust',
    name: 'Founder-Led Trust',
    summary: 'Personal, transparent, and direct. For high-ticket services where reputation is the core asset.',
    traits: ['personal', 'transparent', 'direct'],
    sample: "I take on six clients a year. Here's why that matters.",
  },
  {
    id: 'warm-hospitality',
    name: 'Warm Hospitality',
    summary: 'Welcoming, sensory, and guest-focused. Designed for restaurants and hospitality brands.',
    traits: ['welcoming', 'sensory', 'generous'],
    sample: 'Pull up a chair. Dinner is the easy part.',
  },
  {
    id: 'calm-expertise',
    name: 'Calm Expertise',
    summary: 'Grounded, mindful, and safe. Ideal for wellness and movement studios.',
    traits: ['grounded', 'mindful', 'reassuring'],
    sample: 'Slow is smooth. Smooth is strong.',
  },
  {
    id: 'creative-impact',
    name: 'Creative Impact',
    summary: 'Bold, visual, and conceptual. Designed for portfolios and creative studios.',
    traits: ['bold', 'visual', 'conceptual'],
    sample: 'Ideas that refuse to sit quietly.',
  },
];

// lib/canon/recipes.ts
//
// Full-site recipes — visual layer. Ported from DesignOS design-os/recipes/*.yaml.
// Each recipe is a high-level combination of a palette + type pairing + layout +
// category. The card renders these; the pipeline's full brief is not ported.

import type { Recipe } from './types';

export const CANON_RECIPES: Recipe[] = [
  {
    id: 'premium-service-editorial',
    name: 'Premium Service Editorial',
    summary: 'Restrained editorial layout for high-ticket service providers.',
    paletteId: 'graphite-ivory',
    typographyId: 'editorial-sans-precision',
    voiceId: 'measured-editorial',
    tags: ['premium-service', 'asymmetric-editorial'],
  },
  {
    id: 'executive-authority-dark',
    name: 'Executive Authority Dark',
    summary: 'Dense, high-status dark direction for enterprise trust.',
    paletteId: 'midnight-brass',
    typographyId: 'editorial-sans-precision',
    voiceId: 'executive-authority',
    tags: ['premium-service', 'modular-premium'],
  },
  {
    id: 'founder-led-trust',
    name: 'Founder-Led Trust',
    summary: 'Personal, transparent layout where the founder is the asset.',
    paletteId: 'graphite-ivory',
    typographyId: 'editorial-sans-precision',
    voiceId: 'founder-led-trust',
    tags: ['tech', 'asymmetric-editorial'],
  },
  {
    id: 'cinematic-consulting',
    name: 'Cinematic Consulting',
    summary: 'Scroll-led cinematic direction for premium consultancies.',
    paletteId: 'midnight-brass',
    typographyId: 'editorial-sans-precision',
    voiceId: 'executive-authority',
    tags: ['premium-service', 'cinematic-scroll'],
  },
  {
    id: 'creative-studio',
    name: 'Creative Studio',
    summary: 'Expressive, visual-led layout for portfolios and studios.',
    paletteId: 'ocean-breeze',
    typographyId: 'display-drama',
    voiceId: 'creative-impact',
    tags: ['premium-service', 'asymmetric-editorial'],
  },
  {
    id: 'boutique-wellness',
    name: 'Boutique Wellness',
    summary: 'Calm, grounded layout for wellness and movement studios.',
    paletteId: 'stone-forest',
    typographyId: 'serif-editorial',
    voiceId: 'calm-expertise',
    tags: ['premium-service', 'asymmetric-editorial'],
  },
  {
    id: 'culinary-bistro',
    name: 'Culinary Bistro',
    summary: 'Warm, sensory direction for restaurants and hospitality.',
    paletteId: 'terracotta-sand',
    typographyId: 'newsreader-classic',
    voiceId: 'warm-hospitality',
    tags: ['premium-service', 'asymmetric-editorial'],
  },
  {
    id: 'productized-service',
    name: 'Productized Service',
    summary: 'Modular, structured layout for packaged offerings.',
    paletteId: 'stone-forest',
    typographyId: 'geometric-modern',
    voiceId: 'measured-editorial',
    tags: ['premium-service', 'modular-premium'],
  },
  {
    id: 'technical-clarity',
    name: 'Technical Clarity',
    summary: 'Clean, modular direction for technical and developer products.',
    paletteId: 'stone-forest',
    typographyId: 'grotesk-workhorse',
    voiceId: 'measured-editorial',
    tags: ['tech', 'modular-premium'],
  },
];

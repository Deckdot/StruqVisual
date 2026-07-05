import type { VaultAsset } from './types';

/**
 * Demo library content, shaped exactly like the M2 database model.
 * Palette and typography values come straight from the DesignOS canon
 * (palettes.yaml / typography.yaml) so the browse experience is real from
 * day one. Replaced by the canon import pipeline in M2.
 */

const paletteAsset = (
  id: string,
  name: string,
  mood: string,
  colors: { background: string; surface: string; text: string; accent: string; accentAlt: string },
  tier: 'free' | 'pro' = 'free',
  tags: string[] = []
): VaultAsset => ({
  id: `palette-${id}`,
  type: 'palette',
  slug: id,
  name,
  description: mood,
  tier,
  tags: ['kleuren', ...tags],
  data: { colors, mood },
  prompt: [
    `Gebruik dit kleurenpalet ("${name}") als design tokens voor de hele interface:`,
    `- background: ${colors.background}`,
    `- surface: ${colors.surface}`,
    `- text: ${colors.text}`,
    `- accent: ${colors.accent}`,
    `- accent-alt: ${colors.accentAlt}`,
    'Gebruik accent alleen voor primaire acties en momenten van nadruk. Genereer hover-states via brightness, nooit met andere kleuren.',
  ].join('\n'),
});

export const DEMO_ASSETS: VaultAsset[] = [
  // ── Paletten (canon: design-os/assets/palettes.yaml) ─────────────────────
  paletteAsset('graphite-ivory', 'Graphite Ivory', 'editorial premium', {
    background: '#F3F0E8', surface: '#E8E1D5', text: '#353634', accent: '#9C532C', accentAlt: '#2B4A56',
  }),
  paletteAsset('midnight-brass', 'Midnight Brass', 'executive authority', {
    background: '#101218', surface: '#191C24', text: '#F7F3EA', accent: '#C69B5D', accentAlt: '#8E9AA8',
  }),
  paletteAsset('stone-forest', 'Stone Forest', 'quiet confidence', {
    background: '#EEF0EA', surface: '#D8DDD3', text: '#162017', accent: '#2B5C45', accentAlt: '#7B6A58',
  }),
  paletteAsset('terracotta-sand', 'Terracotta Sand', 'warm earthy premium', {
    background: '#F9F6F0', surface: '#EFE9DF', text: '#402218', accent: '#B85D3B', accentAlt: '#5C6B62',
  }, 'pro', ['warm']),
  paletteAsset('ocean-breeze', 'Ocean Breeze', 'clean professional depth', {
    background: '#EDF2F4', surface: '#D9E2EC', text: '#102A43', accent: '#0A6C74', accentAlt: '#486581',
  }, 'pro', ['koel']),

  // ── Typografie (canon: design-os/assets/typography.yaml) ─────────────────
  {
    id: 'typography-editorial-sans-precision',
    type: 'typography',
    slug: 'editorial-sans-precision',
    name: 'Editorial Sans Precision',
    description: 'Rustige architectonische display met leesbare neutrale body en een ingetogen editorial accent.',
    tier: 'free',
    tags: ['typografie', 'editorial'],
    data: {
      display: { name: 'Sora', stack: '"Sora", ui-sans-serif, system-ui, sans-serif' },
      body: { name: 'Neue Haas Grotesk Text', stack: '"Neue Haas Grotesk Text", "Helvetica Neue", Arial, sans-serif' },
      accent: { name: 'Lora', stack: '"Lora", Georgia, serif' },
      intent: 'Quiet architectural sans display with readable neutral body copy.',
    },
    prompt: [
      'Gebruik deze typografie-combinatie:',
      '- Display: Sora (300–600), tracking -0.045em op grote koppen',
      '- Body: Neue Haas Grotesk Text / Helvetica Neue, regelafstand 1.6',
      '- Accent (citaten, italics): Lora',
      'Laad Sora en Lora via Google Fonts. Houd koppen licht van gewicht en groot van maat.',
    ].join('\n'),
  },
  {
    id: 'typography-warm-rounded',
    type: 'typography',
    slug: 'warm-rounded-humanist',
    name: 'Warm Rounded Humanist',
    description: 'Vriendelijke afgeronde display met een heldere humanistische body. Warm zonder kinderlijk te worden.',
    tier: 'pro',
    tags: ['typografie', 'warm'],
    data: {
      display: { name: 'Comfortaa', stack: '"Comfortaa", ui-sans-serif, system-ui, sans-serif' },
      body: { name: 'Urbanist', stack: '"Urbanist", "Helvetica Neue", Arial, sans-serif' },
      intent: 'Friendly rounded display with a clear humanist body.',
    },
    prompt: [
      'Gebruik deze typografie-combinatie:',
      '- Display: Comfortaa (400–600) voor koppen en de wordmark',
      '- Body: Urbanist (300–600), regelafstand 1.6',
      'Laad beide via Google Fonts. Rond geen andere elementen extra af om het "vriendelijke" te compenseren; de letter doet dat werk al.',
    ].join('\n'),
  },

  // ── Secties (canon: design-os/assets/sections.yaml) ──────────────────────
  {
    id: 'section-hero-cinematic',
    type: 'section',
    slug: 'hero-cinematic-canvas',
    name: 'Cinematic canvas hero',
    description: 'Full-viewport opening met één grote belofte, rustige media en een zachte CTA.',
    tier: 'free',
    tags: ['secties', 'hero'],
    data: { kind: 'hero', layoutStrategy: 'poster-hero', ctaPressure: 'soft', densitySupport: ['airy', 'balanced'] },
    prompt: [
      'Bouw een full-viewport hero-sectie (poster-hero):',
      '- Eén display-kop van maximaal 8 woorden, links uitgelijnd, 60% breedte',
      '- Achtergrond: rustig full-bleed beeld of subtiel kleurvlak, nooit drukke patronen',
      '- Eén primaire CTA + één tekstlink, geen tweede kop',
      '- Verticale witruimte: minimaal 15vh boven en onder de kop',
    ].join('\n'),
  },
  {
    id: 'section-proof-metric-band',
    type: 'section',
    slug: 'proof-metric-band',
    name: 'Metric band proof',
    description: 'Smalle band met 3–4 bewijspunten direct na de hero. Cijfers alleen als ze echt zijn.',
    tier: 'free',
    tags: ['secties', 'proof'],
    data: { kind: 'proof', layoutStrategy: 'metric-band', ctaPressure: 'none', densitySupport: ['dense', 'balanced'] },
    prompt: [
      'Bouw een smalle proof-band direct onder de hero:',
      '- 3 of 4 items op één rij (mobiel: 2x2 grid)',
      '- Elk item: één groot getal of feit + één korte regel context',
      '- Geen CTA in deze sectie; hij bewijst alleen',
      '- Achtergrond één tint donkerder of lichter dan de hero (surface-token)',
    ].join('\n'),
  },
  {
    id: 'section-faq-accordion',
    type: 'section',
    slug: 'faq-accordion-list',
    name: 'Accordion FAQ',
    description: 'Dichte vraag-en-antwoordlijst die bezwaren wegneemt vlak voor de laatste CTA.',
    tier: 'pro',
    tags: ['secties', 'faq'],
    data: { kind: 'faq', layoutStrategy: 'accordion-list', ctaPressure: 'none', densitySupport: ['dense'] },
    prompt: [
      'Bouw een FAQ-sectie als accordion-lijst:',
      '- 5–7 vragen, geformuleerd zoals de bezoeker ze zelf zou stellen',
      '- Eén item tegelijk open; chevron roteert 180° in 200ms',
      '- Antwoorden kort en direct, maximaal 3 zinnen',
      '- Plaats deze sectie direct vóór de afsluitende CTA',
    ].join('\n'),
  },

  // ── Design systems (palet + typografie + silhouet) ───────────────────────
  {
    id: 'system-editorial-restrained',
    type: 'design_system',
    slug: 'editorial-restrained',
    name: 'Editorial Restrained',
    description: 'Kalm premium ritme: oriënteer, bewijs, leg uit, beantwoord, converteer. Graphite Ivory + Sora.',
    tier: 'free',
    tags: ['design system', 'editorial'],
    data: {
      paletteRef: 'graphite-ivory',
      typographyRef: 'editorial-sans-precision',
      silhouette: { name: 'Editorial restrained', sectionOrder: ['hero', 'proof', 'features', 'process', 'faq', 'cta'] },
    },
    prompt: [
      'Bouw de pagina volgens het "Editorial Restrained" systeem:',
      '- Sectievolgorde: hero → proof → features → process → faq → cta',
      '- Palet Graphite Ivory: background #F3F0E8, surface #E8E1D5, text #353634, accent #9C532C',
      '- Typografie: Sora display (licht gewicht, grote maat), Helvetica-familie body, Lora accent',
      '- Dichtheid: hero airy, midden balanced, faq dense',
      '- Toon: kalm en premium; accent spaarzaam, alleen op acties en één moment per sectie',
    ].join('\n'),
  },
  {
    id: 'system-midnight-authority',
    type: 'design_system',
    slug: 'midnight-authority',
    name: 'Midnight Authority',
    description: 'Donker, executive en bewijs-voorwaarts. Midnight Brass + strak grid, voor B2B en advisory.',
    tier: 'pro',
    tags: ['design system', 'donker'],
    data: {
      paletteRef: 'midnight-brass',
      typographyRef: 'editorial-sans-precision',
      silhouette: { name: 'Proof forward', sectionOrder: ['hero', 'proof', 'story-proof', 'features', 'process', 'faq', 'cta'] },
    },
    prompt: [
      'Bouw de pagina volgens het "Midnight Authority" systeem:',
      '- Sectievolgorde: hero → proof → story-proof → features → process → faq → cta',
      '- Palet Midnight Brass: background #101218, surface #191C24, text #F7F3EA, accent #C69B5D',
      '- Bewijs direct na de belofte; cijfers groot, context klein',
      '- Randen: 1px lijnen op 8% wit in plaats van schaduwen',
    ].join('\n'),
  },

  // ── Media (placeholders tot de canon-import in M2: 898 beelden) ──────────
  {
    id: 'media-abstract-dusk',
    type: 'media',
    slug: 'abstract-dusk-gradient',
    name: 'Abstract Dusk',
    description: 'Atmosferische gradient voor hero-achtergronden en cta-secties.',
    tier: 'free',
    tags: ['media', 'abstract'],
    data: {
      aspectRatio: '3:2',
      category: 'Abstract',
      placeholder: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 45%, #b85d3b 130%)',
    },
    prompt: 'Gebruik een donker atmosferisch achtergrondbeeld (abstract, dusk-tinten) full-bleed achter de hero. Leg er een zwarte overlay van 35% over zodat tekst leesbaar blijft.',
  },
  {
    id: 'media-paper-texture',
    type: 'media',
    slug: 'warm-paper-texture',
    name: 'Warm Papier',
    description: 'Subtiele papiertextuur die secties tactiel maakt zonder af te leiden.',
    tier: 'free',
    tags: ['media', 'textuur'],
    data: {
      aspectRatio: '1:1',
      category: 'Texture',
      placeholder: 'linear-gradient(160deg, #f9f6f0 0%, #efe9df 60%, #e8e1d5 100%)',
    },
    prompt: 'Gebruik een warme papiertextuur als sectie-achtergrond op 100% breedte, opacity 60%, blend-mode multiply. Nooit onder lange tekstblokken.',
  },
  {
    id: 'media-forest-atmosphere',
    type: 'media',
    slug: 'forest-atmosphere',
    name: 'Forest Atmosphere',
    description: 'Diepgroene sfeerfoto voor merken met een kalme, natuurlijke identiteit.',
    tier: 'pro',
    tags: ['media', 'natuur'],
    data: {
      aspectRatio: '16:9',
      category: 'Nature',
      placeholder: 'linear-gradient(120deg, #162017 0%, #2b5c45 70%, #7b6a58 140%)',
    },
    prompt: 'Gebruik een diepgroen bos-sfeerbeeld (16:9) als afsluitend cta-achtergrondbeeld met een donkergroene overlay van 40%.',
  },
];

export const demoAssetsByType = (type: VaultAsset['type']) => DEMO_ASSETS.filter((a) => a.type === type);

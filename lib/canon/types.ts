// lib/canon/types.ts
//
// Local TypeScript types for the Canon (Taste Library) — mirrors the shapes the
// DesignOS @designos/contracts package defined, trimmed to what Struq's ported
// tabs render. Static canon only; no Zod, no DB.

/* ---------------------------------------------------------------- Icons --- */

export type IconSemanticId =
  | 'search'
  | 'mail'
  | 'phone'
  | 'shield'
  | 'check'
  | 'arrow-up-right'
  | 'globe'
  | 'settings'
  | 'folder'
  | 'database'
  | 'compass'
  | 'activity';

export type IconSpecimen = {
  id: IconSemanticId;
  label: string;
};

export type IconSetSource = 'canon' | 'candidate';

export type IconSet = {
  id: string;
  name: string;
  providerId: string;
  provider: string;
  website: string;
  summary: string;
  license: string;
  source: IconSetSource;
  /** Iconify collection prefix used to render every specimen, e.g. "tabler". */
  iconifyPrefix: string;
  tags: string[];
  supports: {
    outline: boolean;
    filled: boolean;
    duotone: boolean;
    animated: boolean;
  };
  animation: {
    supported: boolean;
    notes?: string;
  };
  preview: {
    strokeWidth: number;
    cornerStyle: 'rounded' | 'sharp';
    accent: string;
    surface: string;
  };
  /** semantic id → Iconify icon name (without prefix), e.g. search → "search". */
  semanticMap: Record<IconSemanticId, string>;
};

/* ------------------------------------------------------------- Palettes --- */

export type PaletteColors = {
  background: string;
  surface: string;
  text: string;
  accent: string;
  accentAlt?: string;
};

export type Palette = {
  id: string;
  mood: string;
  colors: PaletteColors;
};

/* ----------------------------------------------------------- Typography --- */

export type FontPairing = {
  id: string;
  name: string;
  display: string;
  body: string;
  mood?: string;
  notes?: string;
};

/* --------------------------------------------------------------- Voice ---- */

export type VoiceArchetype = {
  id: string;
  name: string;
  summary: string;
  traits: string[];
  sample?: string;
};

/* -------------------------------------------------------------- Recipe ---- */

export type Recipe = {
  id: string;
  name: string;
  summary: string;
  paletteId?: string;
  typographyId?: string;
  voiceId?: string;
  tags: string[];
};

/* ------------------------------------------------------------ Sections ---- */

export type SectionKind = {
  kind: string;
  name: string;
  purpose: string;
  category: string;
};

/* -------------------------------------------------------------- Brands ---- */

export type BrandSystem = {
  id: string;
  name: string;
  summary: string;
  accent: string;
  tags: string[];
};

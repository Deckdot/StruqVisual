/**
 * The visual-first asset model. This shape mirrors the M2 database schema
 * (lib/db/schema.ts) so the dashboard swaps from demo data to the DB without
 * UI changes. The enum is frozen: five types, prompts are metadata.
 */

export const ASSET_TYPES = ['palette', 'typography', 'design_system', 'section', 'media'] as const;
export type AssetType = (typeof ASSET_TYPES)[number];
export type VaultBrowseFilter = AssetType | 'all' | 'saved';

export type AssetTier = 'free' | 'pro';

export type PaletteData = {
  colors: { background: string; surface: string; text: string; accent: string; accentAlt: string };
  mood: string;
  /** Optional OKLCH surface ladder for frontier palettes. */
  frontier?: Record<string, string>;
};

export type TypographyData = {
  display: { name: string; stack: string };
  body: { name: string; stack: string };
  accent?: { name: string; stack: string };
  intent: string;
};

export type SectionData = {
  kind: string;
  layoutStrategy: string;
  ctaPressure: 'none' | 'soft' | 'firm';
  densitySupport: string[];
};

export type DesignSystemData = {
  paletteRef: string;
  typographyRef: string;
  silhouette: { name: string; sectionOrder: string[] };
};

export type MediaData = {
  aspectRatio: string;
  category: string;
  /** CSS background used as placeholder until the canon media import (M2). */
  placeholder: string;
  src?: string;
  width?: number;
  height?: number;
  alt?: string;
};

export type AssetData = PaletteData | TypographyData | SectionData | DesignSystemData | MediaData;

export type VaultAsset = {
  id: string;
  type: AssetType;
  slug: string;
  name: string;
  description: string;
  /**
   * The copyable AI payload — metadata on the visual asset, never the entity.
   * Server-gated: blanked to '' for a Pro asset the viewer isn't entitled to
   * (see `locked`). The visual preview still ships; only the payload is withheld.
   */
  prompt: string;
  data: AssetData;
  tier: AssetTier;
  tags: string[];
  /**
   * True when this is a Pro asset and the current viewer is on the free tier.
   * The repository (the single gate) strips `prompt` and sets this; the UI reads
   * it to tease the preview and route copy through the entitlement check.
   */
  locked: boolean;
};

export type VaultAssetsPage = {
  items: VaultAsset[];
  total: number;
  hasMore: boolean;
  page: number;
  limit: number;
};

export const TYPE_META: Record<AssetType, { label: string; labelPlural: string }> = {
  palette: { label: 'Palet', labelPlural: 'Kleuren' },
  typography: { label: 'Typografie', labelPlural: 'Typografie' },
  design_system: { label: 'Design system', labelPlural: 'Design systems' },
  section: { label: 'Sectie', labelPlural: 'Secties' },
  media: { label: 'Media', labelPlural: 'Media' },
};

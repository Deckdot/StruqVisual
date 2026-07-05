import { APP_BUILDER_KIT, BEGINNER_KITS, VISUEEL_STARTER_KIT, type ExampleKitAsset } from '@/lib/gallery/example-kits';

/**
 * Curated public gallery (RFC 2026-07 Gallery Vault, Phase 7).
 * Front-end only: the items come straight from the Dutch example-kit content,
 * so the public gallery and the seeded starter vault always tell the same story.
 * Everything here is free to copy — the "Bewaar in je vault" action is the
 * signup hook (IKEA effect: what you save becomes yours).
 */

export type GalleryCategoryKey = 'kleuren' | 'typografie' | 'richting' | 'prompts';

export type GalleryItem = {
  slug: string;
  category: GalleryCategoryKey;
  /** AssetType string value — matches the dashboard taxonomy. */
  type: string;
  title: string;
  summary: string;
  body: string;
  tags: string[];
};

export const GALLERY_CATEGORIES: Array<{ key: GalleryCategoryKey; label: string }> = [
  { key: 'kleuren', label: 'Kleuren' },
  { key: 'typografie', label: 'Typografie' },
  { key: 'richting', label: 'Visuele richting' },
  { key: 'prompts', label: 'Prompts' },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function toItem(asset: ExampleKitAsset, category: GalleryCategoryKey): GalleryItem {
  return {
    slug: slugify(asset.title),
    category,
    type: asset.type,
    title: asset.title,
    summary: asset.summary,
    body: asset.body,
    tags: asset.tags,
  };
}

function categoryForVisualAsset(asset: ExampleKitAsset): GalleryCategoryKey {
  if (asset.type === 'colour_palette') return 'kleuren';
  if (asset.type === 'font') return 'typografie';
  return 'richting';
}

const PROMPT_TYPES = new Set(['quick_prompt', 'master_prompt', 'debug_prompt', 'guardrail', 'checklist']);

const eersteStappenKit = BEGINNER_KITS.find((kit) => kit.name === 'Eerste stappen met AI');

export const CURATED_GALLERY: GalleryItem[] = [
  // The visual layer leads — palettes, pairings, direction.
  ...VISUEEL_STARTER_KIT.assets.map((asset) => toItem(asset, categoryForVisualAsset(asset))),
  // A taste of the execution vault underneath.
  ...(eersteStappenKit?.assets ?? [])
    .filter((asset) => PROMPT_TYPES.has(asset.type))
    .map((asset) => toItem(asset, 'prompts')),
  ...APP_BUILDER_KIT.assets
    .filter((asset) => asset.type === 'master_prompt' || asset.type === 'guardrail')
    .map((asset) => toItem(asset, 'prompts')),
];

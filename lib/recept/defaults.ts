// lib/recept/defaults.ts
//
// The default recipe, id→object resolution, ?basis= prefill, and curated shuffle.
// All lookups fall back gracefully to the default recipe's parts if an id is stale
// (e.g. a removed imported icon candidate), so the preview never renders empty.

import { CANON_PALETTES } from '@/lib/canon/palettes';
import { CANON_TYPOGRAPHY } from '@/lib/canon/typography';
import { CANON_ICON_SETS } from '@/lib/canon/icons';
import { CANON_RECIPES } from '@/lib/canon/recipes';
import type { IconSet } from '@/lib/canon/types';
import type { ReceptDraft, ResolvedRecept } from './types';

/**
 * The first-paint recipe (the "love moment"): the visual half of canon's most
 * confident direction — Premium Service Editorial — plus its calmest icon system.
 */
export const DEFAULT_DRAFT: ReceptDraft = {
  name: '',
  paletteId: 'graphite-ivory',
  typographyId: 'editorial-sans-precision',
  iconSetId: 'iconset.tabler.core',
};

const DEFAULT_PALETTE = CANON_PALETTES.find((p) => p.id === DEFAULT_DRAFT.paletteId) ?? CANON_PALETTES[0]!;
const DEFAULT_PAIRING =
  CANON_TYPOGRAPHY.find((t) => t.id === DEFAULT_DRAFT.typographyId) ?? CANON_TYPOGRAPHY[0]!;
const DEFAULT_ICON_SET =
  CANON_ICON_SETS.find((s) => s.id === DEFAULT_DRAFT.iconSetId) ?? CANON_ICON_SETS[0]!;

/**
 * Resolve a draft's ids to real canon objects. `candidates` are imported icon sets
 * (localStorage/DB) that extend the canon icon list. Any stale id falls back to the
 * default recipe's corresponding part — the preview always has something to render.
 */
export function resolveDraft(
  draft: ReceptDraft,
  candidates: readonly IconSet[] = [],
): ResolvedRecept {
  const palette = CANON_PALETTES.find((p) => p.id === draft.paletteId) ?? DEFAULT_PALETTE;
  const pairing = CANON_TYPOGRAPHY.find((t) => t.id === draft.typographyId) ?? DEFAULT_PAIRING;
  const iconSet =
    CANON_ICON_SETS.find((s) => s.id === draft.iconSetId) ??
    candidates.find((s) => s.id === draft.iconSetId) ??
    DEFAULT_ICON_SET;
  return { palette, pairing, iconSet };
}

/**
 * Prefill from a canon recipe (?basis=<id>). Canon recipes carry palette + type but
 * no icon set, so the icon set stays at the calm default. Unknown id → default draft.
 */
export function buildBasisDraft(canonRecipeId: string): ReceptDraft {
  const recipe = CANON_RECIPES.find((r) => r.id === canonRecipeId);
  if (!recipe) return { ...DEFAULT_DRAFT };
  return {
    name: '',
    paletteId: recipe.paletteId ?? DEFAULT_DRAFT.paletteId,
    typographyId: recipe.typographyId ?? DEFAULT_DRAFT.typographyId,
    iconSetId: DEFAULT_DRAFT.iconSetId,
  };
}

function pickDifferent<T>(items: readonly T[], not: T): T {
  if (items.length <= 1) return items[0]!;
  let choice = not;
  while (choice === not) choice = items[Math.floor(Math.random() * items.length)]!;
  return choice;
}

/**
 * "Verras me": curated randomness only. Palette + typography come from a random
 * canon RECIPE (never uniform-random across 29×6×6 — that betrays "Struq has taste"),
 * plus a random canon icon set. Guaranteed to differ from the current draft.
 */
export function shuffleDraft(current: ReceptDraft): ReceptDraft {
  const recipe = pickDifferent(
    CANON_RECIPES.filter((r) => r.paletteId && r.typographyId),
    CANON_RECIPES.find((r) => r.paletteId === current.paletteId && r.typographyId === current.typographyId) ??
      CANON_RECIPES[0]!,
  );
  const iconSetId = pickDifferent(CANON_ICON_SETS.map((s) => s.id), current.iconSetId);
  return {
    name: '',
    paletteId: recipe.paletteId ?? DEFAULT_DRAFT.paletteId,
    typographyId: recipe.typographyId ?? DEFAULT_DRAFT.typographyId,
    iconSetId,
  };
}

/**
 * Auto-name a recipe from its parts (e.g. "Editorial premium × Sora"). Used the
 * first time a nameless draft is saved; the user can rename inline afterwards.
 */
export function autoName(draft: ReceptDraft, candidates: readonly IconSet[] = []): string {
  const { palette, pairing } = resolveDraft(draft, candidates);
  const mood = palette.mood.charAt(0).toUpperCase() + palette.mood.slice(1);
  const face = pairing.display.match(/"([^"]+)"/)?.[1] ?? pairing.name;
  return `${mood} × ${face}`;
}

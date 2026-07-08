// lib/recept/types.ts
//
// The Recept-bouwer's local draft types. A "Recept" is a user-owned combination
// of curated canon assets: a palette + a type pairing + an icon set. Shaped as a
// sibling of canon's Recipe (paletteId/typographyId keep identical names and
// semantics; iconSetId is added). voiceId is intentionally absent in v1 — three
// pickers is the Hick ceiling and the preview copy is fixed.
//
// SavedRecept is deliberately the flat shape a future kits row + resolver will
// produce, so backend wiring becomes a fetch-swap inside use-recept-draft, not a
// UI rewrite. (kits.icon_set_id is the one backend migration this implies — see
// the handoff doc D2.)

import type { IconSet, Palette, FontPairing } from '@/lib/canon/types';

/** The working draft — three ids + a name. Viewport/section UI state lives in the hook, not here. */
export type ReceptDraft = {
  name: string;
  paletteId: string;
  typographyId: string;
  iconSetId: string;
};

/** An explicitly saved recipe. Flat on purpose (future kits row shape). */
export type SavedRecept = {
  id: string;
  name: string;
  paletteId: string;
  typographyId: string;
  iconSetId: string;
  updatedAt: number;
};

/** A draft with its ids resolved to the real canon objects, ready to render. */
export type ResolvedRecept = {
  palette: Palette;
  pairing: FontPairing;
  iconSet: IconSet;
};

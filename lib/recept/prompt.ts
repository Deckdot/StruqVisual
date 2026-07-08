// lib/recept/prompt.ts
//
// buildReceptPrompt(draft): a deterministic Dutch AI-prompt string built from the
// resolved palette hexes + font names + icon set. This is the product loop —
// "prompts are metadata on visual assets": the visual recipe is the asset, the
// prompt is the copyable metadata a user pastes into any AI tool.
//
// Pure function, no side effects. Copy here is working text; the brandvoice pass
// finalizes the exact phrasing.

import { CANONICAL_SEMANTICS } from '@/lib/canon/icons';
import type { IconSet } from '@/lib/canon/types';
import { resolveDraft } from './defaults';
import { fontStacksFor } from './font-stacks';
import type { ReceptDraft } from './types';

const ROLE_LABEL: Record<string, string> = {
  background: 'Achtergrond',
  surface: 'Oppervlak',
  text: 'Tekst',
  accent: 'Accent',
  accentAlt: 'Accent 2',
};

/** Strip the quoted family name out of a CSS font stack ("Sora", …) → "Sora". */
function familyName(stack: string, fallback: string): string {
  return stack.match(/"?([A-Za-z][A-Za-z0-9 ]+)"?/)?.[1]?.trim() ?? fallback;
}

function iconLines(iconSet: IconSet): string {
  return CANONICAL_SEMANTICS.map((s) => `- ${s.label}: ${iconSet.semanticMap[s.id]}`).join('\n');
}

export function buildReceptPrompt(draft: ReceptDraft, candidates: readonly IconSet[] = []): string {
  const { palette, pairing, iconSet } = resolveDraft(draft, candidates);
  const stacks = fontStacksFor(pairing.id);
  const displayFace = familyName(pairing.display, pairing.name);
  const bodyFace = familyName(pairing.body, 'sans-serif');
  const name = draft.name.trim() || `${palette.mood} × ${displayFace}`;

  const colorLines = (Object.entries(palette.colors) as [string, string][])
    .map(([role, value]) => `- ${ROLE_LABEL[role] ?? role}: ${value}`)
    .join('\n');

  return [
    `Gebruik de designrichting "${name}" consistent door de hele interface.`,
    '',
    'KLEUR',
    `Stemming: ${palette.mood}.`,
    colorLines,
    '',
    'TYPOGRAFIE',
    `Pairing: ${pairing.name}${pairing.mood ? ` (${pairing.mood})` : ''}.`,
    `- Display en koppen: ${displayFace}. CSS-stack: ${stacks.display}`,
    `- Body en lopende tekst: ${bodyFace}. CSS-stack: ${stacks.body}`,
    '',
    'ICONEN',
    `Set: ${iconSet.name} (Iconify-prefix "${iconSet.iconifyPrefix}", licentie ${iconSet.license}).`,
    iconLines(iconSet),
    '',
    'Houd deze richting overal aan: dezelfde kleurrollen, dezelfde fonts en dezelfde iconenset. Zo voelt het ontwerp als één geheel.',
  ].join('\n');
}

// lib/gallery/canon-gallery.ts
//
// Canon-gedreven publieke galerij (visual-first, prompt-vrij). Voedt /galerij
// rechtstreeks uit de dashboard-canon (lib/canon/*) — dezelfde paletten, font-
// pairings, recepten en secties die de ingelogde gebruiker in /canon ziet. Geen
// prompt-content: prompts zijn metadata op visuele assets, nooit een categorie.
//
// De galerij-previews renderen uit de GESTRUCTUREERDE velden hieronder (geen
// tekst-round-trip). `copyText` is puur output: een prompt-vrije Nederlandse spec
// die je zo in elke AI-tool plakt als context.

import { CANON_PALETTES } from '@/lib/canon/palettes';
import { CANON_TYPOGRAPHY } from '@/lib/canon/typography';
import { CANON_RECIPES } from '@/lib/canon/recipes';
import { CANON_SECTIONS } from '@/lib/canon/sections';
import { CANON_VOICES } from '@/lib/canon/voices';
import type {
  Palette,
  FontPairing,
  Recipe,
  SectionKind,
  VoiceArchetype,
} from '@/lib/canon/types';
import { fontStacksFor, type FontStacks } from '@/lib/recept/font-stacks';

export type GalleryCategoryKey = 'kleuren' | 'typografie' | 'recepten' | 'secties';

export type GalleryData =
  | { kind: 'palette'; palette: Palette }
  | { kind: 'typography'; pairing: FontPairing; stacks: FontStacks }
  | {
      kind: 'recipe';
      recipe: Recipe;
      palette?: Palette;
      pairing?: FontPairing;
      stacks?: FontStacks;
      voice?: VoiceArchetype;
    }
  | { kind: 'section'; section: SectionKind };

export type GalleryItem = {
  slug: string;
  category: GalleryCategoryKey;
  /** Bevroren asset_type — mapt 1-op-1 op de taxonomie. */
  type: 'palette' | 'typography' | 'design_system' | 'section';
  title: string;
  summary: string;
  /** Klembord-payload: prompt-vrije NL-spec, klaar om als context te plakken. */
  copyText: string;
  tags: string[];
  data: GalleryData;
};

export const GALLERY_CATEGORIES: Array<{ key: GalleryCategoryKey; label: string }> = [
  { key: 'kleuren', label: 'Kleuren' },
  { key: 'typografie', label: 'Typografie' },
  { key: 'recepten', label: 'Recepten' },
  { key: 'secties', label: 'Secties' },
];

/* --- Curatie ---------------------------------------------------------------
 * Een sterke, editorial-lange selectie i.p.v. een data-dump. De filterbalk doet
 * het versmallen; "Alles" toont de hele wand in categorie-volgorde.
 */

// 10 paletten met een bewuste spreiding: licht/donker, warm/koel, editorial/technisch.
const CURATED_PALETTE_IDS = [
  'graphite-ivory',
  'terracotta-sand',
  'stone-forest',
  'ocean-breeze',
  'midnight-brass',
  'frontier-aperture-technical-dark',
  'frontier-halo-saturated-blush',
  'frontier-numen-paper-cobalt',
  'frontier-seve-bone-oxblood',
  'frontier-tessellate-mint-graphite',
];

/* --- NL-hulp ---------------------------------------------------------------- */

/** kebab-id → nette titel ("graphite-ivory" → "Graphite Ivory"). */
function titleCase(id: string): string {
  return id
    .replace(/^frontier-/, '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** Korte NL-sfeeromschrijving per palet; valt terug op de canon-mood. */
const PALETTE_MOOD_NL: Record<string, string> = {
  'graphite-ivory': 'Editorial en premium',
  'terracotta-sand': 'Warm en aards, met klasse',
  'stone-forest': 'Rustig en zelfverzekerd',
  'ocean-breeze': 'Helder, professioneel, met diepte',
  'midnight-brass': 'Donker met een gezaghebbende glans',
  'frontier-aperture-technical-dark': 'Snel en technisch, diep donker',
  'frontier-halo-saturated-blush': 'Gedurfd, kinetisch en warm',
  'frontier-numen-paper-cobalt': 'Zelfverzekerd portfolio-editorial',
  'frontier-seve-bone-oxblood': 'Ingetogen mode-editorial',
  'frontier-tessellate-mint-graphite': 'Technisch turquoise op donker',
};

function paletteMoodNL(palette: Palette): string {
  return PALETTE_MOOD_NL[palette.id] ?? palette.mood;
}

const ROLE_LABELS_NL: Array<[keyof Palette['colors'], string]> = [
  ['background', 'Achtergrond'],
  ['surface', 'Oppervlak'],
  ['text', 'Tekst'],
  ['accent', 'Accent'],
  ['accentAlt', 'Accent 2'],
];

const SECTION_CATEGORY_NL: Record<string, string> = {
  Opening: 'Opening',
  Offer: 'Aanbod',
  Explain: 'Uitleg',
  Trust: 'Vertrouwen',
  Work: 'Werk',
  Closing: 'Afsluiting',
};

/** Waar een sectie-soort voor dient, in het Nederlands. */
const SECTION_PURPOSE_NL: Record<string, string> = {
  hero: 'Zet de context en de toon neer in het eerste scherm.',
  proof: 'Laat bewijs zien — logo’s, cijfers, testimonials.',
  features: 'Leg uit wat het aanbod is en waarom het ertoe doet.',
  offering: 'Verpak het aanbod in heldere, vergelijkbare keuzes.',
  process: 'Loop stap voor stap door hoe het werkt.',
  'story-proof': 'Een verhalende case die het resultaat bewijst.',
  gallery: 'Toon het werk — een visueel raster of showcase.',
  faq: 'Vang bezwaren op voordat ze blokkades worden.',
  cta: 'Vang de intentie met één heldere volgende stap.',
};

/** Wat er in een sectie-soort thuishoort — één alinea, voor de kopieer-spec. */
const SECTION_CONTENT_NL: Record<string, string> = {
  hero: 'Een pakkende kop, één ondersteunende zin en één primaire actie. Houd het rustig: één blikvanger.',
  proof: 'Bekende logo’s, harde cijfers of een korte quote met naam en functie. Echt bewijs, geen vulling.',
  features: 'Drie tot zes kernpunten, elk met een korte titel en één zin. Voordeel eerst, functie daarna.',
  offering: 'Twee of drie pakketten naast elkaar, met een duidelijk aanbevolen keuze en vergelijkbare regels.',
  process: 'Drie tot vijf genummerde stappen. Kort, concreet en in de juiste volgorde.',
  'story-proof': 'Situatie, aanpak en resultaat van één klant. Eén verhaal, met een meetbare uitkomst.',
  gallery: 'Een raster van echte visuals: werk, screenshots of media. Beeld leidt, tekst is bijzaak.',
  faq: 'Vier tot acht echte vragen met korte, eerlijke antwoorden. Behandel de twijfels die tegenhouden.',
  cta: 'Eén kop, één zin en één knop. Geen ruis, geen tweede uitweg.',
};

/* --- Kopieer-synthesizers (prompt-vrije NL-specs) --------------------------- */

function paletteCopy(palette: Palette): string {
  const lines = ROLE_LABELS_NL.filter(([role]) => palette.colors[role])
    .map(([role, label]) => `${label.padEnd(11)}${palette.colors[role]}`)
    .join('\n');
  return `Kleurenpalet: ${titleCase(palette.id)} (${paletteMoodNL(palette).toLowerCase()})

${lines}

Gebruik dit kleursysteem consequent: accent alleen voor primaire acties en actieve states, nooit meer dan één accent per scherm.`;
}

function typographyCopy(pairing: FontPairing): string {
  return `Typografie: ${pairing.name}${pairing.mood ? ` (${pairing.mood})` : ''}

Koppen:        ${familyName(pairing.display)}
Lopende tekst: ${familyName(pairing.body)}

${pairing.notes ?? 'Maximaal twee gewichten per familie in één weergave; koppen strak, lopende tekst rustig.'}`;
}

function recipeCopy(
  recipe: Recipe,
  palette?: Palette,
  pairing?: FontPairing,
  voice?: VoiceArchetype
): string {
  const blocks: string[] = [`Recept: ${recipe.name}\n\n${recipe.summary}`];
  if (palette) {
    const colors = ROLE_LABELS_NL.filter(([role]) => palette.colors[role])
      .map(([role, label]) => `${label.padEnd(11)}${palette.colors[role]}`)
      .join('\n');
    blocks.push(`Kleuren — ${titleCase(palette.id)}\n${colors}`);
  }
  if (pairing) {
    blocks.push(`Typografie — ${pairing.name}\nKoppen: ${familyName(pairing.display)}\nLopende tekst: ${familyName(pairing.body)}`);
  }
  if (voice) {
    blocks.push(`Stem — ${voice.name}\n${voice.summary}${voice.sample ? `\nVoorbeeld: “${voice.sample}”` : ''}`);
  }
  return blocks.join('\n\n');
}

function sectionCopy(section: SectionKind): string {
  const categoryNL = SECTION_CATEGORY_NL[section.category] ?? section.category;
  const purpose = SECTION_PURPOSE_NL[section.kind] ?? section.purpose;
  const content = SECTION_CONTENT_NL[section.kind] ?? '';
  return `Sectie: ${sectionNameNL(section)} (${categoryNL})

Waarvoor: ${purpose}

Wat hoort hierin: ${content}`;
}

/** Eerste familienaam uit een CSS-stack ("\"Sora\", ui-sans-serif" → "Sora"). */
function familyName(stack: string): string {
  return stack.split(',')[0]?.replace(/["']/g, '').trim() ?? stack;
}

const SECTION_NAME_NL: Record<string, string> = {
  hero: 'Hero',
  proof: 'Bewijs',
  features: 'Kenmerken',
  offering: 'Aanbod',
  process: 'Proces',
  'story-proof': 'Verhaalbewijs',
  gallery: 'Galerij',
  faq: 'Veelgestelde vragen',
  cta: 'Call-to-action',
};

function sectionNameNL(section: SectionKind): string {
  return SECTION_NAME_NL[section.kind] ?? section.name;
}

/* --- Builders --------------------------------------------------------------- */

function paletteItems(): GalleryItem[] {
  return CURATED_PALETTE_IDS.map((id): GalleryItem | null => {
    const palette = CANON_PALETTES.find((p) => p.id === id);
    if (!palette) return null;
    return {
      slug: `palet-${palette.id}`,
      category: 'kleuren',
      type: 'palette',
      title: titleCase(palette.id),
      summary: paletteMoodNL(palette),
      copyText: paletteCopy(palette),
      tags: ['palet', 'kleuren'],
      data: { kind: 'palette', palette },
    };
  }).filter((item): item is GalleryItem => item !== null);
}

function typographyItems(): GalleryItem[] {
  return CANON_TYPOGRAPHY.map((pairing) => ({
    slug: `type-${pairing.id}`,
    category: 'typografie' as const,
    type: 'typography' as const,
    title: pairing.name,
    summary: pairing.mood ? capitalize(pairing.mood) : 'Font-pairing',
    copyText: typographyCopy(pairing),
    tags: ['typografie', 'pairing'],
    data: { kind: 'typography' as const, pairing, stacks: fontStacksFor(pairing.id) },
  }));
}

function recipeItems(): GalleryItem[] {
  return CANON_RECIPES.map((recipe) => {
    const palette = CANON_PALETTES.find((p) => p.id === recipe.paletteId);
    const pairing = CANON_TYPOGRAPHY.find((t) => t.id === recipe.typographyId);
    const voice = CANON_VOICES.find((v) => v.id === recipe.voiceId);
    return {
      slug: `recept-${recipe.id}`,
      category: 'recepten' as const,
      type: 'design_system' as const,
      title: recipe.name,
      summary: recipe.summary,
      copyText: recipeCopy(recipe, palette, pairing, voice),
      tags: recipe.tags,
      data: {
        kind: 'recipe' as const,
        recipe,
        palette,
        pairing,
        stacks: pairing ? fontStacksFor(pairing.id) : undefined,
        voice,
      },
    };
  });
}

function sectionItems(): GalleryItem[] {
  return CANON_SECTIONS.map((section) => ({
    slug: `sectie-${section.kind}`,
    category: 'secties' as const,
    type: 'section' as const,
    title: sectionNameNL(section),
    summary: SECTION_PURPOSE_NL[section.kind] ?? section.purpose,
    copyText: sectionCopy(section),
    tags: ['sectie', (SECTION_CATEGORY_NL[section.category] ?? section.category).toLowerCase()],
    data: { kind: 'section' as const, section },
  }));
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export const CANON_GALLERY: GalleryItem[] = [
  ...paletteItems(),
  ...typographyItems(),
  ...recipeItems(),
  ...sectionItems(),
];

import '@/lib/db/env';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load as parseYaml } from 'js-yaml';
import { sql, inArray } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { assets, assetMedia } from '@/lib/db/schema';
import type {
  AssetTier,
  PaletteData,
  TypographyData,
  SectionData,
  DesignSystemData,
  MediaData,
} from '@/lib/vault/types';

/**
 * Idempotent canon import: reads the DesignOS YAML/JSON donor directly and
 * upserts one `assets` row per canon entity, keyed on a stable `provenance`
 * id (`canon:<type>:<id>`) so re-runs never duplicate — that is the acceptance
 * test (run twice → identical counts).
 *
 * DesignOS is a DONOR: we read its files, we never import its code. Prompt
 * strings mirror the builders in lib/vault/demo-assets.ts so copied prompts
 * stay identical in tone.
 */

const CANON_ROOT = join(process.cwd(), '..', 'DesignOS', 'design-os');
const ASSETS_DIR = join(CANON_ROOT, 'assets');
const MEDIA_DIR = join(CANON_ROOT, 'libraries', 'media');

function readYaml<T>(file: string): T {
  return parseYaml(readFileSync(join(ASSETS_DIR, file), 'utf8')) as T;
}

/** `font-pairing.editorial-sans-precision.v1` → `editorial-sans-precision`. */
function cleanSlug(id: string, ...prefixes: string[]): string {
  let s = id;
  for (const p of prefixes) if (s.startsWith(p)) s = s.slice(p.length);
  return s.replace(/\.v\d+$/, '');
}

type AssetRow = {
  provenance: string;
  type: 'palette' | 'typography' | 'design_system' | 'section' | 'media';
  slug: string;
  name: string;
  description: string;
  prompt: string;
  data: PaletteData | TypographyData | SectionData | DesignSystemData | MediaData;
  tier: AssetTier;
  tags: string[];
};

// ── Palettes ────────────────────────────────────────────────────────────────

type CanonPalette = {
  id: string;
  mood: string;
  colors: { background: string; surface: string; text: string; accent: string; accentAlt?: string };
  frontier?: Record<string, string>;
};

function titleFromId(id: string): string {
  return id
    .replace(/^frontier-/, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function buildPalettes(): AssetRow[] {
  const { palettes } = readYaml<{ palettes: CanonPalette[] }>('palettes.yaml');
  return palettes.map((p, i) => {
    // accentAlt may be absent on some palettes → default to accent.
    const colors = {
      background: p.colors.background,
      surface: p.colors.surface,
      text: p.colors.text,
      accent: p.colors.accent,
      accentAlt: p.colors.accentAlt ?? p.colors.accent,
    };
    const data: PaletteData = { colors, mood: p.mood };
    if (p.frontier) data.frontier = p.frontier;
    const name = titleFromId(p.id);
    // First 5 canon palettes are the free tier (mirrors the demo split).
    return {
      provenance: `canon:palette:${p.id}`,
      type: 'palette',
      slug: p.id,
      name,
      description: p.mood,
      tier: i < 5 ? 'free' : 'pro',
      tags: ['kleuren', ...(p.frontier ? ['frontier'] : [])],
      data,
      prompt: [
        `Gebruik dit kleurenpalet ("${name}") als design tokens voor de hele interface:`,
        `- background: ${colors.background}`,
        `- surface: ${colors.surface}`,
        `- text: ${colors.text}`,
        `- accent: ${colors.accent}`,
        `- accent-alt: ${colors.accentAlt}`,
        'Gebruik accent alleen voor primaire acties en momenten van nadruk. Genereer hover-states via brightness, nooit met andere kleuren.',
      ].join('\n'),
    };
  });
}

// ── Typography ────────────────────────────────────────────────────────────────

type CanonFamily = { name: string; stack: string };
type CanonPairing = {
  id: string;
  name: string;
  intent: string;
  families: { display: CanonFamily; body: CanonFamily; accent?: CanonFamily };
};

function buildTypography(): AssetRow[] {
  const { fontPairings } = readYaml<{ fontPairings: CanonPairing[] }>('typography.yaml');
  return fontPairings.map((fp, i) => {
    const slug = cleanSlug(fp.id, 'font-pairing.');
    const data: TypographyData = {
      display: { name: fp.families.display.name, stack: fp.families.display.stack },
      body: { name: fp.families.body.name, stack: fp.families.body.stack },
      intent: fp.intent,
    };
    if (fp.families.accent) {
      data.accent = { name: fp.families.accent.name, stack: fp.families.accent.stack };
    }
    const promptLines = [
      'Gebruik deze typografie-combinatie:',
      `- Display: ${data.display.name}`,
      `- Body: ${data.body.name}, regelafstand 1.6`,
    ];
    if (data.accent) promptLines.push(`- Accent (citaten, italics): ${data.accent.name}`);
    promptLines.push('Laad de fonts via Google Fonts. Houd koppen licht van gewicht en groot van maat.');
    return {
      provenance: `canon:typography:${slug}`,
      type: 'typography',
      slug,
      name: fp.name,
      description: fp.intent,
      tier: i === 0 ? 'free' : 'pro',
      tags: ['typografie'],
      data,
      prompt: promptLines.join('\n'),
    };
  });
}

// ── Sections ──────────────────────────────────────────────────────────────────

type CanonSectionKind = {
  kind: string;
  layoutStrategy: string;
  ctaPressure: string;
  densitySupport: string[];
};

// Canon uses soft|medium|firm|none|hard; the frozen SectionData union is
// none|soft|firm. Map the extras onto the nearest allowed value.
function mapCtaPressure(v: string): SectionData['ctaPressure'] {
  if (v === 'none' || v === 'soft') return v;
  return 'firm'; // medium, firm, hard → firm
}

function buildSections(): AssetRow[] {
  const { section_kinds } = readYaml<{ section_kinds: CanonSectionKind[] }>('sections.yaml');
  return section_kinds.map((sk, i) => {
    const data: SectionData = {
      kind: sk.kind,
      layoutStrategy: sk.layoutStrategy,
      ctaPressure: mapCtaPressure(sk.ctaPressure),
      densitySupport: sk.densitySupport,
    };
    const name = `${titleFromId(sk.kind)} — ${sk.layoutStrategy}`;
    const description = `${titleFromId(sk.kind)}-sectie met layout "${sk.layoutStrategy}".`;
    return {
      provenance: `canon:section:${sk.kind}`,
      type: 'section',
      slug: sk.kind,
      name,
      description,
      // Hero, proof, features, cta free; the rest pro (mirrors the demo split spirit).
      tier: i < 4 ? 'free' : 'pro',
      tags: ['secties', sk.kind],
      data,
      prompt: [
        `Bouw een ${sk.kind}-sectie volgens de "${sk.layoutStrategy}"-strategie:`,
        `- CTA-druk: ${data.ctaPressure === 'none' ? 'geen CTA in deze sectie' : data.ctaPressure === 'soft' ? 'één zachte CTA' : 'één duidelijke, stevige CTA'}`,
        `- Ondersteunde dichtheid: ${data.densitySupport.join(', ')}`,
        '- Houd de sectie tot één taak beperkt; geen tweede kop of concurrerende actie.',
      ].join('\n'),
    };
  });
}

// ── Design systems (from silhouettes) ─────────────────────────────────────────

type CanonSilhouette = { id: string; name: string; sectionOrder: string[] };

function buildDesignSystems(defaultPaletteRef: string, defaultTypographyRef: string): AssetRow[] {
  const { silhouettes } = readYaml<{ silhouettes: CanonSilhouette[] }>('silhouettes.yaml');
  return silhouettes.map((s, i) => {
    const slug = cleanSlug(s.id, 'silhouette.');
    // Default refs = the first canon palette/typography. A later slice can pair
    // each silhouette with a curated palette; this keeps the seam clean.
    const data: DesignSystemData = {
      paletteRef: defaultPaletteRef,
      typographyRef: defaultTypographyRef,
      silhouette: { name: s.name, sectionOrder: s.sectionOrder },
    };
    return {
      provenance: `canon:design_system:${slug}`,
      type: 'design_system',
      slug,
      name: s.name,
      description: `Sectievolgorde: ${s.sectionOrder.join(' → ')}.`,
      tier: i === 0 ? 'free' : 'pro',
      tags: ['design system'],
      data,
      prompt: [
        `Bouw de pagina volgens het "${s.name}" systeem:`,
        `- Sectievolgorde: ${s.sectionOrder.join(' → ')}`,
        `- Palet: ${defaultPaletteRef}`,
        `- Typografie: ${defaultTypographyRef}`,
        '- Dichtheid: hero airy, midden balanced, faq dense.',
        '- Toon: kalm en premium; accent spaarzaam, alleen op acties en één moment per sectie.',
      ].join('\n'),
    };
  });
}

// ── Media ─────────────────────────────────────────────────────────────────────

type CanonMedia = {
  id: string;
  name: string;
  assetPath: string;
  width: number;
  height: number;
  aspectRatio: string;
  category: string;
  tags?: string[];
  roles?: string[];
};

// Deterministic placeholder gradient per category so cards render before the
// real binary is served (binaries are NOT copied this slice — see canon_path).
const CATEGORY_GRADIENT: Record<string, string> = {
  Abstract: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 45%, #b85d3b 130%)',
  Texture: 'linear-gradient(160deg, #f9f6f0 0%, #efe9df 60%, #e8e1d5 100%)',
  Nature: 'linear-gradient(120deg, #162017 0%, #2b5c45 70%, #7b6a58 140%)',
};
function placeholderFor(category: string): string {
  return (
    CATEGORY_GRADIENT[category] ?? 'linear-gradient(135deg, #191C24 0%, #353634 60%, #9C532C 130%)'
  );
}

function buildMedia(): { rows: AssetRow[]; media: Map<string, CanonMedia> } {
  const json = JSON.parse(readFileSync(join(MEDIA_DIR, 'stock-images.generated.json'), 'utf8')) as {
    media: CanonMedia[];
  };
  const media = new Map<string, CanonMedia>();
  const rows = json.media.map((m) => {
    const data: MediaData = {
      aspectRatio: m.aspectRatio,
      category: m.category,
      placeholder: placeholderFor(m.category),
    };
    const provenance = `canon:media:${m.id}`;
    media.set(provenance, m);
    return {
      provenance,
      type: 'media' as const,
      slug: m.id,
      name: m.name,
      description: `${m.category} · ${m.aspectRatio}`,
      tier: 'free' as AssetTier,
      tags: ['media', ...(m.tags ?? [])].slice(0, 6),
      data,
      prompt: `Gebruik dit ${m.category.toLowerCase()}-beeld (${m.aspectRatio}) full-bleed als sectie-achtergrond. Leg er een donkere overlay van 35% over zodat tekst leesbaar blijft.`,
    };
  });
  return { rows, media };
}

// ── Upsert ────────────────────────────────────────────────────────────────────

async function upsertAssets(rows: AssetRow[]): Promise<Map<string, string>> {
  const idByProvenance = new Map<string, string>();
  // Chunked to keep parameter counts sane for the 898-row media batch.
  const CHUNK = 200;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const batch = rows.slice(i, i + CHUNK);
    const returned = await db
      .insert(assets)
      .values(batch)
      .onConflictDoUpdate({
        target: assets.provenance,
        set: {
          type: sql`excluded.type`,
          slug: sql`excluded.slug`,
          name: sql`excluded.name`,
          description: sql`excluded.description`,
          prompt: sql`excluded.prompt`,
          data: sql`excluded.data`,
          tier: sql`excluded.tier`,
          tags: sql`excluded.tags`,
          updatedAt: sql`now()`,
        },
      })
      .returning({ id: assets.id, provenance: assets.provenance });
    for (const r of returned) idByProvenance.set(r.provenance, r.id);
  }
  return idByProvenance;
}

async function upsertAssetMedia(
  idByProvenance: Map<string, string>,
  media: Map<string, CanonMedia>
): Promise<void> {
  const rows = [...media.entries()].map(([provenance, m]) => ({
    assetId: idByProvenance.get(provenance)!,
    canonPath: m.assetPath,
    aspectRatio: m.aspectRatio,
    width: m.width,
    height: m.height,
    placeholder: placeholderFor(m.category),
    role: m.roles?.[0] ?? null,
  }));
  // asset_media has no natural unique key beyond asset_id; clear + reinsert the
  // media rows for imported assets so re-runs stay idempotent.
  const assetIds = rows.map((r) => r.assetId);
  if (assetIds.length === 0) return;
  const CHUNK = 200;
  for (let i = 0; i < assetIds.length; i += CHUNK) {
    await db.delete(assetMedia).where(inArray(assetMedia.assetId, assetIds.slice(i, i + CHUNK)));
  }
  for (let i = 0; i < rows.length; i += CHUNK) {
    await db.insert(assetMedia).values(rows.slice(i, i + CHUNK));
  }
}

async function main() {
  const palettes = buildPalettes();
  const typography = buildTypography();
  const sections = buildSections();
  const designSystems = buildDesignSystems(palettes[0].slug, typography[0].slug);
  const { rows: mediaRows, media } = buildMedia();

  const allRows = [...palettes, ...typography, ...sections, ...designSystems, ...mediaRows];
  const idByProvenance = await upsertAssets(allRows);
  await upsertAssetMedia(idByProvenance, media);

  console.log('Canon import complete:');
  console.log(`  palette        ${palettes.length}`);
  console.log(`  typography     ${typography.length}`);
  console.log(`  section        ${sections.length}`);
  console.log(`  design_system  ${designSystems.length}`);
  console.log(`  media          ${mediaRows.length}`);
  console.log(`  total assets   ${allRows.length}`);

  process.exit(0);
}

main().catch((err) => {
  console.error('✗ canon import failed:', err);
  process.exit(1);
});

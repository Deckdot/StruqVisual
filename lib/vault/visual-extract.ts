/**
 * Extraction heuristics for type-specific visual renderers (Gallery Vault).
 * Pure text parsing — no rendering, no dependencies.
 */

/** Minimal asset shape the extractors need; the DB model lands in M2. */
type AssetSummary = {
  title: string;
  summary?: string | null;
  body?: string | null;
};

const HEX_COLOR_PATTERN = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g;
const RGB_COLOR_PATTERN = /rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(?:\s*,\s*[\d.]+)?\s*\)/g;
const HSL_COLOR_PATTERN = /hsla?\(\s*[\d.]+(?:deg)?\s*,?\s*[\d.]+%\s*,?\s*[\d.]+%(?:\s*[,/]\s*[\d.]+%?)?\s*\)/g;
const OKLCH_COLOR_PATTERN = /oklch\(\s*[\d.]+%?\s+[\d.]+\s+[\d.]+(?:\s*\/\s*[\d.]+%?)?\s*\)/g;

export const MAX_PALETTE_SWATCHES = 12;

function normalizeHex(hex: string): string {
  return hex.toLowerCase();
}

/** Pull renderable CSS colors out of free text, ordered by first appearance, deduped. */
export function extractPaletteColors(text: string, limit = MAX_PALETTE_SWATCHES): string[] {
  if (!text) return [];

  const matches: { index: number; value: string }[] = [];
  for (const pattern of [HEX_COLOR_PATTERN, RGB_COLOR_PATTERN, HSL_COLOR_PATTERN, OKLCH_COLOR_PATTERN]) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      matches.push({ index: match.index, value: match[0] });
    }
  }

  matches.sort((a, b) => a.index - b.index);

  const seen = new Set<string>();
  const colors: string[] = [];
  for (const { value } of matches) {
    const normalized = value.startsWith('#') ? normalizeHex(value) : value.replace(/\s+/g, ' ');
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    colors.push(normalized);
    if (colors.length >= limit) break;
  }

  return colors;
}

export function extractAssetPaletteColors(asset: Pick<AssetSummary, 'title' | 'summary' | 'body'>): string[] {
  return extractPaletteColors([asset.body ?? '', asset.summary ?? '', asset.title].join('\n'));
}

/** Perceived luminance — decides whether a swatch label reads light or dark. */
export function isLightColor(color: string): boolean {
  const hexMatch = color.match(/^#([0-9a-f]{3,8})$/i);
  if (!hexMatch) {
    // Non-hex colors: cheap heuristic on lightness percentage when present
    const lightness = color.match(/,\s*([\d.]+)%\s*[,)]/);
    if (lightness) return parseFloat(lightness[1]) > 60;
    return false;
  }

  let hex = hexMatch[1];
  if (hex.length <= 4) {
    hex = hex.split('').map((char) => char + char).join('');
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62;
}

const FONT_FAMILY_PATTERN = /font-family\s*:\s*["']?([^;"'\n,]+)/i;
const FONT_LINE_PATTERN = /^(?:#+\s*)?(?:font|typeface|lettertype|display|heading|body)\s*[:\-]\s*(.+)$/im;

/**
 * Best-effort font name for the specimen renderer.
 * Priority: explicit `font-family:` in the body → a "Font: X" style line → the title.
 */
export function extractFontName(asset: Pick<AssetSummary, 'title' | 'body'>): string {
  const body = asset.body ?? '';

  const familyMatch = body.match(FONT_FAMILY_PATTERN);
  if (familyMatch) return familyMatch[1].trim();

  const lineMatch = body.match(FONT_LINE_PATTERN);
  if (lineMatch) {
    const name = lineMatch[1].trim().replace(/[*_`]/g, '');
    if (name.length > 0 && name.length <= 60) return name;
  }

  return asset.title.trim();
}

// Server-only module: imported exclusively by server components and route
// handlers. All asset SQL lives here; never import it into a client component.
import { and, eq, inArray, or, ilike, sql } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { assets, favorites } from '@/lib/db/schema';
import type { AssetTier, AssetType, VaultAsset } from '@/lib/vault/types';

/**
 * The only place SQL for assets lives. Every function returns rows already
 * shaped as `VaultAsset` (from lib/vault/types.ts) so the vault UI is untouched
 * when it swaps off demo data. Routes/components stay thin — no queries in the
 * UI layer.
 *
 * This module is also the single tier gate: every read takes `viewerTier` and
 * `toVaultAsset` blanks the `prompt` of a Pro asset for a free viewer. The paid
 * payload never leaves the server for an unentitled user — the UI cannot leak
 * what it never receives. `getAssetPromptForViewer` re-checks the same rule for
 * the copy route. Gating lives here, never only in the UI.
 */

type AssetRow = typeof assets.$inferSelect;

/** A Pro asset is withheld from a free viewer; anything else is fully readable. */
function isLockedFor(row: Pick<AssetRow, 'tier'>, viewerTier: AssetTier): boolean {
  return row.tier === 'pro' && viewerTier !== 'pro';
}

function toVaultAsset(row: AssetRow, viewerTier: AssetTier): VaultAsset {
  const locked = isLockedFor(row, viewerTier);
  return {
    id: row.id,
    type: row.type,
    slug: row.slug,
    name: row.name,
    description: row.description,
    // Withhold the paid payload from unentitled viewers — the preview (`data`)
    // still ships so the asset is honestly teased, only the prompt is gated.
    prompt: locked ? '' : row.prompt,
    data: row.data,
    tier: row.tier,
    tags: row.tags,
    locked,
  };
}

// Stable ordering for the gallery: visual types first, then media, name A→Z.
const TYPE_ORDER: AssetType[] = ['palette', 'typography', 'design_system', 'section', 'media'];
// Order: visual type rank → free before pro (surfaces the canonical set first,
// matching the demo's lead items) → name A→Z.
const orderExpr = sql`array_position(ARRAY['palette','typography','design_system','section','media']::text[], ${assets.type}::text), (${assets.tier} = 'pro'), ${assets.name}`;

/**
 * The vault browse surface: optional type filter, optional text search over
 * name/description/tags, optional restriction to a set of saved asset ids.
 * Media is excluded from the "all" gallery by default to keep it browsable —
 * pass `includeMedia` or filter `type: 'media'` explicitly to see it.
 */
export async function listAssets(opts: {
  type?: AssetType;
  query?: string;
  savedIds?: string[];
  includeMedia?: boolean;
  limit?: number;
  /** Viewer's tier; Pro-asset prompts are blanked for anything but 'pro'. */
  viewerTier?: AssetTier;
} = {}): Promise<VaultAsset[]> {
  const viewerTier = opts.viewerTier ?? 'free';
  const conditions = [];

  if (opts.type) conditions.push(eq(assets.type, opts.type));
  else if (!opts.includeMedia) conditions.push(sql`${assets.type} <> 'media'`);

  if (opts.savedIds) {
    if (opts.savedIds.length === 0) return [];
    conditions.push(inArray(assets.id, opts.savedIds));
  }

  const q = opts.query?.trim();
  if (q) {
    const like = `%${q}%`;
    conditions.push(
      or(
        ilike(assets.name, like),
        ilike(assets.description, like),
        sql`EXISTS (SELECT 1 FROM unnest(${assets.tags}) tag WHERE tag ILIKE ${like})`
      )!
    );
  }

  const rows = await db
    .select()
    .from(assets)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(orderExpr)
    .limit(opts.limit ?? 500);

  return rows.map((r) => toVaultAsset(r, viewerTier));
}

/** Featured strip / any explicit id set, order preserved to match `ids`. */
export async function getAssetsByIds(
  ids: string[],
  viewerTier: AssetTier = 'free'
): Promise<VaultAsset[]> {
  if (ids.length === 0) return [];
  const rows = await db.select().from(assets).where(inArray(assets.id, ids));
  const byId = new Map(rows.map((r) => [r.id, toVaultAsset(r, viewerTier)]));
  return ids.map((id) => byId.get(id)).filter((a): a is VaultAsset => Boolean(a));
}

/** Featured strip by stable provenance id (survives re-imports / UUID churn). */
export async function getAssetsByProvenance(
  provenances: string[],
  viewerTier: AssetTier = 'free'
): Promise<VaultAsset[]> {
  if (provenances.length === 0) return [];
  const rows = await db.select().from(assets).where(inArray(assets.provenance, provenances));
  const byProv = new Map(rows.map((r) => [r.provenance, r] as const));
  return provenances
    .map((p) => byProv.get(p))
    .filter((r): r is AssetRow => Boolean(r))
    .map((r) => toVaultAsset(r, viewerTier));
}

/** Global header search (substring, capped). Includes media. */
export async function searchAssets(
  query: string,
  limit = 6,
  viewerTier: AssetTier = 'free'
): Promise<VaultAsset[]> {
  const q = query.trim();
  if (!q) return [];
  return listAssets({ query: q, includeMedia: true, limit, viewerTier });
}

/**
 * The copy route's server-side re-check: returns a Pro asset's prompt only when
 * the viewer is entitled. `null` = asset missing OR locked for this viewer — the
 * route maps both to a refusal so a free client can't obtain a Pro payload by
 * hitting the endpoint directly. This is the same gate as `toVaultAsset`.
 */
export async function getAssetPromptForViewer(
  assetId: string,
  viewerTier: AssetTier
): Promise<string | null> {
  const rows = await db
    .select({ prompt: assets.prompt, tier: assets.tier })
    .from(assets)
    .where(eq(assets.id, assetId));
  const row = rows[0];
  if (!row) return null;
  if (isLockedFor(row, viewerTier)) return null;
  return row.prompt;
}

// ── Favorites (DB path for saved assets; localStorage stays the fallback) ─────

export async function getFavorites(userId: string): Promise<string[]> {
  const rows = await db
    .select({ assetId: favorites.assetId })
    .from(favorites)
    .where(eq(favorites.userId, userId));
  return rows.map((r) => r.assetId);
}

/** Toggle a favorite; returns true if it is now saved, false if removed. */
export async function toggleFavorite(userId: string, assetId: string): Promise<boolean> {
  const existing = await db
    .select({ assetId: favorites.assetId })
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.assetId, assetId)));

  if (existing.length > 0) {
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.assetId, assetId)));
    return false;
  }
  await db.insert(favorites).values({ userId, assetId }).onConflictDoNothing();
  return true;
}

export { TYPE_ORDER };

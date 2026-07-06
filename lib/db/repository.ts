// Server-only module: imported exclusively by server components and route
// handlers. All asset SQL lives here; never import it into a client component.
import { and, eq, inArray, or, ilike, sql } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { assetMedia, assets, favorites } from '@/lib/db/schema';
import type {
  AssetTier,
  MediaData,
  AssetType,
  VaultAsset,
  VaultAssetsPage,
  VaultBrowseFilter,
} from '@/lib/vault/types';

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
type AssetMediaRow = typeof assetMedia.$inferSelect;

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

async function getMediaByAssetId(assetIds: string[]): Promise<Map<string, AssetMediaRow>> {
  if (assetIds.length === 0) return new Map();
  const rows = await db
    .select()
    .from(assetMedia)
    .where(inArray(assetMedia.assetId, assetIds));
  return new Map(rows.map((row) => [row.assetId, row]));
}

async function toVaultAssets(rows: AssetRow[], viewerTier: AssetTier): Promise<VaultAsset[]> {
  const mediaByAssetId = await getMediaByAssetId(
    rows.filter((row) => row.type === 'media').map((row) => row.id)
  );

  return rows.map((row) => {
    const asset = toVaultAsset(row, viewerTier);
    if (row.type !== 'media') return asset;

    const media = mediaByAssetId.get(row.id);
    const data = asset.data as MediaData;

    return {
      ...asset,
      data: {
        ...data,
        aspectRatio: media?.aspectRatio ?? data.aspectRatio,
        placeholder: media?.placeholder ?? data.placeholder,
        width: media?.width ?? data.width,
        height: media?.height ?? data.height,
        alt: row.name,
        src: `/api/media/${row.id}`,
      },
    };
  });
}

// Stable ordering for the gallery: visual types first, then media, name A→Z.
const TYPE_ORDER: AssetType[] = ['palette', 'typography', 'design_system', 'section', 'media'];
// Order: visual type rank → free before pro (surfaces the canonical set first,
// matching the demo's lead items) → name A→Z.
const orderExpr = sql`array_position(ARRAY['palette','typography','design_system','section','media']::text[], ${assets.type}::text), (${assets.tier} = 'pro'), ${assets.name}, ${assets.id}`;
export const VAULT_PAGE_SIZE = 36;

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

  return toVaultAssets(rows, viewerTier);
}

function buildAssetConditions(opts: {
  type?: AssetType;
  query?: string;
  savedIds?: string[];
  includeMedia?: boolean;
}) {
  const conditions = [];

  if (opts.type) conditions.push(eq(assets.type, opts.type));
  else if (!opts.includeMedia) conditions.push(sql`${assets.type} <> 'media'`);

  if (opts.savedIds) {
    if (opts.savedIds.length === 0) return { conditions, empty: true };
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

  return { conditions, empty: false };
}

export async function listVaultAssetsPage(opts: {
  filter: VaultBrowseFilter;
  query?: string;
  page?: number;
  limit?: number;
  savedIds?: string[];
  viewerTier?: AssetTier;
}): Promise<VaultAssetsPage> {
  const viewerTier = opts.viewerTier ?? 'free';
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.max(1, Math.min(opts.limit ?? VAULT_PAGE_SIZE, VAULT_PAGE_SIZE));
  const assetType = opts.filter === 'all' || opts.filter === 'saved' ? undefined : opts.filter;
  const savedIds = opts.filter === 'saved' ? opts.savedIds ?? [] : undefined;
  const { conditions, empty } = buildAssetConditions({
    type: assetType,
    query: opts.query,
    savedIds,
    includeMedia: true,
  });

  if (empty) {
    return { items: [], total: 0, hasMore: false, page, limit };
  }

  const where = conditions.length ? and(...conditions) : undefined;
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(assets)
    .where(where);

  const rows = await db
    .select()
    .from(assets)
    .where(where)
    .orderBy(orderExpr)
    .limit(limit)
    .offset((page - 1) * limit);

  return {
    items: await toVaultAssets(rows, viewerTier),
    total: count,
    hasMore: page * limit < count,
    page,
    limit,
  };
}

/** Featured strip / any explicit id set, order preserved to match `ids`. */
export async function getAssetsByIds(
  ids: string[],
  viewerTier: AssetTier = 'free'
): Promise<VaultAsset[]> {
  if (ids.length === 0) return [];
  const rows = await db.select().from(assets).where(inArray(assets.id, ids));
  const hydrated = await toVaultAssets(rows, viewerTier);
  const byId = new Map(hydrated.map((row) => [row.id, row]));
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
  return toVaultAssets(
    provenances
      .map((p) => byProv.get(p))
      .filter((r): r is AssetRow => Boolean(r)),
    viewerTier
  );
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

export async function getMediaObjectPath(assetId: string): Promise<string | null> {
  const rows = await db
    .select({ type: assets.type, canonPath: assetMedia.canonPath })
    .from(assets)
    .innerJoin(assetMedia, eq(assetMedia.assetId, assets.id))
    .where(eq(assets.id, assetId));
  const row = rows[0];
  if (!row || row.type !== 'media') return null;
  return row.canonPath;
}

// ── Favorites (DB path for saved assets; localStorage stays the fallback) ─────

export async function getFavorites(userId: string): Promise<string[]> {
  const rows = await db
    .select({ assetId: favorites.assetId })
    .from(favorites)
    .where(eq(favorites.userId, userId));
  return rows.map((r) => r.assetId);
}

/**
 * Idempotent batch-merge for the anonymous→authenticated migration: inserts
 * any of `assetIds` not already favorited, silently skipping ids that don't
 * exist in `assets` (FK) or are already saved (composite PK). Returns the
 * full merged favorites list for this user.
 */
export async function mergeFavorites(userId: string, assetIds: string[]): Promise<string[]> {
  if (assetIds.length > 0) {
    const existing = await db.select({ id: assets.id }).from(assets).where(inArray(assets.id, assetIds));
    const validIds = existing.map((r) => r.id);
    if (validIds.length > 0) {
      await db
        .insert(favorites)
        .values(validIds.map((assetId) => ({ userId, assetId })))
        .onConflictDoNothing();
    }
  }
  return getFavorites(userId);
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

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth/session';
import { getFavorites, listVaultAssetsPage, VAULT_PAGE_SIZE } from '@/lib/db/repository';
import { ASSET_TYPES } from '@/lib/vault/types';

const filterSchema = z.enum(['all', 'saved', ...ASSET_TYPES]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = z
    .object({
      filter: filterSchema.default('all'),
      q: z.string().trim().optional().default(''),
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(VAULT_PAGE_SIZE).default(VAULT_PAGE_SIZE),
      savedIds: z.string().optional().default(''),
    })
    .safeParse({
      filter: searchParams.get('filter') ?? 'all',
      q: searchParams.get('q') ?? '',
      page: searchParams.get('page') ?? 1,
      limit: searchParams.get('limit') ?? VAULT_PAGE_SIZE,
      savedIds: searchParams.get('savedIds') ?? '',
    });

  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid query' }, { status: 400 });
  }

  const viewer = await getSessionUser();
  const savedIds =
    parsed.data.filter === 'saved'
      ? viewer
        ? await getFavorites(viewer.id)
        : parsed.data.savedIds
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean)
      : undefined;

  const page = await listVaultAssetsPage({
    filter: parsed.data.filter,
    query: parsed.data.q,
    page: parsed.data.page,
    limit: parsed.data.limit,
    savedIds,
    viewerTier: viewer?.tier ?? 'free',
  });

  return NextResponse.json(page);
}

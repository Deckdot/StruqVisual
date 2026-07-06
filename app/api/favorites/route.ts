import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUserId } from '@/lib/auth/session';
import { getFavorites, mergeFavorites, toggleFavorite } from '@/lib/db/repository';

// DB-backed favorites (replaces the saved-assets localStorage for signed-in
// users). No session cookie yet in M2 → 401, and the client falls back to
// localStorage. M5 issues the cookie at login and this path goes live.

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ savedIds: null }, { status: 401 });
  return NextResponse.json({ savedIds: await getFavorites(userId) });
}

const toggleSchema = z.object({ assetId: z.string().uuid() });
// Anonymous→authenticated migration: batch-merge localStorage ids on signup/login.
const mergeSchema = z.object({ assetIds: z.array(z.string().uuid()) });

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const body = await request.json().catch(() => null);

  const mergeParsed = mergeSchema.safeParse(body);
  if (mergeParsed.success) {
    const savedIds = await mergeFavorites(userId, mergeParsed.data.assetIds);
    return NextResponse.json({ savedIds });
  }

  const parsed = toggleSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'invalid body' }, { status: 400 });

  const saved = await toggleFavorite(userId, parsed.data.assetId);
  return NextResponse.json({ saved });
}

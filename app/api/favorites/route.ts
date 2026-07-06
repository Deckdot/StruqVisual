import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUserId } from '@/lib/auth/session';
import { getFavorites, toggleFavorite } from '@/lib/db/repository';

// DB-backed favorites (replaces the saved-assets localStorage for signed-in
// users). No session cookie yet in M2 → 401, and the client falls back to
// localStorage. M5 issues the cookie at login and this path goes live.

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ savedIds: null }, { status: 401 });
  return NextResponse.json({ savedIds: await getFavorites(userId) });
}

const toggleSchema = z.object({ assetId: z.string().uuid() });

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const parsed = toggleSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'invalid body' }, { status: 400 });

  const saved = await toggleFavorite(userId, parsed.data.assetId);
  return NextResponse.json({ saved });
}

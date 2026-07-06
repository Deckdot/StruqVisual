import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { getSessionUserId } from '@/lib/auth/session';
import { db } from '@/lib/db/client';
import { importedIconCandidates } from '@/lib/db/schema';
import type { IconSet } from '@/lib/canon/types';

// DB-backed icon candidates (replaces lib/canon/use-icon-candidates localStorage
// for signed-in users). No session cookie yet in M2 → 401, client falls back to
// localStorage. Mirrors /api/favorites.

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ candidates: null }, { status: 401 });

  const rows = await db
    .select({ payload: importedIconCandidates.payload })
    .from(importedIconCandidates)
    .where(eq(importedIconCandidates.userId, userId));
  return NextResponse.json({ candidates: rows.map((r) => r.payload) });
}

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const set = (await request.json().catch(() => null)) as IconSet | null;
  if (!set || typeof set.id !== 'string') {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }
  const payload: IconSet = { ...set, source: 'candidate' };
  await db
    .insert(importedIconCandidates)
    .values({ id: set.id, userId, payload })
    .onConflictDoUpdate({ target: importedIconCandidates.id, set: { payload, userId } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
  await db
    .delete(importedIconCandidates)
    .where(and(eq(importedIconCandidates.id, id), eq(importedIconCandidates.userId, userId)));
  return NextResponse.json({ ok: true });
}

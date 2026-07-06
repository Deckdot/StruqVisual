import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session';
import { searchAssets } from '@/lib/db/repository';

// Thin route handler for the header search-on-keystroke. The client can't call
// the repository directly (server-only SQL), so it hits this. Repository owns
// the query; this just validates input and shapes the response. It returns
// id/name/type only (no prompt), but the viewer tier is still threaded so the
// gate stays uniform across every read path.
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get('q')?.trim() ?? '';
  if (!q) return NextResponse.json({ results: [] });

  const viewer = await getSessionUser();
  const results = await searchAssets(q, 6, viewer?.tier ?? 'free');
  return NextResponse.json({
    results: results.map((a) => ({ id: a.id, name: a.name, type: a.type, locked: a.locked })),
  });
}

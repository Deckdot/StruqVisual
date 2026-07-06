import { NextResponse } from 'next/server';
import { searchAssets } from '@/lib/db/repository';

// Thin route handler for the header search-on-keystroke. The client can't call
// the repository directly (server-only SQL), so it hits this. Repository owns
// the query; this just validates input and shapes the response.
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get('q')?.trim() ?? '';
  if (!q) return NextResponse.json({ results: [] });

  const results = await searchAssets(q, 6);
  return NextResponse.json({
    results: results.map((a) => ({ id: a.id, name: a.name, type: a.type })),
  });
}

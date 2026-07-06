import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth/session';
import { getAssetPromptForViewer } from '@/lib/db/repository';

// The copy action's server-side entitlement check. The card fetches the prompt
// here rather than reading it from props, so a free client cannot obtain a Pro
// payload by any route: the props are already stripped (repository gate) and
// this endpoint re-checks tier against the DB. A locked or missing asset both
// resolve to 403 — we never reveal whether a Pro id exists to an unentitled
// viewer, and never leak the payload.

const idSchema = z.string().uuid();

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return NextResponse.json({ error: 'invalid id' }, { status: 400 });

  const viewer = await getSessionUser();
  const prompt = await getAssetPromptForViewer(parsed.data, viewer?.tier ?? 'free');
  if (prompt === null) {
    return NextResponse.json({ error: 'locked' }, { status: 403 });
  }
  return NextResponse.json({ prompt });
}

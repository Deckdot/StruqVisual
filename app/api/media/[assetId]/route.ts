import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getMediaObjectPath } from '@/lib/db/repository';
import { canonPathToBucketKey, getPresignedMediaUrl } from '@/lib/media/railway-bucket';

const paramsSchema = z.object({ assetId: z.string().uuid() });

export async function GET(
  _request: Request,
  context: { params: Promise<{ assetId: string }> }
) {
  const params = await context.params;
  const parsed = paramsSchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid asset id' }, { status: 400 });
  }

  const canonPath = await getMediaObjectPath(parsed.data.assetId);
  if (!canonPath) {
    return NextResponse.json({ error: 'media not found' }, { status: 404 });
  }

  const signedUrl = await getPresignedMediaUrl(canonPathToBucketKey(canonPath));
  return NextResponse.redirect(signedUrl, {
    status: 302,
    headers: {
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=900',
    },
  });
}

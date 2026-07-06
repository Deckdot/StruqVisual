import '@/lib/db/env';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { db } from '@/lib/db/client';
import { assetMedia } from '@/lib/db/schema';
import {
  canonPathToBucketKey,
  headBucketObject,
  putBucketObject,
} from '@/lib/media/railway-bucket';

const DESIGNOS_PUBLIC_ROOT = join(process.cwd(), '..', 'DesignOS', 'apps', 'designos', 'public');

function contentTypeFor(filePath: string) {
  switch (extname(filePath).toLowerCase()) {
    case '.webp':
      return 'image/webp';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.avif':
      return 'image/avif';
    default:
      return 'application/octet-stream';
  }
}

async function main() {
  const rows = await db
    .select({ canonPath: assetMedia.canonPath })
    .from(assetMedia);

  const canonPaths = [...new Set(rows.map((row) => row.canonPath).filter((path): path is string => Boolean(path)))];

  let uploaded = 0;
  let skipped = 0;
  let missing = 0;

  for (const canonPath of canonPaths) {
    const key = canonPathToBucketKey(canonPath);
    const localPath = join(DESIGNOS_PUBLIC_ROOT, key);

    if (!existsSync(localPath)) {
      missing += 1;
      console.warn(`missing  ${localPath}`);
      continue;
    }

    const body = readFileSync(localPath);
    const localMd5 = createHash('md5').update(body).digest('hex');
    const existing = await headBucketObject(key);
    const existingEtag = existing?.ETag?.replace(/"/g, '');

    if (existingEtag === localMd5 && existing?.ContentLength === body.length) {
      skipped += 1;
      continue;
    }

    await putBucketObject({
      key,
      body,
      contentType: contentTypeFor(localPath),
      cacheControl: 'public, max-age=31536000, immutable',
    });
    uploaded += 1;
    console.log(`uploaded ${key}`);
  }

  console.log('');
  console.log(`media upload complete`);
  console.log(`  uploaded  ${uploaded}`);
  console.log(`  skipped   ${skipped}`);
  console.log(`  missing   ${missing}`);

  if (missing > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

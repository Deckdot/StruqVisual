import '@/lib/db/env';
import { eq, count } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { assets, assetMedia, users } from '@/lib/db/schema';

/**
 * Post-seed assertion. Exits non-zero if the DB does not hold exactly what the
 * canon import + seed are expected to produce. Wired to `db:seed:assert` and
 * run in CI / after a fresh bootstrap.
 *
 * Update these expected counts if the canon donor changes (that's the point —
 * the assertion catches silent import drift).
 */

const EXPECTED = {
  palette: 29,
  typography: 2,
  section: 9,
  design_system: 5,
  media: 898,
} as const;
const EXPECTED_ASSET_MEDIA = 898;
const DEMO_EMAIL = process.env.E2E_EMAIL ?? 'demo@struq.nl';

async function main() {
  const failures: string[] = [];

  const rows = await db
    .select({ type: assets.type, n: count() })
    .from(assets)
    .groupBy(assets.type);
  const byType = Object.fromEntries(rows.map((r) => [r.type, Number(r.n)]));

  for (const [type, expected] of Object.entries(EXPECTED)) {
    const actual = byType[type] ?? 0;
    if (actual !== expected) failures.push(`assets.${type}: expected ${expected}, got ${actual}`);
    else console.log(`  ✓ ${type.padEnd(14)} ${actual}`);
  }

  const [{ n: mediaRows }] = await db.select({ n: count() }).from(assetMedia);
  if (Number(mediaRows) !== EXPECTED_ASSET_MEDIA)
    failures.push(`asset_media: expected ${EXPECTED_ASSET_MEDIA}, got ${mediaRows}`);
  else console.log(`  ✓ asset_media    ${mediaRows}`);

  const demo = await db
    .select({ tier: users.tier })
    .from(users)
    .where(eq(users.email, DEMO_EMAIL));
  if (demo.length === 0) failures.push(`demo user ${DEMO_EMAIL} missing`);
  else if (demo[0].tier !== 'pro') failures.push(`demo user tier: expected pro, got ${demo[0].tier}`);
  else console.log(`  ✓ demo user      ${DEMO_EMAIL} (pro)`);

  if (failures.length > 0) {
    console.error('\n✗ seed assertions FAILED:');
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log('\n✓ all seed assertions passed.');
  process.exit(0);
}

main().catch((err) => {
  console.error('✗ seed-assert failed:', err);
  process.exit(1);
});

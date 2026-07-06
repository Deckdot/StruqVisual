import '@/lib/db/env';
import { and, eq, count } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { assets, assetMedia, users, accounts } from '@/lib/db/schema';

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
const DEMO_EMAIL = (process.env.E2E_EMAIL ?? 'demo@struq.nl').toLowerCase();
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? 'admin@struq.nl').toLowerCase();

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
    .select({ id: users.id, tier: users.tier })
    .from(users)
    .where(eq(users.email, DEMO_EMAIL));
  if (demo.length === 0) failures.push(`demo user ${DEMO_EMAIL} missing`);
  else if (demo[0].tier !== 'pro') failures.push(`demo user tier: expected pro, got ${demo[0].tier}`);
  else console.log(`  ✓ demo user      ${DEMO_EMAIL} (pro)`);

  if (demo.length > 0) {
    const cred = await db
      .select({ hash: accounts.passwordHash })
      .from(accounts)
      .where(and(eq(accounts.userId, demo[0].id), eq(accounts.provider, 'credentials')));
    if (cred.length === 0 || !cred[0].hash) failures.push('demo credentials account missing a password hash');
    else console.log(`  ✓ demo login     credentials account present`);
  }

  const admin = await db
    .select({ id: users.id, tier: users.tier, isAdmin: users.isAdmin })
    .from(users)
    .where(eq(users.email, ADMIN_EMAIL));
  if (admin.length === 0) failures.push(`admin user ${ADMIN_EMAIL} missing`);
  else if (admin[0].tier !== 'pro') failures.push(`admin user tier: expected pro, got ${admin[0].tier}`);
  else if (!admin[0].isAdmin) failures.push(`admin user isAdmin: expected true, got false`);
  else console.log(`  ✓ admin user     ${ADMIN_EMAIL} (pro, isAdmin)`);

  if (admin.length > 0) {
    const cred = await db
      .select({ hash: accounts.passwordHash })
      .from(accounts)
      .where(and(eq(accounts.userId, admin[0].id), eq(accounts.provider, 'credentials')));
    if (cred.length === 0 || !cred[0].hash) failures.push('admin credentials account missing a password hash');
    else console.log(`  ✓ admin login    credentials account present`);
  }

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

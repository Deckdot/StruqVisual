import '@/lib/db/env';
import { eq, and } from 'drizzle-orm';
import { verify as argon2Verify } from '@node-rs/argon2';
import { db } from '@/lib/db/client';
import { users, accounts } from '@/lib/db/schema';

/**
 * Smoke-test the seeded admin account. Confirms the user row exists, the
 * account is pro + isAdmin, and the password (ADMIN_PASSWORD env, falls back
 * to the seed default) verifies against the stored argon2 hash.
 *
 * Exits 0 only when ALL three checks pass — safe to wire into CI / a Railway
 * one-off after a prod seed:
 *
 *   railway run npx tsx scripts/verify-admin.ts
 */

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? 'admin@struq.nl').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'Release11!';

async function main() {
  const u = await db.query.users.findFirst({ where: eq(users.email, ADMIN_EMAIL) });
  if (!u) {
    console.error(`✗ admin user ${ADMIN_EMAIL} not found`);
    process.exit(1);
  }
  console.log(
    `  ✓ user ${u.email} tier=${u.tier} isAdmin=${u.isAdmin} emailVerified=${Boolean(u.emailVerified)}`
  );

  if (u.tier !== 'pro') {
    console.error(`✗ admin user tier is "${u.tier}", expected "pro"`);
    process.exit(1);
  }
  if (!u.isAdmin) {
    console.error(`✗ admin user isAdmin is false`);
    process.exit(1);
  }

  const a = await db
    .select({ hash: accounts.passwordHash })
    .from(accounts)
    .where(and(eq(accounts.userId, u.id), eq(accounts.provider, 'credentials')));
  if (a.length === 0 || !a[0].hash) {
    console.error('✗ admin credentials account row missing or has no password hash');
    process.exit(1);
  }

  const ok = await argon2Verify(a[0].hash, ADMIN_PASSWORD);
  if (!ok) {
    console.error(`✗ password does not verify against the stored hash`);
    process.exit(1);
  }
  console.log('  ✓ password verifies against stored argon2 hash');
  console.log('\n✓ admin login verified.');
  process.exit(0);
}

main().catch((e) => {
  console.error('✗ verify-admin failed:', e);
  process.exit(1);
});

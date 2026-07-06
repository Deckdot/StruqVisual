import '@/lib/db/env';
import { sql } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { users } from '@/lib/db/schema';

/**
 * Seeds the local demo/E2E account. Idempotent (upsert on email).
 *
 * No password hashing this slice — real auth is M5. The email match is enough
 * for the E2E account referenced by .env.local (demo@struq.nl, pro tier).
 * When a password column lands in M5, hash with the lib M5 will use.
 */

const DEMO_EMAIL = process.env.E2E_EMAIL ?? 'demo@struq.nl';

async function main() {
  await db
    .insert(users)
    .values({ email: DEMO_EMAIL, name: 'Struq Demo', tier: 'pro', emailVerified: new Date() })
    .onConflictDoUpdate({
      target: users.email,
      set: { tier: 'pro', name: 'Struq Demo' },
    });

  const [{ id }] = await db
    .select({ id: users.id })
    .from(users)
    .where(sql`${users.email} = ${DEMO_EMAIL}`);

  console.log(`Seed complete: demo user ${DEMO_EMAIL} (pro) → ${id}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('✗ seed failed:', err);
  process.exit(1);
});

import '@/lib/db/env';
import { and, eq } from 'drizzle-orm';
import { hash as argon2Hash } from '@node-rs/argon2';
import { db } from '@/lib/db/client';
import { users, accounts } from '@/lib/db/schema';

/**
 * Seeds the local demo/E2E account (idempotent).
 *
 * Upserts the demo user (pro) AND its credentials account row holding an argon2
 * hash of E2E_PASSWORD, so `demo@struq.nl` can actually log in via the
 * email/password path — which doubles as the dev/E2E login. Real OAuth is not
 * seeded (it needs a live provider round-trip).
 */

const DEMO_EMAIL = (process.env.E2E_EMAIL ?? 'demo@struq.nl').toLowerCase();
const DEMO_PASSWORD = process.env.E2E_PASSWORD ?? 'Struq2026';

async function main() {
  await db
    .insert(users)
    .values({ email: DEMO_EMAIL, name: 'Struq Demo', tier: 'pro', emailVerified: new Date() })
    .onConflictDoUpdate({ target: users.email, set: { tier: 'pro', name: 'Struq Demo' } });

  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, DEMO_EMAIL));

  const passwordHash = await argon2Hash(DEMO_PASSWORD);
  const existingAccount = await db
    .select({ userId: accounts.userId })
    .from(accounts)
    .where(and(eq(accounts.userId, user.id), eq(accounts.provider, 'credentials')));

  if (existingAccount.length > 0) {
    await db
      .update(accounts)
      .set({ passwordHash })
      .where(and(eq(accounts.userId, user.id), eq(accounts.provider, 'credentials')));
  } else {
    await db.insert(accounts).values({
      userId: user.id,
      type: 'credentials',
      provider: 'credentials',
      providerAccountId: user.id,
      passwordHash,
    });
  }

  console.log(`Seed complete: demo user ${DEMO_EMAIL} (pro) + credentials login → ${user.id}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('✗ seed failed:', err);
  process.exit(1);
});

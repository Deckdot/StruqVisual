import '@/lib/db/env';
import { and, eq } from 'drizzle-orm';
import { hash as argon2Hash } from '@node-rs/argon2';
import { db } from '@/lib/db/client';
import { users, accounts } from '@/lib/db/schema';

/**
 * Seeds login accounts (idempotent).
 *
 * For each account: upsert the user row (tier + isAdmin) AND its credentials
 * account row holding an argon2 hash of the password, so the account can log in
 * via the email/password path. Real OAuth is not seeded (it needs a live
 * provider round-trip).
 *
 *  - Demo/E2E account: pro, non-admin. Credentials from E2E_EMAIL/E2E_PASSWORD
 *    (the Playwright suite depends on it).
 *  - Admin account: pro + isAdmin. Credentials from ADMIN_EMAIL/ADMIN_PASSWORD
 *    (falls back to admin@struq.nl). Skipped only if no password is resolvable.
 */

type SeedAccount = {
  email: string;
  name: string;
  password: string;
  isAdmin: boolean;
};

const DEMO_EMAIL = (process.env.E2E_EMAIL ?? 'demo@struq.nl').toLowerCase();
const DEMO_PASSWORD = process.env.E2E_PASSWORD ?? 'Struq2026';

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? 'admin@struq.nl').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'Release11!';

const SEED_ACCOUNTS: SeedAccount[] = [
  { email: DEMO_EMAIL, name: 'Struq Demo', password: DEMO_PASSWORD, isAdmin: false },
  { email: ADMIN_EMAIL, name: 'Struq Admin', password: ADMIN_PASSWORD, isAdmin: true },
];

async function upsertAccount({ email, name, password, isAdmin }: SeedAccount) {
  // Every seeded account is pro (full access) by design.
  await db
    .insert(users)
    .values({ email, name, tier: 'pro', isAdmin, emailVerified: new Date() })
    .onConflictDoUpdate({ target: users.email, set: { tier: 'pro', name, isAdmin } });

  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));

  const passwordHash = await argon2Hash(password);
  const existing = await db
    .select({ userId: accounts.userId })
    .from(accounts)
    .where(and(eq(accounts.userId, user.id), eq(accounts.provider, 'credentials')));

  if (existing.length > 0) {
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

  console.log(
    `  ✓ ${email} (pro${isAdmin ? ', admin' : ''}) + credentials login → ${user.id}`
  );
}

async function main() {
  // De-duplicate in case ADMIN_EMAIL and E2E_EMAIL collide.
  const seen = new Set<string>();
  for (const account of SEED_ACCOUNTS) {
    if (seen.has(account.email)) continue;
    seen.add(account.email);
    await upsertAccount(account);
  }

  console.log('Seed complete.');
  process.exit(0);
}

main().catch((err) => {
  console.error('✗ seed failed:', err);
  process.exit(1);
});

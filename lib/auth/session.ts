import { auth } from '@/lib/auth';
import type { AssetTier } from '@/lib/vault/types';

/**
 * Server-side session helpers. Backed by Auth.js (NextAuth v5, JWT strategy) —
 * `auth()` reads the session cookie. The M2 route handlers (favorites,
 * icon-candidates) call `getSessionUserId()` and 401 when null; now that a real
 * login issues a session, those DB paths activate with no change to their bodies.
 */

export async function getSessionUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

/** id + tier + admin flag for server-side gating (free vs pro; admin). */
export async function getSessionUser(): Promise<{
  id: string;
  tier: AssetTier;
  isAdmin: boolean;
} | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return {
    id: session.user.id,
    tier: session.user.tier ?? 'free',
    isAdmin: session.user.isAdmin ?? false,
  };
}

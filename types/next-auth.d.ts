import type { DefaultSession } from 'next-auth';
import type { AssetTier } from '@/lib/vault/types';

// Adds Struq's user id + tier to the session and the JWT so `auth()` /
// `useSession()` expose them (the foundation for server-side tier gating).
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      tier: AssetTier;
      isAdmin: boolean;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    tier: AssetTier;
    isAdmin: boolean;
  }
}

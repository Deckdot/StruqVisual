import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { and, eq } from 'drizzle-orm';
import { verify as argon2Verify } from '@node-rs/argon2';
import { db } from '@/lib/db/client';
import { users, accounts, sessions, verificationTokens } from '@/lib/db/schema';
import type { AssetTier } from '@/lib/vault/types';

/**
 * Auth.js (NextAuth v5) config for Struq.
 *
 * Strategy = JWT (required for the Credentials provider; the DB-session
 * strategy can't create sessions for credentials). The Drizzle adapter still
 * handles OAuth account linking + user rows. `tier` (free|pro) rides in the JWT
 * so `auth()` exposes it server-side — the foundation for tier gating.
 *
 * Credentials password hashes live in the `accounts` table (provider
 * 'credentials', providerAccountId = userId, column password_hash), so the
 * `users` table stays OAuth-clean. See app/api/auth/signup/route.ts + lib/db/seed.ts.
 *
 * OAuth providers register only when their secrets are present, so the build
 * and e2e work with zero secrets; Google/GitHub light up once keys are set.
 */

const hasDatabase = Boolean(process.env.DATABASE_URL);
const isDevelopment = process.env.NODE_ENV !== 'production';
const GITHUB_API_BASE_URL = 'https://api.github.com';

type VerifiedOAuthProfile = { email?: string | null; email_verified?: boolean | null };
type GitHubEmail = { email: string; primary: boolean; verified: boolean };
type GitHubProfileWithVerification = VerifiedOAuthProfile & {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
};

// GitHub OAuth may hide the primary email; fetch /user/emails to resolve a
// verified address so account creation always has an email.
async function fetchGitHubProfile(accessToken: string): Promise<GitHubProfileWithVerification> {
  const headers = { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'authjs' };
  const profile = (await fetch(`${GITHUB_API_BASE_URL}/user`, { headers }).then((r) =>
    r.json()
  )) as GitHubProfileWithVerification;

  const emailsResponse = await fetch(`${GITHUB_API_BASE_URL}/user/emails`, { headers });
  if (!emailsResponse.ok) return { ...profile, email: null, email_verified: false };

  const emails = (await emailsResponse.json()) as GitHubEmail[];
  const verified =
    emails.find((e) => e.primary && e.verified) ?? emails.find((e) => e.verified) ?? null;
  return { ...profile, email: verified?.email ?? null, email_verified: Boolean(verified) };
}

// OAuth providers are only registered when their secrets exist.
const oauthProviders: NextAuthConfig['providers'] = [];
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  oauthProviders.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: { prompt: 'consent', access_type: 'offline', response_type: 'code' },
      },
    })
  );
}
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  oauthProviders.push(
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      userinfo: {
        url: `${GITHUB_API_BASE_URL}/user`,
        async request({ tokens }: { tokens: { access_token?: string } }) {
          return fetchGitHubProfile(tokens.access_token!);
        },
      },
      profile(profile) {
        const gh = profile as GitHubProfileWithVerification;
        return {
          id: gh.id.toString(),
          name: gh.name ?? gh.login,
          email: gh.email_verified ? (gh.email ?? '') : '',
          image: gh.avatar_url,
        };
      },
    })
  );
}

const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = (credentials.email as string).toLowerCase();
        const password = credentials.password as string;

        const user = await db.query.users.findFirst({ where: eq(users.email, email) });
        if (!user) return null;

        const account = await db.query.accounts.findFirst({
          where: and(eq(accounts.userId, user.id), eq(accounts.provider, 'credentials')),
        });
        if (!account?.passwordHash) return null;

        const valid = await argon2Verify(account.passwordHash, password);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name ?? '', image: user.image ?? '' };
      },
    }),
    ...oauthProviders,
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // refresh cookie at most once/day
  },
  secret: process.env.AUTH_SECRET,
  trustHost: process.env.AUTH_TRUST_HOST === 'true' || isDevelopment,
  pages: { signIn: '/auth', error: '/auth' },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      // Load tier from the DB so it stays fresh (e.g. after a Stripe upgrade).
      if (hasDatabase && token.id) {
        const row = await db.query.users.findFirst({
          where: eq(users.id, token.id as string),
          columns: { tier: true },
        });
        token.tier = (row?.tier ?? 'free') as AssetTier;
      } else {
        token.tier = 'free';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.tier = (token.tier as AssetTier | undefined) ?? 'free';
      }
      return session;
    },
    async signIn({ account, profile }) {
      if (!account || account.provider === 'credentials') return true;
      const oauth = profile as VerifiedOAuthProfile | undefined;
      const email = typeof oauth?.email === 'string' ? oauth.email.trim() : '';
      if (!email || oauth?.email_verified !== true) return '/auth?error=OAuthEmailNotVerified';
      return true;
    },
  },
  debug: isDevelopment,
};

if (hasDatabase) {
  // Cast: our schema uses camelCase column keys with snake_case DB names, which
  // the adapter's default structural type (expecting snake_case keys) rejects
  // even though the runtime column mapping is correct.
  authConfig.adapter = DrizzleAdapter(db, {
    usersTable: users,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    accountsTable: accounts as any,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;
}

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);

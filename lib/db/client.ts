import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

/**
 * The app's Drizzle client over a pooled postgres.js connection.
 *
 * postgres.js opens real sockets, and Next dev re-imports modules on every HMR
 * cycle — without a cache that exhausts Postgres connections within minutes.
 * We stash the pool on globalThis so hot reloads reuse one pool. Production
 * imports this once, so the guard is inert there.
 */

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set — copy .env.local.example to .env.local.');
}

const sslMode = process.env.DB_SSL ?? 'require';
const ssl = sslMode === 'disable' ? false : sslMode === 'require' ? 'require' : undefined;

const globalForDb = globalThis as unknown as {
  __struqPg?: ReturnType<typeof postgres>;
};

const queryClient =
  globalForDb.__struqPg ??
  postgres(DATABASE_URL, {
    max: Number(process.env.DB_POOL_MAX ?? 10),
    idle_timeout: Number(process.env.DB_IDLE_TIMEOUT_SECONDS ?? 20),
    ssl,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__struqPg = queryClient;
}

export const db = drizzle(queryClient, { schema });
export { schema };

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
 *
 * The client is built LAZILY. `next build` (Turbopack) evaluates every route
 * module while collecting page data, and importing this module must NOT throw
 * when DATABASE_URL is absent — only an actual query at runtime should. We
 * therefore defer both the missing-env check and pool creation until the first
 * property access on `db`, exposed through a Proxy.
 */

const globalForDb = globalThis as unknown as {
  __struqPg?: ReturnType<typeof postgres>;
  __struqDb?: ReturnType<typeof drizzle<typeof schema>>;
};

function createDb() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is not set — copy .env.local.example to .env.local.');
  }

  const sslMode = process.env.DB_SSL ?? 'require';
  const ssl = sslMode === 'disable' ? false : sslMode === 'require' ? 'require' : undefined;

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

  return drizzle(queryClient, { schema });
}

export function getDb(): ReturnType<typeof drizzle<typeof schema>> {
  if (!globalForDb.__struqDb) {
    globalForDb.__struqDb = createDb();
  }
  return globalForDb.__struqDb;
}

// A lazy proxy: importing this module never touches the env or opens a socket.
// The real client is built on the first property access (a real query), so
// `next build` page-data collection can import DB-touching route modules
// without a DATABASE_URL. `has`/`ownKeys` also resolve lazily so any library
// that structurally introspects the client (e.g. the Auth.js Drizzle adapter)
// sees the real instance rather than an empty object.
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
  has(_target, prop) {
    return Reflect.has(getDb(), prop);
  },
  ownKeys() {
    return Reflect.ownKeys(getDb() as object);
  },
  getOwnPropertyDescriptor(_target, prop) {
    return Reflect.getOwnPropertyDescriptor(getDb() as object, prop);
  },
});

export { schema };

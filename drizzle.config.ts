import { config as loadEnv } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Next uses .env.local for local secrets; load it explicitly so drizzle-kit
// and the standalone db scripts see the same DATABASE_URL_MIGRATION as the app.
loadEnv({ path: '.env.local' });
loadEnv();

// Generates migrations into ./drizzle from lib/db/schema.ts.
// Uses the migration URL (a privileged/direct connection) — never db:push.
export default defineConfig({
  dialect: 'postgresql',
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL_MIGRATION ?? process.env.DATABASE_URL ?? '',
  },
  strict: true,
  verbose: true,
});

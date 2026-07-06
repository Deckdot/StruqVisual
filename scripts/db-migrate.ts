import '@/lib/db/env';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import postgres from 'postgres';

/**
 * Custom per-file-transaction migrator.
 *
 * WHY NOT the stock Drizzle migrator: it wraps ALL pending migrations in ONE
 * transaction. Postgres forbids using a freshly `ALTER TYPE ... ADD VALUE`
 * enum value in DML within the same transaction, so a future "add enum value"
 * migration must run in its own transaction, separate from the DML that uses
 * it. Running each file in its own BEGIN…COMMIT makes that pattern safe:
 * file N = ADD VALUE only, file N+1 = the DML. The initial create (0000) is a
 * single file and fine.
 *
 * Fails fast (exit 1) on any error — a failed migration must stop before the
 * app serves traffic (start.sh runs this before Next).
 */

const MIGRATIONS_DIR = join(process.cwd(), 'drizzle');
const JOURNAL_PATH = join(MIGRATIONS_DIR, 'meta', '_journal.json');

type JournalEntry = { idx: number; tag: string; when: number };
type Journal = { entries: JournalEntry[] };

function splitStatements(sql: string): string[] {
  return sql
    .split('--> statement-breakpoint')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

async function main() {
  const url = process.env.DATABASE_URL_MIGRATION ?? process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL_MIGRATION (or DATABASE_URL) is not set.');

  const journal = JSON.parse(readFileSync(JOURNAL_PATH, 'utf8')) as Journal;
  const entries = [...journal.entries].sort((a, b) => a.idx - b.idx);

  // One dedicated connection, max:1 — the migrator is strictly sequential.
  const sql = postgres(url, {
    max: 1,
    ssl: process.env.DB_SSL === 'disable' ? false : 'require',
    onnotice: () => {}, // silence "already exists, skipping" NOTICEs
  });

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
        "id" serial PRIMARY KEY,
        "tag" text NOT NULL UNIQUE,
        "hash" text NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now()
      )
    `;

    const applied = new Set(
      (await sql<{ tag: string }[]>`SELECT tag FROM "__drizzle_migrations"`).map((r) => r.tag)
    );

    let ran = 0;
    for (const entry of entries) {
      if (applied.has(entry.tag)) continue;

      const fileSql = readFileSync(join(MIGRATIONS_DIR, `${entry.tag}.sql`), 'utf8');
      const hash = createHash('sha256').update(fileSql).digest('hex');
      const statements = splitStatements(fileSql);

      // Each file in its own transaction (see WHY NOT above).
      await sql.begin(async (tx) => {
        for (const statement of statements) {
          await tx.unsafe(statement);
        }
        await tx`INSERT INTO "__drizzle_migrations" (tag, hash) VALUES (${entry.tag}, ${hash})`;
      });

      console.log(`  ✓ applied ${entry.tag} (${statements.length} statements)`);
      ran += 1;
    }

    if (ran === 0) console.log('  ↳ database already up to date.');
    else console.log(`  ↳ ${ran} migration(s) applied.`);
  } catch (error) {
    console.error('✗ migration failed:', error);
    await sql.end({ timeout: 5 });
    process.exit(1);
  }

  await sql.end({ timeout: 5 });
}

main();

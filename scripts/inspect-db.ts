import '@/lib/db/env';
import { sql } from 'drizzle-orm';
import { db } from '@/lib/db/client';

async function main() {
  const cols = await db.execute<{
    column_name: string;
    data_type: string;
    column_default: string | null;
    is_nullable: string;
  }>(sql`
    SELECT column_name, data_type, column_default, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'users' ORDER BY ordinal_position
  `);
  console.log('USERS COLUMNS:');
  for (const c of cols) console.log(`  ${c.column_name}  ${c.data_type}  default=${c.column_default}  nullable=${c.is_nullable}`);

  const tables = await db.execute<{ tablename: string }>(sql`
    SELECT tablename FROM pg_tables
    WHERE schemaname='public'
    AND tablename IN ('__drizzle_migrations','users','assets','asset_media','accounts','sessions','favorites','kits','kit_assets','verification_tokens','imported_icon_candidates')
    ORDER BY tablename
  `);
  console.log('\nTABLES PRESENT:');
  for (const t of tables) console.log(`  ✓ ${t.tablename}`);

  const applied = await db.execute<{ id: number; tag: string; hash: string; created_at: string }>(
    sql`SELECT id, tag, hash, created_at FROM "__drizzle_migrations" ORDER BY id`
  );
  console.log('\nAPPLIED MIGRATIONS:');
  for (const m of applied) console.log(`  ${String(m.id).padStart(2)}  ${m.tag}  ${m.created_at.toString()}`);

  const userCount = await db.execute<{ n: string }>(sql`SELECT count(*)::text AS n FROM users`);
  const assetCount = await db.execute<{ n: string }>(sql`SELECT count(*)::text AS n FROM assets`);
  console.log(`\nROW COUNTS: users=${userCount[0]?.n}  assets=${assetCount[0]?.n}`);

  process.exit(0);
}

main().catch((e) => {
  console.error('ERR', e);
  process.exit(1);
});

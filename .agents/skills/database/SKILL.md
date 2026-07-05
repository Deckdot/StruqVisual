---
name: database
description: >
  Use for Drizzle schema changes, migrations, DB safety, seeds, and the canon import pipeline.
  Trigger on: schema.ts, drizzle, migration, column, index, seed, sql, postgres, import pipeline.
---

# Database Skill | Struq

## Stack

- Drizzle ORM + Postgres · schema: `lib/db/schema.ts` · config: `drizzle.config.ts` · local DB via Docker.

## Hard Constraints

- **The `asset_type` enum is exactly** `palette | typography | design_system | section | media`. Changing it requires an RFC, never a casual migration. Prompts are a column on `assets`, not a type.
- **NEVER use `db:push`** — it bypasses the migration tracker and silently drifts production.
- **NEVER hand-write migration SQL** — always `npm run db:generate` after editing `schema.ts`. Hand-written files are missing from `drizzle/meta/_journal.json` and get silently skipped while the migrator reports success.
- **Commit `schema.ts` and its generated `.sql` together, always in the same PR.** A schema change merged without its migration file breaks the next deploy.

## Workflows

Schema change: edit `schema.ts` → `npm run db:generate` → `npm run db:migrate:local` → commit both.

Multi-machine (Linux laptop + Windows desktop, each with its own Docker Postgres): after `git pull`, run `npm run db:migrate:local`. Broken local DB: `npm run docker:reset` → migrate → seed.

Production: migrations apply automatically on container start (`start.sh` runs the migrator before Next.js; a failed migration exits before serving traffic). Merging to main is the deployment trigger.

## Postgres Enum ADD VALUE Rule

Never `ALTER TYPE … ADD VALUE` and use that value in DML in the same transaction — Postgres requires the enum value committed first. The standard Drizzle migrator wraps ALL pending migrations in one transaction, so splitting files is not enough: use a custom migrate script that runs each file in its own transaction. If a migrator is (re)introduced, verify per-file transactions before relying on it. Pattern: file N = `ADD VALUE` only; file N+1 = the DML; journal entries for both.

## Seeds & Canon Import

- The canon import (`scripts/import-canon.ts`, once built) is **idempotent**: upsert on provenance id so canon re-imports never duplicate.
- Seeds never run against production implicitly; only explicit `db:seed:*` scripts.
- Prefer safe staged changes on populated tables: add → backfill → enforce.

## Verification

- Schema-affecting changes: `T3` (migration must generate and apply clean on a fresh DB) · user-flow impact: `T4`.

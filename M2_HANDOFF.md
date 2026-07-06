# M2 Handoff — Datamodel + Canon Import (execution-ready)

> **Audience:** an implementing agent. Everything is reasoned out; follow it top to
> bottom. Do not redesign. Where a decision was already made, it is stated with the
> reason so you don't re-litigate it. Read the three "Read first" files, then execute
> Phase 0 → 7 in order. Run the stated verification tier after each phase.

---

## 0. Mission & scope

Replace the dashboard's static demo data (`lib/vault/demo-assets.ts`) with a real
Postgres database, seeded from the DesignOS canon. After M2, the vault/dashboard/
search render **from the DB** with no visible UI change, and the two localStorage
stopgaps (saved assets, icon candidates) gain a **DB-backed path** while keeping the
localStorage fallback for signed-out users.

**In scope (this slice):** schema, migrations, local Docker Postgres wiring, the DB
client, a repository query layer, the idempotent canon-import script, a seed-assert
script, and swapping the three demo-data consumers to the repository. Minimal auth
tables are created (so `favorites`/`kits` can key on a user) but **full Auth.js /
Stripe / MCP wiring is M5** — create the tables, do not build the flows.

**Explicitly OUT of scope (do NOT build now):** Auth.js login flow, Stripe webhooks,
MCP server, the live preview sandbox, media object-storage upload. Leave clean seams.

### Read first (do not skip)
1. `.claude/skills/database/SKILL.md` — the hard rules (enum frozen, never `db:push`,
   never hand-write SQL, commit schema+migration together, per-file-transaction
   migrator for enum ADD VALUE). **These are non-negotiable.**
2. `lib/vault/types.ts` — the `VaultAsset` shape + the five `data` variants. **The
   schema's `data` JSONB must round-trip these exactly.** This file is the contract
   between the DB and the existing UI.
3. `lib/vault/demo-assets.ts` — the current content and the prompt-generation style.
   The importer must produce the same `VaultAsset` shape (esp. the `prompt` strings).

### Ground truth already in the repo (use it, don't recreate)
- `docker-compose.yml` — Postgres 16, db `struq`, user/pw `postgres`, port `5432`,
  named volume `struq-db-data`, healthcheck present. **Already correct — do not edit
  unless adding a second service.**
- `.env.local.example` — already declares `DATABASE_URL`, `DATABASE_URL_MIGRATION`,
  `DB_POOL_MAX`, `DB_IDLE_TIMEOUT_SECONDS`, `DB_SSL`, and the E2E demo account
  (`demo@struq.nl` / `Struq2026`, pro tier) that `lib/db/seed.ts` is expected to
  create. Mirror these names exactly.
- `INDEX.md` line 37 already reserves the M2 paths: `lib/db/`, `drizzle/`,
  `scripts/import-canon.ts`, `docker-compose.yml`.
- Canon donor lives in the sibling repo `../DesignOS/design-os/`:
  - `assets/palettes.yaml` (29 palettes; first 5 are plain hex, rest carry OKLCH +
    optional `frontier` ladder)
  - `assets/typography.yaml` (`fontPairings[]` with `families.{display,body,accent}.stack`)
  - `assets/sections.yaml` (`section_kinds[]` → `kind`, `variants[]`, `layoutStrategy`,
    `ctaPressure`, `densitySupport`)
  - `assets/silhouettes.yaml` (`silhouettes[]` → `sectionOrder`, `densityByKind`) →
    these become `design_system` presets
  - `libraries/media/stock-images.generated.json` (~898 media entries with dimensions/
    aspect/category/tags)
- There is **no** existing `import-canon` script in DesignOS to copy — DesignOS loads
  canon at runtime via `repository.ts`. You are writing the importer fresh, reading the
  YAML/JSON directly. `../DesignOS/apps/designos/src/server/repository.ts` (the
  `getBuildingBlocksLibrary` function, ~line 110-280) is a **reference** for how each
  YAML is parsed — read it, don't import from it.

### Consumers to migrate (only these three read demo data today)
- `components/vault/vault-browser.tsx` — filters by `type`, by `saved`, and text-search
  over `name`/`description`/`tags`. (Query surface the repo must serve.)
- `components/dashboard/dashboard-home.tsx` — featured strip (`FEATURED_IDS`) + saved count.
- `components/dashboard/global-search.tsx` — substring search across assets.

---

## 1. Decisions already made (do not reopen)

| Decision | Choice | Why |
|---|---|---|
| ORM | **Drizzle** + `postgres` (postgres.js driver) | Named in `database` skill + `.env` pool vars; Drizzle is the repo standard. |
| `asset_type` enum | `palette \| typography \| design_system \| section \| media` — **frozen** | Hard constraint. Prompts are a `text` column, never a type. |
| `data` column | single `jsonb` holding the discriminated union from `lib/vault/types.ts` | UI already reads `asset.data` as a variant; one column = zero UI change. |
| Migrator | **custom per-file-transaction** runner (not the default Drizzle migrator) | Enum `ADD VALUE` can't share a transaction with DML (skill §"Postgres Enum ADD VALUE Rule"). Build it once, correctly, now. |
| Import idempotency | upsert on a stable `provenance` id (e.g. `canon:palette:graphite-ivory`) | Skill §"Seeds & Canon Import" — re-imports never duplicate. |
| Media files | **DB metadata only this slice**; store `placeholder` CSS + canon path, DO NOT copy 898 image binaries into the repo | Keeps the slice mergeable; object-storage decision is deferred (NORTHSTAR M2 "grootte­beslissing"). Record the path so a later slice uploads. |
| Auth tables | create `users`, `accounts`, `sessions`, `verification_tokens` (Auth.js v5 Drizzle schema) + `favorites`, `kits`, `kit_assets` | `favorites`/`kits` need a user FK; creating the tables now avoids a second migration in M5. **No auth logic.** |
| Saved/candidates hooks | add a DB path, keep localStorage fallback | Signed-out users still work; skill §"staged changes". |
| Seed account | `demo@struq.nl` / `Struq2026`, tier `pro` | Already referenced by `.env.local.example` + E2E. |

---

## 2. Dependencies to add

```
drizzle-orm postgres            # runtime
drizzle-kit  tsx  dotenv        # dev (tsx already present — verify before adding)
```
Add npm scripts to `package.json` (names must match the `database` skill exactly):

```jsonc
"db:generate":     "drizzle-kit generate",
"db:migrate:local": "tsx scripts/db-migrate.ts",   // the CUSTOM per-file migrator
"db:seed":         "tsx scripts/import-canon.ts && tsx lib/db/seed.ts",
"db:seed:assert":  "tsx scripts/seed-assert.ts",
"docker:up":       "docker compose up -d db",
"docker:reset":    "docker compose down -v && docker compose up -d db"
```
> Do NOT add a `db:push` script. It is banned.

---

## 3. Phase-by-phase execution

### Phase 0 — Branch + Docker + env (T0)
1. Branch from `main`: `git checkout -b feat/m2-datamodel` (main is protected; per
   `github` skill work in a slice branch).
2. `cp .env.local.example .env.local`; set for **local Docker**:
   - `DATABASE_URL=postgres://postgres:postgres@localhost:5432/struq`
   - `DATABASE_URL_MIGRATION=postgres://postgres:postgres@localhost:5432/struq`
   - `DB_SSL=disable` (local Postgres has no TLS; the prod example uses `require`).
3. `npm run docker:up`; confirm healthy: `docker compose ps` shows `healthy`.
4. Install deps (Phase 2 list). **Verify: `npm run typecheck` still green.**

### Phase 1 — DB client + config (T0)
- `drizzle.config.ts` (root): dialect `postgresql`, `schema: './lib/db/schema.ts'`,
  `out: './drizzle'`, `dbCredentials.url` from `DATABASE_URL_MIGRATION`. Load env via
  `dotenv/config`.
- `lib/db/client.ts`: create a `postgres()` pool from `DATABASE_URL` honoring
  `DB_POOL_MAX` / `DB_IDLE_TIMEOUT_SECONDS` / `DB_SSL`, wrap in `drizzle(...)`, export
  `db`. Use a module-level singleton guarded for Next dev HMR (`globalThis` cache) so
  hot reload doesn't exhaust connections.

### Phase 2 — Schema (`lib/db/schema.ts`) (T0 then T3 after migration)

Reason each table from the contract in `lib/vault/types.ts` + NORTHSTAR M2.

```
assetTypeEnum   pgEnum('asset_type', ['palette','typography','design_system','section','media'])
assetTierEnum   pgEnum('asset_tier', ['free','pro'])

assets
  id           uuid pk default gen_random_uuid()
  provenance   text unique not null          -- e.g. 'canon:palette:graphite-ivory' (import upsert key)
  type         assetTypeEnum not null
  slug         text not null                 -- unique within type: unique(type, slug)
  name         text not null
  description  text not null default ''
  prompt       text not null                 -- the copyable AI payload (metadata, never entity)
  data         jsonb not null                -- the discriminated variant from lib/vault/types.ts
  tier         assetTierEnum not null default 'free'
  tags         text[] not null default '{}'
  created_at   timestamptz not null default now()
  updated_at   timestamptz not null default now()
  indexes: unique(provenance); unique(type, slug); index(type); GIN index(tags)

asset_media                                   -- media rows link to their binary/source
  id           uuid pk
  asset_id     uuid fk → assets(id) on delete cascade
  canon_path   text                           -- source path in DesignOS media canon (no binary copied this slice)
  aspect_ratio text
  width, height integer
  placeholder  text                           -- CSS background used until real media served
  role         text                           -- from canon metadata if present

users                                          -- Auth.js v5 minimal (tables only)
  id, email unique, name, image, email_verified timestamptz,
  tier assetTierEnum default 'free', created_at
accounts, sessions, verification_tokens        -- standard Auth.js Drizzle shape (copy the canonical schema)

favorites                                      -- replaces the saved-assets localStorage
  user_id fk → users, asset_id fk → assets, created_at, pk(user_id, asset_id)

kits
  id uuid pk, user_id fk → users, name, description, created_at
kit_assets
  kit_id fk → kits, asset_id fk → assets, position int, pk(kit_id, asset_id)

imported_icon_candidates                       -- replaces lib/canon/use-icon-candidates localStorage (Canon icons tab)
  id text pk (the candidate.<prefix> id), user_id fk → users nullable,
  payload jsonb (the IconSet), created_at
```

> **Enum-first migration:** the very first generated migration creates the enums +
> tables together in one file — that's fine (no `ADD VALUE` yet). The per-file
> migrator matters for any *future* enum value additions. Build the migrator now
> anyway (Phase 3) because the skill mandates it and `start.sh` will call it.

After writing `schema.ts`: `npm run db:generate` → inspect the generated
`drizzle/0000_*.sql` + `drizzle/meta/_journal.json`. **Never edit the SQL by hand.**

### Phase 3 — Custom migrator `scripts/db-migrate.ts` (T0)
Reason: the standard Drizzle migrator wraps *all* pending files in one transaction,
which breaks the enum `ADD VALUE` → DML split. Implement:
1. Read `drizzle/meta/_journal.json` for the ordered migration list.
2. Ensure a `__drizzle_migrations` bookkeeping table exists.
3. For each un-applied file **in its own `BEGIN…COMMIT`**, execute the SQL, then record
   it. Fail fast on error (exit non-zero) — a failed migration must stop before serving.
4. Connect via `DATABASE_URL_MIGRATION`.
Run `npm run db:migrate:local` against the fresh Docker DB. **Verify (T3): tables exist
(`\dt` via `docker compose exec db psql -U postgres -d struq -c '\dt'`).**

### Phase 4 — Canon import `scripts/import-canon.ts` (idempotent) (T0)
Read the DesignOS YAML/JSON directly (path: `../DesignOS/design-os/...`). Use `js-yaml`
(add if missing) to parse. For each asset, **upsert on `provenance`** (`insert … on
conflict (provenance) do update`). Produce the exact `VaultAsset.data` variant + the
`prompt` string (mirror the builders in `demo-assets.ts` — reuse that prompt-writing
style so copied prompts stay identical in tone).

Import order + mapping:
1. **Palettes** ← `palettes.yaml` → `data: { colors:{background,surface,text,accent,accentAlt}, mood, frontier? }`.
   provenance `canon:palette:<id>`. (Handle the 5 plain-hex + OKLCH/frontier variants;
   `accentAlt` may be absent on some — default to `accent`.)
2. **Typography** ← `typography.yaml fontPairings[]` → `data: { display:{name,stack}, body:{name,stack}, accent?, intent }`.
3. **Sections** ← `sections.yaml section_kinds[]` → `data: { kind, layoutStrategy, ctaPressure, densitySupport }`.
4. **Design systems** ← `silhouettes.yaml silhouettes[]` → `data: { paletteRef, typographyRef, silhouette:{name, sectionOrder} }`.
   (Pick a sensible default `paletteRef`/`typographyRef` per silhouette, or leave the
   first canon palette/typography — document the choice inline.)
5. **Media** ← `stock-images.generated.json` → one `assets` row (type `media`) +
   one `asset_media` row each. `data: { aspectRatio, category, placeholder }`.
   **Do not copy binaries** — store `canon_path`. Cap the import if 898 is unwieldy for
   review, but the seed-assert expectation should match whatever you import.
The script must be safe to run twice with no duplicates (that's the acceptance test).

### Phase 5 — Seed account + assert (T0)
- `lib/db/seed.ts`: upsert the demo user (`demo@struq.nl`, tier `pro`). Idempotent.
  (No password hashing flow needed this slice — a placeholder credential row is fine;
  real auth is M5. If a password column is added, hash with the same lib M5 will use.)
- `scripts/seed-assert.ts`: query counts per `type` and assert non-zero (and the exact
  counts you imported). Exit non-zero on mismatch. Wire to `db:seed:assert`.
- Run: `npm run db:seed` then `npm run db:seed:assert` → must pass.

### Phase 6 — Repository layer `lib/db/repository.ts` (T0)
Thin, typed functions returning `VaultAsset[]` / `VaultAsset` (import the type from
`lib/vault/types.ts` — the repo's job is to make DB rows *equal* that type so the UI is
untouched). Provide exactly what the three consumers need:
- `listAssets({ type?, query?, savedIds? }): Promise<VaultAsset[]>`
- `getAssetsByIds(ids: string[])` (featured strip)
- `searchAssets(query: string)` (global search)
- `getFavorites(userId)` / `toggleFavorite(userId, assetId)`
Map each row → `VaultAsset` (spread `data` jsonb as the variant; DB `tags text[]` → `string[]`).
Keep all SQL here; never in components (skill/AGENTS rule: routes/UI stay thin).

### Phase 7 — Swap consumers to the repository (T2 → T4)
The three consumers are **client components** reading a static import. Two clean paths —
pick per file, documented inline:
- **Server-load + prop-drill (preferred):** make the route (`app/(dashboard)/vault/page.tsx`,
  `.../dashboard/page.tsx`) a server component that calls the repository and passes
  `assets` down; the client browser/home receive props instead of importing `DEMO_ASSETS`.
- Where a client component must fetch (global search on keystroke), add a thin route
  handler `app/api/assets/search/route.ts` calling the repository.

Migrate localStorage stopgaps to a DB path **without breaking signed-out UX:**
- `hooks/use-saved-assets.ts` → if a user session exists, read/write `favorites` via a
  route handler; else keep localStorage. (Session plumbing is minimal — a `userId` from
  a cookie is enough for this slice; full Auth.js is M5.)
- `lib/canon/use-icon-candidates.ts` → same pattern against `imported_icon_candidates`.
Keep `lib/vault/demo-assets.ts` in the repo until the DB path is proven, then delete it
in the same PR and confirm nothing imports it (`grep -r DEMO_ASSETS`).

**Verify (T4):** `npm run verify:full` — the Playwright E2E must pass against the seeded
DB (the demo account + real assets). Routes `/dashboard`, `/vault`, `/vault?filter=saved`,
`/canon` must render from the DB with no visual regression.

---

## 4. Guardrails checklist (verify before PR)
- [ ] `asset_type` enum unchanged: `palette | typography | design_system | section | media`.
- [ ] No `db:push` script anywhere; no hand-written SQL in `drizzle/`.
- [ ] `lib/db/schema.ts` and the generated `drizzle/*.sql` committed **together**.
- [ ] Custom per-file-transaction migrator in place and used by `db:migrate:local`.
- [ ] `import-canon.ts` is idempotent (run twice → identical counts; the acceptance test).
- [ ] `seed-assert` passes with exact per-type counts.
- [ ] No DB queries inside components; all in `lib/db/repository.ts`.
- [ ] Signed-out users still get saved-assets + icon-candidates via localStorage fallback.
- [ ] `DEMO_ASSETS` deleted and unreferenced (grep clean) — OR explicitly kept with a
      one-line reason if the swap is staged across PRs.
- [ ] `.env.local.example` updated if any new var was introduced.

## 5. Handoff / docs to update at the end (anti-drift, mandatory)
- `PROJECT_STATE.md`: move M2 from "Volgende stap" to "Stand"; record the tier that ran (T4).
- `NORTHSTAR.md`: tick the M2 checkboxes actually completed; leave media-object-storage
  and auth/stripe/mcp unticked (deferred).
- `FEATURES.md`: add the DB/repository capability.
- `INDEX.md`: confirm `lib/db/`, `drizzle/`, `scripts/import-canon.ts` are described.
- `github` skill PR flow: open the PR with `.github/PULL_REQUEST_TEMPLATE.md`, fill the
  doc-drift checklist, note that auth/stripe/mcp tables exist but flows are M5.

## 6. Definition of done
1. Fresh clone → `npm run docker:up && npm run db:migrate:local && npm run db:seed && npm run db:seed:assert` succeeds from zero.
2. `npm run db:seed` run twice → no duplicate rows (idempotent import proven).
3. `/vault`, `/dashboard`, `/canon` render from Postgres; `filter=saved` works; global
   search works — all with no visual change vs. the demo-data version.
4. `npm run verify:full` (T4) green.
5. Schema + migration + docs committed together; PR opened per the `github` skill.

## 7. Traps specific to this codebase (learned, so you don't rediscover them)
- **Enum + DML same transaction** → Postgres errors. Only relevant when you later ADD a
  value; the initial create is one file and fine. The migrator must still be per-file.
- **postgres.js in Next dev** exhausts connections on HMR unless the client is a
  `globalThis` singleton. Do it in `lib/db/client.ts`.
- **`data` jsonb must round-trip the union** in `lib/vault/types.ts` — if the UI reads
  `(asset.data as PaletteData).colors.accentAlt` and a canon palette lacks `accentAlt`,
  the importer must fill it. Test all five variants render in `/vault`.
- **Media count (~898)** — importing binaries bloats the repo; this slice stores metadata
  + `canon_path` only. The object-storage upload is a later slice; leave the seam.
- **DesignOS is a donor, not a dependency** — read its YAML files directly; never import
  from `../DesignOS` at runtime, and never copy its `repository.ts`/contracts wholesale.
- **Line endings on Windows** — git will warn LF→CRLF on new files; harmless, ignore.
```

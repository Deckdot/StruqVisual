# INDEX — File map

> Snelle plattegrond voor (nieuwe) AI-agents. Eén regel per item. Bijwerken bij elke structuurwijziging (regel in WORKFLOW.md).

## Root docs (operating system)

- `CLAUDE.md` — operating guide voor Claude-agents; verplicht startpunt: master-orchestrator skill
- `AGENTS.md` — zelfde contract voor alle andere agents/LLM's
- `INDEX.md` — dit bestand
- `NORTHSTAR.md` — einddoel, moats, roadmap met checkboxes (waar werken we naartoe)
- `PROJECT_STATE.md` — compacte actuele stand (max 60 regels, altijd bij)
- `PRODUCT.md` — wat het product is en wat we verkopen (tiers)
- `CUSTOMER.md` — de perfecte klant + anti-personas
- `FEATURES.md` — capability-inventaris met status per feature
- `DESIGN.md` — design-taal + motion-registers (stub tot M1)
- `SEO.md` — AEO/SEO-strategie: schrijfregels, vragenkaart, pillar-cluster, gids-backlog
- `WORKFLOW.md` — verification tiers, git/PR-strategie, doc-drift regels
- `CONVERSION_ONBOARDING_CONTEXT.md` — gedetailleerd overzicht van onboarding, conversie, maturity en gating voor psychologie-agents
- `COMPETITOR_IMPECCABLE.md` — teardown van impeccable.style: wat we overnemen/vermijden (design-vocabulaire, homepage-funnel, MCP-trust-signalen)


## Skills

- `.skillshare/skills/` — **canonieke** skills; alleen hier bewerken, daarna `skillshare sync`
  - `master-orchestrator/` — verplichte startup: scope-classificatie, lane-routing, handoff-regels
  - `frontend/` · `backend/` · `database/` · `mcp/` · `github/` · `quality/` — domeinregels
  - `railway/` — deploy-SOP: Railway CLI-linking, log/crash-debugging, env-vars, bekende faalsignaturen
  - `brandvoice/` — Nederlandse copy-canon + Struq-stem
  - `psychology/` — UX/persuasie-gate voor elke interactie
  - `onboarding/` — activatie, first-run, tours
- `.claude/skills/`, `.agents/skills/`, `.agent/skills/` — gegenereerde mirrors, nooit bewerken
- `.skillshare/config.yaml` — sync-targets

## Datamodel + DB (M2)

- `docker-compose.yml` — lokale Postgres 16 (`struq`, poort 5432)
- `drizzle.config.ts` — drizzle-kit config (schema→`drizzle/`, migratie-URL)
- `lib/db/schema.ts` — Drizzle-schema (assets, asset_media, users/accounts/sessions/verification_tokens, favorites, kits/kit_assets, imported_icon_candidates); enum bevroren op 5 types
- `lib/db/client.ts` — postgres.js pool + Drizzle-client (HMR-singleton)
- `lib/db/env.ts` — env-bootstrap voor standalone db-scripts (.env.local)
- `lib/db/repository.ts` — getypeerde query-laag, rijen → `VaultAsset` (enige plek met asset-SQL)
- `lib/db/seed.ts` — idempotente upsert van demo (`demo@struq.nl`, pro) + admin (`admin@struq.nl`, pro+isAdmin) credentials-accounts; env-overridable via `E2E_*` en `ADMIN_*`
- `lib/auth/session.ts` — server-side sessie-helpers (`getSessionUserId`/`getSessionUser`) op de Auth.js-sessie; `getSessionUser` exposeert `id`+`tier`+`isAdmin`
- `drizzle/` — gegenereerde migraties + `meta/_journal.json` (nooit met de hand bewerken)
- `scripts/db-migrate.ts` — custom per-file-transactie migrator (enum ADD VALUE-veilig)
- `scripts/import-canon.ts` — idempotente canon-import uit `../DesignOS` (upsert op provenance)
- `scripts/seed-assert.ts` — asserteert exacte counts per type + admin/demo accounts (pro + isAdmin + credentials)
- `scripts/verify-admin.ts` — rooktest dat `ADMIN_PASSWORD` verifieert tegen de stored argon2-hash (draait op elke DB via env)
- `app/api/assets/search/` · `app/api/assets/[id]/prompt/` (entitlement-gated kopieer-payload) · `app/api/favorites/` · `app/api/icon-candidates/` — route handlers op de repository
- `app/(dashboard)/pro/` — contextuele Pro-upgrade-uitleg (bereikt vanaf een locked asset, niet uit de nav)

## Auth (M5, slice 1)

- `lib/auth.ts` — Auth.js v5 config (Credentials + conditioneel Google/GitHub, DrizzleAdapter, JWT met `tier`)
- `types/next-auth.d.ts` — sessie/JWT-augmentatie (`id` + `tier`)
- `app/api/auth/[...nextauth]/route.ts` — Auth.js handlers
- `app/api/auth/signup/route.ts` — e-mail/wachtwoord-registratie (argon2)
- `components/site/auth/auth-client.tsx` — bedrade cinematische login (behoudt de handoff)
- `SessionProvider` in `app/providers.tsx`; sign-out in `components/dashboard/sidebar.tsx`

## SEO/AEO (gids-cluster)

- `app/sitemap.ts` · `app/robots.ts` — sitemap + robots (AI-crawlers expliciet welkom)
- `public/llms.txt` — LLM-kaart van de site (llmstxt-formaat)
- `lib/gids/guides.ts` — getypeerde gids-content (`GUIDES`), AEO-regels in SEO.md
- `app/gids/` — hub + `[slug]`-route met Article/FAQPage/Breadcrumb JSON-LD
- `components/site/gids/` — `guide-article.tsx` (renderer) + `gids-index.tsx` (hub)
- `lib/seo/` — metadata-factory, schema-generators, SITE_URL-config

## Overig

- `.github/PULL_REQUEST_TEMPLATE.md` — PR-structuur incl. doc-drift checklist
- `.gitignore`
- `Dockerfile` · `railway.json` · `start.sh` — deployment- en containerconfiguratie voor Railway/Docker

## Komt eraan (zie NORTHSTAR)

- M1: `app/`, `components/`, configs (Next.js 16 + Tailwind v4 + GSAP/Lenis/Three.js) — geland
- M3: `app/(dashboard)/`, `components/vault/` — dashboard-frontend staat (M3-voorschot); UX-verdieping volgt
- M5: Auth.js-login geland (slice 1); Stripe + MCP-server volgen (seams staan al)

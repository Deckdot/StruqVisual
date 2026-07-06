# PROJECT_STATE

> Compact, altijd actueel. Max 60 regels. Bijwerken bij elke substantiële wijziging.

## Actieve milestone

**M2 + M5-auth afgerond → volgende: M5 (Stripe, MCP) of M3 (vault/dashboard UX-verdieping)**. Zie `NORTHSTAR.md`.

## Stand

- M0 klaar: agent OS (10 skills, docs, PR-template, skillshare sync). GitHub remote bewust overgeslagen.
- M1 klaar: homepage + galerij + visueel + methode + learn gekopieerd uit Struq en draaiend; FourForms omgebouwd naar 5 visuele vormen; SEO/copy visual-first; DESIGN.md definitief.
- M3-voorschot: dashboard-frontend staat — shell (sidebar/topbar/bottom-nav), `/dashboard` home (3 keuzes + uitgelicht), `/vault` browser (zoek, type-chips, empty states), 5 type-renderers, maturity provider (progressive disclosure), saved/copy via localStorage. Alles op demo-data in `lib/vault/demo-assets.ts` die het M2-schema spiegelt.
- Overgangssysteem: intro-loader (count-up + wordmark, sessie-gated), curtain page-transitions op marketing, en naadloze auth→dashboard handoff (gedeelde warme wash + gestaggerde reveal). Zie `components/site/loaders/`, `components/providers/PageTransition.tsx`, `components/dashboard/dashboard-entrance.tsx`, `lib/handoff.ts`.
- Canon (Smaak-bibliotheek) uit DesignOS gehaald: nieuwe `/canon` dashboard-route met 7 tabs (recepten, secties, typografie, kleur, iconen, merken, stem). Echte canon-content als statische data in `lib/canon/*.ts` (29 paletten, 6 type-pairings, 6 stemmen, 9 recepten, 9 secties, 18 merken, 6 iconensets). Iconensysteem: `@iconify/react`, Iconify publieke API direct (browse/zoek/koppel 12 semantics), import als kandidaat → localStorage (`lib/canon/use-icon-candidates.ts`). Preview-dialog = statische themed mini-pagina (seam voor toekomstige live sandbox). Geanimeerd merk (split/reassemble) + wordmark-reveal in navbar + footer.
- M2 klaar: Drizzle + Postgres (Docker). `lib/db/schema.ts` (assets/asset_media/auth/favorites/kits/imported_icon_candidates, enum bevroren op 5 types), custom per-file-transactie migrator (`scripts/db-migrate.ts`), idempotente canon-import (`scripts/import-canon.ts`: 29 paletten, 2 typografie, 9 secties, 5 design_systems, 898 media = 943 assets), seed (`lib/db/seed.ts` demo@struq.nl pro) + assert (`scripts/seed-assert.ts`, exacte counts). Repository-laag (`lib/db/repository.ts`) mapt rijen → `VaultAsset`. Dashboard/vault renderen via server-component prop-drill; global search via `/api/assets/search`. Favorites + icon-candidates: DB-pad (`/api/favorites`, `/api/icon-candidates`, gated op `struq_uid`-cookie die M5 zet) met localStorage-fallback voor uitgelogd. `demo-assets.ts` verwijderd. Media: alleen metadata + `canon_path`, geen binaries (object-storage uitgesteld).
- M5-auth klaar (slice 1): Auth.js v5 (`lib/auth.ts`) — Credentials (argon2, hash in `accounts.password_hash`) + Google/GitHub (conditioneel op env-secrets). JWT-sessie draagt `id`+`tier`. `[...nextauth]` + `/api/auth/signup` routes. `lib/auth/session.ts` leest nu de echte sessie → favorites/icon-candidates DB-pad geactiveerd (401→200 na login). `SessionProvider` in `app/providers.tsx`. Auth-client-form bedraad (controlled + `signIn`/signup + OAuth-knoppen) met behoud van de cinematische auth→dashboard handoff; sign-out in de sidebar. Seed zet demo-credentials (`demo@struq.nl`/`Struq2026`). Migratie `0001` (`accounts.password_hash`).
- Branch: `feat/m5-auth` (afsplitsing van `feat/m2-datamodel`→main). Verificatie: T4 — build/lint/typecheck groen; 11/11 e2e groen (6 auth + 5 M2 vault, geen regressie). NB: bestaande `homepage.spec.ts` faalt op een strict-mode selector-bug (M1-testschuld, raakt deze slice niet).

## Beslissingen (kort)

- Clean successor; geen datamigratie. Donors: `../Struq` (code), `../DesignOS` (canon).
- Enum bevroren op 5 visuele types; prompts zijn metadata. Silhouettes = presets in design_system.
- Nederlands-only, Railway, freemium free|pro.
- Cold review niet verplicht; tier groen → direct mergen (Roy's besluit).
- Galerij draait tijdelijk op gequarantainede demo-data (`lib/gallery/example-kits.ts`) tot M4 (DB-koppeling).
- Admin studio + AI-generatie-engine bewust niet gekopieerd (later milestone).

## Laatste verificatie

- T4: `npm run build` (typecheck+lint+verify:design) groen; e2e 11/11 groen (`auth.spec.ts` 6 + `vault-db.spec.ts` 5). Auth bewezen: credentials login → `/dashboard`, favorites 401→200 na login, fout wachtwoord/duplicaat-signup tonen NL-fout, uitgelogd blijft 401 + localStorage-fallback. DoD vanaf nul: `docker:up → db:migrate:local → db:seed → db:seed:assert` groen (incl. demo-credentials).
- Uitgesteld (M5, latere slices): Stripe-webhooks, MCP-server, wachtwoord-reset/e-mailverificatie, media-object-storage upload. Seams staan.

## Volgende stap

M5 vervolg: Stripe freemium (checkout + webhooks als bron van waarheid, `tier` sync) en MCP-server (OAuth PKCE). Of M3 (vault/dashboard UX-verdieping, free/pro-gating in UI).

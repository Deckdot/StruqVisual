# PROJECT_STATE

> Compact, altijd actueel. Max 60 regels. Bijwerken bij elke substantiële wijziging.

## Actieve milestone

**M2 afgerond → volgende: M3 (vault/dashboard UX-verdieping) of M5 (auth/stripe/mcp)**. Zie `NORTHSTAR.md`.

## Stand

- M0 klaar: agent OS (10 skills, docs, PR-template, skillshare sync). GitHub remote bewust overgeslagen.
- M1 klaar: homepage + galerij + visueel + methode + learn gekopieerd uit Struq en draaiend; FourForms omgebouwd naar 5 visuele vormen; SEO/copy visual-first; DESIGN.md definitief.
- M3-voorschot: dashboard-frontend staat — shell (sidebar/topbar/bottom-nav), `/dashboard` home (3 keuzes + uitgelicht), `/vault` browser (zoek, type-chips, empty states), 5 type-renderers, maturity provider (progressive disclosure), saved/copy via localStorage. Alles op demo-data in `lib/vault/demo-assets.ts` die het M2-schema spiegelt.
- Overgangssysteem: intro-loader (count-up + wordmark, sessie-gated), curtain page-transitions op marketing, en naadloze auth→dashboard handoff (gedeelde warme wash + gestaggerde reveal). Zie `components/site/loaders/`, `components/providers/PageTransition.tsx`, `components/dashboard/dashboard-entrance.tsx`, `lib/handoff.ts`.
- Canon (Smaak-bibliotheek) uit DesignOS gehaald: nieuwe `/canon` dashboard-route met 7 tabs (recepten, secties, typografie, kleur, iconen, merken, stem). Echte canon-content als statische data in `lib/canon/*.ts` (29 paletten, 6 type-pairings, 6 stemmen, 9 recepten, 9 secties, 18 merken, 6 iconensets). Iconensysteem: `@iconify/react`, Iconify publieke API direct (browse/zoek/koppel 12 semantics), import als kandidaat → localStorage (`lib/canon/use-icon-candidates.ts`). Preview-dialog = statische themed mini-pagina (seam voor toekomstige live sandbox). Geanimeerd merk (split/reassemble) + wordmark-reveal in navbar + footer.
- M2 klaar: Drizzle + Postgres (Docker). `lib/db/schema.ts` (assets/asset_media/auth/favorites/kits/imported_icon_candidates, enum bevroren op 5 types), custom per-file-transactie migrator (`scripts/db-migrate.ts`), idempotente canon-import (`scripts/import-canon.ts`: 29 paletten, 2 typografie, 9 secties, 5 design_systems, 898 media = 943 assets), seed (`lib/db/seed.ts` demo@struq.nl pro) + assert (`scripts/seed-assert.ts`, exacte counts). Repository-laag (`lib/db/repository.ts`) mapt rijen → `VaultAsset`. Dashboard/vault renderen via server-component prop-drill; global search via `/api/assets/search`. Favorites + icon-candidates: DB-pad (`/api/favorites`, `/api/icon-candidates`, gated op `struq_uid`-cookie die M5 zet) met localStorage-fallback voor uitgelogd. `demo-assets.ts` verwijderd. Media: alleen metadata + `canon_path`, geen binaries (object-storage uitgesteld).
- Branch: `feat/m2-datamodel`. Verificatie: T4 — build/lint/typecheck groen; 5 nieuwe DB-render e2e's (`tests/e2e/vault-db.spec.ts`) groen. NB: bestaande `homepage.spec.ts` faalt op een strict-mode selector-bug (M1-testschuld, raakt M2 niet).

## Beslissingen (kort)

- Clean successor; geen datamigratie. Donors: `../Struq` (code), `../DesignOS` (canon).
- Enum bevroren op 5 visuele types; prompts zijn metadata. Silhouettes = presets in design_system.
- Nederlands-only, Railway, freemium free|pro.
- Cold review niet verplicht; tier groen → direct mergen (Roy's besluit).
- Galerij draait tijdelijk op gequarantainede demo-data (`lib/gallery/example-kits.ts`) tot M4 (DB-koppeling).
- Admin studio + AI-generatie-engine bewust niet gekopieerd (later milestone).

## Laatste verificatie

- T4: `npm run build` (incl. typecheck+lint+verify:design) groen; `tests/e2e/vault-db.spec.ts` 5/5 groen tegen geseede DB. Idempotentie bewezen: import 2× → 943 assets, 898 asset_media, geen dupes. DoD vanaf nul: `docker:up → db:migrate:local → db:seed → db:seed:assert` groen.
- Uitgesteld (M5): Auth.js-flow, Stripe, MCP-server, media-object-storage upload. Tabellen/seams staan; flows niet.

## Volgende stap

M3 (vault/dashboard UX-verdieping) of M5 (auth→cookie zet `struq_uid`, favorites/icon-candidates DB-pad gaat live; Stripe; MCP).

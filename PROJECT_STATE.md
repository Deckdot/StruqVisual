# PROJECT_STATE

> Compact, altijd actueel. Max 60 regels. Bijwerken bij elke substantiële wijziging.

## Actieve milestone

**M1 afgerond → volgende: M2 (datamodel + canon-import)**. Zie `NORTHSTAR.md`.

## Stand

- M0 klaar: agent OS (10 skills, docs, PR-template, skillshare sync). GitHub remote bewust overgeslagen.
- M1 klaar: homepage + galerij + visueel + methode + learn gekopieerd uit Struq en draaiend; FourForms omgebouwd naar 5 visuele vormen; SEO/copy visual-first; DESIGN.md definitief.
- M3-voorschot: dashboard-frontend staat — shell (sidebar/topbar/bottom-nav), `/dashboard` home (3 keuzes + uitgelicht), `/vault` browser (zoek, type-chips, empty states), 5 type-renderers, maturity provider (progressive disclosure), saved/copy via localStorage. Alles op demo-data in `lib/vault/demo-assets.ts` die het M2-schema spiegelt.
- Overgangssysteem: intro-loader (count-up + wordmark, sessie-gated), curtain page-transitions op marketing, en naadloze auth→dashboard handoff (gedeelde warme wash + gestaggerde reveal). Zie `components/site/loaders/`, `components/providers/PageTransition.tsx`, `components/dashboard/dashboard-entrance.tsx`, `lib/handoff.ts`.
- Canon (Smaak-bibliotheek) uit DesignOS gehaald: nieuwe `/canon` dashboard-route met 7 tabs (recepten, secties, typografie, kleur, iconen, merken, stem). Echte canon-content als statische data in `lib/canon/*.ts` (29 paletten, 6 type-pairings, 6 stemmen, 9 recepten, 9 secties, 18 merken, 6 iconensets). Iconensysteem: `@iconify/react`, Iconify publieke API direct (browse/zoek/koppel 12 semantics), import als kandidaat → localStorage (`lib/canon/use-icon-candidates.ts`). Preview-dialog = statische themed mini-pagina (seam voor toekomstige live sandbox). Geanimeerd merk (split/reassemble) + wordmark-reveal in navbar + footer.
- Branch: `feat/m1-homepage`. Verificatie: T2 groen (102 bestanden design gate); routes /, /galerij, /visueel, /methode, /learn, /dashboard, /vault, /canon → 200.

## Beslissingen (kort)

- Clean successor; geen datamigratie. Donors: `../Struq` (code), `../DesignOS` (canon).
- Enum bevroren op 5 visuele types; prompts zijn metadata. Silhouettes = presets in design_system.
- Nederlands-only, Railway, freemium free|pro.
- Cold review niet verplicht; tier groen → direct mergen (Roy's besluit).
- Galerij draait tijdelijk op gequarantainede demo-data (`lib/gallery/example-kits.ts`) tot M4 (DB-koppeling).
- Admin studio + AI-generatie-engine bewust niet gekopieerd (later milestone).

## Laatste verificatie

- T2 (typecheck + lint + verify:design) groen; handmatige route-check 200 op alle 7 routes.
- Brand logo's vernieuwd (struq-logo.png en struq-mark-256.png) met imagegen chroma-key workflow en geïntegreerd in navbar + footer.

## Volgende stap

M2: `lib/db/schema.ts` (5 types, assets+asset_media+kits+auth), Docker Postgres, `scripts/import-canon.ts` (24 paletten, typografie, 9 secties, silhouettes, 898 media) → dashboard demo-data vervangen door DB.

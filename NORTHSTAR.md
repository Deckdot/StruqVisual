# NORTHSTAR — Struq

## End Goal

struq.nl is de Nederlandse visual-first bibliotheek + vault voor AI-native builders. Je bladert door een prachtige publieke galerij van paletten, typografie, design systems, secties en media → bewaart ze in je vault → gebruikt ze direct in elke AI: via kopieerbare prompts (gratis) of rijke previews + MCP-integratie (Pro). De homepage verkoopt de droom; de vault is het product.

**Twee moats:**
1. **Bibliotheekkwaliteit** — gecureerde canon (DesignOS/TasteFrame), niet user-generated ruis.
2. **Elk model, premium output** — elk asset draagt een prompt-payload die zo is gebouwd dat *elke* AI er betrouwbaar premium frontend mee levert. Plakken werkt, altijd.

**Kernprincipes (nooit heronderhandelen zonder RFC):**
- Visual-first datamodel: `palette | typography | design_system | section | media`. Prompts zijn metadata, nooit het primaire entiteit.
- Previews zijn statische media, nooit live-gerenderde dependencies.
- Frictieloos by default, strikte progressive disclosure, psychologie-pass op elke interactie.
- Gratis is echt goed; Pro is beter met previews.
- Nederlands voor alles wat de gebruiker ziet.

## Roadmap

### M0 — Repo + Agent OS
- [x] Git repo + .gitignore
- [x] Canonieke skills in `.skillshare/skills/` (master-orchestrator, frontend, backend, database, github, mcp, onboarding, brandvoice, psychology, quality) + sync naar mirrors
- [x] Root docs: CLAUDE.md, AGENTS.md, INDEX.md, NORTHSTAR.md, PRODUCT.md, CUSTOMER.md, FEATURES.md, PROJECT_STATE.md, WORKFLOW.md (+ DESIGN.md stub — definitief in M1)
- [x] `.github/PULL_REQUEST_TEMPLATE.md` met doc-drift checklist
- [ ] GitHub remote + branch protection op `main`

### M1 — Marketing homepage
- [ ] Next.js 16 scaffold (configs verbatim uit Struq: next/ts/tailwind/postcss/eslint/playwright/Docker/railway)
- [ ] Animatie-infra verbatim: motion.tsx, Lenis provider, GSAP setup, Three.js memory-field
- [ ] Homepage gekopieerd (`app/page.tsx` + `components/site/home/`), site chrome (navbar/footer)
- [ ] Nederlandse copy-pass (brandvoice): visual-library pitch, nieuwe pricing-framing
- [ ] `DESIGN.md` definitief schrijven, geëxtraheerd uit de geïntegreerde homepage
- [ ] Verification-scripts in package.json (T0–T4)

### M2 — Datamodel + canon-import
- [x] `lib/db/schema.ts`: 5 asset types, assets (met `prompt` + `data` jsonb + `tier`), asset_media, kits, favorites, auth-tabellen (users/accounts/sessions/verification_tokens), imported_icon_candidates. Subscriptions + mcp_tokens blijven M5.
- [x] Docker Postgres + migraties + custom per-file-transactie migrator (`scripts/db-migrate.ts`)
- [x] `scripts/import-canon.ts` (idempotent): 29 paletten, 2 typografie-pairings, 9 sectie-kinds, 5 silhouettes → design_system presets, 898 media (metadata + canon_path)
- [ ] Media-bestanden import + groottebeslissing (repo vs object storage) — uitgesteld; alleen metadata + `canon_path` deze slice, seam voor object-storage upload staat
- [x] Seed-assert script (aantallen per type)
- [x] Repository-laag + dashboard/vault/canon renderen uit Postgres (demo-data verwijderd); localStorage→DB-pad voor favorites + icon-candidates (auth-flow M5)

### M3 — Vault/dashboard UX
- [ ] Dashboard shell `app/(dashboard)/`: rustige galerij-home, 3–4 keuzes
- [ ] Type-specifieke renderers: palet→swatches, typografie→specimen, media→player, sectie→thumbnail, design system→composiet
- [ ] Maturity/disclosure provider (level stijgt door milestones, nooit terug)
- [ ] Bewaren/verzamelen + kopieer-prompt flow (≤30s eerste save)
- [ ] Free vs Pro gating in UI (previews geteased, eerlijk)

### M4 — Publieke galerij + Learn
- [ ] `app/galerij/` SSR + SEO, data uit de assets-DB
- [ ] Learn platform overgenomen (`app/learn/`, `content/learn/`, admin studio)

### M5 — Auth, Stripe, MCP
- [ ] Auth.js v5 (Google/GitHub OAuth + e-mail)
- [ ] Stripe freemium (free|pro), webhooks als bron van waarheid
- [ ] MCP server (OAuth PKCE) met visual-first tool surface

### M6 — Launch
- [ ] SEO (metadata, sitemap, robots), Playwright E2E-suite, perf/media-audit
- [ ] Railway deploy + domein-cutover struq.nl

## Nu actief

**M0** — zie `PROJECT_STATE.md` voor de actuele stand.

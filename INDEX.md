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
- `WORKFLOW.md` — verification tiers, git/PR-strategie, doc-drift regels

## Skills

- `.skillshare/skills/` — **canonieke** skills; alleen hier bewerken, daarna `skillshare sync`
  - `master-orchestrator/` — verplichte startup: scope-classificatie, lane-routing, handoff-regels
  - `frontend/` · `backend/` · `database/` · `mcp/` · `github/` · `quality/` — domeinregels
  - `brandvoice/` — Nederlandse copy-canon + Struq-stem
  - `psychology/` — UX/persuasie-gate voor elke interactie
  - `onboarding/` — activatie, first-run, tours
- `.claude/skills/`, `.agents/skills/`, `.agent/skills/` — gegenereerde mirrors, nooit bewerken
- `.skillshare/config.yaml` — sync-targets

## Overig

- `.github/PULL_REQUEST_TEMPLATE.md` — PR-structuur incl. doc-drift checklist
- `.gitignore`

## Komt eraan (zie NORTHSTAR)

- M1: `app/`, `components/`, configs (Next.js 16 + Tailwind v4 + GSAP/Lenis/Three.js)
- M2: `lib/db/`, `drizzle/`, `scripts/import-canon.ts`, `docker-compose.yml`
- M3: `app/(dashboard)/`, `components/vault/`

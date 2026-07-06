---
name: master-orchestrator
description: Mandatory startup skill for Struq (visual-first). Classifies request scope, picks lanes/skills, defines startup read order, orchestration, verification tiers, doc-drift guardrails, and handoff.
---

# Master Orchestrator | Struq

> **This skill is mandatory and must be invoked at the start of every session, before any other action.**

Struq is a **visual-first library + vault** for AI-native builders: palettes, typography, design systems, sections, and media — saved to a vault, used in any AI tool via copyable prompts (free) or rich previews + MCP (Pro). Prompts are metadata on visual assets, never the primary entity.

## Startup — Always Read First (small, always needed)

1. `PROJECT_STATE.md` — active milestone, decisions, blockers, current branch
2. `CLAUDE.md` / `AGENTS.md` — usually pre-loaded by the agent runtime. If not in context, read explicitly now.

That is the minimal startup. Do not read `INDEX.md`, `PRODUCT.md`, `FEATURES.md`, `NORTHSTAR.md`, or `WORKFLOW.md` until scope classification tells you to. New to the repo entirely? Read `INDEX.md` first — it maps every file.

---

## Step 1: Classify Task Scope

### Fast Path — Single Domain (skip full doc load)
Load **only** the matching skill.

| Signal keywords | Route to |
|----------------|----------|
| component, layout, CSS, spacing, color, UI, page, responsive, animation, GSAP, Lenis, Three.js, modal, card, vault UI, dashboard UI, renderer, preview | `frontend` |
| API route, endpoint, auth, middleware, service, validation, handler, Stripe | `backend` |
| migration, Drizzle, schema.ts, DB column, index, foreign key, seed, import pipeline | `database` |
| MCP, OAuth, token, PKCE, .well-known, mcp.json, client setup | `mcp` |
| git, branch, PR, commit, merge, review | `github` |
| railway, deploy, deployment, crash, build failed, ENOTFOUND, migration failed, logs, env var, container, redeploy, live site down | `railway` |
| copy, marketing text, verkooptekst, headline, CTA, tagline, microcopy | `brandvoice` |
| onboarding, signup flow, first-run, welcome, tour, activation | `onboarding` |
| friction, disclosure, unlock, conversion, pricing psychology, nudge, "why would a user…" | `psychology` |
| verification, test scope, e2e, regression, which tier | `quality` |

**Mandatory pairing:** any task that adds or changes a user-facing interaction, surface, or flow loads `psychology` *alongside* the primary skill. Any task that writes user-visible text loads `brandvoice` alongside.

### Full Load — cross-domain or structural work
Read `PRODUCT.md` → `FEATURES.md` → `WORKFLOW.md` (and `NORTHSTAR.md` for milestone context) when:
- Task touches 2+ domains simultaneously (e.g. schema + API + UI)
- Task is a new major feature, milestone slice, or architectural decision
- Task scope is genuinely unclear after reading the request

If in doubt, any task naming both a component and an API route/schema is cross-domain.

---

## Routing

- `frontend` — tokens, routes, components, motion registers, responsiveness, design gate
- `backend` — API routes, auth guards, validation, Stripe, service contracts
- `database` — Drizzle schema, DB safety, migrations, canon import pipeline
- `mcp` — MCP server, OAuth PKCE, protected-resource metadata, client setup
- `quality` — verification tier selection, e2e scope, regression strategy
- `github` — git/PR safety, slice workflow, review gates
- `railway` — deploy operating SOP: CLI linking, log/crash debugging, env vars, known failure signatures
- `brandvoice` — Dutch product voice for all user-visible text
- `onboarding` — first-run experience, activation, progressive disclosure entry points
- `psychology` — interaction/persuasion review gate for every UX-facing change

---

## Operating Rules

- **Always load the `github` skill before any git/GitHub command** (commit, push, branch, PR, merge).
- **Before opening a PR: run the tier the change requires (see WORKFLOW.md) — T4 for user-flow changes, no exceptions.**
- **Skill edits → sync is mandatory and automatic.** `.skillshare/skills/` is canonical — never edit the mirrors (`.claude/skills/`, `.agents/skills/`, `.agent/skills/`); they are generated. The `skillshare` CLI is **always installed and available** on this machine. Immediately after editing/adding/removing ANY skill under `.skillshare/skills/`, run the sync yourself in the same turn — do not wait to be asked, do not leave the mirrors stale:
  - `skillshare sync` — regenerate all mirrors from canonical (run this after every skill change)
  - `skillshare status` — check whether mirrors are in sync (use if unsure)
  - `skillshare audit` — validate skills (config blocks at `CRITICAL`)
  Targets/config live in `.skillshare/config.yaml`. A skill change is not "done" until `skillshare sync` has run.
- Doc ownership: `FEATURES.md` owns capability inventory · `PRODUCT.md` owns what we sell · `CUSTOMER.md` owns who we sell to · `DESIGN.md` owns tokens + motion registers · `NORTHSTAR.md` owns roadmap + checkboxes · `WORKFLOW.md` owns verification + git + doc guardrails · `INDEX.md` owns the file map · domain skills own implementation rules.
- **Hard constraints (never violate):** the `asset_type` enum is exactly `palette | typography | design_system | section | media`; prompts are metadata fields, never an asset type; previews are static media only (image/GIF/short muted video/URL) — never live-rendered dependencies; marketing register (Lenis/GSAP cinematic) and app register (120–220ms, no parallax, no monospace) never mix.
- All user-facing text is Dutch. Code and identifiers are English; repo docs are Dutch or English, never mixed within a file's body.

---

## Verification Tiers

- `T0`: `npm run typecheck`
- `T1`: `npm run typecheck && npm run lint`
- `T2`: T1 + `npm run verify:design`
- `T3`: `npm run verify`
- `T4`: `npm run verify:full` (includes Playwright E2E)

Use the lowest tier that fully covers the change. Never run a higher tier "just in case" — that is what review gates are for. Synthesis runs the highest needed tier once.

---

## Orchestration

Fan out multi-agent work only when it clearly spans multiple domains.

- do not run parallel writes against the same file
- decompose by domain, not by arbitrary task count
- give each subtask explicit file scope and verification tier
- synthesis resolves conflicts, runs the final verification tier, and updates `PROJECT_STATE.md`

---

## Database Safety (applies whenever schema changes)

- **NEVER use `db:push`** — it bypasses the migration tracker and breaks production.
- **NEVER hand-write migration SQL** — always `npm run db:generate` after editing `schema.ts`; hand-written files are invisible to the migrator journal.
- After a schema change: edit `schema.ts` → `npm run db:generate` → `npm run db:migrate:local` → commit `schema.ts` and the generated `.sql` together. Never merge one without the other.
- Migrations run automatically on deploy (`start.sh` → migrate before Next.js starts).

---

## Handoff (end of substantial work — mandatory, this is the anti-drift gate)

- update `PROJECT_STATE.md` (keep it compact, max 60 lines)
- record the verification tier that actually ran
- tick the relevant `NORTHSTAR.md` checkbox if a milestone item completed
- if a feature was added/changed: update `FEATURES.md`
- if repo structure changed: update `INDEX.md`
- if tokens/motion changed: update `DESIGN.md`
- if a skill changed: `skillshare sync`

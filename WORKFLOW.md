# WORKFLOW — Struq

## Verification Tiers

| Tier | Commando | Wanneer |
|---|---|---|
| T0 | `npm run typecheck` | types-only, docs |
| T1 | T0 + `npm run lint` | kleine component-/logica-wijzigingen |
| T2 | T1 + `npm run verify:design` | alles wat tokens of visuals raakt |
| T3 | `npm run verify` | structureel: schema, routes, config |
| T4 | `npm run verify:full` (incl. Playwright E2E) | user-flows, pre-release |

**Regel: de laagste tier die de wijziging volledig dekt.** Nooit `build` of E2E "voor de zekerheid". De `quality` skill beslist bij twijfel.

## Git & PR-strategie

- Werken in **slices**: branch per slice (`feat/<milestone>-<slice>`, `fix/…`, `docs/…`), kleine PR's.
- Gate per slice: **tier groen → merge/push.** Cold code review en menselijke verificatie zijn optioneel, op initiatief van Roy (bijv. `/code-review` op een grote slice) — geen verplichte gate.
- PR-body (wanneer er een PR is) via `.github/PULL_REQUEST_TEMPLATE.md`, inclusief doc-drift checklist.
- Schema-PR zonder gegenereerd migratiebestand = merge blokkeren (zie `database` skill).
- Mergen naar main is de deploy-trigger (Railway; migraties draaien automatisch bij containerstart).

## Doc-drift regels (hard)

Bij het afronden van substantieel werk, in dezelfde PR:

| Als… | Dan bijwerken |
|---|---|
| altijd | `PROJECT_STATE.md` (compact, max 60 regels) + gedraaide tier vermelden |
| milestone-item af | checkbox in `NORTHSTAR.md` |
| feature toegevoegd/gewijzigd | `FEATURES.md` |
| repo-structuur gewijzigd | `INDEX.md` |
| tokens/motion gewijzigd | `DESIGN.md` |
| skill gewijzigd | alleen in `.skillshare/skills/` bewerken → `skillshare sync` |
| user-zichtbare tekst | `brandvoice`-pass |
| interactie/flow gewijzigd | `psychology`-pass |

Drift wordt op drie plekken gevangen: agent-handoff (master-orchestrator skill) → PR-template checklist → reviewer.

## Skills

- Canoniek: `.skillshare/skills/` — **alleen daar bewerken**.
- `skillshare sync` kopieert naar `.claude/skills/`, `.agents/skills/`, `.agent/skills/` (config: `.skillshare/config.yaml`). Mirrors worden gecommit zodat elke agent ze op clone heeft, maar nooit met de hand bewerkt.

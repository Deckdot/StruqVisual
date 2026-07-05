---
name: quality
description: >
  Use for verification tier selection, regression scope, and Playwright e2e coverage decisions.
  Trigger on: typecheck, lint, test, e2e, verify, CI, playwright, which tier.
---

# Quality Skill | Struq

## Tier Selection

- `T0`: `npm run typecheck` — types-only, docs
- `T1`: T0 + `npm run lint` — small component/logic changes
- `T2`: T1 + `npm run verify:design` — anything touching tokens or visuals
- `T3`: `npm run verify` — structural work: schema, routes, config
- `T4`: `npm run verify:full` (includes Playwright e2e) — user-flow changes, pre-release

**Verify the lowest tier that proves the change.** Never run `build` or e2e "just in case" — escalate only when static checks cannot give confidence.

## Playwright Guidance

Run e2e when auth flows, save/collect flows, route transitions, or critical UI journeys changed. Not for small refactors.

## Gate Intent

- `verify:design`: catches token drift and styling regressions in source (see `frontend` skill).
- `verify:docs`: catches drift in the canonical doc set (INDEX/FEATURES/PROJECT_STATE structure, banned legacy references).

---
name: github
description: >
  Use for branch, commit, push, PR, review, and merge safety.
  Trigger on: git, branch, merge, rebase, tag, release, pr, commit, review.
---

# GitHub Skill | Struq

## Slice Workflow

- Work in **slices**: one branch per slice, named `feat/<milestone>-<slice>` (or `fix/…`, `docs/…`). Small, mergeable units.
- Gate per slice: **tier verification green → merge/push directly.** Cold code review and human verification are optional and Roy-initiated (e.g. `/code-review` on a big slice) — not a mandatory gate.

## PR Rules

- Before opening a PR: run the verification tier the change requires (see `WORKFLOW.md`) — `T4` for user-flow changes. Do not open a PR on a red tier.
- Always use `.github/PULL_REQUEST_TEMPLATE.md` as the body; fill every applicable section including the doc-drift checklist.
- Call out any skipped checks explicitly in the PR body.

## Git Safety

- No destructive git commands unless explicitly requested; prefer non-interactive commands.
- Inspect `git status` before commit/push; do not assume a clean worktree; never revert unrelated changes.
- Keep commits scoped and clear. Docs, skills, and verification scripts are first-class project code.

## Schema Change Checklist (when a PR touches `lib/db/schema.ts`)

1. A generated `drizzle/*.sql` migration file is committed alongside it (via `npm run db:generate`, never hand-written).
2. Missing migration file = **block the merge** — merging to main deploys, and migrations run automatically on container start.

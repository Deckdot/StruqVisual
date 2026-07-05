# CLAUDE.md — Struq Operating Guide

> **MANDATORY — before anything else:** invoke the `master-orchestrator` skill from `.skillshare/skills/master-orchestrator/SKILL.md`. Do not read docs, plan work, or touch any file until it is loaded. It classifies the task, picks the lane/skills, and decides what to read — do not pre-load docs.

## Mission

Struq is a **visual-first library + vault for AI-native builders**: gecureerde paletten, typografie, design systems, secties en media — bewaard in je vault, direct bruikbaar in elke AI via kopieerbare prompts (free) of rijke previews + MCP (Pro). Dutch-only market, domain `struq.nl`. Freemium via Stripe. North star and roadmap: `NORTHSTAR.md`.

## Hard Constraints (never violate, RFC required to change)

- `asset_type` enum is exactly `palette | typography | design_system | section | media`. **Prompts are metadata on visual assets, never the primary entity.** No prompt-first architecture, ever.
- Previews are static media only (image/GIF/short muted video/URL) — never live-rendered components or dependency sandboxes.
- Two motion registers, never mixed: marketing = cinematic (Lenis/GSAP/Three.js); app = 120–220ms, no parallax, no monospace.
- Frictionless defaults + strict progressive disclosure; every UX change passes the `psychology` skill gate; every user-visible string passes `brandvoice` (Dutch).
- Do not import product language, legacy asset taxonomy, or dead architecture from the old Struq repo (`../Struq` is a code donor, not a truth source).

## Canonical Sources

- Root docs are the operating source of truth — see `INDEX.md` for the map, `PROJECT_STATE.md` for current state.
- Canonical skills live in `.skillshare/skills/` — **edit skills there only**, then run `skillshare sync`. The mirrors (`.claude/skills/`, `.agents/skills/`, `.agent/skills/`) are generated; never edit them.

## Verification Policy

`T0` typecheck · `T1` +lint · `T2` +verify:design · `T3` verify · `T4` verify:full (E2E). Use the lowest tier that fully covers the change — never run heavier checks "just in case". Details: `WORKFLOW.md`.

## Handoff (anti-drift, mandatory)

When finishing substantial work: update `PROJECT_STATE.md` (compact, ≤60 lines), record the tier that ran, tick `NORTHSTAR.md` checkboxes, and update `FEATURES.md` / `INDEX.md` / `DESIGN.md` when features / structure / tokens changed. The PR template enforces the same checklist.

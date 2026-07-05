# PROJECT_STATE

> Compact, altijd actueel. Max 60 regels. Bijwerken bij elke substantiële wijziging.

## Actieve milestone

**M0 — Repo + Agent OS** (zie `NORTHSTAR.md`)

## Stand

- Repo geïnitialiseerd (branch `main`), agent OS staat: 10 canonieke skills + root docs + PR-template.
- `DESIGN.md` is bewust een stub — definitieve versie wordt in M1 geëxtraheerd uit de geïntegreerde homepage.
- Nog open in M0: GitHub remote + branch protection.

## Beslissingen (kort)

- Clean successor van het oude Struq-repo; geen datamigratie. Bronrepo's: `../Struq` (code-donor), `../DesignOS` (canon-donor).
- Enum bevroren op 5 visuele types; prompts zijn metadata. Silhouettes = presets in design_system.
- Nederlands-only. Railway deploy. Freemium free|pro.

## Laatste verificatie

- Geen (docs-only; er is nog geen codebase — T0 n.v.t.)

## Volgende stap

M1 slice 1: Next.js scaffold + configs + animatie-infra uit Struq kopiëren.

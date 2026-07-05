---
name: onboarding
description: >
  Use for first-run experience, signup/activation flow, welcome states, tours, and progressive-disclosure entry points.
  Trigger on: onboarding, signup flow, first-run, welcome, tour, activation, empty state, eerste keer.
---

# Onboarding Skill | Struq

Always pair with the `psychology` skill — onboarding is where its rules bite hardest.

## Activation Principles

- **≤30 seconds to the first save.** A new user lands, sees beautiful assets, saves one. That is activation; everything else is secondary.
- **The gallery is the onboarding.** No form-heavy setup, no questionnaire walls. At most one lightweight question (experience level) that seeds the disclosure level.
- **Beginners see 3–4 choices, max** (Hick's Law). The first screen is a quiet, visual, gallery-like space, not a feature tour of everything.
- **Progressive disclosure, never regression.** Surfaces unlock with real usage milestones and stay unlocked. Nothing a user has seen gets re-hidden.
- **Show value before asking anything.** Signup is asked when the user wants to keep something (save action), not at the door.
- **Empty states sell the next action**, in Dutch, one CTA each — never a blank screen.

## Tour Pattern (when a guided tour is warranted)

Prefer contextual first-use hints over a full tour. If a tour is needed: SVG spotlight overlay + animated step cards + localStorage persistence (`useSyncExternalStore`), client-side only, SSR-safe, skippable at every step. A proven implementation to copy lives in the old Struq repo (`components/onboarding/`, `hooks/use-onboarding.ts`) — adapt selectors and copy, keep the mechanics.

## Rules

- Onboarding copy is `brandvoice` territory: Dutch, direct, nuchter.
- Every step must be dismissible; completing zero steps must still leave a usable product.
- Track milestone events (first save, first kit, first copy-prompt) — they drive the disclosure level.

## Verification

- Flow changes: `T4` (this is the definition of a user-flow change).

---
name: psychology
description: >
  The review gate for every user-facing interaction, feature, and flow. Applies behavioral principles to keep
  the default UX frictionless and conversion honest. Trigger on: friction, disclosure, unlock, conversion,
  pricing, nudge, onboarding, new feature, new interaction, "why would a user", empty state, upgrade prompt.
---

# Psychology Skill | Struq

Every interaction we ship is designed from a psychological standpoint. This skill is loaded **alongside** the primary skill for any UX-facing change and signs off before the work is done.

## Core Laws

- **Frictionless default (floor low, ceiling high).** The default path never requires configuration, reading, or decisions beyond the task. Expert options exist but are opt-in. If a step can be removed, remove it.
- **Progressive disclosure, strictly.** Surfaces appear when the user is ready (seeded by experience level, raised by real usage milestones) and **never regress** — nothing a user has earned or seen is re-hidden (goal-gradient: unlocks feel like progress).
- **Hick's Law.** Fewer choices, faster action. Beginners see 3–4 destinations; taxonomies collapse to the visual groups; advanced filters hide until asked for.
- **Von Restorff.** One thing per screen is the hero. In Struq that is the visual asset, never the chrome, never a promo.
- **IKEA effect.** Saving a free asset makes it "yours" — invest the user early with save/collect actions; their vault is their sunk value.
- **≤30 seconds to first value.** Landing → saved asset in under 30s. Every flow addition is measured against this.
- **Aesthetic-usability.** Polish is a trust signal: motion in the right register, no jank, no loading flashes. Beautiful defaults make users forgive and stay.
- **Loss aversion, honestly.** Pro assets are visible with previews teased — users see what they'd miss. Never dark patterns: no fake scarcity, no countdown timers, no guilt copy, no invented social proof.
- **Recognition over recall.** Show, don't make users remember: visual previews over names, recently-used surfaced, one-click copy where the user already is.

## The Gate — checklist per UX change

1. What decision does the user face here? Can we remove or default it?
2. Does the default path stay frictionless for a first-time user? (Count the clicks and reads.)
3. Is anything disclosed too early (noise) or locked too late (frustration)? Does an unlock regress anything?
4. What is the hero of the screen? Is it the asset?
5. Does this preserve ≤30s-to-first-save?
6. Is every persuasion element honest? (Real numbers, real previews, real scarcity or none.)
7. Mobile: does the same psychology hold with thumbs and a small screen?

If a check fails, the change is not done — simplify or re-stage the disclosure.

## Pricing & Conversion Notes

- Free tier must be genuinely great (reciprocity builds the relationship; a crippled free tier kills trust and SEO-borne growth).
- The upgrade moment is contextual: when a user hits a Pro preview they want, not a nag banner.
- Anchor Pro against the value of the library, not against the free tier's limitations.

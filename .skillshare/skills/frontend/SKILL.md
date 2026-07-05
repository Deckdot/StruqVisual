---
name: frontend
description: >
  Use for Struq UI routes, components, tokens, motion, responsive behavior, and design-gate consistency.
  Trigger on: globals.css, tailwind, component, layout, UI, page, responsive, animation, GSAP, Lenis, Three.js,
  renderer, preview, or file paths under app/ or components/.
---

# Frontend Skill | Struq

## Scope

- `app/**`, `components/**`, `app/globals.css`, `tailwind.config.ts`
- Never read or edit files under `.next/` — always the source file.

## Hard Constraints

- **Previews are static media only** (image / GIF / short muted video / URL). Never live-rendered components or dependency sandboxes.
- **The asset taxonomy is frozen**: `palette | typography | design_system | section | media`. UI never invents new types or groups without an RFC.
- Every UX-facing change gets a `psychology` skill pass; every user-visible string gets a `brandvoice` pass. All user-facing text is Dutch.

## Two Motion Registers — never mix

| Register | Where | Rules |
|---|---|---|
| **Marketing** | `app/page.tsx`, public site, gallery | Cinematic: Lenis smooth scroll, GSAP (ScrollTrigger/SplitText/etc.), Three.js. Copied Struq homepage infra lives here. |
| **App** | `app/(dashboard)/**` | Fast + quiet: 120–220ms transitions, no Lenis, no parallax, no scroll-jacking, no monospace fonts. |

## Token Canon

- Tokens and themes live in `app/globals.css`; semantic mappings in `tailwind.config.ts`.
- Use semantic classes only: `bg-background`, `bg-card`, `bg-accent`/`text-accent`, `text-foreground`, `text-muted-foreground`, `border`.
- Never hardcode color scales (`bg-blue-*`, `text-gray-*`, `border-indigo-*`) or raw hex in `className`.
- Exceptions (only): Three.js materials/lighting, chart palettes/SVG data-viz, vendor brand marks, code syntax highlighting — and **palette asset renderers**, which render user/canon colors by definition.

## Typography Weights

- Body: `font-normal` (default, no class needed) · labels/nav/CTAs: `font-medium` · headings/card titles: `font-semibold`.
- `font-bold` only for rare one-off emphasis. `font-extrabold` / `font-black`: never.

## Buttons & Interaction

- No glow or colored drop-shadows on interactive elements. Hover feedback via `hover:brightness-110`, never a hardcoded hover color.
- Neutral `shadow-sm`/`shadow-md` on non-interactive containers is fine.

## Mobile / Desktop — two experiences, one codebase

The `sm:` (640px) breakpoint is the split. Every frontend change accounts for both explicitly:

- Navigation: sidebar on desktop, bottom nav on mobile — never the same component.
- Pickers/dropdowns: `DropdownMenu` on desktop, bottom sheet (`fixed bottom-0`, `rounded-t-2xl`, drag handle, backdrop-close, `pb-safe-or-4`) on mobile. Never one `DropdownMenu` on both.
- Modals: full-screen on mobile, centered fixed-width on desktop.
- Dense lists on desktop; card/single-column on mobile.

Done-checklist: reasoned through `<640px` and `≥640px` · no horizontal overflow on mobile · touch targets ≥44px.

## Design Gate

`npm run verify:design` scans `app/**` and `components/**` TSX for: hardcoded gray/blue/indigo scales, `className` hex colors, `font-extrabold`/`font-black`, colored shadows. Keep the exception list in the gate script minimal and documented. `// design-gate: ignore` only for documented rendering exceptions.

## Verification

- Pure component/logic: `T1` · anything touching tokens or visuals: `T2` · routes/structure: `T3` · user flows: `T4`.

# DESIGN — Struq

> **Status: wordt geschreven in M1.** Dit document wordt geëxtraheerd uit de geïntegreerde marketing-homepage (gekopieerd uit Struq) zodra die in deze repo draait — niet overgenomen uit Struq's `DESIGN.md`, zodat tokens en werkelijkheid gegarandeerd overeenkomen. Tot die tijd is `app/globals.css` (na M1) de bron van waarheid voor tokens.

## Wat hier komt (M1)

- Token-spec (kleuren, typografie-rollen, spacing, radii) — geverifieerd tegen de werkende homepage
- De twee motion-registers en hun regels:
  - **Marketing-register**: cinematisch — Lenis smooth scroll, GSAP (ScrollTrigger/SplitText), Three.js. Alleen publieke pagina's.
  - **App-register**: 120–220ms, geen parallax, geen scroll-jacking, geen monospace. Alleen dashboard.
- Sectie-grammatica van de homepage (volgorde, dichtheid, ritme)
- Design-gate regels (wat `verify:design` afdwingt)

## Vaste regels (gelden nu al)

- Semantische tokens only; geen hardcoded kleurschalen of hex in `className` (uitzonderingen: zie `frontend` skill).
- Registers mengen nooit.

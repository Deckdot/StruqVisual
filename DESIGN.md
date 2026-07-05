# DESIGN — Struq

> Geëxtraheerd uit de geïntegreerde marketing-homepage en het dashboard (M1). Bron van waarheid voor tokens is `app/globals.css`; dit document beschrijft het systeem erachter.

## Twee registers — nooit mengen

| | Marketing (publiek) | App (dashboard) |
|---|---|---|
| Tokens | `--sq-*` (paper/ink-familie) | Semantische `@theme` tokens (`bg-background`, `bg-card`, `bg-panel`, `text-primary-text`, `text-secondary-text`, `text-meta-text`, `bg-accent`, `border`) |
| Motion | Cinematisch: Lenis smooth scroll, GSAP (ScrollTrigger, SplitText, MorphSVG, DrawSVG), Three.js (MemoryField) | 120–220ms, `ease-out`, alleen transform/opacity/kleur. Geen Lenis, geen parallax, geen scroll-jacking |
| Typo | Comfortaa display (`sq-display`), Urbanist body; koppen licht van gewicht, groot van maat | Urbanist; `font-semibold` koppen, `font-medium` labels/CTA's, `font-normal` body. Geen monospace |
| Toon | Verleidend, nuchter, beeld voorop | Kalm, functioneel, geen verkooppraat |

## Marketing-tokens (`--sq-*`)

Warm papier-canvas met inkt en één oranje accent:
`--sq-paper` (canvas) · `--sq-sunken` / `--sq-raised` (sectievlakken) · `--sq-ink` / `--sq-ink-soft` / `--sq-ink-faint` (tekst) · `--sq-line` / `--sq-line-strong` (lijnen) · `--sq-accent` #e4572e-familie / `--sq-accent-deep` / `--sq-accent-wash` · `--sq-inverse-*` (donkere panelen) · `--sq-shadow-float`.

Utilityklassen: `sq-container`, `sq-eyebrow`, `sq-h2/h3`, `sq-lead`, `sq-muted`, `sq-faint`, `sq-display`, `sq-btn(-accent)`, `sq-panel-inverse`, `sq-marquee`.

## Homepage sectie-grammatica (volgorde = psychologie, zie home-client.tsx)

hero (power fantasy) → proof-marquee (momentum) → problem (pijnherkenning, pinned theater) → insight (belief shift) → four-forms (taxonomie voelbaar: 5 vormen MorphSVG-pin) → showcase (verlangen, horizontale galerij) → how-it-works (gemak, 3 stappen) → blueprint (mechanisme, split-screen pin) → vault (serieus gereedschap) → memory-field (Three.js crescendo) → pricing (risico weg) → faq (bezwaren weg).

## App-regels (dashboard)

- Shell: sidebar ≥`lg`, bottom-nav <`lg` (nooit hetzelfde component); nav uit `components/dashboard/nav-items.ts`, disclosure-gated via maturity provider.
- Kaarten: `rounded-xl border border-border bg-card`; hover alleen `shadow-md`/`bg-panel-hover`; knoppen `hover:brightness-110`, nooit hover-kleurwissel.
- Previews: statisch (swatches, specimens, CSS-thumbnails), nooit live rendering. Paletrenderers mogen letterlijke kleuren tonen (rendering-uitzondering).
- Focus: altijd `focus-visible:ring-accent`; touch targets ≥44px mobiel.

## Design gate

`npm run verify:design` dwingt af: geen hardcoded gray/blue/indigo-schalen, geen hex in className, geen `font-extrabold`/`font-black`, geen gekleurde schaduwen, geen em-dash in zichtbare tekst. Uitzonderingen gedocumenteerd in `scripts/verify-design.ts`.

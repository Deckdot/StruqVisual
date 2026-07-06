# FEATURES — Struq

> Capability-inventaris. Status: `planned` (milestone) · `building` · `live`. Elke feature-PR werkt dit bestand bij (zie WORKFLOW.md).

## Bibliotheek & Vault

| Feature | Tier | Status |
|---|---|---|
| Bladeren door 5 asset-types (palette, typography, design_system, section, media) | free | planned (M3) |
| Type-specifieke previews (swatches, specimens, media, sectie-thumbnails) | free (basis) / pro (rijk) | planned (M3) |
| Asset bewaren (favoriet) in eigen vault | free | planned (M3) |
| Kopieer-prompt: één klik, plakbaar in elke AI | free | planned (M3) |
| Kits: assets bundelen tot collecties | free (basis) / pro | planned (M3) |
| Zoeken + filteren (visueel-eerst, geavanceerd achter disclosure) | free | planned (M3) |
| Progressive disclosure: oppervlaktes ontgrendelen met gebruik | — | planned (M3) |
| Premium assets met rijke previews | pro | planned (M3) |

## Content

| Feature | Status |
|---|---|
| Canon-import: 29 paletten (incl. OKLCH/frontier), 2 typografie-pairings, 9 sectie-kinds, 5 silhouette-presets → design_system, 898 media (metadata + `canon_path`) | live (M2) |
| Idempotente re-import bij canon-updates (upsert op provenance) | live (M2) |
| Media-binaries → object storage (nu alleen metadata) | planned (later) |

## Publiek / marketing

| Feature | Status |
|---|---|
| Marketing-homepage (cinematisch: Lenis/GSAP/Three.js, Nederlands) | planned (M1) |
| Publieke galerij, SSR + SEO-geïndexeerd, "Bewaar in je vault" → signup | planned (M4) |
| Learn platform (lessen + admin studio) | planned (M4) |

## Platform

| Feature | Status |
|---|---|
| Datamodel + Drizzle/Postgres: schema (5 asset-types bevroren), custom per-file-migrator, seed + assert | live (M2) |
| Repository-laag: getypeerde queries → `VaultAsset`; dashboard/vault/canon renderen uit DB | live (M2) |
| Favorites + icon-candidates: DB-pad (route handlers) met localStorage-fallback | live (M2 seam, M5 geactiveerd) |
| Auth.js v5: Google/GitHub OAuth + e-mail/wachtwoord (JWT-sessie met `tier`, argon2, sign-out) | live (M5) |
| Stripe freemium (free/pro) | planned (M5) |
| MCP server (OAuth PKCE): assets zoeken/lezen, kits, saves vanuit je AI-tool — pro | planned (M5) |
| Railway deploy, migraties automatisch bij start | planned (M6) |

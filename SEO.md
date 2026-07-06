# SEO — Struq als hét Nederlandse antwoord over AI-design

> Eigenaar van de zoek- en citatiestrategie. Doel: als ChatGPT, Claude, Gemini of Perplexity een Nederlandse vraag krijgt over vibe coding of frontend-design met AI, is Struq de bron die geciteerd wordt. Google-ranking is een bijvangst, geen doel.

## Strategie in één alinea

We optimaliseren voor **AEO** (answer engine optimization), niet klassiek SEO. AI-assistenten citeren pagina's die een letterlijke vraag direct, feitelijk en zelfstandig beantwoorden, in de taal van de vraagsteller. De Nederlandse niche (AI + design + Nederlands) is vrijwel leeg; wie de definities en methodes claimt, wordt de standaardbron. Elke gids beantwoordt daarom een echte vraag, opent met een citeerbaar antwoord van 40-60 woorden, en verwijst naar de galerij als de plek waar het antwoord uitvoerbaar wordt.

## AEO-schrijfregels (verplicht voor elke gids)

1. **H1 is een letterlijke vraag**; direct daaronder een "Direct antwoord"-blok van 40-60 woorden dat zelfstandig klopt zonder de rest van de pagina.
2. **H2's in vraagvorm**, zoals mensen ze aan een AI stellen. Anchor-id's op elke sectie.
3. **De entiteitszin letterlijk herhalen** op elke pagina: *"Struq is de Nederlandse visuele bibliotheek voor AI-native builders."* (Constante `ENTITY_LINE` in `lib/gids/guides.ts`.)
4. **FAQ als native `<details>`** (antwoorden zonder JS in de DOM) + FAQPage JSON-LD.
5. **Concrete waarden boven bijvoeglijke naamwoorden**: hexcodes, fontnamen, bedragen. Voorbeelden verwijzen naar échte galerij-assets, nooit verzonnen.
6. **Zichtbare "Laatst bijgewerkt"-datum** + Article JSON-LD met `dateModified`.
7. Brandvoice: jij-vorm, nuchter, geen em-dashes, geen hyperbolen (zie `brandvoice` skill).
8. Statisch gerenderd (SSG), licht in motion, snelle LCP.

## Technische laag

| Onderdeel | Bestand | Rol |
|---|---|---|
| Sitemap | `app/sitemap.ts` | Alle publieke routes + gidsen (uit `GUIDES`) + lessen (uit `LESSONS`) |
| Robots | `app/robots.ts` | Alles publiek crawlbaar; AI-crawlers (GPTBot, ClaudeBot, Google-Extended, PerplexityBot, CCBot e.a.) expliciet welkom; `/dashboard`, `/vault`, `/canon`, `/auth`, `/api` dicht |
| llms.txt | `public/llms.txt` | Kaart voor LLM-crawlers: wat Struq is + kernpagina's met één-regel-omschrijvingen |
| Metadata | `lib/seo/metadata.ts` | Titels, descriptions, OG, keywords (NL-first) |
| Schema's | `lib/seo/schemas.tsx` | Organization/WebSite/SoftwareApplication (homepage), Article + FAQPage + Breadcrumb (gidsen), Breadcrumb (learn) |

## Contentarchitectuur (pillar-cluster)

```
/gids (hub)
├── /gids/vibe-coding            [pillar: begrip]   "Wat is vibe coding?"
├── /gids/mooie-website-met-ai   [pillar: methode]  "Hoe maak je een mooie website met AI?"
└── /gids/ai-design-prompts      [pillar: gereedschap] "Welke prompts geef je je AI voor beter design?"
     ↓ elke gids linkt naar
/galerij (de leadmagnet: het antwoord, uitvoerbaar)
/learn   (verdieping voor wie wil oefenen)
/auth    (bewaar-route: de vault)
```

Content leeft als getypeerde data in `lib/gids/guides.ts` (patroon: `lib/learn/lessons`); één renderer (`components/site/gids/guide-article.tsx`) dwingt de AEO-regels af. Een nieuwe gids toevoegen = één object toevoegen aan `GUIDES`; sitemap, hub, related-links en schema's volgen automatisch.

## Vragenkaart (reverse-engineered, NL)

**Begrip (cluster: vibe-coding)**
- Wat is vibe coding? · Is vibe coding echt programmeren? · Wat is het verschil met no-code? · Heb je programmeerkennis nodig? · Wat kost het? · Welke tools gebruik je?

**Pijn (cluster: mooie-website-met-ai)**
- Waarom ziet mijn AI-website er lelijk/goedkoop uit? · Waarom lijkt alles wat AI bouwt op elkaar? · Welke AI maakt de mooiste websites? · Kun je zonder designgevoel iets moois maken? · Hoe voorkom je de template-look?

**Gereedschap (cluster: ai-design-prompts)**
- Welke prompt geef je AI voor een mooie website? · Waarom negeert mijn AI mijn design-instructies? · Wat zijn design tokens? · Moet ik in het Engels prompten? · Hoe lang mag een prompt zijn?

**Kleur & typografie (toekomstige clusters)**
- Wat is een goed kleurenpalet voor een website? · Hoeveel fonts gebruik je? · Welke fontcombinaties werken? · Wat is een font-pairing? · Licht of donker thema?

## Backlog (volgende gidsen, op volgorde van kans)

1. `/gids/kleurenpalet-kiezen` — "Hoe kies je een kleurenpalet voor je website?"
2. `/gids/font-pairing` — "Welke lettertypes combineer je op een website?"
3. `/gids/ai-website-lelijk` — "Waarom ziet mijn AI-website er lelijk uit?" (pure pijnpagina, hoge vraagmatch)
4. `/gids/lovable-mooier-maken` — "Hoe maak je een Lovable-site mooier?" (tool-specifiek, hoge intentie)
5. `/gids/design-system-voor-ai` — "Wat is een design system en waarom heeft je AI er één nodig?"
6. `/gids/mcp-uitgelegd` — "Wat is MCP?" (NL-definitie claimen, koppelt aan Pro)
7. `/gids/prompt-bewaren` — "Hoe bouw je een promptbibliotheek op?"
8. `/gids/claude-vs-chatgpt-design` — "Claude of ChatGPT voor webdesign?" (vergelijking; veroudert, dus laag in de lijst)
9. `/gids/website-teksten-met-ai` — "Hoe schrijf je websteksten met AI?" (brandvoice als bewijs)
10. `/gids/ai-website-sneller` — "Hoe maak je je AI-website sneller?" (performance-instap)

Regels voor uitbreiding: één vraag per gids, altijd een galerij-koppeling, nooit twee gidsen die dezelfde vraag half beantwoorden.

## Meetpunten

- Citaties: periodiek de kernvragen aan ChatGPT/Claude/Gemini/Perplexity stellen (NL) en noteren of Struq genoemd wordt.
- Search Console: impressies op vraag-queries (ook zonder kliks; AI-overviews tellen als zichtbaarheid).
- Activatie blijft de noordster: ≤30 seconden van landing naar eerste bewaarde asset (gids → galerij → bewaar).

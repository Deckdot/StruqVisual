# COMPETITOR_IMPECCABLE — Teardown van impeccable.style

> Referentiedocument, geen actieplan. Doel: bij elke relevante beslissing (DESIGN.md, onboarding, MCP, marketing) even checken of we een Impeccable-valkuil herhalen of hun sterke punt onbenut laten. Onderzocht 2026-07-06: live site (homepage, `/slop`, `/docs`) + broncode (`pbakaus/impeccable`, 43.8k stars, incl. `skill/reference/typeset.md` en `critique.md`).

## Wat het is

Impeccable is een **design-vocabulaire voor coding agents**: 23 slash-commands (`/typeset`, `/colorize`, `/critique`...) plus een detector (46 deterministische anti-patroonregels) die Claude Code/Cursor/Copilot minder "AI-slop" UI laat opleveren. Gratis, open-source, MIT-licentie. Het bewijst dat onze markt (AI-native builders die geen designer zijn) reëel en groot is — 43.8k stars is geen ruis.

**Kernspanning die we uitbuiten:** de IP (het design-denken) is sterk. De verpakking (hoe je het ervaart) is een devtool zonder progressive disclosure. Wij bouwen het tegenovergestelde: dezelfde smaak, in een vault-first, laag-frictie ervaring.

---

## Deel 1 — Wat we overnemen (het denken, niet het artefact)

### 1. Vocabulaire als codified checklist, niet als losse prompt
Hun 23 commands vallen in een echte lifecycle: **Create** (craft, shape) → **Evaluate** (audit, critique) → **Refine** (typeset, layout, colorize, animate, delight, bolder/quieter, overdrive) → **Simplify** (distill, clarify, adapt) → **Harden** (polish, optimize, harden). Elk command is een discipline-checklist met harde drempelwaarden — `typeset.md` bevat bijv. concrete regels: type-ratio ≥1.25, body-tekst ≥16px, `clamp()` voor marketing vs. vaste `rem`-schaal voor app-UI, regellengte 45–75 tekens, max 2-3 fontfamilies.

- [ ] **Actie:** vertaal dit soort discipline-checklists (typografie, kleur/contrast, spacing, motion) naar **vault-content**, niet naar commands. Een `typography`- of `design_system`-asset kan een "waarom dit werkt"-callout tonen die put uit zo'n checklist (concrete cijfers, geen vage smaak-taal).
- [ ] **Niet overnemen:** de command-als-CLI-verb-framing (`/impeccable typeset`). Struq is geen coding-agent-skill; we hebben geen commands nodig, de regels leven in de asset zelf.

### 2. Brand mode vs. product mode als expliciete dimensie
Elk command gedraagt zich anders in **brand**-register (marketing, cinematisch, fluid `clamp()`-type, mag luid zijn) vs. **product**-register (app-UI, vaste `rem`-schaal, restraint, geen parallax). Dit is vrijwel woord-voor-woord onze eigen harde regel in `CLAUDE.md` ("Twee motion-registers, nooit gemengd"). **Bevestiging, geen nieuw idee** — we zitten hier al goed. Wel de moeite waard: zij passen dit consistent toe op élk command/asset. Blijf dit net zo strikt handhaven naarmate de assettypes groeien.

### 3. "Slop museum" als leer- en marketingformat
`/slop` catalogiseert 46 benoemde anti-patronen (gradient-text, purple-glassmorphism, side-stripe-border, generieke SaaS-copy...) gegroepeerd per discipline, elk met een live visueel voorbeeld. Dit is hún sterkste top-of-funnel content: concreet, visueel, en een niet-designer snapt in seconden "oh, DAT is wat er mis is met mijn pagina" — zonder jargon.

- [ ] **Actie (hoge prioriteit):** bouw een eigen "slop-galerij" — herkenbare, benoemde AI-clichés met voor/na, in het Nederlands, zonder signup nodig. Dit past beter bij Struq (wij zijn al visueel-first) dan bij Impeccable (zij tonen code-diffs). Kandidaat voor gratis, deelbare content: *"Herken je deze AI-clichés?"*.
- [ ] **Actie:** gebruik hun era-framing (2022-slop vs. 2026-slop) als inspiratie — het signaleert dat de taxonomie evolueert, wat terugkerende bezoeken uitlokt in plaats van een vast oordeel te voelen.

### 4. Portable projectcontext (PRODUCT.md → DESIGN.md)
Ze bewaren projectcontext (doelgroep, brand voice, anti-referenties) in `PRODUCT.md`, gelezen door elk command, en exporteren het resulterende visuele systeem als `DESIGN.md` (Google Stitch-formaat) — een portable spec die andere tools kunnen lezen.

- [ ] **Actie:** overweeg een klein, leesbaar "projectbrief"-concept dat blijft bestaan over sessies/assets heen en dat onze MCP kan lezen vóór het genereren van previews — versterkt de Pro/MCP-pitch ("we onthouden je merkstem en anti-referenties, niet alleen een los palet").
- [ ] **Niet overnemen:** hun exacte DESIGN.md/Stitch-bestandsformaat klakkeloos klonen — dat is Google's spec om te bezitten. Eigen schema, gekoppeld aan ons `asset_type`-model.

### 5. "Respecteert je bestaande design-systeem" als expliciet, getoond vertrouwenssignaal
Punt 01 van hun "ready to drop in"-sectie: ze scannen eerst de codebase (tokens, Tailwind-config, bestaande componenten) en matchen daarop in plaats van te overschrijven — met een live terminal-scan-animatie die dat *toont*, niet alleen belooft. Dit pareert de grootste angst van elke dev: "gaat dit mijn design-systeem slopen?"

- [ ] **Actie:** voor de MCP-pitch specifiek — expliciet beloven én *tonen* dat gegenereerde/geëxporteerde assets bestaande tokens/systemen respecteren, als dat technisch klopt. Zo niet, dit als roadmap-prioriteit noteren — het is een bewezen adoptie-blocker bij precies onze doelgroep.

---

## Deel 2 — Wat we vermijden (specifiek, niet "minder clutter")

### 1. Homepage doet ~9 dingen tegelijk, zonder funnel
Eén scroll bevat: hero, live embedded productdemo (met eigen toolbar: Pick/Insert/Detect/DESIGN.md/Steer), oneindige testimonial-marquee (2 gedupliceerde rijen, draait vóórdat je weet wat het product doet), een 7-categorie slop-grid, 18 command-buttons met tab-wisselbaar demo-paneel, 8 genummerde feature-artikelen elk met eigen code/terminal-visualisatie, een slop-detector CLI-demo, een live-mode-demo, een "writes to source"-diff-demo, en dan pas een 3-tabs installatiesectie met `npx`-commands, Node-versie-eisen, Chrome-extensie-pitch en CLI-voor-CI-pitch — vóór de footer.

Dit is geen "beetje druk", dit is **nul progressive disclosure**: alles staat uitgeklapt, niets zit achter een duidelijke "volgende stap", en een eerste bezoeker krijgt geen signaal wat als eerste te bekijken.

- [ ] **Niet overnemen, hard:** "toon alles, laat de bezoeker scroll-scannen." Onze hele pitch is lage frictie; een muur interactieve demo's is het tegenovergestelde.
- [ ] **Actie:** kies ÉÉN mechaniek om live te tonen boven de vouw (waarschijnlijk: plak-een-prompt-in-je-AI → preview verschijnt in vault). Zet elke andere capability achter een expliciete "bekijk hoe X werkt"-klik — exact wat onze `psychology`-skill-gate al voorschrijft. Zij hébben aparte pagina's (`/designing`) maar herhalen dezelfde content toch volledig uitgeklapt op de homepage. Niet herhalen: als het op een subpagina staat, hoeft het niet óók volledig uitgeklapt op de homepage.

### 2. Legt nergens in één zin uit "hoe gebruik ik dit"
Ondanks extreme detailrijkdom staat er geen enkele plain-English zin in de hero die zegt "je typt een slash-command in je terminal en het bewerkt je bestanden." Je moet het mechanisme afleiden uit een live demo-widget, dan uit installatie-instructies, dan uit docs. Bevestigt precies jouw observatie: het legt niet uit, het toont en verwacht dat je het zelf reverse-engineert.

- [ ] **Actie:** Struq's hero moet het mechanisme in één zin zeggen die een niet-developer direct snapt ("Blader door paletten en secties, kopieer een prompt, plak 'm in je AI"). Laat de demo niet de uitleg dragen.

### 3. Devtool-mechaniek lekt in marketingcopy
`npx impeccable install`, `Node 24+ required`, `exit codes for build gates`, `JSON output`, `--gpt`/`--gemini`-flags, `HMR`, `PR checks` — CLI/CI-vocabulaire middenin wat nominaal een marketingpagina is. Correct voor hún publiek (senior devs die zichzelf al selecteren voor een Claude Code-skill), maar precies het "alleen echte developers zouden dit gebruiken"-gevoel dat je benoemde.

- [ ] **Niet overnemen, hard:** geen terminal-commands, versie-eisen, of CI/exit-code-taal waar dan ook in de buurt van Struq's marketingoppervlak. Als/wanneer we MCP-setup-instructies tonen, horen die in een docs-zone achter "Pro" of "Instellingen", nooit op de homepage.

### 4. "Docs-site"-patroon signaleert infrastructuur, niet delight
Een aparte `/docs` met sidebar-taxonomie (Tutorials → Reference → Automation → Commands per verb) is exact de vorm van een framework-documentatiesite (denk Tailwind-docs, geen consumentenproduct-pagina). Passend voor een tool dat developers in hun pipeline installeren. Volledig verkeerd register voor "een vault die je doorbladert voor inspiratie" — docs-site-chrome (sidebar-nav, "on this page"-TOC, referentietabellen) communiceert op zichzelf al "tool om te configureren voor professionals", wat lage-frictie-positionering ondermijnt zelfs als de content erachter simpel was.

- [ ] **Niet overnemen:** geen docs-site-skelet bouwen voor de gratis/casual-laag. Als MCP-setup echte documentatie nodig heeft, houd het minimaal en taakgericht ("3 stappen om Claude Code te koppelen"), geen volledige referentie-sidebar.

### 5. Testimonial-muur als primair bewijs, op extreem volume
Twee gedupliceerde, auto-scrollende rijen van ~15 ruwe X/Twitter-quotes (meerdere zijn simpelweg "it's so good" / "How is this free??" zonder specificiteit) direct onder de hero, vóór enige productuitleg. Een muur-van-lof-patroon dat aanvoelt als compensatie voor een product dat nog niet zelfverklarend is — kwantiteit boven selectiviteit, en het is het tweede wat een bezoeker ziet, vóór die weet wat "het" is.

- [ ] **Niet overnemen:** geen ongeverifieerde social proof vóór het mechanisme is uitgelegd. Testimonials bij Struq: weinig, specifiek, geplaatst ná begrip van het product (sluit aan bij `marketing-psychology`/`cro`-instinct).

### 6. Live Mode-demo is indrukwekkend maar is een tech-demo, geen onboarding-pad
De embedded live-edit-demo (element kiezen → steer → 3 varianten wisselen via HMR) is het knapste ding op de pagina — dicht bij wat onze MCP + previews beter zouden kunnen leveren. Maar gepresenteerd als autoplay-toy in de hero, losgekoppeld van "hoe krijg ik dit zelf werkend." Coole demo, nul funnel van demo → activatie.

- [ ] **Actie:** neem de ambitie over (een interactieve picker met instant-varianten is een sterk mechaniek — dichter bij onze MCP/Pro-waardepropositie dan wat dan ook op hun pagina), **niet de uitvoering** (autoplay-demo zonder duidelijke "probeer dit zelf"-CTA er direct naast).

---

## Deel 3 — Onze structurele voorsprong

1. **Prompts als metadata, niet het product** (onze harde regel) is gedisciplineerder dan Impeccable's command-first model. Hun hele product ís het command/de prompt; bij ons is de prompt een aflevermechanisme voor een visueel asset. Ons "voelt als devtool"-oppervlak is daardoor inherent kleiner — daar op leunen in plaats van hun command-centrische framing te importeren.
2. **Vault + preview eerst, mechanisme later.** Impeccable heeft geen doorbladerbare galerij van uitkomsten — resultaten zie je alleen via hun eigen demo-site of losse case-studies (`/cases/neo-mirai`). Een vault van gecureerde, statische previews die zonder setup te doorbladeren is, is een fundamenteel lagere-frictie voordeur dan "installeer een CLI en draai een command om te zien of je het leuk vindt." Dit is onze structurele moat: **try-before-install** vs. hun **install-before-you-see-anything**.
3. **MCP kan de "live mode"-payoff zijn zonder de demo-toy-framing** — als Pro/MCP iemand een vault-asset met volledige fidelity direct in hun AI-context laat trekken, is dat Impeccable's meest indrukwekkende feature (live steer + HMR-swap) minus de CLI/Node/HMR-complexiteit, omdat wij een al-gecureerd asset overhandigen in plaats van live vanaf nul te genereren.

---

## Samenvattend: lane-split

| Ons (al goed, bevestigd) | Overnemen (het denken) | Expliciet vermijden |
|---|---|---|
| Visueel-first, asset-type-taxonomie, prompts-als-metadata | Discipline-checklists met concrete drempelwaarden, als vault-content | Slash-command/CLI-framing waar dan ook in marketing |
| Frictionless defaults + progressive disclosure (psychology-gate) | "Slop museum"-galerij — benoemde anti-patronen, voor/na, deelbaar | Docs-site-chrome (sidebar + TOC + referentietabellen) op publieke pagina's |
| Nederlandstalig, non-dev-first toon | Brand-mode vs. product-mode als expliciete dimensie (hebben we al) | Terminal-commands / Node-versies / exit-codes / CI-taal in copy |
| Try-before-install (vault doorbladeren, geen signup) | Portable "projectbrief"-context (hun PRODUCT.md) die MCP-output voedt | Front-loaded testimonial-muren vóór het mechanisme is uitgelegd |
| | "Respecteert je bestaande systeem" als expliciet, getoond vertrouwenssignaal | Autoplay-tech-demo-als-hero zonder direct "probeer het"-pad |

---

## Openstaande vervolgstappen (niet nu uitwerken, later oppakken)

- [ ] Slop-galerij als eigen contentformat scopen (waar in de site, hoeveel items, welke bron van waarheid voor "wat is AI-slop" in het Nederlands/onze markt).
- [ ] Projectbrief-concept (PRODUCT.md-equivalent) toetsen tegen ons datamodel (`lib/db/schema.ts`) — past dit als asset-metadata of als aparte tabel?
- [ ] MCP-pitch herzien met "respecteert je bestaande systeem" als expliciet claim, zodra MCP-server technisch scherp is.
- [ ] Homepage-funnel (hero → één live mechaniek → rest achter clicks) toetsen tegen huidige `components/site/home/*` bij eerstvolgende homepage-iteratie.

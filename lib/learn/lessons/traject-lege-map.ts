import type { LessonManifest } from '@/lib/learn/schema';

/**
 * Flagship lesson for Het Traject: from an empty folder to something that is
 * really online, for people who have never heard of a .md file. The end
 * state is shown first; every milestone walks toward it.
 */
export const trajectLegeMap: LessonManifest = {
  slug: 'van-lege-map-naar-live-site',
  archetype: 'traject',
  lane: 'beginner',
  title: 'Van lege map naar live site',
  hook: 'Geen voorkennis. Aan het einde staat er echt iets online, en snap je waarom elke stap nodig was.',
  description:
    'Stap-voor-stap traject voor complete beginners: wat een .md-bestand is, wat dependencies zijn, hoe je een AI-agent regels geeft en hoe je project live gaat.',
  minutes: 18,
  publishedAt: '2026-07-04',
  updatedAt: '2026-07-04',
  artifact: {
    title: 'Starter-kit: jouw eerste projectcontext',
    description:
      'Een kant-en-klaar CLAUDE.md startbestand met projectcontext en agent-regels, plus de drie startprompts voor je eerste sessie.',
    assetType: 'context',
    tags: ['starter', 'context', 'claude-md', 'learn'],
    filename: 'starter-kit.md',
    body: `# Starter-kit: jouw eerste projectcontext

Zet dit bestand als \`CLAUDE.md\` (of \`AGENTS.md\`) in de map van je project, voordat je je AI-agent iets laat bouwen.

## CLAUDE.md template

\`\`\`markdown
# [Projectnaam]

## Wat dit is
[Eén alinea: wat bouw je en voor wie. Schrijf het alsof je het
aan een vriend uitlegt.]

## Hoe het eruit moet zien
- Warm en rustig, geen standaard AI-look
- Eén accentkleur: [kies er één]
- Veel ruimte, grote koppen

## Regels voor de agent
- Vraag eerst, bouw daarna: bij twijfel over wat ik bedoel, stel één vraag
- Kleine stappen: één onderdeel per keer, laat het me zien voor je verder gaat
- Geen extra dependencies toevoegen zonder het te melden
- Leg bij elke stap in één zin uit wat je deed en waarom
\`\`\`

## Je drie startprompts

**Prompt 1, de start:**
"Lees CLAUDE.md. Zet een nieuw Next.js project op in deze map. Leg me daarna in vijf zinnen uit wat je hebt aangemaakt en waarom."

**Prompt 2, de eerste pagina:**
"Bouw de homepage volgens de stijlregels in CLAUDE.md. Begin met alleen de hero-sectie. Laat me het resultaat zien voordat je verder gaat."

**Prompt 3, live zetten:**
"Help me dit project live zetten met Vercel. Loop me stap voor stap door wat ik moet doen, één stap per keer."

## Waarom dit werkt

Een agent zonder context is een aannemer zonder bouwtekening: hij bouwt wel iets. Dit bestand is je bouwtekening, en hij groeit mee met je project.

Bewaard vanuit Struq Learn · struq.nl/learn`,
  },
  opening: {
    eyebrow: 'Het Traject',
    title: 'Dit staat straks echt online.',
    hook: 'Wat je hiernaast ziet is het eindpunt van dit traject: een eigen site, live op internet, gebouwd met een AI-agent. Je hebt er geen voorkennis voor nodig. Je hebt een map, een tekstbestand en een kwartier nodig.',
    artifact: 'traject-site',
    promise: [
      'Je snapt wat een .md-bestand is en waarom agents erop draaien',
      'Je weet wat dependencies zijn, zonder er bang voor te zijn',
      'De complete starter-kit met agent-regels is aan het einde van jou',
    ],
  },
  steps: [
    {
      id: 'fundament',
      kicker: 'Milestone 1 · Het fundament',
      title: 'Alles begint met één tekstbestand',
      blocks: [
        {
          id: 'fundament-predict',
          kind: 'predict',
          prompt: 'Wat heb je nodig voordat je een AI-agent iets laat bouwen?',
          options: [
            {
              id: 'idee',
              label: 'Een uitgewerkt plan met alle schermen',
              correct: false,
              feedback:
                'Fijn als je het hebt, maar niet nodig. Agents werken juist goed met een richting plus kleine stappen. Grote plannen verouderen voordat je klaar bent.',
            },
            {
              id: 'tools',
              label: 'Betaalde developer-tools en een cursus',
              correct: false,
              feedback:
                'Nee. Alles in dit traject kan met gratis gereedschap. Het verschil tussen beginners en gevorderden zit niet in de tools.',
            },
            {
              id: 'context',
              label: 'Eén goed contextbestand',
              correct: true,
              feedback:
                'Dit is het hele geheim. Eén tekstbestand dat beschrijft wat je bouwt en welke regels gelden. Alles wat de agent doet, wordt er beter van.',
            },
          ],
          reveal:
            'Een agent zonder context is een aannemer zonder bouwtekening: hij bouwt wel iets, maar niet jouw huis. Dit traject draait om die bouwtekening, en je schrijft hem in gewone taal.',
        },
        {
          id: 'fundament-prose',
          kind: 'prose',
          paragraphs: [
            'Dat contextbestand is een .md-bestand. De "md" staat voor Markdown: gewone tekst met een paar simpele tekens voor opmaak. Een hekje voor een kop, een streepje voor een lijstje. Dat is alles, echt.',
            'Waarom werken AI-agents hiermee? Omdat het puur tekst is. Geen verborgen opmaak, geen speciaal programma nodig. De agent leest het zoals jij het schreef.',
          ],
        },
      ],
    },
    {
      id: 'mdbestand',
      kicker: 'Milestone 2 · De bouwtekening',
      title: 'Je eerste CLAUDE.md, laag voor laag',
      curiosityHook: 'Drie kopjes in een tekstbestand, en je agent gedraagt zich opeens als een teamlid.',
      blocks: [
        {
          id: 'mdbestand-code',
          kind: 'code-reveal',
          language: 'Markdown',
          intro:
            'Dit is het bestand dat je zo meeneemt. We bouwen hem in drie lagen op. Klik door de lagen en let op: elke laag is gewone taal.',
          stages: [
            {
              code: '# Mijn eerste site\n\n## Wat dit is\nEen persoonlijke pagina waar ik laat zien\nwat ik maak. Voor vrienden en nieuwsgierigen,\nniet voor recruiters.',
              note: 'Laag 1: wat je bouwt en voor wie. Schrijf het alsof je het aan een vriend uitlegt. Dit ene stukje voorkomt de helft van alle misverstanden met je agent.',
            },
            {
              code: '## Hoe het eruit moet zien\n- Warm en rustig, geen standaard AI-look\n- Eén accentkleur: diep groen\n- Veel ruimte, grote koppen',
              note: 'Laag 2: smaak. Drie regels zijn genoeg. Zonder deze laag krijg je de paarse gradient die elke AI-site heeft.',
            },
            {
              code: '## Regels voor de agent\n- Vraag eerst, bouw daarna\n- Kleine stappen: één onderdeel per keer\n- Geen extra dependencies zonder melden\n- Leg elke stap in één zin uit',
              note: 'Laag 3: gedragsregels. Dit maakt het verschil tussen een agent die je overrompelt en een agent die met je samenwerkt. Vooral "kleine stappen" gaat je veel opleveren.',
            },
          ],
        },
        {
          id: 'mdbestand-secret',
          kind: 'secret',
          teaser: 'Waarom "vraag eerst, bouw daarna" de belangrijkste regel is',
          title: 'De duurste fout is een vlijtige agent',
          body: 'Een agent die bij twijfel doorbouwt, bouwt met veel energie de verkeerde kant op. Eén regel in je contextbestand ("bij twijfel: stel één vraag") verandert dat gedrag volledig. Ervaren builders zetten deze regel in elk project, ook na jaren. Het is de goedkoopste verzekering die er bestaat.',
        },
      ],
    },
    {
      id: 'dependencies',
      kicker: 'Milestone 3 · De bouwmaterialen',
      title: 'Dependencies, zonder de angst',
      curiosityHook: 'Dat mapje "node_modules" met tienduizend bestanden? Je hoeft er nooit in te kijken. Dit is waarom.',
      blocks: [
        {
          id: 'dependencies-prose',
          kind: 'prose',
          paragraphs: [
            'Een dependency is code van iemand anders die jouw project gebruikt. Een datumprikker, een animatie-bibliotheek, een font. Je bouwt niet alles zelf, net zoals een aannemer zijn bakstenen niet zelf bakt.',
            'Het enige dat jij hoeft te onthouden: er is een boodschappenlijstje (package.json) waar elke dependency op staat, en een kassabon (het lock-bestand) die vastlegt welke exacte versies je hebt. Je agent beheert beide. Jouw taak is alleen: weten dat ze bestaan, en je agent vragen het te melden als het lijstje verandert.',
          ],
        },
        {
          id: 'dependencies-compare',
          kind: 'compare',
          left: {
            label: 'Zonder afspraak',
            body: 'De agent installeert bij elk probleem een nieuw pakket. Na een maand heb je er veertig, waarvan je er acht gebruikt, en niemand weet meer waarom.',
          },
          right: {
            label: 'Met één regel context',
            body: '"Geen extra dependencies zonder melden." De agent vraagt het eerst even, jij zegt ja of nee, en je boodschappenlijstje blijft van jou.',
          },
          caption: 'Dezelfde agent, één regel verschil in je contextbestand.',
        },
        {
          id: 'dependencies-taste',
          kind: 'taste-check',
          question: 'Je agent stelt voor een pakket te installeren dat je niet kent. Wat doe je?',
          options: [
            {
              id: 'ja',
              label: 'Gewoon ja zeggen, de agent weet het beter',
              consequence:
                'Meestal gaat dit goed. Maar je leert niets over je eigen project, en na tien keer ja zeggen is het project van de agent, niet van jou.',
              isCraft: false,
            },
            {
              id: 'vragen',
              label: 'Eerst vragen: wat doet het en kan het ook zonder?',
              consequence:
                'Eén vraag, twee dingen gewonnen: je begrijpt je project beter, en verrassend vaak zegt de agent "eigenlijk kan het ook zonder". Zo blijf jij de opdrachtgever.',
              isCraft: true,
            },
          ],
          resolution:
            'Je hoeft dependencies niet te begrijpen op code-niveau. Je moet er alleen over durven vragen. "Wat doet dit en kan het simpeler" is de krachtigste zin in vibecoding.',
        },
      ],
    },
    {
      id: 'live',
      kicker: 'Milestone 4 · De oplevering',
      title: 'Zet het live',
      curiosityHook: 'De stap die het engst klinkt, is de kortste van allemaal.',
      blocks: [
        {
          id: 'live-prose',
          kind: 'prose',
          paragraphs: [
            'Live zetten klinkt als het domein van professionals, maar het is tegenwoordig de makkelijkste stap van het hele traject. Diensten als Vercel zijn er precies voor gebouwd: je verbindt je project, en zij zorgen voor de rest.',
            'En het mooiste: ook hier hoef je de stappen niet uit je hoofd te kennen. Je agent kent ze. Jij hoeft alleen de opdracht te geven en per stap mee te lezen.',
          ],
        },
        {
          id: 'live-dothis',
          kind: 'do-this',
          intro:
            'Dit is het hele traject in vier acties. Doe ze in je eigen tempo. Vandaag, of verspreid over de week: er is geen deadline en niets loopt weg.',
          actions: [
            {
              id: 'map',
              label: 'Maak een lege map met de naam van je project',
              detail: 'Gewoon op je bureaublad. Dit is officieel het begin.',
            },
            {
              id: 'bestand',
              label: 'Zet de starter-kit erin als CLAUDE.md',
              detail: 'De kit die je aan het einde van deze les meeneemt. Vul de drie lagen in met jouw project.',
            },
            {
              id: 'prompt',
              label: 'Open je agent in die map en geef startprompt 1',
              detail: 'De prompt staat in je starter-kit. De agent doet de rest en legt uit wat hij deed.',
            },
            {
              id: 'deploy',
              label: 'Vraag je agent: help me dit live zetten',
              detail: 'Stap voor stap, één stap per keer. Binnen een kwartier heb je een echte link.',
            },
          ],
          verify:
            'Het bewijs is een link die je naar iemand kunt appen. Zodra die er is, ben je officieel iemand die dingen op internet zet. Welkom.',
        },
      ],
    },
  ],
  finale: {
    title: 'Er staat iets online. Van jou.',
    body: 'Je weet nu wat een contextbestand doet, wat dependencies zijn en hoe je een agent laat samenwerken in plaats van overrompelen. De starter-kit hieronder is je bouwtekening voor elk volgend project.',
    nextSlug: 'waarom-je-ai-saaie-output-geeft',
  },
  seo: {
    title: 'Van lege map naar live site',
    description:
      'Stap-voor-stap traject voor beginners: leer wat een .md-bestand en dependencies zijn en zet met een AI-agent echt iets online. Gratis, zonder voorkennis.',
  },
};

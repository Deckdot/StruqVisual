import type { LessonManifest } from '@/lib/learn/schema';

/**
 * Flagship lesson for De Blauwdruk: see a finished hero, strip it to its
 * layers, play with the choices behind it, and walk away with the recipe.
 */
export const heroBlauwdruk: LessonManifest = {
  slug: 'bouw-een-hero-die-niemand-verwacht',
  archetype: 'blauwdruk',
  lane: 'expert',
  title: 'Bouw een hero die niemand van je verwacht',
  hook: 'Je ziet eerst het eindresultaat. Daarna halen we hem laag voor laag uit elkaar.',
  description:
    'Leer waarom een hero-sectie premium voelt: ruimte, typografie, kleur en beweging. Interactief, zonder jargon, met het recept als beloning.',
  minutes: 12,
  publishedAt: '2026-07-04',
  updatedAt: '2026-07-04',
  artifact: {
    title: 'Hero-recept: groots, rustig en vol karakter',
    description:
      'Een herbruikbaar prompt-recept dat je AI-agent een hero laat bouwen met ruimte, karakter en een zachte entree-animatie.',
    assetType: 'Prompt',
    tags: ['hero', 'design', 'recept', 'learn'],
    filename: 'hero-recept.md',
    body: `# Hero-recept: groots, rustig en vol karakter

Gebruik dit recept als prompt voor je AI-agent (Claude Code, Cursor, Copilot) wanneer je een hero-sectie wilt die niet naar template ruikt.

## De prompt

Bouw een hero-sectie met deze regels:

1. **Ruimte eerst.** Verticale padding minimaal 15% van de viewport, boven en onder. De kop krijgt lucht: niets staat er dichter dan een regelhoogte op.
2. **Eén display-font, één tekstfont.** De kop in een font met karakter, groot (clamp tussen 2.5rem en 6.5rem), regelafstand strak (1.05). Alles daaronder in een rustig tekstfont.
3. **Eén accentkleur.** Kies er precies één en gebruik hem maximaal drie keer: één keer in een klein detail bij de kop, één keer in de primaire knop, één keer ergens onverwacht.
4. **Eén asymmetrisch element.** Iets dat het grid net breekt: een gedraaide kaart, een handgetekende lijn onder een woord, een element dat half buiten beeld valt.
5. **Zachte entree.** Elementen komen binnen met opacity plus 24 tot 32px verticale beweging, duur rond 0.9s, ease expo.out, stagger van ongeveer 0.1s. Nooit opacity alleen.
6. **Respecteer prefers-reduced-motion:** zonder animatievoorkeur staat alles meteen op zijn plek.

## Waarom dit werkt

- Ruimte communiceert zelfvertrouwen: wie niet schreeuwt, heeft het niet nodig.
- Eén accentkleur die schaars is, voelt duurder dan vijf kleuren die overal zitten.
- De stagger van 0.1s laat de pagina "ademen" in plaats van ploffen.

Bewaard vanuit Struq Learn · struq.nl/learn`,
  },
  opening: {
    eyebrow: 'De Blauwdruk',
    title: 'Dit ga je zelf kunnen bouwen.',
    hook: 'Deze hero draait live, hierboven. Aan het einde van deze les weet je precies waarom hij duur voelt, en neem je het recept mee om hem zelf te bouwen met je AI.',
    artifact: 'hero-blueprint',
    promise: [
      'Je ontdekt de vier lagen waar elke goede hero uit bestaat',
      'Je draait zelf aan kleur, vorm en beweging',
      'Het complete recept is aan het einde van jou',
    ],
  },
  steps: [
    {
      id: 'waarom',
      kicker: 'Stap 1 · Kijken',
      title: 'Waarom voelt dit duur?',
      blocks: [
        {
          id: 'waarom-predict',
          kind: 'predict',
          prompt: 'Je zag net de hero. Wat maakt hem volgens jou premium?',
          options: [
            {
              id: 'kleur',
              label: 'De oranje accentkleur',
              correct: false,
              feedback:
                'Kleur helpt, maar dezelfde kleur in een vol scherm zou goedkoop voelen. Er is iets anders aan de hand.',
            },
            {
              id: 'ruimte',
              label: 'De lege ruimte eromheen',
              correct: true,
              feedback:
                'Precies. Ruimte is het duurste ingrediënt in design, juist omdat het niets kost.',
            },
            {
              id: 'font',
              label: 'Het ronde font',
              correct: false,
              feedback:
                'Het font geeft karakter, maar zet ditzelfde font in een kramperig blok en de magie is weg.',
            },
          ],
          reveal:
            'Ruimte is wat amateurs als eerste opofferen en wat studios als eerste beschermen. Alles in deze les bouwt daarop voort: elke keuze krijgt lucht om te bestaan.',
        },
        {
          id: 'waarom-prose',
          kind: 'prose',
          paragraphs: [
            'De meeste AI-gegenereerde pagina’s zien er hetzelfde uit: alles gecentreerd, drie kaartjes, een gradient. Niet omdat AI slecht is, maar omdat niemand hem smaak heeft gegeven.',
            'Deze les geeft jou die smaak. Niet als theorie, maar door de hero die je net zag letterlijk uit elkaar te halen.',
          ],
        },
      ],
    },
    {
      id: 'lagen',
      kicker: 'Stap 2 · Ontleden',
      title: 'Strip hem tot op het bot',
      curiosityHook: 'Zet één schakelaar uit en je ziet meteen waarom 90% van de AI-sites grijs aanvoelt.',
      blocks: [
        {
          id: 'lagen-deconstruct',
          kind: 'deconstruct-layers',
          artifact: 'hero-blueprint',
          intro:
            'Elke goede hero is een stapel lagen. Zet ze uit en aan, en voel wat elke laag doet. Dit is dezelfde hero als hierboven, live.',
          layers: [
            {
              id: 'layout',
              label: 'Layout en ruimte',
              description:
                'Zonder ruimte-laag kruipt alles tegen elkaar aan. De inhoud is identiek, maar het vertrouwen is weg. Ruimte is de laag die niemand ziet en iedereen voelt.',
            },
            {
              id: 'typografie',
              label: 'Typografie',
              description:
                'Zonder typografische hiërarchie is alles even belangrijk, en dus niets. Eén groot display-font voor de kop, één rustig font voor de rest. Meer heb je zelden nodig.',
            },
            {
              id: 'kleur',
              label: 'Kleur',
              description:
                'Zonder kleur zie je hoe hard de andere lagen werken. Kleur is de kers, niet de taart. Daarom werkt één schaarse accentkleur beter dan vijf enthousiaste.',
            },
          ],
        },
      ],
    },
    {
      id: 'keuzes',
      kicker: 'Stap 3 · Kiezen',
      title: 'Kleur en vorm zijn keuzes, geen toeval',
      curiosityHook: 'Hierna draai je zelf aan de knoppen. Er is geen fout antwoord, wel een gevolg.',
      blocks: [
        {
          id: 'keuzes-playground',
          kind: 'playground-tokens',
          artifact: 'hero-blueprint',
          intro:
            'Draai aan de knoppen en kijk wat er met de hero gebeurt. Niet nadenken, gewoon spelen. Je smaak leert sneller dan je hoofd.',
          controls: [
            {
              id: 'accent',
              label: 'Accentkleur',
              cssVar: '--art-accent',
              type: 'swatch',
              options: [
                { label: 'Vlamoranje', value: '#e4572e' },
                { label: 'Diep groen', value: '#2e6b4f' },
                { label: 'Inktblauw', value: '#2b4a8f' },
                { label: 'Pruim', value: '#7c3a5f' },
              ],
              defaultValue: '#e4572e',
            },
            {
              id: 'radius',
              label: 'Ronding',
              cssVar: '--art-radius',
              type: 'range',
              min: 0,
              max: 2,
              step: 0.25,
              unit: 'rem',
              defaultValue: '1.5',
            },
            {
              id: 'space',
              label: 'Ademruimte',
              cssVar: '--art-space',
              type: 'range',
              min: 0.5,
              max: 1.8,
              step: 0.1,
              defaultValue: '1',
            },
          ],
          insight:
            'Merk je dat elke kleur werkt, zolang er maar één is? En dat de hero bij minder ademruimte meteen goedkoper voelt? Dat is geen mening, dat is hoe ogen werken.',
        },
        {
          id: 'keuzes-taste',
          kind: 'taste-check',
          question: 'Je klant wil "meer kleur" in de hero. Wat doe je?',
          options: [
            {
              id: 'meer',
              label: 'Twee extra accentkleuren toevoegen',
              consequence:
                'De hero wordt drukker en de blik van de bezoeker weet niet meer waar hij moet landen. Alles vraagt aandacht, dus niets krijgt hem.',
              isCraft: false,
            },
            {
              id: 'rijker',
              label: 'Dezelfde kleur op één onverwachte plek extra',
              consequence:
                'De hero voelt rijker zonder drukker te worden. De herhaling van één kleur leest als een keuze, en keuzes voelen duur.',
              isCraft: true,
            },
          ],
          resolution:
            'Studio’s zeggen zelden "nee" tegen kleur, ze zeggen "één". Meer kleur betekent bijna altijd: dezelfde kleur, vaker en slimmer ingezet.',
        },
      ],
    },
    {
      id: 'beweging',
      kicker: 'Stap 4 · Bewegen',
      title: 'Beweging maakt het duur',
      curiosityHook: 'Eén getal bepaalt of je pagina "ademt" of "plopt". Je gaat hem zo zelf vinden.',
      blocks: [
        {
          id: 'beweging-playground',
          kind: 'playground-motion',
          artifact: 'hero-blueprint',
          intro:
            'De entree-animatie van de hero is een timeline: elk element komt iets later binnen dan het vorige. Draai aan de knoppen en speel hem opnieuw af tot je voelt waar het lekker wordt.',
          controls: [
            {
              id: 'duration',
              label: 'Duur per element',
              type: 'range',
              min: 0.2,
              max: 2,
              step: 0.1,
              unit: 's',
              defaultValue: 0.8,
            },
            {
              id: 'stagger',
              label: 'Tijd tussen elementen',
              type: 'range',
              min: 0,
              max: 0.4,
              step: 0.02,
              unit: 's',
              defaultValue: 0.1,
            },
            {
              id: 'distance',
              label: 'Afstand',
              type: 'range',
              min: 0,
              max: 80,
              step: 4,
              unit: 'px',
              defaultValue: 26,
            },
            {
              id: 'ease',
              label: 'Karakter',
              type: 'choice',
              options: [
                { label: 'Zacht (expo.out)', value: 'expo.out' },
                { label: 'Netjes (power2.out)', value: 'power2.out' },
                { label: 'Stuiterend (back.out)', value: 'back.out(1.7)' },
                { label: 'Robotisch (none)', value: 'none' },
              ],
              defaultValue: 'expo.out',
            },
          ],
          insight:
            'De stagger is het geheim. Bij 0s ploft alles tegelijk op het scherm. Rond 0.1s ademt de pagina. Boven 0.3s sta je te wachten. Beweging is timing, geen effect.',
        },
        {
          id: 'beweging-secret',
          kind: 'secret',
          teaser: 'Waarom studio’s nooit alleen opacity animeren',
          title: 'Opacity liegt',
          body: 'Een element dat alleen in opacity verschijnt, voelt alsof het er altijd al stond en je het net pas zag. Geef het 24 tot 32px verticale beweging mee en het "arriveert". Aankomen voelt levend, verschijnen voelt spookachtig. Daarom is de regel in vrijwel elk goed motion-systeem: nooit opacity alleen.',
        },
      ],
    },
    {
      id: 'recept',
      kicker: 'Stap 5 · Meenemen',
      title: 'Het recept, regel voor regel',
      curiosityHook: 'Alles wat je net voelde, past in zes regels die je AI begrijpt.',
      blocks: [
        {
          id: 'recept-code',
          kind: 'code-reveal',
          language: 'Prompt-recept',
          intro:
            'Dit is het recept dat je zo meeneemt. Elke laag die je net ontleedde, is één regel voor je AI-agent. Klik door de lagen heen.',
          stages: [
            {
              code: 'Bouw een hero-sectie met deze regels:\n\n1. Ruimte eerst. Verticale padding minimaal 15% van\n   de viewport. De kop krijgt lucht.',
              note: 'Regel 1 is de laag die je in stap 2 uitzette: ruimte. Hij staat expres bovenaan, want dit is de regel die AI standaard negeert.',
            },
            {
              code: '2. Eén display-font, één tekstfont. De kop groot\n   (clamp 2.5rem tot 6.5rem), regelafstand 1.05.\n\n3. Eén accentkleur, maximaal drie keer gebruikt.',
              note: 'Typografie en kleur, precies zoals je ze net voelde in de playground. "Maximaal drie keer" is de grens die schaarste afdwingt.',
            },
            {
              code: '4. Eén asymmetrisch element dat het grid net breekt.\n\n5. Zachte entree: opacity plus 24-32px beweging,\n   0.9s, ease expo.out, stagger 0.1s.\n\n6. Respecteer prefers-reduced-motion.',
              note: 'En de beweging: de getallen waar jij net aan draaide. 0.1s stagger, expo.out. Regel 6 hoort er altijd bij, toegankelijkheid is geen optie.',
            },
          ],
        },
        {
          id: 'recept-prose',
          kind: 'prose',
          paragraphs: [
            'Dit is wat Struq bedoelt met een asset: geen tutorial die je vergeet, maar een recept dat je elke keer opnieuw inzet. Volgende week een hero nodig? Recept erbij, AI aan het werk, klaar.',
          ],
        },
      ],
    },
  ],
  finale: {
    title: 'Van kijker naar bouwer.',
    body: 'Je weet nu waarom deze hero werkt: ruimte, hiërarchie, één kleur, timing. Het recept hieronder is van jou. Kopieer het, download het, of bewaar het in je vault zodat je AI er altijd bij kan.',
  },
  seo: {
    title: 'Bouw een hero die niemand van je verwacht',
    description:
      'Interactieve les: haal een premium hero-sectie laag voor laag uit elkaar en neem het recept mee voor je AI-agent. Gratis, zonder jargon.',
  },
};

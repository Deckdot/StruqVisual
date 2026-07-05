import type { LessonManifest } from '@/lib/learn/schema';

/**
 * Flagship lesson for Het Lab: dissect why one prompt returns grey filler
 * and another returns character, by physically toggling prompt parts.
 */
export const promptLabSaaieOutput: LessonManifest = {
  slug: 'waarom-je-ai-saaie-output-geeft',
  archetype: 'lab',
  lane: 'gevorderd',
  title: 'Waarom je AI saaie output geeft',
  hook: 'Het ligt niet aan het model. Je gaat de prompt openmaken en zien welk onderdeel de smaak draagt.',
  description:
    'Interactieve les: ontleed een prompt onderdeel voor onderdeel en ontdek waarom je AI grijs gemiddelde teruggeeft, en hoe je dat fixt.',
  minutes: 10,
  publishedAt: '2026-07-04',
  updatedAt: '2026-07-04',
  artifact: {
    title: 'Prompt-anatomie: van grijs naar karakter',
    description:
      'Een herbruikbare prompt-template met de vijf onderdelen die elke goede prompt nodig heeft: rol, context, opdracht, grenzen en vorm.',
    assetType: 'Prompt',
    tags: ['prompt', 'template', 'anatomie', 'learn'],
    filename: 'prompt-anatomie.md',
    body: `# Prompt-anatomie: van grijs naar karakter

Elke keer dat je AI-output "wel oké" is maar nergens naar smaakt, ontbreekt een van deze vijf onderdelen. Vul de template in en de output verandert van gemiddeld naar van jou.

## De template

**Rol:** Je bent [een specifieke expert met eigen smaak, bijv. "een senior brand-designer die haat wat iedereen mooi vindt"].

**Context:** [Voor wie is dit, wat is de sfeer, wat moet het gevoel zijn. Twee zinnen is genoeg, nul zinnen is dodelijk.]

**Opdracht:** [Wat moet er precies komen, hoeveel, hoe lang. Meetbaar.]

**Grenzen:** [Wat mag er niet: geen jargon, geen uitroeptekens, geen buzzwoorden, geen beloftes met cijfers.]

**Vorm:** [Hoe wil je het terug: lijst, tabel, per optie één zin uitleg waarom die werkt.]

## Waarom dit werkt

- **Rol** geeft het model een smaakprofiel in plaats van het gemiddelde van internet.
- **Context** laat het model kiezen in plaats van gokken.
- **Grenzen** zijn het geheim: creativiteit ontstaat waar opties wegvallen.
- **Vorm** voorkomt dat je drie alinea's beleefdheid moet doorworstelen.

## Snelle check

Grijze output? Lees je prompt terug en zoek welk onderdeel ontbreekt. In negen van de tien gevallen: context of grenzen.

Bewaard vanuit Struq Learn · struq.nl/learn`,
  },
  opening: {
    eyebrow: 'Het Lab',
    title: 'Het ligt niet aan jou. En ook niet aan de AI.',
    hook: 'Hiernaast staat de prompt-asset die je aan het einde meeneemt. Maar eerst gaan we hem openmaken: welk onderdeel draagt de smaak, en wat gebeurt er als je het weghaalt?',
    artifact: 'lab-prompt-card',
    promise: [
      'Je ziet live wat elk prompt-onderdeel met de output doet',
      'Je ontdekt waarom grenzen creatiever maken dan vrijheid',
      'De complete prompt-template is aan het einde van jou',
    ],
  },
  steps: [
    {
      id: 'herken',
      kicker: 'Stap 1 · Herkennen',
      title: 'Herken je dit?',
      blocks: [
        {
          id: 'herken-compare',
          kind: 'compare',
          left: {
            label: 'Wat je meestal krijgt',
            body: '"Ontdek de kracht van innovatie! Onze oplossing tilt jouw bedrijf naar een hoger niveau. Klaar voor de toekomst? Start vandaag nog!"',
          },
          right: {
            label: 'Wat ook kan',
            body: '"Dit stond gister nog niet online. Vandaag wel. Gebouwd op een dinsdagavond, tussen het opruimen en de sportschool in."',
          },
          caption: 'Zelfde model, zelfde vraag. Het verschil zit volledig in de prompt.',
        },
        {
          id: 'herken-predict',
          kind: 'predict',
          prompt: 'Waarom is de linker output zo grijs?',
          options: [
            {
              id: 'model',
              label: 'Het model is niet goed genoeg',
              correct: false,
              feedback:
                'Beide teksten komen uit hetzelfde model. Een beter model met dezelfde lege prompt geeft je hetzelfde grijs, maar dan langer.',
            },
            {
              id: 'smaak',
              label: 'De prompt geeft geen smaak mee',
              correct: true,
              feedback:
                'Ja. Zonder rol, context en grenzen geeft het model je het statistisch gemiddelde van internet. En het gemiddelde van internet is precies dat: gemiddeld.',
            },
            {
              id: 'woorden',
              label: 'De prompt was te kort',
              correct: false,
              feedback:
                'Lengte is het niet. Een lange prompt zonder smaak geeft lange grijze output. Het gaat om wat erin zit, niet hoeveel.',
            },
          ],
          reveal:
            'AI zonder richting is een gemiddelde-machine. De vraag is dus nooit "hoe krijg ik betere AI", maar "hoe geef ik mijn smaak door". Dat is exact wat je nu gaat ontleden.',
        },
      ],
    },
    {
      id: 'anatomie',
      kicker: 'Stap 2 · Ontleden',
      title: 'Maak de prompt open',
      curiosityHook: 'Zet onderdelen uit en kijk de output live degraderen. Eén onderdeel doet meer pijn dan alle andere.',
      blocks: [
        {
          id: 'anatomie-block',
          kind: 'prompt-anatomy',
          intro:
            'Dit is de prompt achter de goede output van net, in vijf onderdelen. Klik onderdelen uit en aan, en kijk rechts wat er met de output gebeurt.',
          segments: [
            {
              id: 'rol',
              label: 'Rol',
              text: 'Je bent een senior brand-designer met sterke eigen smaak.',
              explanation:
                'De rol geeft het model een smaakprofiel. Zonder rol schrijft het als "iedereen", en iedereen schrijft grijs.',
            },
            {
              id: 'context',
              label: 'Context',
              text: 'Warm, hand-gemaakt gevoel. Publiek: makers, geen managers.',
              explanation:
                'Context laat het model kiezen in plaats van gokken. Twee zinnen context besparen je tien correctierondes.',
            },
            {
              id: 'opdracht',
              label: 'Opdracht',
              text: 'Schrijf 3 hero-koppen die nieuwsgierig maken, max 8 woorden.',
              explanation:
                'Meetbaar: drie stuks, acht woorden. Vage opdrachten krijgen vage antwoorden.',
            },
            {
              id: 'grenzen',
              label: 'Grenzen',
              text: 'Geen jargon, geen uitroeptekens, geen beloftes met cijfers.',
              explanation:
                'Het krachtigste onderdeel. Elke grens snijdt duizend clichés weg. Haal hem weg en de uitroeptekens komen terug.',
            },
            {
              id: 'vorm',
              label: 'Vorm',
              text: 'Toon per kop ook waarom die werkt, in één zin.',
              explanation:
                'Vorm bepaalt wat je terugkrijgt. Zonder vorm krijg je een opstel, met vorm krijg je iets bruikbaars.',
            },
          ],
          outputStates: [
            {
              minSegments: 0,
              label: 'Grijs',
              body: '"Ontdek de kracht van creativiteit! Wij helpen jou verder. Neem vandaag nog contact op!" Drie keer hetzelfde, drie keer niets.',
            },
            {
              minSegments: 2,
              label: 'Bijna',
              body: '"Maak iets moois vandaag." Beter. Maar het kan van elk merk zijn, voor elk publiek, uit elk jaar. Er ontbreekt nog smaak of een grens.',
            },
            {
              minSegments: 4,
              label: 'Warm',
              body: '"Gemaakt op een dinsdagavond." Er zit al karakter in. Met alle vijf onderdelen krijg je er ook bij WAAROM dit werkt.',
            },
            {
              minSegments: 5,
              label: 'Van jou',
              body: '"Dit stond gister nog niet online." Werkt omdat het beweging impliceert zonder te beloven. Plus twee alternatieven en per kop één zin uitleg. Direct bruikbaar.',
            },
          ],
          insight:
            'Viel het op? Grenzen weghalen doet meer pijn dan de rol weghalen. De meeste mensen promptem precies andersom: veel rol, nul grenzen.',
        },
      ],
    },
    {
      id: 'grenzen',
      kicker: 'Stap 3 · Begrijpen',
      title: 'Grenzen maken creativiteit',
      curiosityHook: 'Klinkt tegenstrijdig: minder vrijheid geeft betere output. Zo werkt dat.',
      blocks: [
        {
          id: 'grenzen-prose',
          kind: 'prose',
          paragraphs: [
            'Een model zonder grenzen kiest de veiligste weg: het cliché. Niet omdat het lui is, maar omdat clichés statistisch het meest voorkomen. "Til je bedrijf naar een hoger niveau" staat miljoenen keren op internet, dus dat rolt eruit.',
            'Elke grens die je stelt, snijdt een snelweg aan clichés af. Wat overblijft is dunner bevolkt terrein, en daar woont het interessante werk.',
          ],
        },
        {
          id: 'grenzen-taste',
          kind: 'taste-check',
          question: 'Je output is nog steeds net-niet. Wat probeer je eerst?',
          options: [
            {
              id: 'uitbreiden',
              label: 'De opdracht uitgebreider beschrijven',
              consequence:
                'Meer woorden, zelfde richting. Het model heeft geen gebrek aan informatie, het heeft een gebrek aan grenzen. Je krijgt langere net-niet output.',
              isCraft: false,
            },
            {
              id: 'verbieden',
              label: 'Drie dingen verbieden die je in de vorige output zag',
              consequence:
                'Je snijdt precies weg wat je niet wilde, en dwingt het model een nieuwe route te zoeken. Dit is hoe je itereert: verbied wat je terugkreeg en niet beviel.',
              isCraft: true,
            },
          ],
          resolution:
            'Onthoud de reflex: slechte output is geen reden om meer te vragen, maar om meer te verbieden. "Geen X, geen Y, geen Z" werkt sneller dan drie alinea’s uitleg.',
        },
        {
          id: 'grenzen-secret',
          kind: 'secret',
          teaser: 'De grens die vrijwel elke Nederlandse tekst beter maakt',
          title: 'Verbied de uitroeptekens',
          body: 'Voeg aan elke Nederlandse marketing-prompt toe: "geen uitroeptekens, geen Engelse leenwoorden waar een Nederlands woord bestaat". Deze twee grenzen halen in één klap de opgewonden-foldertje-toon weg waar Nederlandse AI-output standaard in schiet. Het scheelt per tekst gemiddeld twee correctierondes.',
        },
      ],
    },
    {
      id: 'vanjou',
      kicker: 'Stap 4 · Toepassen',
      title: 'Maak hem van jou',
      curiosityHook: 'De template werkt pas als hij jouw smaak bevat. Drie invulmomenten en hij is klaar.',
      blocks: [
        {
          id: 'vanjou-dothis',
          kind: 'do-this',
          intro:
            'Pak de template die je zo meeneemt en maak hem persoonlijk. Dit kost twee minuten en je doet het maar één keer: daarna hergebruik je hem eindeloos.',
          actions: [
            {
              id: 'rol-invullen',
              label: 'Vul een rol in die bij jouw werk past',
              detail: 'Niet "een expert", maar "een [vak] die een hekel heeft aan [wat jij grijs vindt]".',
            },
            {
              id: 'grenzen-invullen',
              label: 'Schrijf je drie vaste verboden op',
              detail: 'Kijk naar je laatste slechte AI-output. Wat stoorde je? Dat zijn je grenzen.',
            },
            {
              id: 'testen',
              label: 'Test hem op een echte taak van deze week',
              detail: 'Zelfde vraag als vorige keer, nu met de ingevulde template. Vergelijk.',
            },
          ],
          verify:
            'Als de nieuwe output iets bevat dat je vorige output nooit had gegeven, werkt je template. Zo niet: scherp je grenzen aan, niet je opdracht.',
        },
      ],
    },
  ],
  finale: {
    title: 'Je prompt heeft nu een anatomie.',
    body: 'Rol, context, opdracht, grenzen, vorm. Vijf onderdelen, en je weet nu welk onderdeel welke pijn oplost. De template hieronder is van jou: kopieer hem, of bewaar hem in je vault zodat je hem overal kunt hergebruiken.',
    nextSlug: 'bouw-een-hero-die-niemand-verwacht',
  },
  seo: {
    title: 'Waarom je AI saaie output geeft',
    description:
      'Interactieve les: ontleed een prompt onderdeel voor onderdeel en zie live waarom je AI grijs gemiddelde teruggeeft. Gratis, met herbruikbare template.',
  },
};

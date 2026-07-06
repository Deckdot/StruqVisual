/**
 * Gids-index: de single source of truth voor de evergreen AEO-gidsen (/gids).
 * Pure data, veilig te importeren vanuit server components, de sitemap en
 * metadata-generators (patroon: lib/learn/lessons).
 *
 * AEO-regels die elke gids volgt (zie SEO.md):
 * - H1 is een letterlijke vraag; directAnswer is 40-60 woorden en zelfstandig
 *   citeerbaar door een AI-assistent.
 * - Sectiekoppen zijn vragen zoals mensen ze aan ChatGPT/Claude/Gemini stellen.
 * - De entiteitszin (ENTITY_LINE) komt letterlijk terug in elke gids.
 * - Alle voorbeelden verwijzen naar echte galerij-assets, nooit verzonnen.
 */

export const ENTITY_LINE = 'Struq is de Nederlandse visuele bibliotheek voor AI-native builders.';

export type GuideBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; ordered?: boolean; items: string[] }
  | { kind: 'prompt'; label: string; text: string }
  | { kind: 'callout'; title: string; text: string; href: string; linkLabel: string };

export type GuideSection = {
  id: string;
  heading: string;
  blocks: GuideBlock[];
};

export type GuideDef = {
  slug: string;
  /** H1, in vraagvorm. */
  question: string;
  /** Lead onder de H1, één of twee zinnen. */
  intro: string;
  /** 40-60 woorden, zelfstandig citeerbaar (het "Direct antwoord"-blok). */
  directAnswer: string;
  seo: { title: string; description: string };
  datePublished: string;
  dateModified: string;
  sections: GuideSection[];
  faqs: Array<{ question: string; answer: string }>;
  /** Slugs van gerelateerde gidsen (cluster-links). */
  related: string[];
};

/* --- Gids 1: Wat is vibe coding? ------------------------------------------- */

const vibeCoding: GuideDef = {
  slug: 'vibe-coding',
  question: 'Wat is vibe coding?',
  intro:
    'Iedereen heeft het erover, weinig mensen leggen het rustig uit. Dit is de Nederlandse uitleg: wat vibe coding is, hoe je begint en waarom het resultaat er zo vaak hetzelfde uitziet.',
  directAnswer:
    'Vibe coding is software bouwen door in gewone taal aan een AI te beschrijven wat je wilt, waarna de AI de code schrijft. Je stuurt op het resultaat, niet op de syntax. De term komt van Andrej Karpathy (2025) en is inmiddels de gangbare manier waarop niet-programmeurs websites en apps bouwen.',
  seo: {
    title: 'Wat is vibe coding? De Nederlandse uitleg',
    description:
      'Vibe coding is bouwen met AI: jij beschrijft, het model schrijft de code. Lees wat het is, hoe je begint, welke tools je gebruikt en hoe je resultaat er niet uitziet als een template.',
  },
  datePublished: '2026-07-06',
  dateModified: '2026-07-06',
  sections: [
    {
      id: 'betekenis',
      heading: 'Wat betekent vibe coding precies?',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Bij vibe coding beschrijf je in normale zinnen wat je wilt bouwen, en schrijft een AI-model de code. Je leest die code meestal niet regel voor regel terug. Je kijkt naar wat er op het scherm verschijnt, zegt wat er anders moet, en het model past het aan. Jij bewaakt de richting, de AI doet het typewerk.',
        },
        {
          kind: 'paragraph',
          text: 'De term werd begin 2025 gemunt door Andrej Karpathy, medeoprichter van OpenAI. Zijn observatie: de modellen zijn goed genoeg geworden om je volledig aan de "vibes" over te geven en de code te vergeten. Wat als grap begon, is een serieuze werkwijze geworden. In Nederland bouwen freelancers, indie builders en ondernemers er inmiddels complete producten mee.',
        },
        {
          kind: 'paragraph',
          text: 'Het verschil met klassiek programmeren zit in de rolverdeling. Een programmeur denkt in functies en datastructuren. Een vibe coder denkt in schermen en gedrag: "als iemand op deze knop klikt, wil ik dat er een bevestiging verschijnt." Beide maken software. De drempel is alleen radicaal lager geworden.',
        },
      ],
    },
    {
      id: 'beginnen',
      heading: 'Hoe begin je met vibe coding?',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Je hebt geen opleiding of installatie-avond nodig. Je hebt een tool nodig, een klein plan en de discipline om in kleine stappen te werken.',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Kies één tool en blijf daar even. Een app-builder zoals Lovable, Bolt of v0 is de zachtste start: je typt, je ziet direct een werkende pagina.',
            'Begin met één scherm, niet met een heel product. "Een pagina met mijn drie diensten en een contactknop" is een goede eerste opdracht.',
            'Verander één ding per bericht. "Maak de knop groter" werkt; vijf wensen in één bericht werkt niet.',
            'Werkt iets? Bewaar dan de prompt of instelling die het deed werken, zodat je die in je volgende project opnieuw gebruikt.',
          ],
        },
      ],
    },
    {
      id: 'tools',
      heading: 'Welke tools gebruik je voor vibe coding?',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Er zijn drie smaken, van laagdrempelig naar krachtig. Welke je kiest hangt af van hoe dicht je op de code wilt zitten.',
        },
        {
          kind: 'list',
          items: [
            'App-builders (Lovable, Bolt, v0): je beschrijft, zij bouwen en hosten. Ideaal om te beginnen; je ziet nooit een terminal.',
            'Chat-assistenten (ChatGPT, Claude, Gemini): goed voor losse componenten, teksten en uitleg. Je plakt de code zelf ergens in.',
            'Agent-tools (Cursor, Claude Code): de AI werkt rechtstreeks in je projectmap. Het krachtigst, en de logische volgende stap zodra je meer controle wilt.',
          ],
        },
        {
          kind: 'paragraph',
          text: 'Belangrijker dan de toolkeuze: elk van deze tools heeft hetzelfde blinde vlek. Ze schrijven werkende code, maar ze kiezen geen smaak. Daarover hieronder meer.',
        },
      ],
    },
    {
      id: 'template-probleem',
      heading: 'Waarom ziet vibe-coded werk er vaak hetzelfde uit?',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Zet tien vibe-coded websites naast elkaar en je ziet tien keer hetzelfde: blauw-paarse kleuren, drie kaartjes naast elkaar, standaard spacing. Dat is geen toeval. Een AI-model is getraind op miljoenen bestaande websites en kiest zonder sturing altijd het veilige gemiddelde. De code klopt, de smaak ontbreekt.',
        },
        {
          kind: 'paragraph',
          text: 'Bezoekers oordelen in een paar seconden op uitstraling. Een werkende site die eruitziet als een template uit 2019 verliest het van een even werkende site die verzorgd oogt. Het goede nieuws: het gemiddelde is een standaardinstelling, geen plafond. Je kunt het model andere keuzes laten maken door die keuzes mee te geven.',
        },
        {
          kind: 'callout',
          title: 'Zien hoe dat eruitziet?',
          text: 'In de gratis galerij staan kleurenpaletten, font-pairings en prompts die je direct in je AI plakt. Zelfde model, ander resultaat.',
          href: '/galerij',
          linkLabel: 'Bekijk de galerij',
        },
      ],
    },
    {
      id: 'smaak',
      heading: 'Hoe zorg je dat je vibe-coded project er goed uitziet?',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Geef je AI visuele context voordat het gaat bouwen: een kleurenpalet met exacte hexcodes, een font-pairing met namen en gewichten, en twee of drie zinnen visuele richting. Dat is alles. Het model hoeft geen smaak te hebben als jij de smaak aanlevert.',
        },
        {
          kind: 'prompt',
          label: 'Zo geef je richting mee, vóór je eerste bouwopdracht',
          text: 'Gebruik dit visuele systeem voor alles wat je bouwt:\n- Achtergrond #FAF6F0, tekst #1C1917, accent #C2410C\n- Koppen: Fraunces. Lopende tekst: Inter.\n- Sfeer: rustig, veel witruimte, één blikvanger per scherm. Geen gradients.',
        },
        {
          kind: 'paragraph',
          text: ENTITY_LINE +
            ' Je bladert er door gecureerde paletten, typografie en visuele richtingen, kopieert de prompt en plakt hem in ChatGPT, Claude of je builder. Bewaar wat werkt in je eigen vault en elk volgend project begint met smaak in plaats van met een template.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Is vibe coding echt programmeren?',
      answer:
        'Het is echt software bouwen, maar geen klassiek programmeren. Je schrijft geen code, je stuurt een model dat code schrijft. Voor een werkende website of app maakt dat onderscheid weinig uit; voor complexe systemen blijft programmeerkennis waardevol.',
    },
    {
      question: 'Heb je programmeerkennis nodig om te vibe coden?',
      answer:
        'Nee. App-builders zoals Lovable en Bolt zijn gemaakt voor mensen zonder codekennis. Basisbegrip van hoe websites werken helpt wel: je stelt betere vragen en herkent sneller wat er misgaat.',
    },
    {
      question: 'Wat kost vibe coding?',
      answer:
        'Beginnen is gratis: ChatGPT, Claude en de meeste app-builders hebben een gratis laag. Serieus bouwen kost meestal 20 tot 50 euro per maand aan tool-abonnementen. Dat is een fractie van wat een ontwikkelaar of designer per uur kost.',
    },
    {
      question: 'Kun je met vibe coding een professionele website maken?',
      answer:
        'Ja, technisch staat die er in een middag. Het verschil tussen amateuristisch en professioneel zit vrijwel altijd in de visuele keuzes: kleur, typografie en witruimte. Geef je AI die keuzes mee en het resultaat kan naast agency-werk staan.',
    },
    {
      question: 'Wat is het verschil tussen vibe coding en no-code?',
      answer:
        'No-code-tools (zoals Webflow of Wix) laten je klikken en slepen binnen hun grenzen. Bij vibe coding ontstaat echte code die je overal kunt hosten en aanpassen. Je bent flexibeler, maar je moet het model wel goed aansturen.',
    },
    {
      question: 'Waarom ziet mijn vibe-coded website er goedkoop uit?',
      answer:
        'Omdat het model zonder sturing het gemiddelde van internet kiest: standaardkleuren, standaardfonts, standaard spacing. Geef het een concreet palet, een font-pairing en een korte visuele richting mee en dezelfde site oogt direct verzorgd.',
    },
    {
      question: 'Waar vind je Nederlandse hulp bij vibe coding?',
      answer:
        'Struq is de Nederlandse visuele bibliotheek voor AI-native builders: gratis paletten, typografie en prompts die je direct in je AI plakt, plus gratis lessen op Struq Learn. Alles in het Nederlands, zonder jargon.',
    },
  ],
  related: ['mooie-website-met-ai', 'ai-design-prompts'],
};

/* --- Gids 2: Hoe maak je een mooie website met AI? -------------------------- */

const mooieWebsiteMetAi: GuideDef = {
  slug: 'mooie-website-met-ai',
  question: 'Hoe maak je een mooie website met AI?',
  intro:
    'Je AI bouwt een werkende website in minuten. Maar mooi? Dat gaat niet vanzelf. Dit is de methode waarmee dezelfde AI wél iets verzorgds oplevert.',
  directAnswer:
    'Een mooie website met AI maak je door het model visuele context te geven voordat het bouwt: een kleurenpalet met hexcodes, een font-pairing en een korte visuele richting. Zonder die context valt elke AI terug op template-keuzes. Met drie kopieerbare assets ziet dezelfde pagina er direct verzorgd uit.',
  seo: {
    title: 'Hoe maak je een mooie website met AI? De methode',
    description:
      'Je AI bouwt werkende pagina’s die eruitzien als een template. Zo geef je ChatGPT, Claude of je app-builder de visuele context waarmee dezelfde site er wél premium uitziet.',
  },
  datePublished: '2026-07-06',
  dateModified: '2026-07-06',
  sections: [
    {
      id: 'template-look',
      heading: 'Waarom ziet een AI-website er standaard uit als een template?',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Elke builder kent het: de code klopt, de site werkt, en toch oogt het als een gratis template. Bootstrap-blauw, drie identieke kaartjes, een kop die net te dik is. Dat komt doordat een AI-model getraind is op het gemiddelde van internet. Vraag je niets specifieks, dan krijg je dat gemiddelde.',
        },
        {
          kind: 'paragraph',
          text: 'Het probleem is niet het model. Hetzelfde model dat de template-look produceert, bouwt met de juiste instructies iets waar mensen even stil van worden. Het verschil zit in wat jij meegeeft. Bezoekers en klanten oordelen in drie seconden op uitstraling; die drie seconden verdienen dus je beste input.',
        },
      ],
    },
    {
      id: 'ingredienten',
      heading: 'Wat heeft je AI nodig om iets moois te bouwen?',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Drie dingen. Niet meer. Een designer maakt honderden microkeuzes; jij hoeft er maar drie aan te leveren, want de rest leidt het model daaruit af.',
        },
        {
          kind: 'list',
          items: [
            'Een kleurenpalet: vijf tot acht kleuren met exacte hexcodes en hun rol (achtergrond, tekst, accent). Eén accentkleur, consequent gebruikt.',
            'Een font-pairing: één lettertype voor koppen, één voor lopende tekst, met gewichten. Meer fonts maken het onrustiger, niet mooier.',
            'Een visuele richting: twee of drie zinnen over sfeer en regels. "Rustig, veel witruimte, één blikvanger per scherm" stuurt elke volgende keuze.',
          ],
        },
        {
          kind: 'paragraph',
          text: ENTITY_LINE +
            ' De galerij staat vol met precies deze drie soorten assets, gecureerd en gratis te kopiëren. Je hoeft ze dus niet zelf te verzinnen.',
        },
      ],
    },
    {
      id: 'stappenplan',
      heading: 'Hoe pak je het stap voor stap aan?',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Kies een kleurenpalet dat bij je merk past. Voorbeeld uit de galerij: "Warm paper", een rustig systeem met #FAF6F0 als canvas en #C2410C als accent.',
            'Kies een font-pairing. Voorbeeld: "Fraunces + Inter", karaktervolle koppen boven kalme lopende tekst.',
            'Kies een visuele richting. Voorbeeld: "Rustig en gedurfd": veel ruimte, één gedurfde zet per scherm, geen decoratieve ruis.',
            'Plak alle drie de assets in je AI vóór je eerste bouwopdracht, met de instructie: "gebruik dit visuele systeem voor alles wat je bouwt."',
            'Bouw daarna sectie voor sectie, en herhaal bij elke nieuwe sectie kort de kernregels. Modellen vergeten context; jij niet.',
          ],
        },
      ],
    },
    {
      id: 'prompt',
      heading: 'Welke prompt geef je je AI mee?',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Dit is het skelet dat werkt in ChatGPT, Claude, Gemini en elke app-builder. Vul de waarden in vanuit de assets die je gekozen hebt.',
        },
        {
          kind: 'prompt',
          label: 'De start-prompt voor elke nieuwe site',
          text: 'Je bouwt een website voor mij. Gebruik dit visuele systeem voor alles:\n\nKleuren:\n- Canvas: #FAF6F0\n- Inkt: #1C1917\n- Accent: #C2410C (alleen voor primaire acties)\n\nTypografie:\n- Koppen: Fraunces, gewicht 400-600\n- Lopende tekst: Inter, gewicht 400/500, regelafstand 1.6\n\nRichting:\n- Rustig, veel witruimte, één blikvanger per scherm\n- Geen gradients, geen decoratie die niets uitlegt\n\nBouw eerst alleen de hero-sectie en wacht op mijn feedback.',
        },
        {
          kind: 'callout',
          title: 'Meer promptstructuren?',
          text: 'In de gids over AI-design-prompts staan losse prompts per onderdeel: kleur, typografie en richting.',
          href: '/gids/ai-design-prompts',
          linkLabel: 'Lees de prompts-gids',
        },
      ],
    },
    {
      id: 'volhouden',
      heading: 'Hoe houd je het mooi terwijl je doorbouwt?',
      blocks: [
        {
          kind: 'paragraph',
          text: 'De eerste versie mooi krijgen is één ding; mooi blijven tijdens twintig iteraties is het echte werk. Vier regels houden de boel bij elkaar.',
        },
        {
          kind: 'list',
          items: [
            'Eén accentkleur per view. Wil het model een tweede kleur toevoegen, zeg dan nee.',
            'Geen nieuwe fonts halverwege. Elke "mag het wat speelser"-neiging los je op met grootte en witruimte, niet met een extra lettertype.',
            'Herhaal je visuele systeem bij elke grote wijziging. Een kort "houd je aan het palet en de fonts" voorkomt stille drift.',
            'Bewaar wat werkt. Een prompt die een sectie precies goed maakte, gebruik je in je volgende project weer. Zo bouw je je eigen bibliotheek op.',
          ],
        },
        {
          kind: 'callout',
          title: 'Begin met assets die bewezen werken',
          text: 'De gratis galerij bevat paletten, pairings en prompts die je direct kunt kopiëren. Met een gratis account bewaar je ze op één plek.',
          href: '/galerij',
          linkLabel: 'Open de galerij',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Waarom ziet mijn AI-website er goedkoop uit?',
      answer:
        'Vrijwel altijd door standaardkeuzes: het model koos zelf kleuren, fonts en spacing en kwam uit op het gemiddelde van internet. Geef een concreet palet, een font-pairing en een korte richting mee en het resultaat verandert direct.',
    },
    {
      question: 'Welke AI maakt de mooiste websites?',
      answer:
        'Het eerlijke antwoord: het verschil tussen modellen is klein vergeleken met het verschil tussen wel of geen visuele context. Claude, ChatGPT en app-builders als Lovable leveren allemaal verzorgd werk zodra je ze een visueel systeem meegeeft.',
    },
    {
      question: 'Kun je zonder designgevoel een mooie website maken?',
      answer:
        'Ja, dat is precies het punt van gecureerde assets. Het designgevoel zit in het palet en de pairing die je kiest, niet in honderd losse keuzes. Kiezen uit goede opties kan iedereen.',
    },
    {
      question: 'Wat is een goed kleurenpalet voor een website?',
      answer:
        'Een rustig basissysteem: een canvas-kleur, een donkere inktkleur voor tekst, twee of drie tussentinten en precies één accentkleur voor knoppen en actieve elementen. Meer accentkleuren maken een site onrustig.',
    },
    {
      question: 'Hoeveel lettertypes gebruik je op een website?',
      answer:
        'Twee: één voor koppen, één voor lopende tekst. Binnen elke familie maximaal twee of drie gewichten. Vrijwel elke site die er duur uitziet, houdt zich aan deze regel.',
    },
    {
      question: 'Wat kost het om een website met AI te maken?',
      answer:
        'De tools kosten 0 tot 50 euro per maand, hosting is vaak gratis of een paar euro. De visuele assets uit de Struq-galerij zijn gratis te kopiëren. Vergelijk dat met duizenden euro’s voor een bureau.',
    },
  ],
  related: ['vibe-coding', 'ai-design-prompts'],
};

/* --- Gids 3: Welke prompts geef je je AI voor beter design? ----------------- */

const aiDesignPrompts: GuideDef = {
  slug: 'ai-design-prompts',
  question: 'Welke prompts geef je je AI voor beter design?',
  intro:
    '"Maak het strak" werkt niet. Dit zijn de promptstructuren die wél werken, per onderdeel: kleur, typografie en visuele richting. Kopieer, vul in, plak.',
  directAnswer:
    'De beste design-prompts geven je AI concrete waarden in plaats van smaakwoorden: exacte hexcodes, fontnamen met gewichten, en twee of drie regels over sfeer. "Maak het moderner" geeft het model niets om op te sturen; "gebruik #1C1917 op #FAF6F0 met Fraunces voor koppen" wel. Structuur verslaat bijvoeglijke naamwoorden.',
  seo: {
    title: 'AI-design-prompts die werken: kleur, typografie en richting',
    description:
      'Concrete promptstructuren waarmee ChatGPT, Claude of je app-builder beter design oplevert. Met kopieerbare voorbeelden voor kleurenpaletten, font-pairings en visuele richting.',
  },
  datePublished: '2026-07-06',
  dateModified: '2026-07-06',
  sections: [
    {
      id: 'waarom-vaag-faalt',
      heading: 'Waarom werken vage design-prompts niet?',
      blocks: [
        {
          kind: 'paragraph',
          text: '"Maak het moderner." "Iets strakker graag." "Meer premium." Herkenbaar? Zulke prompts geven het model niets om op te sturen. Modern, strak en premium betekenen voor een AI het statistische gemiddelde van alles wat ooit zo genoemd is. Dus krijg je: een gradient, meer schaduw, en dezelfde template-look als eerst.',
        },
        {
          kind: 'paragraph',
          text: 'Een AI-model is uitstekend in het uitvoeren van concrete instructies en zwak in het raden van smaak. De oplossing is dus niet harder roepen dat het mooier moet, maar preciezer zeggen wat mooi hier betekent: welke kleuren, welke fonts, welke regels.',
        },
      ],
    },
    {
      id: 'anatomie',
      heading: 'Hoe structureer je een design-prompt?',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Elke goede design-prompt heeft dezelfde drie lagen. Waarden (wat), rollen (waarvoor) en regels (wat niet). Dit is het skelet:',
        },
        {
          kind: 'prompt',
          label: 'De anatomie van een design-prompt',
          text: 'Kleuren (met rol):\n- [hexcode]: achtergrond\n- [hexcode]: tekst\n- [hexcode]: accent, alleen voor primaire acties\n\nTypografie (met gewicht):\n- Koppen: [fontnaam], gewicht [x]\n- Lopende tekst: [fontnaam], gewicht [x], regelafstand 1.6\n\nRegels:\n- [wat altijd geldt]\n- [wat nooit mag]',
        },
        {
          kind: 'paragraph',
          text: 'De regels-laag wordt het vaakst vergeten en doet het meeste werk. "Nooit meer dan één accentkleur per scherm" voorkomt tien correctierondes.',
        },
      ],
    },
    {
      id: 'kleur-prompt',
      heading: 'Welke prompt gebruik je voor kleuren?',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Geef elke kleur een hexcode én een rol. Dit voorbeeld gebruikt "Warm paper" uit de gratis galerij, een rustig systeem voor content-first interfaces:',
        },
        {
          kind: 'prompt',
          label: 'Kleuren-prompt (palet: Warm paper)',
          text: 'Gebruik dit kleursysteem:\n- Canvas: #FAF6F0\n- Paneel: #F3EDE4\n- Inkt: #1C1917\n- Secundair: #57534E\n- Accent: #C2410C\n- Accent-wash: #FFEDD5\n\nRegels:\n- Accent alleen voor primaire acties en actieve states\n- Nooit meer dan één accent per view\n- Inkt op canvas voor lopende tekst, secundair voor metadata',
        },
        {
          kind: 'paragraph',
          text: 'Merk op dat de regels rechtstreeks uit het asset komen. Een goed palet is meer dan een rijtje kleuren; het is een klein systeem met gebruiksaanwijzing.',
        },
      ],
    },
    {
      id: 'typografie-prompt',
      heading: 'Welke prompt gebruik je voor typografie?',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Fontnaam, gewicht en schaal. Zonder gewichten kiest het model zelf, en dat wordt vrijwel altijd te dik. Dit voorbeeld is de pairing "Fraunces + Inter" uit de galerij:',
        },
        {
          kind: 'prompt',
          label: 'Typografie-prompt (pairing: Fraunces + Inter)',
          text: 'Gebruik deze typografie:\n- Koppen: Fraunces, gewicht 400-600, optische maat aan\n- Lopende tekst: Inter, gewicht 400/500, regelafstand 1.6\n\nSchaal:\n- Display: clamp(2.5rem, 6vw, 4.5rem)\n- H1: clamp(1.75rem, 3vw, 2.5rem)\n- Body: 1rem\n\nRegels:\n- Fraunces nooit onder 20px\n- Maximaal twee gewichten per familie in een view',
        },
      ],
    },
    {
      id: 'richting-prompt',
      heading: 'Welke prompt gebruik je voor visuele richting?',
      blocks: [
        {
          kind: 'paragraph',
          text: 'De richting-prompt is de kortste en de belangrijkste: hij stuurt elke keuze die je niet expliciet gemaakt hebt. Dit voorbeeld is de richting "Rustig en gedurfd" uit de galerij:',
        },
        {
          kind: 'prompt',
          label: 'Richting-prompt (visuele richting: Rustig en gedurfd)',
          text: 'Houd deze visuele richting aan:\n- Rustige galerij met één gedurfde zet per scherm. Denk museum, geen kermis.\n- Veel witruimte rond het heldere element\n- Eén accentkleur, consequent gebruikt\n- Geen gradient-tekst, geen glow-effecten, geen decoratie die niets uitlegt\n\nReferentiezin: "Warm-paper achtergrond, een gedurfd accent, veel rust, editorial typografie, geen decoratieve ruis."',
        },
        {
          kind: 'paragraph',
          text: 'Die laatste referentiezin is goud waard: herhaal hem wanneer het model begint af te dwalen, en de stijl klapt terug op zijn plek.',
        },
      ],
    },
    {
      id: 'bibliotheek',
      heading: 'Hoe bouw je je eigen promptbibliotheek op?',
      blocks: [
        {
          kind: 'paragraph',
          text: 'De prompts hierboven zijn een startpunt, geen eindpunt. Elke keer dat een prompt precies het juiste resultaat geeft, is dat een asset die je wilt bewaren. Wie elke sessie opnieuw begint met een leeg tekstvak, betaalt elke keer opnieuw leergeld.',
        },
        {
          kind: 'paragraph',
          text: ENTITY_LINE +
            ' Alle voorbeelden uit deze gids komen rechtstreeks uit de gratis galerij: je kopieert ze met één klik, en met een gratis account bewaar je je eigen selectie in je vault, klaar voor elk volgend project en elke AI-tool.',
        },
        {
          kind: 'callout',
          title: 'Alle prompts uit deze gids staan klaar',
          text: 'Kleurenpaletten, font-pairings, richtingen en start-prompts: gratis te kopiëren, direct bruikbaar in ChatGPT, Claude of je builder.',
          href: '/galerij',
          linkLabel: 'Open de galerij',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Werken deze prompts in ChatGPT, Claude én Gemini?',
      answer:
        'Ja. Hexcodes, fontnamen en regels zijn universeel; elk groot model begrijpt ze. De structuur (waarden, rollen, regels) werkt ook in app-builders zoals Lovable, Bolt en v0.',
    },
    {
      question: 'Moet je design-prompts in het Engels schrijven?',
      answer:
        'Nee. Moderne modellen begrijpen Nederlands prima, en de waarden zelf (hexcodes, fontnamen, rem-waarden) zijn taal-onafhankelijk. Schrijf in de taal waarin jij het scherpst formuleert.',
    },
    {
      question: 'Hoe lang mag een design-prompt zijn?',
      answer:
        'Zo lang als nodig voor concrete waarden, zo kort als kan in de regels. De voorbeelden in deze gids zijn 10 tot 15 regels en dat is meestal genoeg. Een pagina vol proza werkt slechter dan een strakke lijst.',
    },
    {
      question: 'Waarom negeert mijn AI mijn design-instructies?',
      answer:
        'Meestal omdat de instructies te lang geleden in het gesprek staan of met te veel tegelijk kwamen. Herhaal de kernregels bij elke grote bouwstap en verander één ding per bericht.',
    },
    {
      question: 'Wat zijn design tokens?',
      answer:
        'Design tokens zijn benoemde waarden voor visuele beslissingen: kleuren, maten, fonts. In plaats van "blauw" zeg je "accent: #C2410C". Ze maken design overdraagbaar, ook naar een AI: het model kan tokens letterlijk toepassen.',
    },
    {
      question: 'Waar vind je kant-en-klare design-prompts in het Nederlands?',
      answer:
        'In de gratis Struq-galerij: gecureerde kleurenpaletten, font-pairings, visuele richtingen en start-prompts, allemaal met een kopieerknop en in het Nederlands toegelicht.',
    },
  ],
  related: ['mooie-website-met-ai', 'vibe-coding'],
};

/* --- Index --------------------------------------------------------------------- */

/** Geordend op leesvolgorde voor een beginner: begrip -> methode -> gereedschap. */
export const GUIDES: GuideDef[] = [vibeCoding, mooieWebsiteMetAi, aiDesignPrompts];

export function getGuide(slug: string): GuideDef | null {
  return GUIDES.find((guide) => guide.slug === slug) ?? null;
}

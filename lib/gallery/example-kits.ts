/**
 * QUARANTAINE — statische marketing-democontent, 1-op-1 uit het oude Struq.
 * Voedt alleen de publieke galerij (M1). Wordt in M4 vervangen door de echte
 * assets-DB (canon-import, 5 visuele types). Bouw hier NIETS nieuws op;
 * de legacy typestrings hieronder zijn geen product-taxonomie.
 */

enum AssetStatus {
  DRAFT = 'Draft',
  READY = 'Ready',
}

const ASSET_TYPE = {
  MASTER_PROMPT: 'master_prompt',
  SECURITY_AUDIT: 'security_audit',
  REFACTOR_PROMPT: 'refactor_prompt',
  GUARDRAIL: 'guardrail',
  REVIEW_PROMPT: 'review_prompt',
  DEBUG_PROMPT: 'debug_prompt',
  DOCS_PROMPT: 'docs_prompt',
  TEST_PROMPT: 'test_prompt',
  CLAUDE_SKILL: 'skill',
  CLAUDE_MD: 'agent_rules',
  WINDSURF_RULE: 'ide_rule',
  AGENT_PERSONA: 'agent_persona',
  MCP_CONFIG: 'mcp_config',
  FONT: 'font',
  COLOUR_PALETTE: 'colour_palette',
  DESIGN_BRIEF: 'design_brief',
  DESIGN_SYSTEM: 'design_system',
  DESIGN_PROMPT: 'design_prompt',
  BRAND_GUIDE: 'brand_guide',
  QUICK_PROMPT: 'quick_prompt',
  WORKFLOW: 'workflow',
  ENV_CONFIG: 'env_config',
  NOTE: 'note',
  SNIPPET: 'snippet',
  REFERENCE: 'reference',
  CHECKLIST: 'checklist',
  PRD: 'prd',
  SOP: 'sop',
  RFC: 'rfc',
  ADR: 'adr',
  TEMPLATE: 'template',
  SESSION_PRIMER: 'session_primer',
  HOOK: 'hook',
  PLAN: 'plan',
  CONTEXT: 'context',
  EVAL: 'eval',
} as const;

type StarterAssetType = (typeof ASSET_TYPE)[keyof typeof ASSET_TYPE];

export type ExampleKitAsset = {
  type: StarterAssetType;
  title: string;
  summary: string;
  body: string;
  tags: string[];
  status: AssetStatus;
};

export type ExampleKit = {
  name: string;
  description: string;
  isPublic: boolean;
  assets: ExampleKitAsset[];
};

const READY = AssetStatus.READY;

function makeThisYoursPrompt(kitName: string, stackFocus: string) {
  return `You are rewriting the ${kitName} for my own project.

My stack and preferences:
- stack: [fill in]
- editor or agent: [fill in]
- conventions: [fill in]
- constraints: [fill in]

Rewrite the kit so it:
- keeps the same outcome
- matches my stack and naming
- removes anything I do not need
- stays export-friendly for my IDE and LLM workflow
- gives me a clean version I can reuse later

Focus on: ${stackFocus}

Return the adapted kit in a concise, practical form.`;
}

const STRUQ_STARTER_GUIDE = `# What this kit is for
Struq is operational memory for AI-native builders. This starter kit shows the smallest useful version of that idea.

## Use it when
- you want to understand how Struq groups reusable assets
- you want to export a kit into your own IDE
- you want your own LLM to rewrite a kit for your stack

## The working loop
1. Export the kit as a ZIP
2. Import it into your editor or agent workflow
3. Ask your LLM to rewrite the kit for your repo
4. Save the adapted version as your baseline

## Struq in one sentence
Keep what works, reuse it across projects, and stop rebuilding context from scratch.`;

const STRUQ_STARTER_CHECKLIST = `# Install this kit
- Export the kit from Struq
- Open the ZIP in your editor
- Read the guide asset first
- Ask your LLM to rewrite the template for your own stack
- Save the adapted version back into your workflow
- Re-export whenever your conventions change`;

const STRUQ_STARTER_PRIMER = `You are helping me use Struq as reusable operational memory.

Read the current project context first.
Keep the kit practical and short.
Preserve the existing structure unless I ask for a redesign.
Prefer the smallest change that still makes the kit useful.
Explain why a suggestion matters before you expand it.
When I ask to implement a kit, make it easy to export and adapt.`;

const SESSION_ROUTER_SKILL = `---
name: struq-session-router
description: Route work to the right context and verify at the lowest useful tier.
---

# Struq Session Router

## What this skill does
It helps you decide what kind of work you are doing, what context to read first, and how much verification is actually needed.

## Working rules
1. Classify the task domain before editing anything.
2. Read the smallest set of relevant docs or files.
3. Prefer the existing patterns in the repo.
4. Keep changes surgical and easy to review.
5. Verify at the lowest tier that proves the change.

## Example routing
- UI and layout -> frontend rules
- API and auth -> backend rules
- schema and migrations -> database rules
- verification scope -> quality rules

## Output
Start with the outcome, then give the change, then finish with the verification path.`;

const PROJECT_RULES_TEMPLATE = `# CLAUDE.md

## Project
[Describe the project in one paragraph]

## Stack
- Framework: [fill in]
- Language: [fill in]
- Database: [fill in]
- Editor or agent: [fill in]

## Working rules
- Read existing code before making changes
- Keep the smallest change that solves the problem
- Follow the repository's conventions instead of inventing new ones
- Add verification that matches the size of the change
- Ask before destructive or irreversible operations

## Do not
- hardcode secrets
- bypass the service layer
- add unnecessary abstractions
- skip migrations or ignore contract changes`;

const QUALITY_GUARDRAILS = `## Always do
- Keep the current patterns intact
- Validate inputs at the boundary
- Keep public contracts stable
- Use clear naming and small changes
- Verify before merging

## Never do
- Ship code you cannot explain
- Mix unrelated refactors into one change
- Hide risky behavior behind a vague helper
- Skip review because the change feels small`;

const MAKE_CONTEXT_YOURS = `You are adapting this AI Builder Context Kit for my own repo.

My goal:
- [fill in]

My stack:
- [fill in]

My conventions:
- [fill in]

Rewrite the rules, skill, and guardrails so they fit my project.
Keep the structure reusable and export-friendly.
Return the adapted version as files I can import into my editor.`;

const VERIFICATION_WORKFLOW = `# Verification workflow

- T0: \`npm run typecheck\`
- T1: \`npm run typecheck && npm run lint\`
- T2: \`npm run typecheck && npm run lint && npm run verify:design\`
- T3: \`npm run verify\`
- T4: \`npm run verify:full\`

Use the lowest tier that proves the change.
Escalate only when the change reaches beyond static checks.`;

const IMPLEMENTATION_PLAN_TEMPLATE = `# Implementation plan

## Goal
[What are you building?]

## Decisions
[What did you decide and why?]

## Phases
1. [Phase one]
2. [Phase two]
3. [Phase three]

## Open questions
[What still needs a decision?]

## Done
[What does success look like?]`;

const SELF_REVIEW_PROMPT = `Review this change before I ship it.

Check for:
- auth and ownership issues
- contract drift
- missing validation
- design or token drift
- missing tests or verification
- risky assumptions that should be called out

Return:
1. blockers
2. risks
3. the smallest fix that resolves each issue`;

const EXPORT_IMPORT_GUIDE = `# Export and reuse

1. Export the kit from Struq as a ZIP.
2. Import it into your IDE or agent workflow.
3. Open the guide and template assets first.
4. Ask your LLM to rewrite the kit for your stack and preferences.
5. Save the adapted version as your own reusable baseline.

This is the point of the kit: the exported version should become your version.`;

const WAT_IS_EEN_PROMPT = `# Wat is een prompt?

Een prompt is de opdracht die je aan een AI geeft. Meer niet.

"Schrijf een e-mail aan mijn huurbaas" is een prompt. "Leg uit wat dit foutbericht betekent" ook.

## Waarom bewaren?
Een goede prompt schrijf je één keer scherp en gebruik je daarna telkens opnieuw. Dat is precies waar Struq voor is: je bewaart wat werkt, zodat je het niet elke keer opnieuw hoeft te bedenken.

## Zo werkt de loop
1. Je vindt of schrijft een prompt die goed werkt
2. Je bewaart hem hier in je vault
3. Volgende keer: kopiëren, plakken in ChatGPT of Claude, klaar

## Eén tip
Hoe concreter je prompt, hoe beter het resultaat. "Schrijf iets over mijn product" is vaag. "Schrijf 3 korte productteksten voor [product], toon: direct en zonder overdrijven" werkt.`;

const UNIVERSELE_START_PROMPT = `Ik wil dat je me helpt met de volgende taak.

Taak: [beschrijf hier wat je wilt]

Werk zo:
- Stel eerst maximaal 3 vragen als iets onduidelijk is
- Geef daarna één concreet voorstel, geen tien opties
- Gebruik gewone taal, geen vakjargon
- Als iets niet kan, zeg dat eerlijk

Begin nu.`;

const LEG_DIT_UIT_PROMPT = `Leg het volgende aan me uit alsof ik er niets van weet.

[plak hier de tekst, code of foutmelding]

Regels:
- Gewone taal, geen vaktermen zonder uitleg
- Begin met wat het in één zin betekent
- Vertel daarna wat ik ermee moet doen
- Houd het kort`;

const ZO_GEBRUIK_JE_STRUQ = `# Zo gebruik je Struq

- Open een asset in je vault (begin met deze kit)
- Klik op kopiëren
- Plak de prompt in ChatGPT, Claude of je andere AI-tool
- Vul de [invulvelden] aan met jouw situatie
- Werkt de prompt goed? Pas hem hier aan zodat hij nóg beter wordt
- Kom je zelf een goede prompt tegen? Bewaar hem met de + knop bovenin

Dat is alles. Je vault groeit vanzelf mee met wat jij bouwt.`;

const APP_BUILDER_SPEC_PROMPT = `You are building an app with me in an AI app builder (Lovable, Bolt, v0).

The app: [one-sentence description]

Core screens:
1. [screen one]
2. [screen two]
3. [screen three]

Rules for this build:
- Build ONE screen at a time and wait for my confirmation
- Use a simple, consistent visual style: [describe or say "clean and minimal"]
- No features I did not ask for
- If a request is ambiguous, ask before building
- Keep the data model as small as possible

Start with screen 1.`;

const APP_BUILDER_FIX_PROMPT = `Something is broken in the app you are building.

What I see: [describe what happens]
What I expected: [describe what should happen]

Rules:
- Fix ONLY this issue, change nothing else
- Tell me in one sentence what caused it
- If the fix requires changing something I asked for earlier, ask first`;

const APP_BUILDER_GUARDRAILS = `## Always do
- One change per message: small steps ship
- Describe what you see, not what you guess is wrong
- Save a working version before asking for big changes
- Ask the builder to explain its plan before a large feature

## Never do
- Paste five requests into one message
- Say "make it better" without saying what better means
- Keep iterating on a broken state; roll back instead
- Let the builder invent features you didn't ask for`;

const APP_BUILDER_LAUNCH_CHECKLIST = `# Before you share your app

- Click through every screen as a stranger would
- Try to break every form: empty input, weird input, double submit
- Check it on your phone, not just your laptop
- Remove placeholder text and demo data
- Test the one flow that matters most, three times
- Have one other person use it without your help`;

const STRUQ_MCP_GUIDE = `# Connect your vault to your agent (MCP)

Struq ships an MCP server. Once connected, your agent can search, read, and write vault assets directly, no copy-paste.

## Endpoint
\`https://struq.nl/api/mcp\` (Streamable HTTP, OAuth 2.0 + PKCE, Pro plan)

## Claude Code
\`\`\`bash
claude mcp add --transport http struq https://struq.nl/api/mcp
\`\`\`
Then authenticate via the OAuth flow in \`/mcp\`.

## What you get
- \`vault_search\`, \`vault_get_asset\`, \`vault_create_asset\`, \`vault_fork\`
- \`vault_list_kits\`, \`vault_get_kit\`
- \`vault_list_projects\`, \`project_list_blockers\` and friends

## The point
Your agent reads your operational memory at the start of a session and writes back what it learned at the end. The vault compounds without you doing the bookkeeping.`;

const STRUQ_MCP_CONFIG = `{
  "mcpServers": {
    "struq": {
      "type": "http",
      "url": "https://struq.nl/api/mcp"
    }
  }
}`;

const AGENT_VAULT_LOOP = `# Agent vault loop

A working session pattern for agents connected to Struq via MCP.

## Session start
1. \`vault_get_project\` for the active project: read currentStatus, nextSteps, open blockers
2. \`vault_search\` for assets tagged with the domain you are about to touch
3. Load the relevant kit with \`vault_get_kit\` if one exists

## During work
- Hit a reusable insight? \`vault_create_asset\` (type: note), refine later
- Blocked? \`project_create_blocker\` with severity and a one-line summary

## Session end
1. Update the project: what changed, what's next
2. Resolve blockers you cleared
3. Promote any notes worth keeping to a real asset type

The vault is only operational memory if the agent actually writes to it.`;

const EERSTE_STAPPEN_KIT: ExampleKit = {
  name: 'Eerste stappen met AI',
  description:
    'Voor als je net begint. Wat een prompt is, twee prompts die je meteen kunt gebruiken, en hoe je Struq laat meegroeien met wat je doet.',
  isPublic: true,
  assets: [
    {
      type: ASSET_TYPE.REFERENCE,
      title: 'Wat is een prompt?',
      summary: 'De basis in gewone taal, en waarom je goede prompts bewaart.',
      body: WAT_IS_EEN_PROMPT,
      tags: ['basis', 'uitleg', 'starter'],
      status: READY,
    },
    {
      type: ASSET_TYPE.QUICK_PROMPT,
      title: 'Universele start-prompt',
      summary: 'Eén prompt die elke taak beter laat beginnen. Kopiëren, invullen, plakken.',
      body: UNIVERSELE_START_PROMPT,
      tags: ['prompt', 'starter', 'hergebruik'],
      status: READY,
    },
    {
      type: ASSET_TYPE.QUICK_PROMPT,
      title: 'Leg dit uit',
      summary: 'Plak een tekst, foutmelding of stuk code en krijg uitleg zonder jargon.',
      body: LEG_DIT_UIT_PROMPT,
      tags: ['prompt', 'uitleg', 'starter'],
      status: READY,
    },
    {
      type: ASSET_TYPE.CHECKLIST,
      title: 'Zo gebruik je Struq',
      summary: 'De hele werkwijze in zes stappen.',
      body: ZO_GEBRUIK_JE_STRUQ,
      tags: ['struq', 'workflow', 'starter'],
      status: READY,
    },
  ],
};

const APP_BUILDER_KIT: ExampleKit = {
  name: 'App Builder Kit',
  description:
    'Prompts and guardrails for building in Lovable, Bolt, or v0. Keeps your builder focused, your iterations small, and your app shippable.',
  isPublic: true,
  assets: [
    {
      type: ASSET_TYPE.MASTER_PROMPT,
      title: 'App spec prompt',
      summary: 'Start every app builder session with a scoped, screen-by-screen plan.',
      body: APP_BUILDER_SPEC_PROMPT,
      tags: ['lovable', 'app-builder', 'spec'],
      status: READY,
    },
    {
      type: ASSET_TYPE.DEBUG_PROMPT,
      title: 'Fix one thing',
      summary: 'Report a bug to your app builder without triggering a rebuild of everything.',
      body: APP_BUILDER_FIX_PROMPT,
      tags: ['debug', 'app-builder', 'iterate'],
      status: READY,
    },
    {
      type: ASSET_TYPE.GUARDRAIL,
      title: 'App builder guardrails',
      summary: 'Working rules that keep AI app builders on the rails.',
      body: APP_BUILDER_GUARDRAILS,
      tags: ['guardrails', 'app-builder'],
      status: READY,
    },
    {
      type: ASSET_TYPE.CHECKLIST,
      title: 'Before you share your app',
      summary: 'The minimum QA pass before anyone else sees it.',
      body: APP_BUILDER_LAUNCH_CHECKLIST,
      tags: ['checklist', 'launch', 'qa'],
      status: READY,
    },
  ],
};

const MCP_AGENT_KIT: ExampleKit = {
  name: 'Vault via MCP',
  description:
    'Connect Struq to Claude Code or any MCP client. Your agent reads and writes the vault directly: operational memory without copy-paste.',
  isPublic: true,
  assets: [
    {
      type: ASSET_TYPE.REFERENCE,
      title: 'Connect your vault via MCP',
      summary: 'Endpoint, auth flow, and the tools your agent gets.',
      body: STRUQ_MCP_GUIDE,
      tags: ['mcp', 'agent', 'setup'],
      status: READY,
    },
    {
      type: ASSET_TYPE.MCP_CONFIG,
      title: 'Struq MCP client config',
      summary: 'Drop-in server entry for any MCP client config.',
      body: STRUQ_MCP_CONFIG,
      tags: ['mcp', 'config'],
      status: READY,
    },
    {
      type: ASSET_TYPE.WORKFLOW,
      title: 'Agent vault loop',
      summary: 'Session pattern: read the vault at start, write back at the end.',
      body: AGENT_VAULT_LOOP,
      tags: ['workflow', 'agent', 'mcp'],
      status: READY,
    },
  ],
};

export const EXAMPLE_KITS: ExampleKit[] = [
  {
    name: 'Struq Starter Kit',
    description:
      'Orientation kit for the vault. Export it, import it into your IDE, and let your LLM rewrite the starter prompt for your own stack.',
    isPublic: true,
    assets: [
      {
        type: ASSET_TYPE.REFERENCE,
        title: 'What Struq is',
        summary: 'A short map of the platform and the starter-kit loop.',
        body: STRUQ_STARTER_GUIDE,
        tags: ['struq', 'context', 'starter'],
        status: READY,
      },
      {
        type: ASSET_TYPE.CHECKLIST,
        title: 'Install this kit',
        summary: 'The fastest way to move the kit into your own workflow.',
        body: STRUQ_STARTER_CHECKLIST,
        tags: ['kit', 'workflow', 'import'],
        status: READY,
      },
      {
        type: ASSET_TYPE.TEMPLATE,
        title: 'Make this kit yours',
        summary: 'Prompt your LLM to rewrite this kit for your repo and conventions.',
        body: makeThisYoursPrompt('Struq Starter Kit', 'exporting and adapting a starter workflow'),
        tags: ['template', 'llm', 'customize'],
        status: READY,
      },
      {
        type: ASSET_TYPE.SESSION_PRIMER,
        title: 'Starter vault primer',
        summary: 'A compact opener you can paste into Claude or Cursor.',
        body: STRUQ_STARTER_PRIMER,
        tags: ['primer', 'vault', 'context'],
        status: READY,
      },
    ],
  },
  {
    name: 'AI Builder Context Kit',
    description:
      'Reusable agent rules and project instructions that make AI work feel predictable. Use it when your LLM should behave like part of the repo, not a random helper.',
    isPublic: true,
    assets: [
      {
        type: ASSET_TYPE.CLAUDE_SKILL,
        title: 'Struq Session Router',
        summary: 'A trimmed skill for classifying work, loading the right context, and verifying at the right tier.',
        body: SESSION_ROUTER_SKILL,
        tags: ['skill', 'routing', 'verification'],
        status: READY,
      },
      {
        type: ASSET_TYPE.CLAUDE_MD,
        title: 'Project Rules Template',
        summary: 'Project-root instructions you can adapt to any stack.',
        body: PROJECT_RULES_TEMPLATE,
        tags: ['claude.md', 'rules', 'template'],
        status: READY,
      },
      {
        type: ASSET_TYPE.GUARDRAIL,
        title: 'Quality guardrails',
        summary: 'Working rules for predictable, reviewable AI output.',
        body: QUALITY_GUARDRAILS,
        tags: ['guardrails', 'quality', 'review'],
        status: READY,
      },
      {
        type: ASSET_TYPE.TEMPLATE,
        title: 'Make this context yours',
        summary: 'Prompt to adapt the kit for your repo and conventions.',
        body: MAKE_CONTEXT_YOURS,
        tags: ['template', 'adapt', 'llm'],
        status: READY,
      },
    ],
  },
  {
    name: 'Shipping & Release Kit',
    description:
      'Verification, planning, and self-review assets for the moment you want to ship with confidence. Use it after the starter kit when your workflow needs a stricter loop.',
    isPublic: true,
    assets: [
      {
        type: ASSET_TYPE.CHECKLIST,
        title: 'Verification workflow',
        summary: 'A tiered quality ladder from typecheck to full verify.',
        body: VERIFICATION_WORKFLOW,
        tags: ['verification', 'quality', 'release'],
        status: READY,
      },
      {
        type: ASSET_TYPE.SOP,
        title: 'Implementation plan template',
        summary: 'A simple plan structure for building in phases.',
        body: IMPLEMENTATION_PLAN_TEMPLATE,
        tags: ['plan', 'sop', 'shipping'],
        status: READY,
      },
      {
        type: ASSET_TYPE.REVIEW_PROMPT,
        title: 'Self-review prompt',
        summary: 'Ask your LLM to review the change before you merge it.',
        body: SELF_REVIEW_PROMPT,
        tags: ['review', 'prompt', 'merge'],
        status: READY,
      },
      {
        type: ASSET_TYPE.REFERENCE,
        title: 'Export / import guide',
        summary: 'How to move the kit into your IDE and reuse it later.',
        body: EXPORT_IMPORT_GUIDE,
        tags: ['export', 'import', 'reuse'],
        status: READY,
      },
    ],
  },
];

const [STRUQ_STARTER_KIT, AI_BUILDER_CONTEXT_KIT, SHIPPING_RELEASE_KIT] = EXAMPLE_KITS;

// Visual starter kit (Gallery Vault, RFC 2026-07) — every new vault opens as a
// gallery, not a wall of text. Palettes carry real hex values so the swatch
// renderer fires; fonts carry real pairings so the specimen renderer fires.
const WARM_PAPER_PALETTE = `# Warm paper

Rustig, warm basissysteem voor content-first interfaces.

## Kleuren
- Canvas: #FAF6F0
- Paneel: #F3EDE4
- Inkt: #1C1917
- Secundair: #57534E
- Accent: #C2410C
- Accent-wash: #FFEDD5
- Succes: #16A34A
- Waarschuwing: #D97706

## Gebruik
- Accent alleen voor primaire acties en actieve states
- Nooit meer dan een accent per view
- Inkt op canvas voor lopende tekst, secundair voor metadata`;

const MIDNIGHT_STUDIO_PALETTE = `# Midnight studio

Donker systeem met een koele kern en een enkele warme vlam.

## Kleuren
- Achtergrond: #0C0A09
- Paneel: #1C1917
- Rand: #292524
- Tekst: #FAFAF9
- Gedempt: #A8A29E
- Vlam: #F97316
- IJsblauw: #38BDF8
- Diep paars: #6D28D9

## Gebruik
- Vlam voor CTA's, ijsblauw voor informatieve accenten
- Paars alleen decoratief in illustraties, nooit in UI-chrome`;

const EDITORIAL_PAIRING = `# Editorial pairing

## Kop
font-family: Fraunces
Gewicht: 400-600, optische maat aan. Voor titels en pull-quotes.

## Lopende tekst
font-family: Inter
Gewicht: 400/500. Regelafstand 1.6 voor artikelen, 1.5 voor UI.

## Schaal
- Display: clamp(2.5rem, 6vw, 4.5rem)
- H1: clamp(1.75rem, 3vw, 2.5rem)
- Body: 1rem / 1.6
- Caption: 0.8125rem

## Regels
- Fraunces nooit onder 20px
- Maximaal twee gewichten per familie in een view`;

const PRODUCT_UI_PAIRING = `# Product UI pairing

## Interface
font-family: Urbanist
Gewicht: 400/500/600. Alles van knoppen tot tabellen.

## Merkmomenten
font-family: Comfortaa
Alleen voor de merknaam, grote cijfers en lege staten.

## Schaal
- Paneel-titel: 1.0625rem / 500
- Body: 0.875rem / 400
- Label: 0.6875rem / 700, uppercase, letter-spacing 0.16em

## Regels
- Comfortaa nooit in formulieren of lopende tekst
- Cijfers altijd tabular-nums`;

const VISUAL_DIRECTION_BRIEF = `# Visuele richting: rustig en gedurfd

## Gevoel
Rustige galerij met een enkele gedurfde zet per scherm. Denk museum, geen kermis.

## Doen
- Veel wit- of papierruimte rond het heldere element
- Een accentkleur, consequent gebruikt
- Echte visuals (swatches, specimens, media) boven iconen
- Motion kort en doelgericht: 120-220ms, expo-out

## Niet doen
- Gradient-tekst of glow-effecten
- Meer dan een blikvanger per view
- Decoratie die niets uitlegt

## Referentiezin voor AI-generatie
"Warm-paper achtergrond, een gedurfd accent, veel rust, editorial typografie, geen decoratieve ruis."`;

const VISUEEL_STARTER_KIT: ExampleKit = {
  name: 'Visuele basis',
  description:
    'Twee kleurenpaletten, twee font-pairings en een visuele richting om elk project mee te openen. Dit is je galerij: vervang de waarden door die van je eigen merk.',
  isPublic: true,
  assets: [
    {
      type: ASSET_TYPE.COLOUR_PALETTE,
      title: 'Warm paper',
      summary: 'Rustig, warm basissysteem voor content-first interfaces.',
      body: WARM_PAPER_PALETTE,
      tags: ['palet', 'warm', 'licht'],
      status: READY,
    },
    {
      type: ASSET_TYPE.COLOUR_PALETTE,
      title: 'Midnight studio',
      summary: 'Donker systeem met een koele kern en een enkele warme vlam.',
      body: MIDNIGHT_STUDIO_PALETTE,
      tags: ['palet', 'donker', 'contrast'],
      status: READY,
    },
    {
      type: ASSET_TYPE.FONT,
      title: 'Fraunces + Inter',
      summary: 'Editorial pairing: karaktervolle koppen boven kalme lopende tekst.',
      body: EDITORIAL_PAIRING,
      tags: ['typografie', 'editorial', 'pairing'],
      status: READY,
    },
    {
      type: ASSET_TYPE.FONT,
      title: 'Urbanist + Comfortaa',
      summary: 'Product-UI pairing: zakelijke interface met warme merkmomenten.',
      body: PRODUCT_UI_PAIRING,
      tags: ['typografie', 'product', 'pairing'],
      status: READY,
    },
    {
      type: ASSET_TYPE.DESIGN_BRIEF,
      title: 'Rustig en gedurfd',
      summary: 'Visuele richting die je aan elke AI-generatie meegeeft.',
      body: VISUAL_DIRECTION_BRIEF,
      tags: ['richting', 'brief', 'ai'],
      status: READY,
    },
  ],
};

// Profile-based kit sets: what a new user's vault is seeded with after onboarding.
// The visual kit leads for every profile — the gallery is the front door.
export const BEGINNER_KITS: ExampleKit[] = [VISUEEL_STARTER_KIT, EERSTE_STAPPEN_KIT, STRUQ_STARTER_KIT];
export const BUILDER_KITS: ExampleKit[] = [VISUEEL_STARTER_KIT, ...EXAMPLE_KITS];
export const EXPERT_KITS: ExampleKit[] = [VISUEEL_STARTER_KIT, AI_BUILDER_CONTEXT_KIT, SHIPPING_RELEASE_KIT, MCP_AGENT_KIT];
export { APP_BUILDER_KIT, VISUEEL_STARTER_KIT };

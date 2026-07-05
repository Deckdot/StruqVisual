/**
 * Struq Learn 2.0 — content schema.
 *
 * A lesson is a typed, serializable manifest. Interactive blocks reference
 * registered React components (artifacts) by key, never by import, so
 * manifests stay pure data and new lessons are authored without touching UI.
 *
 * Psychological contract baked into the shape:
 * - `opening` shows the finished artifact first (power fantasy) and counts
 *   as the first completed step (endowed progress).
 * - `steps[].curiosityHook` is the veiled teaser for the NEXT step.
 * - `predict` blocks probe current knowledge before a concept is taught
 *   (generation + hypercorrection effect).
 * - The reward is the artifact itself (`artifact`), never points.
 */

export type Archetype = 'blauwdruk' | 'lab' | 'traject';

/**
 * Lanes: the learner picks a lane that matches what they already know and
 * builds up from there. Every lesson belongs to exactly one lane, and the
 * index shows per lane what you will be able to build at the end.
 */
export type Lane = 'beginner' | 'gevorderd' | 'expert';

export const LANE_META: Record<
  Lane,
  { label: string; order: number; forWho: string; endResult: string }
> = {
  beginner: {
    label: 'Beginner',
    order: 1,
    forWho: 'Je hebt nog nooit een .md-bestand gezien en dat is prima.',
    endResult: 'Een eigen site die echt online staat, gebouwd met een AI-agent.',
  },
  gevorderd: {
    label: 'Gevorderd',
    order: 2,
    forWho: 'Je gebruikt AI al, maar de output blijft grijs gemiddelde.',
    endResult: 'Prompts met jouw smaak erin, die je eindeloos hergebruikt.',
  },
  expert: {
    label: 'Expert',
    order: 3,
    forWho: 'Je bouwt al, maar je front-end mag van niveau studio worden.',
    endResult: 'Interfaces met karakter: ruimte, typografie, kleur en timing.',
  },
};

/** What the learner walks away with. This IS the reward. */
export interface ClaimableArtifact {
  title: string;
  description: string;
  /** Vault asset type value (matches AssetType in lib/types.ts). */
  assetType: string;
  tags: string[];
  /** The actual asset content: prompt, recipe or kit in markdown. */
  body: string;
  /** Download filename, e.g. 'hero-recept.md'. */
  filename: string;
}

/* ---------------------------------------------------------------- blocks */

interface BlockBase {
  id: string;
}

/** Plain teaching prose. One string per paragraph. */
export interface ProseBlock extends BlockBase {
  kind: 'prose';
  paragraphs: string[];
}

/** The live end result, rendered from the artifact registry. */
export interface ArtifactStageBlock extends BlockBase {
  kind: 'artifact-stage';
  artifact: string;
  caption?: string;
}

/** Toggle visual layers of the live artifact on and off. */
export interface DeconstructLayersBlock extends BlockBase {
  kind: 'deconstruct-layers';
  artifact: string;
  intro: string;
  layers: { id: string; label: string; description: string }[];
}

export interface TokenControl {
  id: string;
  label: string;
  /** CSS custom property set on the artifact wrapper, e.g. '--art-accent'. */
  cssVar: string;
  type: 'swatch' | 'range';
  /** Swatch options: value is any CSS color/value string. */
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  defaultValue: string;
}

/** Live design-token playground bound to the artifact. */
export interface PlaygroundTokensBlock extends BlockBase {
  kind: 'playground-tokens';
  artifact: string;
  intro: string;
  controls: TokenControl[];
  /** The takeaway that lands after playing. */
  insight: string;
}

export interface MotionControl {
  id: 'duration' | 'stagger' | 'distance' | 'ease';
  label: string;
  type: 'range' | 'choice';
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  defaultValue: number | string;
}

/** Motion playground: scrub the entrance timeline of the artifact. */
export interface PlaygroundMotionBlock extends BlockBase {
  kind: 'playground-motion';
  artifact: string;
  intro: string;
  controls: MotionControl[];
  insight: string;
}

export interface PromptSegment {
  id: string;
  label: string;
  text: string;
  /** Why this segment matters, shown when toggled. */
  explanation: string;
}

/** A prompt whose segments toggle on/off; the output preview responds. */
export interface PromptAnatomyBlock extends BlockBase {
  kind: 'prompt-anatomy';
  intro: string;
  segments: PromptSegment[];
  /**
   * Output states by number of enabled segments, ascending.
   * The state whose `minSegments` is highest but <= enabled count wins.
   */
  outputStates: { minSegments: number; label: string; body: string }[];
  insight: string;
}

/** Side-by-side comparison, the "grijze gemiddelde vs. karakter" pattern. */
export interface CompareBlock extends BlockBase {
  kind: 'compare';
  left: { label: string; body: string };
  right: { label: string; body: string };
  caption: string;
}

/**
 * Taste checkpoint. No right or wrong: every option shows its consequence.
 * `isCraft` marks the option the pros would pick; the resolution explains why.
 */
export interface TasteCheckBlock extends BlockBase {
  kind: 'taste-check';
  question: string;
  options: { id: string; label: string; consequence: string; isCraft: boolean }[];
  resolution: string;
}

/**
 * Predict-first probe: challenge current knowledge BEFORE teaching.
 * Being wrong is designed to surprise; `reveal` delivers the correction.
 */
export interface PredictBlock extends BlockBase {
  kind: 'predict';
  prompt: string;
  options: { id: string; label: string; correct: boolean; feedback: string }[];
  reveal: string;
}

/** Progressive code walkthrough. */
export interface CodeRevealBlock extends BlockBase {
  kind: 'code-reveal';
  language: string;
  intro: string;
  stages: { code: string; note: string }[];
}

/** Action step for trajecten, with a self-verify moment. */
export interface DoThisBlock extends BlockBase {
  kind: 'do-this';
  intro: string;
  actions: { id: string; label: string; detail?: string }[];
  verify: string;
}

/** Variable reward: a hidden atelier secret the learner can open. */
export interface SecretBlock extends BlockBase {
  kind: 'secret';
  teaser: string;
  title: string;
  body: string;
}

export type Block =
  | ProseBlock
  | ArtifactStageBlock
  | DeconstructLayersBlock
  | PlaygroundTokensBlock
  | PlaygroundMotionBlock
  | PromptAnatomyBlock
  | CompareBlock
  | TasteCheckBlock
  | PredictBlock
  | CodeRevealBlock
  | DoThisBlock
  | SecretBlock;

/* ----------------------------------------------------------------- lesson */

export interface Step {
  id: string;
  /** Small label above the title, e.g. 'Stap 2 · Typografie'. */
  kicker: string;
  title: string;
  /**
   * Teaser for THIS step, shown veiled at the end of the previous step.
   * Written as an open loop, e.g. 'Eén regel CSS maakt dit twee keer zo duur.'
   */
  curiosityHook?: string;
  blocks: Block[];
}

/** The end-result-first showcase. Watching it completes "step 1". */
export interface OpeningReveal {
  eyebrow: string;
  title: string;
  hook: string;
  artifact: string;
  /** What you will own at the end. Endowment starts here. */
  promise: string[];
}

export interface FinaleConfig {
  title: string;
  body: string;
  /** Open loop to the next lesson. */
  nextSlug?: string;
}

export interface LessonManifest {
  slug: string;
  archetype: Archetype;
  lane: Lane;
  title: string;
  /** One-line desire hook used on cards. */
  hook: string;
  description: string;
  minutes: number;
  publishedAt: string;
  updatedAt: string;
  artifact: ClaimableArtifact;
  opening: OpeningReveal;
  steps: Step[];
  finale: FinaleConfig;
  seo: { title: string; description: string };
}

/* --------------------------------------------------------------- identity */

/**
 * Identity levels: who you are becoming, never a score.
 * Level is derived from the number of claimed artifacts.
 */
export const IDENTITY_LEVELS = [
  { id: 'kijker', label: 'Kijker', minClaims: 0, line: 'Je ziet wat mooi is.' },
  { id: 'bouwer', label: 'Bouwer', minClaims: 1, line: 'Je maakt het zelf.' },
  { id: 'vormgever', label: 'Vormgever', minClaims: 2, line: 'Je geeft het karakter.' },
  { id: 'architect', label: 'Architect', minClaims: 3, line: 'Je ontwerpt het systeem.' },
] as const;

export type IdentityLevel = (typeof IDENTITY_LEVELS)[number];

export function identityForClaims(claims: number): IdentityLevel {
  let current: IdentityLevel = IDENTITY_LEVELS[0];
  for (const level of IDENTITY_LEVELS) {
    if (claims >= level.minClaims) current = level;
  }
  return current;
}

export const ARCHETYPE_META: Record<
  Archetype,
  { label: string; line: string }
> = {
  blauwdruk: {
    label: 'De Blauwdruk',
    line: 'Zie het eindresultaat, haal het uit elkaar, bouw het zelf.',
  },
  lab: {
    label: 'Het Lab',
    line: 'Ontleed waarom de ene prompt goud oplevert en de andere grijs.',
  },
  traject: {
    label: 'Het Traject',
    line: 'Van lege map naar iets dat echt online staat, stap voor stap.',
  },
};

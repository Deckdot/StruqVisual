/**
 * Contract between lesson blocks and live artifact components.
 * Blocks drive artifacts exclusively through these props, so every
 * playground control works on every artifact that honors the contract.
 */

export interface ArtifactMotionParams {
  /** Seconds per element. */
  duration?: number;
  /** Seconds between elements. */
  stagger?: number;
  /** Entrance travel in px. */
  distance?: number;
  /** GSAP ease string. */
  ease?: string;
}

export interface ArtifactProps {
  /** CSS custom property overrides, e.g. { '--art-accent': '#...' }. */
  tokens?: Record<string, string>;
  motion?: ArtifactMotionParams;
  /** Layer visibility by layer id; missing key means visible. */
  layers?: Record<string, boolean>;
  /** Bump to replay the entrance timeline. */
  replayKey?: number;
  /** Denser rendering for cards and small stages. */
  compact?: boolean;
}

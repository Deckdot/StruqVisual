'use client';

/**
 * Block registry: resolves a manifest block to its component. Adding a new
 * block kind = one component + one case here + one schema member.
 */

import type { Block } from '@/lib/learn/schema';
import { DeconstructLayers } from '@/components/site/learn/blocks/deconstruct-layers-block';
import { PlaygroundTokens } from '@/components/site/learn/blocks/playground-tokens-block';
import { PlaygroundMotion } from '@/components/site/learn/blocks/playground-motion-block';
import { PromptAnatomy } from '@/components/site/learn/blocks/prompt-anatomy-block';
import { Predict } from '@/components/site/learn/blocks/predict-block';
import { TasteCheck } from '@/components/site/learn/blocks/taste-check-block';
import {
  Prose,
  ArtifactStage,
  Compare,
  CodeReveal,
  Secret,
  DoThis,
} from '@/components/site/learn/blocks/simple-blocks';

export function BlockRenderer({
  block,
  onEngage,
  onSecret,
}: {
  block: Block;
  /** First meaningful interaction with this step. */
  onEngage: () => void;
  /** A hidden atelier secret was opened. */
  onSecret: (secretId: string) => void;
}) {
  switch (block.kind) {
    case 'prose':
      return <Prose block={block} />;
    case 'artifact-stage':
      return <ArtifactStage block={block} onEngage={onEngage} />;
    case 'deconstruct-layers':
      return <DeconstructLayers block={block} onEngage={onEngage} />;
    case 'playground-tokens':
      return <PlaygroundTokens block={block} onEngage={onEngage} />;
    case 'playground-motion':
      return <PlaygroundMotion block={block} onEngage={onEngage} />;
    case 'prompt-anatomy':
      return <PromptAnatomy block={block} onEngage={onEngage} />;
    case 'compare':
      return <Compare block={block} />;
    case 'taste-check':
      return <TasteCheck block={block} onEngage={onEngage} />;
    case 'predict':
      return <Predict block={block} onEngage={onEngage} />;
    case 'code-reveal':
      return <CodeReveal block={block} onEngage={onEngage} />;
    case 'do-this':
      return <DoThis block={block} onEngage={onEngage} />;
    case 'secret':
      return (
        <Secret
          block={block}
          onOpen={() => {
            onEngage();
            onSecret(block.id);
          }}
        />
      );
    default:
      return null;
  }
}

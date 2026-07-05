'use client';

/**
 * Artifact registry: manifests reference artifacts by key, blocks resolve
 * them here. Adding a new showpiece = one component + one registry line.
 */

import type { ComponentType } from 'react';
import type { ArtifactProps } from '@/lib/learn/artifacts/types';
import { HeroBlueprintArtifact } from '@/lib/learn/artifacts/hero-blueprint';
import { LabPromptCardArtifact } from '@/lib/learn/artifacts/lab-prompt-card';
import { TrajectSiteArtifact } from '@/lib/learn/artifacts/traject-site';

const ARTIFACTS: Record<string, ComponentType<ArtifactProps>> = {
  'hero-blueprint': HeroBlueprintArtifact,
  'lab-prompt-card': LabPromptCardArtifact,
  'traject-site': TrajectSiteArtifact,
};

export function resolveArtifact(key: string): ComponentType<ArtifactProps> | null {
  return ARTIFACTS[key] ?? null;
}

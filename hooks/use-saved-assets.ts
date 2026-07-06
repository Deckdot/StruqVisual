'use client';

import { useSavedAssetsContext } from '@/components/providers/saved-assets-provider';

export function useSavedAssets() {
  return useSavedAssetsContext();
}

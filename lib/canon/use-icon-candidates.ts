'use client';

// lib/canon/use-icon-candidates.ts
//
// Imported Iconify candidate sets, persisted to localStorage until the DB lands
// in M2 (mirrors hooks/use-saved-assets.ts). In DesignOS these are Prisma
// ImportedIconCandidate rows surfaced through the repository; here they live in
// the browser and merge with the static canon in the Icons tab. useSyncExternalStore
// keeps every consumer in sync without a provider.

import { useCallback, useSyncExternalStore } from 'react';
import type { IconSet } from './types';

const STORAGE_KEY = 'struq_icon_candidates_v1';
const CHANGE_EVENT = 'struq:icon-candidates-changed';

let cache: { raw: string | null; sets: readonly IconSet[] } = { raw: null, sets: [] };

function getSnapshot(): readonly IconSet[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return cache.sets;
  }
  if (raw !== cache.raw) {
    try {
      cache = { raw, sets: raw ? (JSON.parse(raw) as IconSet[]) : [] };
    } catch {
      cache = { raw, sets: [] };
    }
  }
  return cache.sets;
}

const EMPTY: readonly IconSet[] = [];
function getServerSnapshot(): readonly IconSet[] {
  return EMPTY;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener('storage', callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function persist(sets: IconSet[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sets));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // non-fatal
  }
}

export function useIconCandidates() {
  const candidates = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addCandidate = useCallback((set: IconSet) => {
    const current = getSnapshot();
    // Replace on id collision so re-importing updates rather than duplicates.
    const next = [...current.filter((s) => s.id !== set.id), { ...set, source: 'candidate' as const }];
    persist(next);
  }, []);

  const removeCandidate = useCallback((id: string) => {
    const next = getSnapshot().filter((s) => s.id !== id);
    persist(next);
  }, []);

  return { candidates, addCandidate, removeCandidate } as const;
}

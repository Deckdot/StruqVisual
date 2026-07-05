'use client';

/**
 * Saved assets (favorites) in localStorage until the DB lands in M2.
 * useSyncExternalStore keeps every consumer (cards, nav badge, saved view)
 * in sync across the app without a provider.
 */

import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'struq_saved_assets_v1';
const CHANGE_EVENT = 'struq:saved-assets-changed';

let cache: { raw: string | null; ids: readonly string[] } = { raw: null, ids: [] };

function getSnapshot(): readonly string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return cache.ids;
  }
  if (raw !== cache.raw) {
    try {
      cache = { raw, ids: raw ? (JSON.parse(raw) as string[]) : [] };
    } catch {
      cache = { raw, ids: [] };
    }
  }
  return cache.ids;
}

const EMPTY: readonly string[] = [];
function getServerSnapshot(): readonly string[] {
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

export function useSavedAssets() {
  const savedIds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleSaved = useCallback((id: string): boolean => {
    const current = getSnapshot();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(CHANGE_EVENT));
    } catch {
      // non-fatal
    }
    return next.length > current.length;
  }, []);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  return { savedIds, isSaved, toggleSaved } as const;
}

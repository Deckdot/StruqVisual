'use client';

/**
 * Saved assets (favorites).
 *
 * Two paths, chosen at runtime:
 *  - Signed-in (a `struq_uid` session cookie exists → /api/favorites returns a
 *    list): the DB is the source of truth; toggles POST to the route handler.
 *  - Signed-out (route returns 401): localStorage, exactly as before. This keeps
 *    the signed-out experience unchanged while the DB path is wired for M5.
 *
 * useSyncExternalStore keeps every localStorage consumer (cards, nav badge,
 * saved view) in sync across the app without a provider; the DB path layers a
 * small React state store on top with the same public API.
 */

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

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
  const localIds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // DB mode is null until the session probe resolves; stays null when signed out.
  const [dbIds, setDbIds] = useState<readonly string[] | null>(null);
  const dbMode = dbIds !== null;
  const dbModeRef = useRef(false);
  dbModeRef.current = dbMode;

  useEffect(() => {
    let active = true;
    fetch('/api/favorites')
      .then((res) => (res.ok ? res.json() : { savedIds: null }))
      .then((data: { savedIds: string[] | null }) => {
        if (active && Array.isArray(data.savedIds)) setDbIds(data.savedIds);
      })
      .catch(() => {
        /* offline → stay on localStorage */
      });
    return () => {
      active = false;
    };
  }, []);

  const savedIds = (dbIds ?? localIds) as readonly string[];

  const toggleSaved = useCallback((id: string): boolean => {
    if (dbModeRef.current) {
      let nowSaved = false;
      setDbIds((prev) => {
        const current = prev ?? [];
        nowSaved = !current.includes(id);
        return nowSaved ? [...current, id] : current.filter((x) => x !== id);
      });
      // Fire-and-forget; the optimistic state above already updated the UI.
      fetch('/api/favorites', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ assetId: id }),
      }).catch(() => {
        /* non-fatal; a reload re-syncs from the DB */
      });
      return nowSaved;
    }

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

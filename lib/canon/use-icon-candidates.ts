'use client';

// lib/canon/use-icon-candidates.ts
//
// Imported Iconify candidate sets. Two paths, chosen at runtime (mirrors
// hooks/use-saved-assets.ts):
//  - Signed-in (a struq_uid cookie exists → /api/icon-candidates returns a list):
//    the DB is the source of truth; add/remove hit the route handler.
//  - Signed-out (route returns 401): localStorage, exactly as before.
// In DesignOS these are Prisma ImportedIconCandidate rows; here the DB path is
// wired and dormant until M5 issues the session cookie. useSyncExternalStore
// keeps localStorage consumers in sync; the DB path layers React state on top.

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
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
  const localSets = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const [dbSets, setDbSets] = useState<readonly IconSet[] | null>(null);
  const dbModeRef = useRef(false);
  dbModeRef.current = dbSets !== null;

  useEffect(() => {
    let active = true;
    fetch('/api/icon-candidates')
      .then((res) => (res.ok ? res.json() : { candidates: null }))
      .then((data: { candidates: IconSet[] | null }) => {
        if (active && Array.isArray(data.candidates)) setDbSets(data.candidates);
      })
      .catch(() => {
        /* offline → stay on localStorage */
      });
    return () => {
      active = false;
    };
  }, []);

  const candidates = (dbSets ?? localSets) as readonly IconSet[];

  const addCandidate = useCallback((set: IconSet) => {
    const withSource = { ...set, source: 'candidate' as const };
    if (dbModeRef.current) {
      // Replace on id collision so re-importing updates rather than duplicates.
      setDbSets((prev) => [...(prev ?? []).filter((s) => s.id !== set.id), withSource]);
      fetch('/api/icon-candidates', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(withSource),
      }).catch(() => {
        /* non-fatal; a reload re-syncs from the DB */
      });
      return;
    }
    const next = [...getSnapshot().filter((s) => s.id !== set.id), withSource];
    persist(next);
  }, []);

  const removeCandidate = useCallback((id: string) => {
    if (dbModeRef.current) {
      setDbSets((prev) => (prev ?? []).filter((s) => s.id !== id));
      fetch(`/api/icon-candidates?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {
        /* non-fatal */
      });
      return;
    }
    const next = getSnapshot().filter((s) => s.id !== id);
    persist(next);
  }, []);

  return { candidates, addCandidate, removeCandidate } as const;
}

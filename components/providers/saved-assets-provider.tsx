'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'struq_saved_assets_v1';
const CHANGE_EVENT = 'struq:saved-assets-changed';

type SavedAssetsContextValue = {
  dbMode: boolean;
  savedIds: readonly string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => boolean;
};

const SavedAssetsContext = createContext<SavedAssetsContextValue | null>(null);

function readLocalSavedIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeLocalSavedIds(ids: readonly string[]) {
  try {
    if (ids.length === 0) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // local persistence is best-effort only
  }
}

export function SavedAssetsProvider({
  children,
  initialSavedIds,
  userId,
}: {
  children: ReactNode;
  initialSavedIds: string[];
  userId: string | null;
}) {
  const dbMode = Boolean(userId);
  const migrationStarted = useRef(false);
  const [savedIds, setSavedIds] = useState<readonly string[]>(() =>
    dbMode ? initialSavedIds : readLocalSavedIds()
  );

  useEffect(() => {
    if (dbMode) {
      setSavedIds(initialSavedIds);
      return;
    }

    const syncFromLocal = () => setSavedIds(readLocalSavedIds());
    syncFromLocal();
    window.addEventListener('storage', syncFromLocal);
    window.addEventListener(CHANGE_EVENT, syncFromLocal);
    return () => {
      window.removeEventListener('storage', syncFromLocal);
      window.removeEventListener(CHANGE_EVENT, syncFromLocal);
    };
  }, [dbMode, initialSavedIds]);

  useEffect(() => {
    if (!dbMode || migrationStarted.current) return;

    const localIds = readLocalSavedIds();
    if (localIds.length === 0) return;

    migrationStarted.current = true;

    fetch('/api/favorites', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ assetIds: localIds }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { savedIds?: string[] } | null) => {
        if (!data?.savedIds) return;
        setSavedIds(data.savedIds);
        writeLocalSavedIds([]);
      })
      .catch(() => {
        migrationStarted.current = false;
      });
  }, [dbMode]);

  const toggleSaved = useCallback(
    (id: string): boolean => {
      if (dbMode) {
        let nowSaved = false;
        setSavedIds((prev) => {
          nowSaved = !prev.includes(id);
          return nowSaved ? [...prev, id] : prev.filter((x) => x !== id);
        });

        fetch('/api/favorites', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ assetId: id }),
        }).catch(() => {
          // optimistic state re-syncs on next navigation / reload
        });

        return nowSaved;
      }

      const current = readLocalSavedIds();
      const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
      writeLocalSavedIds(next);
      setSavedIds(next);
      return next.length > current.length;
    },
    [dbMode]
  );

  const value: SavedAssetsContextValue = {
    dbMode,
    savedIds,
    isSaved: (id: string) => savedIds.includes(id),
    toggleSaved,
  };

  return <SavedAssetsContext.Provider value={value}>{children}</SavedAssetsContext.Provider>;
}

export function useSavedAssetsContext(): SavedAssetsContextValue {
  const value = useContext(SavedAssetsContext);
  if (!value) {
    throw new Error('useSavedAssets must be used inside SavedAssetsProvider.');
  }
  return value;
}

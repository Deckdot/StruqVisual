'use client';

// lib/recept/use-recept-draft.ts
//
// The one state hook for the Recept-bouwer (repo convention: React state +
// localStorage, no store library — mirrors use-icon-candidates / use-saved-assets).
// Owns the working draft, the saved-recipes list, localStorage persistence, and
// ?basis= hydration. State is tiny, so the orchestrator prop-drills it two levels
// rather than reaching for a context.
//
// Persistence keys are shaped like the future kits rows (handoff D5) so the backend
// slice is a fetch-swap here, not a UI rewrite:
//   struq_recept_draft_v1  — the working draft, auto-saved on every change
//   struq_recepten_v1      — explicitly saved recipes

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DEFAULT_DRAFT, buildBasisDraft, autoName } from './defaults';
import type { ReceptDraft, SavedRecept } from './types';
import type { IconSet } from '@/lib/canon/types';

const DRAFT_KEY = 'struq_recept_draft_v1';
const SAVED_KEY = 'struq_recepten_v1';

function readDraft(): ReceptDraft | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ReceptDraft>;
    if (!parsed.paletteId || !parsed.typographyId || !parsed.iconSetId) return null;
    return {
      name: parsed.name ?? '',
      paletteId: parsed.paletteId,
      typographyId: parsed.typographyId,
      iconSetId: parsed.iconSetId,
    };
  } catch {
    return null;
  }
}

function readSaved(): SavedRecept[] {
  try {
    const raw = window.localStorage.getItem(SAVED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedRecept[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage unavailable → session-only state, no error surface.
  }
}

export type ReceptDraftApi = {
  draft: ReceptDraft;
  saved: SavedRecept[];
  hydrated: boolean;
  setPalette: (id: string) => void;
  setTypography: (id: string) => void;
  setIconSet: (id: string) => void;
  setName: (name: string) => void;
  applyDraft: (next: ReceptDraft) => void;
  saveCurrent: (candidates?: readonly IconSet[]) => SavedRecept;
  loadSaved: (id: string) => void;
  deleteSaved: (id: string) => void;
  renameSaved: (id: string, name: string) => void;
};

export function useReceptDraft(): ReceptDraftApi {
  const searchParams = useSearchParams();
  const basis = searchParams.get('basis');

  const [draft, setDraft] = useState<ReceptDraft>(DEFAULT_DRAFT);
  const [saved, setSaved] = useState<SavedRecept[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const basisApplied = useRef(false);

  // Hydrate once on mount: ?basis= wins over a stored draft (an explicit intent to
  // start from a canon recipe), otherwise restore the auto-saved draft.
  useEffect(() => {
    setSaved(readSaved());
    if (basis) {
      setDraft(buildBasisDraft(basis));
      basisApplied.current = true;
    } else {
      const stored = readDraft();
      if (stored) setDraft(stored);
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save the draft on every change (nobody loses work), but only after hydration
  // so we never clobber a stored draft with the default on first paint.
  useEffect(() => {
    if (!hydrated) return;
    persist(DRAFT_KEY, draft);
  }, [draft, hydrated]);

  const setPalette = useCallback((id: string) => setDraft((d) => ({ ...d, paletteId: id })), []);
  const setTypography = useCallback((id: string) => setDraft((d) => ({ ...d, typographyId: id })), []);
  const setIconSet = useCallback((id: string) => setDraft((d) => ({ ...d, iconSetId: id })), []);
  const setName = useCallback((name: string) => setDraft((d) => ({ ...d, name })), []);
  const applyDraft = useCallback((next: ReceptDraft) => setDraft(next), []);

  const persistSaved = useCallback((next: SavedRecept[]) => {
    setSaved(next);
    persist(SAVED_KEY, next);
  }, []);

  const saveCurrent = useCallback(
    (candidates: readonly IconSet[] = []): SavedRecept => {
      const name = draft.name.trim() || autoName(draft, candidates);
      const entry: SavedRecept = {
        id: `recept_${Date.now().toString(36)}`,
        name,
        paletteId: draft.paletteId,
        typographyId: draft.typographyId,
        iconSetId: draft.iconSetId,
        updatedAt: Date.now(),
      };
      setDraft((d) => ({ ...d, name }));
      persistSaved([entry, ...readSaved()]);
      return entry;
    },
    [draft, persistSaved],
  );

  const loadSaved = useCallback((id: string) => {
    const entry = readSaved().find((r) => r.id === id);
    if (!entry) return;
    setDraft({
      name: entry.name,
      paletteId: entry.paletteId,
      typographyId: entry.typographyId,
      iconSetId: entry.iconSetId,
    });
  }, []);

  const deleteSaved = useCallback(
    (id: string) => persistSaved(readSaved().filter((r) => r.id !== id)),
    [persistSaved],
  );

  const renameSaved = useCallback(
    (id: string, name: string) =>
      persistSaved(readSaved().map((r) => (r.id === id ? { ...r, name, updatedAt: Date.now() } : r))),
    [persistSaved],
  );

  return {
    draft,
    saved,
    hydrated,
    setPalette,
    setTypography,
    setIconSet,
    setName,
    applyDraft,
    saveCurrent,
    loadSaved,
    deleteSaved,
    renameSaved,
  };
}

'use client';

/**
 * Progressive disclosure (psychology skill: goal-gradient, never regress).
 * The disclosure level starts at 0, is raised by real usage milestones and
 * persists the highest level reached — surfaces are earned, never re-hidden.
 *
 * Level 0: browse + save + copy (the frictionless floor)
 * Level 1: after the first save — filters, saved view, kits teaser
 * Level 2: after 3 saves or 3 copies — kits, MCP teaser
 */

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'struq_maturity_v1';

export type Surface = 'filters' | 'saved-view' | 'kits' | 'mcp-teaser';

const SURFACE_LEVEL: Record<Surface, number> = {
  filters: 1,
  'saved-view': 1,
  kits: 2,
  'mcp-teaser': 2,
};

type Milestones = { saves: number; copies: number };

type MaturityContextValue = {
  level: number;
  canSee: (surface: Surface) => boolean;
  recordSave: () => void;
  recordCopy: () => void;
};

const MaturityContext = createContext<MaturityContextValue | null>(null);

function levelFor(m: Milestones): number {
  if (m.saves >= 3 || m.copies >= 3) return 2;
  if (m.saves >= 1) return 1;
  return 0;
}

function readStored(): { level: number; milestones: Milestones } {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { level?: number; milestones?: Partial<Milestones> };
      return {
        level: parsed.level ?? 0,
        milestones: { saves: parsed.milestones?.saves ?? 0, copies: parsed.milestones?.copies ?? 0 },
      };
    }
  } catch {
    // localStorage unavailable: session-only disclosure
  }
  return { level: 0, milestones: { saves: 0, copies: 0 } };
}

export function MaturityProvider({ children }: { children: ReactNode }) {
  const [level, setLevel] = useState(0);
  const [milestones, setMilestones] = useState<Milestones>({ saves: 0, copies: 0 });

  useEffect(() => {
    const stored = readStored();
    setMilestones(stored.milestones);
    setLevel(Math.max(stored.level, levelFor(stored.milestones)));
  }, []);

  const persist = useCallback((nextMilestones: Milestones) => {
    setMilestones(nextMilestones);
    setLevel((current) => {
      const next = Math.max(current, levelFor(nextMilestones));
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ level: next, milestones: nextMilestones }));
      } catch {
        // non-fatal
      }
      return next;
    });
  }, []);

  const recordSave = useCallback(() => {
    persist({ ...milestones, saves: milestones.saves + 1 });
  }, [milestones, persist]);

  const recordCopy = useCallback(() => {
    persist({ ...milestones, copies: milestones.copies + 1 });
  }, [milestones, persist]);

  const canSee = useCallback((surface: Surface) => level >= SURFACE_LEVEL[surface], [level]);

  return (
    <MaturityContext.Provider value={{ level, canSee, recordSave, recordCopy }}>
      {children}
    </MaturityContext.Provider>
  );
}

export function useMaturity(): MaturityContextValue {
  const ctx = useContext(MaturityContext);
  if (!ctx) throw new Error('useMaturity must be used within a MaturityProvider');
  return ctx;
}

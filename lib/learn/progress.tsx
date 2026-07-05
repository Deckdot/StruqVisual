'use client';

/**
 * Struq Learn 2.0 — progress engine.
 *
 * Anonymous-first: everything lives in localStorage so learning starts with
 * zero friction. Progress only ever accumulates (no streaks, no decay, no
 * guilt mechanics). The opening reveal counts as a completed step so nobody
 * ever starts at 0% (endowed progress).
 *
 * `stashPendingClaim` + `takePendingClaim` carry an artifact claim across the
 * signup redirect, so "bewaar in je vault" survives authentication.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { identityForClaims, type IdentityLevel, type LessonManifest } from '@/lib/learn/schema';

const STORAGE_KEY = 'struq.learn.v1';
const PENDING_CLAIM_KEY = 'struq.learn.pending-claim';

export interface LessonProgress {
  startedAt: number;
  openingSeen: boolean;
  steps: Record<string, true>;
  /** Scene index in the guided player, so returning resumes exactly there. */
  sceneIndex?: number;
  completedAt?: number;
  claimed?: boolean;
  secrets: string[];
}

interface LearnState {
  v: 1;
  lessons: Record<string, LessonProgress>;
}

const EMPTY_STATE: LearnState = { v: 1, lessons: {} };

function readState(): LearnState {
  if (typeof window === 'undefined') return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as LearnState;
    if (parsed?.v !== 1 || typeof parsed.lessons !== 'object') return EMPTY_STATE;
    return parsed;
  } catch {
    return EMPTY_STATE;
  }
}

function writeState(state: LearnState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable: progress simply stays in memory this session.
  }
}

function emptyLesson(): LessonProgress {
  return { startedAt: Date.now(), openingSeen: false, steps: {}, secrets: [] };
}

/* ------------------------------------------------------------- pending claim */

export interface PendingClaim {
  slug: string;
}

export function stashPendingClaim(claim: PendingClaim) {
  try {
    window.localStorage.setItem(PENDING_CLAIM_KEY, JSON.stringify(claim));
  } catch {
    // Ignore: the user can claim again after signing in.
  }
}

export function takePendingClaim(): PendingClaim | null {
  try {
    const raw = window.localStorage.getItem(PENDING_CLAIM_KEY);
    if (!raw) return null;
    window.localStorage.removeItem(PENDING_CLAIM_KEY);
    const parsed = JSON.parse(raw) as PendingClaim;
    return parsed?.slug ? parsed : null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ context */

interface LearnProgressContextValue {
  /** Null until hydrated, so SSR and first paint never mismatch. */
  ready: boolean;
  lessons: Record<string, LessonProgress>;
  identity: IdentityLevel;
  claimCount: number;
  markOpeningSeen: (slug: string) => void;
  markStep: (slug: string, stepId: string) => void;
  setSceneIndex: (slug: string, index: number) => void;
  markComplete: (slug: string) => void;
  markClaimed: (slug: string) => void;
  foundSecret: (slug: string, secretId: string) => void;
}

const LearnProgressContext = createContext<LearnProgressContextValue | null>(null);

export function LearnProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LearnState>(EMPTY_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(readState());
    setReady(true);
  }, []);

  const update = useCallback(
    (slug: string, mutate: (lesson: LessonProgress) => LessonProgress) => {
      setState((current) => {
        const lesson = current.lessons[slug] ?? emptyLesson();
        const next: LearnState = {
          ...current,
          lessons: { ...current.lessons, [slug]: mutate(lesson) },
        };
        writeState(next);
        return next;
      });
    },
    []
  );

  const markOpeningSeen = useCallback(
    (slug: string) => update(slug, (l) => (l.openingSeen ? l : { ...l, openingSeen: true })),
    [update]
  );

  const markStep = useCallback(
    (slug: string, stepId: string) =>
      update(slug, (l) => (l.steps[stepId] ? l : { ...l, steps: { ...l.steps, [stepId]: true } })),
    [update]
  );

  const setSceneIndex = useCallback(
    (slug: string, index: number) =>
      update(slug, (l) => (l.sceneIndex === index ? l : { ...l, sceneIndex: index })),
    [update]
  );

  const markComplete = useCallback(
    (slug: string) =>
      update(slug, (l) => (l.completedAt ? l : { ...l, completedAt: Date.now() })),
    [update]
  );

  const markClaimed = useCallback(
    (slug: string) => update(slug, (l) => (l.claimed ? l : { ...l, claimed: true })),
    [update]
  );

  const foundSecret = useCallback(
    (slug: string, secretId: string) =>
      update(slug, (l) =>
        l.secrets.includes(secretId) ? l : { ...l, secrets: [...l.secrets, secretId] }
      ),
    [update]
  );

  const claimCount = useMemo(
    () => Object.values(state.lessons).filter((l) => l.claimed).length,
    [state.lessons]
  );

  const value = useMemo<LearnProgressContextValue>(
    () => ({
      ready,
      lessons: state.lessons,
      identity: identityForClaims(claimCount),
      claimCount,
      markOpeningSeen,
      markStep,
      setSceneIndex,
      markComplete,
      markClaimed,
      foundSecret,
    }),
    [ready, state.lessons, claimCount, markOpeningSeen, markStep, setSceneIndex, markComplete, markClaimed, foundSecret]
  );

  return <LearnProgressContext.Provider value={value}>{children}</LearnProgressContext.Provider>;
}

export function useLearnProgress(): LearnProgressContextValue {
  const ctx = useContext(LearnProgressContext);
  if (!ctx) throw new Error('useLearnProgress must be used inside LearnProgressProvider');
  return ctx;
}

/**
 * Percent complete for a lesson. The opening reveal counts as one unit, so
 * simply watching the end result already moves the needle (endowed progress).
 */
export function lessonPercent(manifest: LessonManifest, progress?: LessonProgress): number {
  const total = manifest.steps.length + 1;
  if (!progress) return 0;
  const done =
    (progress.openingSeen ? 1 : 0) +
    manifest.steps.filter((s) => progress.steps[s.id]).length;
  if (progress.completedAt) return 100;
  return Math.round((done / total) * 100);
}

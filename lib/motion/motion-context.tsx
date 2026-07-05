'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  type MotionLevel,
  checkBatterySignal,
  detectInitialMotionLevel,
  prefersReducedMotion,
  watchReducedMotion,
  writeStoredPreference,
} from './detect-performance';

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

interface MotionPreferenceContextValue {
  /**
   * True if ANY signal says animations should be reduced or eliminated.
   * Use this as the primary gate in components.
   */
  reducedMotion: boolean;

  /**
   * Full resolution of the current motion level:
   *   "full"        — all animations on
   *   "reduced"     — decorative/infinite off, essential transitions kept
   *   "performance" — full kill (user toggle, auto-detect, or device heuristic)
   */
  motionLevel: MotionLevel;

  /**
   * True only when Performance Mode was explicitly activated by the user or
   * auto-detected from device heuristics (not just OS prefers-reduced-motion).
   */
  performanceMode: boolean;

  /**
   * True when Performance Mode was activated because of OS prefers-reduced-motion,
   * not a user toggle. Use to show "controlled by your OS" messaging in settings.
   */
  osReducedMotion: boolean;

  /** Set by the user-facing toggle. Persisted to localStorage. */
  setPerformanceMode: (enabled: boolean) => void;
}

const MotionPreferenceContext = createContext<MotionPreferenceContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

/**
 * Wraps the app to provide motion preference state.
 * Also writes `data-motion` on <html> so CSS can respond without JS in flight.
 *
 * Levels written to the html attribute:
 *   data-motion="full"        — default
 *   data-motion="reduced"     — OS pref only
 *   data-motion="performance" — full kill
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [motionLevel, setMotionLevel] = useState<MotionLevel>('full');
  // Track whether initial detection has run (SSR safe)
  const initialised = useRef(false);

  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;

    // Synchronous detection on mount
    setMotionLevel(detectInitialMotionLevel());

    // Watch for OS pref changes at runtime
    const unwatch = watchReducedMotion((isReduced) => {
      setMotionLevel((prev) => {
        // Only change level when OS switches — don't override user's explicit perf toggle
        if (prev === 'performance') return prev;
        return isReduced ? 'reduced' : 'full';
      });
    });

    // Async: battery signal — only upgrade, never downgrade
    checkBatterySignal(() => {
      setMotionLevel((prev) => (prev === 'full' ? 'performance' : prev));
    });

    return () => unwatch();
  }, []);

  // Apply data-motion attribute to <html> on every level change
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-motion', motionLevel);
    }
  }, [motionLevel]);

  const setPerformanceMode = useCallback((enabled: boolean) => {
    writeStoredPreference(enabled);
    setMotionLevel((prev) => {
      if (enabled) return 'performance';
      // When user turns it off, fall back to OS pref if active
      return prefersReducedMotion() ? 'reduced' : 'full';
    });
  }, []);

  const value = useMemo<MotionPreferenceContextValue>(
    () => ({
      reducedMotion: motionLevel !== 'full',
      motionLevel,
      performanceMode: motionLevel === 'performance',
      osReducedMotion: motionLevel === 'reduced',
      setPerformanceMode,
    }),
    [motionLevel, setPerformanceMode]
  );

  return (
    <MotionPreferenceContext.Provider value={value}>
      {children}
    </MotionPreferenceContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Consume the current motion preference in any client component.
 *
 * @example
 * const { reducedMotion } = useMotionPreference();
 * if (reducedMotion) return <StaticFallback />;
 */
export function useMotionPreference(): MotionPreferenceContextValue {
  const ctx = useContext(MotionPreferenceContext);
  if (!ctx) {
    // Graceful fallback — return "full motion" so SSR and tests don't crash
    return {
      reducedMotion: false,
      motionLevel: 'full',
      performanceMode: false,
      osReducedMotion: false,
      setPerformanceMode: () => {},
    };
  }
  return ctx;
}

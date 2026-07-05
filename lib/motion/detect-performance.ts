'use client';

/**
 * Struq Performance Mode detection.
 *
 * Priority order (highest wins, never downgraded by lower-priority signals):
 *   Tier 1 — User declared  (localStorage override, OS prefers-reduced-motion)
 *   Tier 2 — Device class   (CPU cores, RAM, network saveData, 2g)
 *   Tier 3 — Runtime        (battery level, FPS < 30 for 3s, Long Tasks)
 *
 * Returns immediately — all signals are evaluated synchronously where possible.
 * Battery and network signals are evaluated lazily via callbacks.
 */

export type MotionLevel = 'full' | 'reduced' | 'performance';

const LS_KEY = 'struq:perf-mode';

/** Read the user's explicit localStorage override, if any. */
export function readStoredPreference(): boolean | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = localStorage.getItem(LS_KEY);
    if (v === 'on') return true;
    if (v === 'off') return false;
    return null;
  } catch {
    return null;
  }
}

/** Persist the user's explicit preference. */
export function writeStoredPreference(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LS_KEY, enabled ? 'on' : 'off');
  } catch {
    // noop
  }
}

/** True when the OS or browser reports prefers-reduced-motion: reduce. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Tier-2 heuristic: synchronous device-class signals.
 * Returns true if the device appears low-performance.
 */
export function detectLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false;

  const nav = navigator as Navigator & {
    hardwareConcurrency?: number;
    deviceMemory?: number;
    connection?: {
      effectiveType?: string;
      saveData?: boolean;
    };
  };

  if ((nav.hardwareConcurrency ?? Infinity) <= 2) return true;
  if ((nav.deviceMemory ?? Infinity) <= 2) return true;

  const conn = nav.connection;
  if (conn?.saveData === true) return true;
  if (conn?.effectiveType === '2g' || conn?.effectiveType === 'slow-2g') return true;

  return false;
}

/**
 * Determine the initial MotionLevel before any runtime signals.
 * Called once at provider mount.
 *
 * "reduced"     — OS pref only; keep essential transitions, kill decorative infinite loops
 * "performance" — user forced on, or device heuristic triggered; full animation kill
 * "full"        — default
 */
export function detectInitialMotionLevel(): MotionLevel {
  if (typeof window === 'undefined') return 'full';

  // Tier 1a: user explicitly forced ON
  const stored = readStoredPreference();
  if (stored === true) return 'performance';

  // Tier 1b: user explicitly forced OFF — honour it even if OS says reduce
  if (stored === false) return 'full';

  // Tier 1c: OS preference (no user override)
  if (prefersReducedMotion()) return 'reduced';

  // Tier 2: device heuristics
  if (detectLowEndDevice()) return 'performance';

  return 'full';
}

/**
 * Subscribe to OS prefers-reduced-motion changes.
 * Returns an unsubscribe function.
 */
export function watchReducedMotion(cb: (reduced: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handler = (e: MediaQueryListEvent) => cb(e.matches);
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}

/**
 * Asynchronously check battery and fire cb(true) if battery is critically low.
 * Safe to call — gracefully no-ops in environments without the Battery API.
 */
export async function checkBatterySignal(cb: () => void): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const nav = navigator as Navigator & {
      getBattery?: () => Promise<{ level: number; charging: boolean }>;
    };
    if (!nav.getBattery) return;
    const battery = await nav.getBattery();
    if (battery.level < 0.2 && !battery.charging) cb();
  } catch {
    // Battery API not available — ignore
  }
}

// lib/handoff.ts
//
// The auth → dashboard handoff contract. Login success ends on a full-screen
// warm wash; the dashboard mounts a curtain in the SAME color, already covering
// the screen, then reveals the finished dashboard from underneath it. Because
// both sides agree on one color and one flag, the crossover has zero visible
// seam — no flash-drop, no cold dashboard frame, no loading wireframe.

/** Session flag set by auth right before router.push('/dashboard'). */
export const HANDOFF_KEY = 'handoff:dashboard';

/**
 * The warm wash color shared by the auth bloom and the dashboard curtain.
 * Picked from the auth supernova gradient's mid-stop so the two are identical.
 */
export const HANDOFF_WASH = '#ffe8cc';

export function markHandoff(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(HANDOFF_KEY, '1');
  } catch {
    // Private mode → dashboard falls back to its quiet cover. Acceptable.
  }
}

/** Reads AND clears the flag, so a later manual nav to /dashboard stays quiet. */
export function consumeHandoff(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const hit = sessionStorage.getItem(HANDOFF_KEY) === '1';
    if (hit) sessionStorage.removeItem(HANDOFF_KEY);
    return hit;
  } catch {
    return false;
  }
}

// components/site/loaders/use-first-visit.ts
//
// Per-session "play once" gate for first-load loaders. A loader given an `id`
// plays on the first visit this session and is skipped on later client navs —
// so the intro loader never stacks on top of the route curtain on every click.
// No `id` → always plays.

const PREFIX = 'loader:';

export function loaderSeen(id?: string): boolean {
  if (typeof window === 'undefined' || !id) return false;
  try {
    return sessionStorage.getItem(PREFIX + id) === '1';
  } catch {
    return false;
  }
}

export function markLoaderSeen(id?: string): void {
  if (typeof window === 'undefined' || !id) return;
  try {
    sessionStorage.setItem(PREFIX + id, '1');
  } catch {
    // Private mode → loader plays every time. Acceptable.
  }
}

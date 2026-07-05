'use client';

// components/providers/PageTransition.tsx
//
// Overlay-wipe page transitions — the robust "award site" approach.
//
// Flow on link click:
//   1. intercept → COVER (panel/columns/iris in) covers the screen
//   2. router.push(href) (old page unmounts, new mounts, hidden by the cover)
//   3. once the new route is committed → REVEAL (cover out) shows the new page
//
// VARIANTS (pass `variant` on <TransitionLink> or useTransitionRouter().push):
//   wipe-up (default) · wipe-down · wipe-left · wipe-right · columns · iris
// The default reproduces the bottom→top wipe.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap } from '@/components/site/motion';
import { cn } from '@/lib/utils';

export type TransitionVariant =
  | 'wipe-up'
  | 'wipe-down'
  | 'wipe-left'
  | 'wipe-right'
  | 'columns'
  | 'iris';

type NavOpts = { variant?: TransitionVariant; fillClass?: string };
type Ctx = { navigate: (href: string, opts?: NavOpts) => void };
const TransitionCtx = createContext<Ctx | null>(null);

const COLS = 6;
// Default fill is Struq's warm dark theme color (primary text) for high-contrast cinematic curtain
const DEFAULT_FILL = 'bg-[#221d15]'; // design-gate: ignore

export function useTransitionRouter() {
  const ctx = useContext(TransitionCtx);
  if (!ctx) {
    throw new Error('useTransitionRouter must be used within PageTransitionProvider');
  }
  return { push: ctx.navigate };
}

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Set the overlay's starting state for the chosen variant. Always renders both
// the single panel and the column track; we just show/reset the relevant one.
function prep(
  variant: TransitionVariant,
  panel: HTMLElement,
  colsWrap: HTMLElement,
  reduce: boolean
) {
  const useCols = !reduce && variant === 'columns';
  gsap.set(colsWrap, { autoAlpha: useCols ? 1 : 0 });
  gsap.set(panel, {
    autoAlpha: useCols ? 0 : 1,
    clipPath: !reduce && variant === 'iris' ? 'circle(0% at 50% 50%)' : 'none',
    scaleX: 1,
    scaleY: 1,
  });
}

// COVER — panel comes in, then fires onComplete (which triggers router.push).
function cover(
  variant: TransitionVariant,
  panel: HTMLElement,
  bars: HTMLElement[],
  reduce: boolean,
  onComplete: () => void
) {
  if (reduce) {
    return gsap.fromTo(panel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, onComplete });
  }
  const d = 0.6;
  const ease = 'power3.inOut';
  switch (variant) {
    case 'wipe-down':
      return gsap.fromTo(
        panel,
        { scaleY: 0, transformOrigin: 'top' },
        { scaleY: 1, duration: d, ease, onComplete }
      );
    case 'wipe-left':
      return gsap.fromTo(
        panel,
        { scaleX: 0, transformOrigin: 'right' },
        { scaleX: 1, duration: d, ease, onComplete }
      );
    case 'wipe-right':
      return gsap.fromTo(
        panel,
        { scaleX: 0, transformOrigin: 'left' },
        { scaleX: 1, duration: d, ease, onComplete }
      );
    case 'iris':
      return gsap.fromTo(
        panel,
        { clipPath: 'circle(0% at 50% 50%)' },
        {
          clipPath: 'circle(150% at 50% 50%)',
          duration: 0.7,
          ease: 'power2.inOut',
          onComplete,
        }
      );
    case 'columns':
      return gsap.fromTo(
        bars,
        { scaleY: 0, transformOrigin: 'bottom' },
        { scaleY: 1, duration: 0.5, ease, stagger: 0.06, onComplete }
      );
    case 'wipe-up':
    default:
      return gsap.fromTo(
        panel,
        { scaleY: 0, transformOrigin: 'bottom' },
        { scaleY: 1, duration: d, ease, onComplete }
      );
  }
}

// REVEAL — cover goes out from the covered state, uncovering the new page.
function reveal(
  variant: TransitionVariant,
  panel: HTMLElement,
  bars: HTMLElement[],
  reduce: boolean,
  onComplete: () => void
) {
  if (reduce) {
    return gsap.to(panel, { autoAlpha: 0, duration: 0.2, onComplete });
  }
  const d = 0.7;
  const ease = 'power3.inOut';
  const delay = 0.05; // let the new page paint under the cover first
  switch (variant) {
    case 'wipe-down':
      return gsap.to(panel, {
        scaleY: 0,
        transformOrigin: 'bottom',
        duration: d,
        ease,
        delay,
        onComplete,
      });
    case 'wipe-left':
      return gsap.to(panel, {
        scaleX: 0,
        transformOrigin: 'left',
        duration: d,
        ease,
        delay,
        onComplete,
      });
    case 'wipe-right':
      return gsap.to(panel, {
        scaleX: 0,
        transformOrigin: 'right',
        duration: d,
        ease,
        delay,
        onComplete,
      });
    case 'iris':
      return gsap.to(panel, {
        clipPath: 'circle(0% at 50% 50%)',
        duration: d,
        ease: 'power2.inOut',
        delay,
        onComplete,
      });
    case 'columns':
      return gsap.to(bars, {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 0.5,
        ease,
        stagger: 0.05,
        delay,
        onComplete,
      });
    case 'wipe-up':
    default:
      return gsap.to(panel, {
        scaleY: 0,
        transformOrigin: 'top',
        duration: d,
        ease,
        delay,
        onComplete,
      });
  }
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const cols = useRef<HTMLDivElement>(null);
  const pending = useRef<string | null>(null);
  const variantRef = useRef<TransitionVariant>('wipe-up');
  const [fill, setFill] = useState<string>(DEFAULT_FILL);
  const [covering, setCovering] = useState(false);

  // Reveal (cover out) whenever the path actually changes while covered.
  useEffect(() => {
    if (!covering) return;
    const p = panel.current;
    if (!p) return;
    const bars = cols.current ? gsap.utils.toArray<HTMLElement>(cols.current.children) : [];
    const t = reveal(variantRef.current, p, bars, prefersReduced(), () =>
      setCovering(false)
    );
    return () => {
      t.kill();
    };
  }, [pathname, covering]);

  const navigate = useCallback(
    (href: string, opts?: NavOpts) => {
      if (href === pathname) return;
      const p = panel.current;
      const c = cols.current;
      if (!p || !c) {
        router.push(href);
        return;
      }
      const variant = opts?.variant ?? 'wipe-up';
      variantRef.current = variant;
      setFill(opts?.fillClass ?? DEFAULT_FILL);
      const reduce = prefersReduced();
      const bars = gsap.utils.toArray<HTMLElement>(c.children);
      prep(variant, p, c, reduce);
      pending.current = href;
      setCovering(true);
      cover(variant, p, bars, reduce, () => {
        if (pending.current) router.push(pending.current);
        pending.current = null;
      });
    },
    [pathname, router]
  );

  return (
    <TransitionCtx.Provider value={{ navigate }}>
      {children}
      {/* Cover overlay. Restyle the fill per page navigation via `fillClass`. z above everything. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[10000]">
        <div
          ref={panel}
          style={{ transform: 'scaleY(0)' }}
          className={cn('absolute inset-0', fill)}
        />
        <div ref={cols} style={{ visibility: 'hidden' }} className="absolute inset-0 flex">
          {Array.from({ length: COLS }).map((_, i) => (
            <div
              key={i}
              style={{ transform: 'scaleY(0)' }}
              className={cn('h-full flex-1', fill)}
            />
          ))}
        </div>
      </div>
    </TransitionCtx.Provider>
  );
}

export function TransitionLink({
  href,
  children,
  className,
  variant,
  fillClass,
  ...rest
}: {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: TransitionVariant;
  fillClass?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children'>) {
  const { push } = useTransitionRouter();
  const router = useRouter();

  return (
    <a
      href={href}
      className={className}
      // Prefetch manually on hover/focus so route is ready when the curtain closes
      onPointerEnter={() => router.prefetch(href)}
      onFocus={() => router.prefetch(href)}
      onClick={(e) => {
        // Preserve default browser shortcuts (cmd+click, etc.)
        if (
          e.defaultPrevented ||
          e.button !== 0 ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey
        ) {
          return;
        }

        // If it's a hash link on the current page, let the default behavior (scroll) occur
        const cleanPathname = window.location.pathname;
        const [hrefPath, hrefHash] = href.split('#');
        const isCurrentPage =
          hrefPath === '' ||
          hrefPath === cleanPathname ||
          (hrefPath === '/' && cleanPathname === '/');

        if (hrefHash !== undefined && isCurrentPage) {
          return;
        }

        if (href === cleanPathname) {
          return;
        }

        e.preventDefault();
        push(href, { variant, fillClass });
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

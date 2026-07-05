'use client';

// components/site/brand/animated-wordmark.tsx
//
// Per-character clip-path reveal of the Struq wordmark. Each glyph sits at a
// faint base opacity, then a fill copy wipes up from a clipped baseline with a
// small stagger. Ported from the DesignOS AnimatedWordmark, retuned for Struq's
// display font + marketing tokens.
//
// Marketing register — uses the shared GSAP instance from components/site/motion.

import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '@/components/site/motion';

type AnimatedWordmarkProps = {
  text?: string;
  className?: string;
  fillColor?: string;
  baseOpacity?: number;
  initialDelayMs?: number;
  startOnInView?: boolean;
  style?: React.CSSProperties;
};

export function AnimatedWordmark({
  text = 'struq',
  className = '',
  fillColor = 'var(--sq-ink)',
  baseOpacity = 0.22,
  initialDelayMs = 0,
  startOnInView = false,
  style,
}: AnimatedWordmarkProps) {
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(!startOnInView);

  useEffect(() => {
    if (!startOnInView) {
      queueMicrotask(() => setHasEnteredView(true));
      return;
    }

    const node = rootRef.current;
    if (!node || hasEnteredView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        setHasEnteredView(true);
        observer.disconnect();
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasEnteredView, startOnInView]);

  useGSAP(
    () => {
      if (!rootRef.current || !hasEnteredView) return;

      const fills = rootRef.current.querySelectorAll('[data-wordmark-fill]');
      if (!fills.length) return;

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) {
        gsap.set(fills, { clipPath: 'inset(0% 0% 0% 0%)', yPercent: 0, opacity: 1 });
        return;
      }

      gsap.set(fills, {
        clipPath: 'inset(100% 0% 0% 0%)',
        yPercent: 10,
        opacity: 1,
        willChange: 'clip-path, transform',
      });

      gsap.to(fills, {
        clipPath: 'inset(0% 0% 0% 0%)',
        yPercent: 0,
        duration: 0.42,
        ease: 'power2.out',
        stagger: 0.045,
        delay: initialDelayMs / 1000,
      });
    },
    { scope: rootRef, dependencies: [hasEnteredView, initialDelayMs, text], revertOnUpdate: true }
  );

  return (
    <span ref={rootRef} aria-label={text} className={className} style={style}>
      <span className="inline-block whitespace-nowrap">
        {Array.from(text).map((char, index) => (
          <span key={`${char}-${index}`} className="relative inline-block">
            <span aria-hidden="true" style={{ opacity: baseOpacity }}>
              {char}
            </span>
            <span
              aria-hidden="true"
              data-wordmark-fill
              className="absolute inset-0"
              style={{ color: fillColor }}
            >
              {char}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}

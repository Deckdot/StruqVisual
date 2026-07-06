'use client';

// components/site/brand/animated-mark.tsx
//
// Struq brand mark with a split-apart / reassemble motion, ported from the
// DesignOS AnimatedBrandLogo. Three stacked layers drift apart (top ↗, bottom ↘,
// center a touch of scale) then reassemble with a small stagger — on a slow loop
// and on hover/focus. Respects prefers-reduced-motion and can defer until in view.
//
// The three layers are inline SVG (self-contained, no external assets, can never
// show a broken image). Swap in PNG layers later by replacing the <MarkLayers>
// markup — the animation targets `[data-mark-piece="top|center|bottom"]`.

import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '@/components/site/motion';

type MarkSize = 'navbar' | 'footer' | 'sidebar' | 'login';

type AnimatedMarkProps = {
  size?: MarkSize;
  alt?: string;
  animated?: boolean;
  loopDelayMs?: number;
  initialDelayMs?: number;
  startOnInView?: boolean;
  className?: string;
  /** Mark ink color — override on dark/inverse backgrounds so it stays visible. */
  color?: string;
};

const sizeClasses: Record<MarkSize, string> = {
  navbar: 'w-8 h-8',
  footer: 'w-10 h-10',
  sidebar: 'w-8 h-8',
  login: 'w-12 h-12',
};

const motionProfile: Record<MarkSize, { travel: number; rotation: number; scale: number }> = {
  navbar: { travel: 6, rotation: 7, scale: 1.015 },
  footer: { travel: 8, rotation: 8, scale: 1.018 },
  sidebar: { travel: 5, rotation: 6, scale: 1.012 },
  login: { travel: 8, rotation: 8, scale: 1.02 },
};

/** Three stacked layers forming the Struq mark — a lens/aperture silhouette. */
function MarkLayers() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" aria-hidden="true">
      {/* bottom — widest base bar */}
      <rect
        data-mark-piece="bottom"
        x="18"
        y="60"
        width="64"
        height="18"
        rx="9"
        fill="var(--sq-accent)"
        opacity="0.9"
      />
      {/* center — the core */}
      <rect
        data-mark-piece="center"
        x="26"
        y="41"
        width="48"
        height="18"
        rx="9"
        fill="currentColor"
      />
      {/* top — narrowest cap */}
      <rect
        data-mark-piece="top"
        x="34"
        y="22"
        width="32"
        height="18"
        rx="9"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
}

export function AnimatedMark({
  size = 'navbar',
  alt = 'Struq',
  animated = true,
  loopDelayMs = 7000,
  initialDelayMs = 0,
  startOnInView = false,
  className = '',
  color = 'var(--sq-ink)',
}: AnimatedMarkProps) {
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const stageRef = useRef<HTMLSpanElement | null>(null);
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
      if (!rootRef.current || !stageRef.current) return;

      const q = gsap.utils.selector(rootRef);
      const top = q('[data-mark-piece="top"]')[0];
      const center = q('[data-mark-piece="center"]')[0];
      const bottom = q('[data-mark-piece="bottom"]')[0];
      if (!top || !center || !bottom) return;

      const pieces = [top, center, bottom];
      const { travel, rotation, scale } = motionProfile[size];
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      gsap.set(stageRef.current, { scale: 1, transformOrigin: '50% 50%' });
      gsap.set(pieces, {
        x: 0,
        y: 0,
        rotation: 0,
        transformOrigin: '50% 50%',
        force3D: true,
      });

      if (!animated || reduce || !hasEnteredView) return;

      gsap.set([stageRef.current, ...pieces], { willChange: 'transform, opacity' });

      const tl = gsap.timeline({ paused: true });
      tl.addLabel('assembled')
        .to(top, { x: -travel, y: -travel * 0.8, rotation: -rotation, duration: 0.34, ease: 'power3.out' })
        .to(bottom, { x: travel * 0.9, y: travel, rotation, duration: 0.34, ease: 'power3.out' }, '-=0.16')
        .to(
          center,
          { x: travel * 0.16, y: -travel * 0.12, rotation: rotation * 0.12, opacity: 0.93, duration: 0.28, ease: 'power2.out' },
          '-=0.12'
        )
        .to(stageRef.current, { scale, duration: 0.26, ease: 'power2.out' }, '-=0.2');

      tl.addLabel('expanded')
        .to([top, bottom, center], { x: 0, y: 0, rotation: 0, duration: 0.72, ease: 'power2.inOut', stagger: 0.03 }, '>')
        .to(center, { opacity: 1, duration: 0.56, ease: 'power2.inOut' }, '<')
        .to(stageRef.current, { scale: 1, duration: 0.56, ease: 'power2.inOut' }, '<');

      let isHovered = false;
      let nextLoop: gsap.core.Tween | null = null;
      let stateTween: gsap.core.Animation | null = null;

      const clearLoop = () => {
        nextLoop?.kill();
        nextLoop = null;
      };
      const clearStateTween = () => {
        stateTween?.kill();
        stateTween = null;
      };
      const scheduleLoop = (delaySeconds: number) => {
        clearLoop();
        nextLoop = gsap.delayedCall(delaySeconds, () => {
          if (isHovered) return;
          tl.restart();
        });
      };

      tl.eventCallback('onComplete', () => {
        tl.pause(0);
        if (!isHovered) scheduleLoop(loopDelayMs / 1000);
      });

      const tweenToExpanded = (duration = 0.48) => {
        tl.pause();
        return gsap
          .timeline({ defaults: { duration, ease: 'power2.out', overwrite: 'auto' } })
          .to(top, { x: -travel, y: -travel * 0.8, rotation: -rotation }, 0)
          .to(bottom, { x: travel * 0.9, y: travel, rotation }, 0.06)
          .to(center, { x: travel * 0.16, y: -travel * 0.12, rotation: rotation * 0.12, opacity: 0.93, duration: duration * 0.92 }, 0.1)
          .to(stageRef.current, { scale, duration: duration * 0.88 }, 0.08);
      };
      const tweenToAssembled = (duration = 0.6) => {
        tl.pause();
        return gsap
          .timeline({ defaults: { duration, ease: 'power2.inOut', overwrite: 'auto' } })
          .to([top, bottom, center], { x: 0, y: 0, rotation: 0 }, 0)
          .to(center, { opacity: 1, duration: duration * 0.84 }, 0)
          .to(stageRef.current, { scale: 1, duration: duration * 0.84 }, 0);
      };

      const moveToExpanded = () => {
        clearLoop();
        clearStateTween();
        stateTween = tweenToExpanded();
        stateTween?.eventCallback('onComplete', () => tl.pause());
      };
      const moveToAssembled = () => {
        clearLoop();
        clearStateTween();
        stateTween = tweenToAssembled();
        stateTween?.eventCallback('onComplete', () => {
          tl.pause(0);
          if (!isHovered) scheduleLoop(loopDelayMs / 1000);
        });
      };

      const handleEnter = () => {
        isHovered = true;
        moveToExpanded();
      };
      const handleLeave = () => {
        isHovered = false;
        moveToAssembled();
      };

      const element = rootRef.current;
      if (!element) return;

      if (initialDelayMs <= 0) {
        nextLoop = gsap.delayedCall(0, () => {
          if (isHovered) return;
          tl.restart();
        });
      } else {
        scheduleLoop(initialDelayMs / 1000);
      }

      element.addEventListener('pointerenter', handleEnter);
      element.addEventListener('pointerleave', handleLeave);
      element.addEventListener('focusin', handleEnter);
      element.addEventListener('focusout', handleLeave);

      return () => {
        clearLoop();
        clearStateTween();
        tl.pause(0);
        element.removeEventListener('pointerenter', handleEnter);
        element.removeEventListener('pointerleave', handleLeave);
        element.removeEventListener('focusin', handleEnter);
        element.removeEventListener('focusout', handleLeave);
      };
    },
    {
      scope: rootRef,
      dependencies: [animated, hasEnteredView, initialDelayMs, loopDelayMs, size],
      revertOnUpdate: true,
    }
  );

  return (
    <span
      ref={rootRef}
      role="img"
      aria-label={alt}
      className={`relative inline-flex shrink-0 items-center justify-center ${sizeClasses[size]}${className ? ` ${className}` : ''}`}
      style={{ color }}
    >
      <span ref={stageRef} className="relative inline-flex h-full w-full items-center justify-center">
        <MarkLayers />
      </span>
    </span>
  );
}

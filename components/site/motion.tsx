'use client';

/**
 * Motion foundation for the Struq marketing site.
 * One RAF clock: Lenis is driven by the GSAP ticker; ScrollTrigger listens to Lenis.
 * All GSAP plugins used across the marketing pages are registered here, once.
 */

import { useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
// Note: 'gsap/all' avoids a Windows file-casing clash between Flip.d.ts and flip.d.ts.
import { Flip } from 'gsap/all';
import Lenis from 'lenis';

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  ScrollToPlugin,
  SplitText,
  DrawSVGPlugin,
  MorphSVGPlugin,
  MotionPathPlugin,
  Flip
);

export { gsap, useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin, Flip };

/** Entrance ease used across the whole site (expo-style out). */
export const EASE_OUT = 'expo.out';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Mounts Lenis on the native window scroll and bridges it into GSAP's ticker.
 * Keep this mounted regardless of reduced-motion; individual animations gate
 * themselves so the scroll layer stays stable.
 */
export function ScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      autoRaf: false,
      anchors: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Fonts and images shift layout after hydration; settle pin positions once.
    const refresh = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };
    const timer = window.setTimeout(refresh, 600);
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => undefined);

    return () => {
      window.clearTimeout(timer);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

'use client';

// components/site/footer-brand.tsx
//
// The footer's left-side brand reveal, ported from the DesignOS Footer lockup:
//   mark → wordmark → subtitle tagline → "Volg ons" label + 3 social icons,
// each arriving in sequence when the footer scrolls into view.
//
// DesignOS typed the tagline on a monospace-feeling typewriter; Struq bans that
// aesthetic, so the tagline uses a masked line reveal (SplitText) instead — same
// "reveals in" feel, on-brand. Marketing register (shared GSAP from motion.ts).

import { useEffect, useRef, useState } from 'react';
import { Twitter, Github, Linkedin } from 'lucide-react';
import { gsap, useGSAP, SplitText } from '@/components/site/motion';
import { AnimatedMark } from '@/components/site/brand/animated-mark';
import { AnimatedWordmark } from '@/components/site/brand/animated-wordmark';

const TAGLINE = 'Van visuele smaak naar herbruikbare front-ends van hoog niveau.';

const SOCIALS = [
  { href: 'https://twitter.com', label: 'Twitter', Icon: Twitter },
  { href: 'https://github.com', label: 'GitHub', Icon: Github },
  { href: 'https://www.linkedin.com', label: 'LinkedIn', Icon: Linkedin },
];

export function FooterBrand() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || inView) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [inView]);

  useGSAP(
    () => {
      if (!rootRef.current) return;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const tagline = rootRef.current.querySelector('[data-footer-tagline]') as HTMLElement | null;
      const connect = rootRef.current.querySelector('[data-footer-connect]');
      const icons = rootRef.current.querySelectorAll('[data-footer-social]');

      // Resting states so nothing is trapped invisible if the reveal never fires.
      if (reduce || !inView) {
        if (connect) gsap.set(connect, { autoAlpha: reduce ? 1 : 0 });
        if (icons.length) gsap.set(icons, { autoAlpha: reduce ? 1 : 0, y: reduce ? 0 : 14 });
        return;
      }

      const tl = gsap.timeline();

      // Tagline: masked line reveal, after the wordmark has settled.
      if (tagline) {
        const split = SplitText.create(tagline, { type: 'lines', mask: 'lines' });
        gsap.set(split.lines, { yPercent: 110 });
        tl.to(split.lines, { yPercent: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 }, 0.55);
      }

      // "Volg ons" + social icons stagger in last (DesignOS timing).
      if (connect) {
        gsap.set(connect, { autoAlpha: 0, y: 10 });
        tl.to(connect, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 1.35);
      }
      if (icons.length) {
        gsap.set(icons, { autoAlpha: 0, y: 14 });
        tl.to(icons, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.12 }, 1.2);
      }
    },
    { scope: rootRef, dependencies: [inView], revertOnUpdate: true }
  );

  return (
    <div ref={rootRef} className="flex max-w-sm flex-col gap-6">
      {/* Brand lockup */}
      <div className="flex items-center gap-3 sq-display text-2xl font-semibold">
        <AnimatedMark size="footer" alt="Struq" startOnInView />
        <AnimatedWordmark
          text="struq"
          fillColor="var(--sq-inverse-ink)"
          baseOpacity={0.28}
          initialDelayMs={220}
          startOnInView
        />
        <span aria-hidden="true" style={{ color: 'var(--sq-accent)' }}>.</span>
      </div>

      {/* Tagline */}
      <p
        data-footer-tagline
        className="text-[0.95rem] leading-relaxed"
        style={{ color: 'var(--sq-inverse-soft)' }}
      >
        {TAGLINE}
      </p>

      {/* Connect + socials */}
      <div className="mt-1 flex flex-col gap-3">
        <span data-footer-connect className="sq-eyebrow" style={{ color: 'var(--sq-inverse-soft)' }}>
          Volg ons
        </span>
        <div className="flex gap-3">
          {SOCIALS.map(({ href, label, Icon }) => (
            <a
              key={label}
              data-footer-social
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-11 w-11 items-center justify-center rounded-lg border transition-all duration-300"
              style={{ borderColor: 'color-mix(in srgb, var(--sq-inverse-ink) 14%, transparent)', color: 'var(--sq-inverse-soft)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--sq-accent)';
                e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--sq-accent) 40%, transparent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--sq-inverse-soft)';
                e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--sq-inverse-ink) 14%, transparent)';
              }}
            >
              <Icon size={16} strokeWidth={1.5} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

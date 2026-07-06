'use client';

import { useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { TransitionLink as Link } from '@/components/providers/PageTransition';
import {
  gsap,
  useGSAP,
  SplitText,
  DrawSVGPlugin,
  MorphSVGPlugin,
  EASE_OUT,
} from '@/components/site/motion';
import { markHandoff, HANDOFF_WASH } from '@/lib/handoff';
import { SlotText } from '@/components/site/slot-text';

const AuthParticles = dynamic(() => import('./auth-particles'), { ssr: false });

/** Only ever hand the router an internal path — never an absolute/external URL. */
function safeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/dashboard';
  return raw;
}

/* =========================================================================
   SVG SILHOUETTES — same five taxonomy forms as four-forms.tsx
   ========================================================================= */
const SHAPE_DROP =
  'M200 52 C 200 52 92 176 92 252 C 92 316 140 356 200 356 C 260 356 308 316 308 252 C 308 176 200 52 200 52 Z';
const SHAPE_LETTER =
  'M200 48 L338 352 L266 352 L200 200 L134 352 L62 352 Z';
const SHAPE_CARD =
  'M84 92 L316 92 Q332 92 332 108 L332 292 Q332 308 316 308 L84 308 Q68 308 68 292 L68 108 Q68 92 84 92 Z';
const SHAPE_SYSTEM = 'M200 52 L324 118 L324 268 L200 334 L76 268 L76 118 Z';
const SHAPE_LENS =
  'M200 60 C 277 60 340 123 340 200 C 340 277 277 340 200 340 C 123 340 60 277 60 200 C 60 123 123 60 200 60 Z';

const SHAPES = [SHAPE_DROP, SHAPE_LETTER, SHAPE_CARD, SHAPE_SYSTEM, SHAPE_LENS];

/* Positions for the five orbiting silhouettes around the card (desktop) */
const ORBIT_POSITIONS = [
  { x: -320, y: -180, scale: 0.22, rotate: -6 },
  { x: 310, y: -140, scale: 0.18, rotate: 8 },
  { x: -340, y: 120, scale: 0.20, rotate: 4 },
  { x: 330, y: 160, scale: 0.16, rotate: -5 },
  { x: 0, y: -260, scale: 0.24, rotate: 3 },
];

/* =========================================================================
   AUTH CLIENT — the cinematic login experience
   ========================================================================= */

/**
 * De Ontgrendeling — Struq's authentication page.
 *
 * A full-viewport dark canvas where five taxonomy silhouettes orbit a frosted
 * glass auth card. DrawSVG entrance → MorphSVG ambient loop → SplitText
 * headline → staggered form reveal → portal animation on submit.
 *
 * Marketing register: cinematic GSAP, Three.js particles. No backend wiring.
 */
export function AuthClient() {
  const root = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeNextPath(searchParams.get('next'));
  const particleIntensityRef = useRef(0);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isAnimating, setIsAnimating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const toggleMode = useCallback(() => {
    if (isAnimating || submitting) return;
    setError(null);
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
  }, [isAnimating, submitting]);

  // The cinematic success gesture (~2.1s) ending on the warm wash that becomes
  // the dashboard curtain. Runs ONLY after a resolved successful sign-in.
  const runSuccessHandoff = useCallback(() => {
      setIsAnimating(true);

      // === SUCCESS → DASHBOARD HANDOFF ===
      // ONE clean, monotonic gesture (~2.1s). Particles only ever accelerate —
      // no ramp/dip/ramp — and the ambient silhouette morph is killed instantly
      // so no half-formed blob is ever on screen. It ends holding a full-screen
      // warm wash that becomes the dashboard's curtain (zero-seam crossover).
      const section = root.current;

      // Kill ALL ambient loops the moment we commit, so nothing keeps morphing,
      // rotating or floating underneath the success gesture.
      if (section) {
        const ambientTargets = section.querySelectorAll(
          '[data-auth-shape], [data-auth-ring], [data-auth-morph-path]'
        );
        ambientTargets.forEach((el) => gsap.killTweensOf(el));
        // Also kill the morph target's path tweens explicitly.
        const morph = section.querySelector('[data-auth-morph-path]');
        if (morph) gsap.killTweensOf(morph);
      }

      const ctx = gsap.context(() => {
        let navigated = false;
        const goToDashboard = () => {
          if (navigated) return;
          navigated = true;
          markHandoff(); // dashboard curtain reads this and reveals from the wash
          router.push(nextPath);
        };

        const tl = gsap.timeline({ onComplete: goToDashboard });

        // --- The particle vortex: ONE continuous 0→1 acceleration. ---
        // A single power2.in tween means velocity only ever climbs into the
        // bloom — the eye reads one committed rush, never a stutter.
        tl.to(particleIntensityRef, { current: 1, duration: 1.7, ease: 'power2.in' }, 0);

        // CTA commits: warms and settles as the vortex takes over.
        tl.to(
          '[data-auth-cta]',
          {
            boxShadow: '0 0 60px 12px rgba(255, 232, 204, 0.55)',
            scale: 1.03,
            duration: 0.9,
            ease: 'power2.out',
          },
          0
        );
        tl.to('[data-auth-card]', { borderColor: 'rgba(255, 232, 204, 0.45)', duration: 0.9 }, 0.1);

        // Silhouettes + ring: a single clean sweep to center and gone — no
        // morph, no lingering shape. They ride the same acceleration as the dust.
        tl.to(
          ['[data-auth-shape]', '[data-auth-ring]'],
          {
            x: 0,
            y: 0,
            scale: 0,
            opacity: 0,
            duration: 1.1,
            ease: 'power2.in',
          },
          0.35
        );

        // The UI lifts toward the center of gravity as one, in the vortex's wake.
        tl.to(
          ['[data-auth-card]', '[data-auth-headline]', '[data-auth-subtitle]', '[data-auth-footer]'],
          {
            y: -22,
            scale: 0.97,
            opacity: 0,
            duration: 0.7,
            ease: 'power2.in',
          },
          1.0
        );

        // BLOOM: the warm wash floods from the bright center and HOLDS opaque —
        // it is the curtain the dashboard reveals from. (No fade-out by design.)
        tl.fromTo(
          '[data-auth-shockwave]',
          { scale: 0, opacity: 0.5 },
          { scale: 5, opacity: 0, duration: 0.9, ease: 'power2.out' },
          1.35
        );
        tl.fromTo(
          '[data-auth-flash]',
          { opacity: 0 },
          { opacity: 1, duration: 0.55, ease: 'power2.in' },
          1.55
        );
        // Brief hold on the fully-opaque wash while the swap happens behind it.
        tl.to({}, { duration: 0.2 });
      }, root);

      // Safety net: never strand the user on the wash if navigation is delayed.
      window.setTimeout(() => {
        markHandoff();
        router.push(nextPath);
      }, 2800);

      // The context is intentionally not reverted here: the timeline must run to
      // completion (it ends holding the wash) and the component unmounts on nav.
      void ctx;
  }, [router, nextPath]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isAnimating || submitting) return;
      setError(null);
      setSubmitting(true);

      try {
        if (mode === 'signup') {
          const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
          });
          if (!res.ok) {
            const data = (await res.json().catch(() => null)) as { error?: string } | null;
            setError(data?.error ?? 'Aanmaken mislukt. Probeer het opnieuw.');
            setSubmitting(false);
            return;
          }
        }

        // Establish the session (login, or right after a successful signup).
        const result = await signIn('credentials', { email, password, redirect: false });
        if (!result || result.error) {
          setError(
            mode === 'login'
              ? 'E-mailadres of wachtwoord klopt niet.'
              : 'Inloggen na aanmaken mislukt. Probeer opnieuw in te loggen.'
          );
          setSubmitting(false);
          return;
        }

        // Success → play the cinematic handoff. It navigates to /dashboard.
        runSuccessHandoff();
      } catch {
        setError('Er ging iets mis. Controleer je verbinding en probeer opnieuw.');
        setSubmitting(false);
      }
    },
    [isAnimating, submitting, mode, name, email, password, runSuccessHandoff]
  );

  const handleOAuth = useCallback(
    (provider: 'google' | 'github') => {
      if (isAnimating || submitting) return;
      // Full-page OAuth redirect; on return the user lands on nextPath (default /dashboard).
      void signIn(provider, { callbackUrl: nextPath });
    },
    [isAnimating, submitting, nextPath]
  );

  /* -----------------------------------------------------------------------
     GSAP entrance choreography
     ----------------------------------------------------------------------- */
  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Read accent from CSS
        const css = getComputedStyle(section);
        const accent = css.getPropertyValue('--sq-accent').trim() || '#e4572e';

        const masterTl = gsap.timeline({ defaults: { ease: EASE_OUT } });

        /* Phase 1 — Curtain line draws across center then splits */
        masterTl.fromTo(
          '[data-auth-curtain]',
          { drawSVG: '50% 50%' },
          { drawSVG: '0% 100%', duration: 1.0, ease: 'power2.inOut' },
          0
        );
        masterTl.to(
          '[data-auth-curtain]',
          { opacity: 0, duration: 0.5 },
          0.9
        );

        // Card starts collapsed to a center hairline so it can open outward.
        gsap.set('[data-auth-card]', { scaleY: 0, scaleX: 0.92, transformOrigin: 'center center' });

        /* Phase 2 — Silhouettes draw in with DrawSVG, then position around card */
        const shapes = gsap.utils.toArray<SVGElement>('[data-auth-shape]');
        // Start them invisible and centered
        gsap.set(shapes, { opacity: 0, scale: 0, x: 0, y: 0 });

        shapes.forEach((shape, i) => {
          const pos = ORBIT_POSITIONS[i];
          const path = shape.querySelector('path');
          if (path) {
            gsap.set(path, { drawSVG: '0% 0%' });
          }

          masterTl.to(
            shape,
            { opacity: 1, scale: pos.scale * 0.5, duration: 0.1 },
            0.7 + i * 0.12
          );

          if (path) {
            masterTl.to(
              path,
              { drawSVG: '0% 100%', duration: 0.7, ease: 'power2.inOut' },
              0.75 + i * 0.12
            );
          }

          masterTl.to(
            shape,
            {
              x: pos.x,
              y: pos.y,
              scale: pos.scale,
              rotation: pos.rotate,
              duration: 1.2,
              ease: 'elastic.out(1, 0.75)',
            },
            1.3 + i * 0.08
          );
        });

        /* Phase 2b — Orbit ring draws in */
        masterTl.fromTo(
          '[data-auth-ring] circle',
          { drawSVG: '0% 0%' },
          { drawSVG: '0% 100%', duration: 1.4, ease: 'power2.inOut' },
          1.0
        );

        /* Phase 3 — SplitText headline reveal */
        const headlineEl = section.querySelector('[data-auth-headline]') as HTMLElement;
        if (headlineEl) {
          const split = SplitText.create(headlineEl, { type: 'words', mask: 'words' });
          gsap.set(split.words, { yPercent: 120 });
          masterTl.to(
            split.words,
            { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' },
            1.4
          );
        }

        /* Phase 3b — Subtitle fade */
        masterTl.fromTo(
          '[data-auth-subtitle]',
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.7 },
          2.0
        );

        /* Phase 3c — Card expands from the middle: a hairline at center that
           opens outward top+bottom at once (scaleY from center), with a touch
           of horizontal give so it reads as unfolding, not wiping. */
        masterTl.fromTo(
          '[data-auth-card]',
          {
            autoAlpha: 1,
            scaleY: 0,
            scaleX: 0.92,
            transformOrigin: 'center center',
          },
          {
            scaleY: 1,
            scaleX: 1,
            duration: 0.85,
            ease: 'expo.out',
          },
          2.05
        );

        /* Phase 4 — Form elements stagger up (inside the now-open card) */
        masterTl.fromTo(
          '[data-auth-form-el]',
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1 },
          2.5
        );

        /* Phase 4b — CTA pulse glow */
        masterTl.fromTo(
          '[data-auth-cta]',
          { boxShadow: `0 0 0 0px ${accent}00` },
          {
            boxShadow: `0 0 32px 4px ${accent}44`,
            duration: 0.6,
            ease: 'power2.out',
          },
          3.0
        );
        masterTl.to(
          '[data-auth-cta]',
          { boxShadow: `0 0 0 0px ${accent}00`, duration: 0.8 },
          3.6
        );

        /* Phase 5 — Footer links fade */
        masterTl.fromTo(
          '[data-auth-footer]',
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.6 },
          2.8
        );

        /* Ambient loop — silhouettes morph through forms continuously */
        const morphTarget = section.querySelector('[data-auth-morph-path]');
        if (morphTarget) {
          const morphTl = gsap.timeline({ repeat: -1, defaults: { ease: 'sine.inOut' } });
          SHAPES.forEach((shape, i) => {
            const next = SHAPES[(i + 1) % SHAPES.length];
            morphTl.to(morphTarget, {
              morphSVG: { shape: next, type: 'rotational' },
              duration: 2.8,
              delay: 0.6,
            });
          });
        }

        /* Ambient — orbit ring slow rotation */
        gsap.to('[data-auth-ring]', {
          rotation: 360,
          duration: 60,
          repeat: -1,
          ease: 'none',
          transformOrigin: 'center center',
        });

        /* Ambient — individual silhouettes gentle float */
        shapes.forEach((shape, i) => {
          const pos = ORBIT_POSITIONS[i];
          gsap.to(shape, {
            y: pos.y - 12,
            duration: 3 + i * 0.6,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.4,
          });
        });
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        // Show everything immediately, no animations
        gsap.set('[data-auth-curtain]', { opacity: 0 });
        gsap.set('[data-auth-shape]', (i: number) => ({
          opacity: 1,
          x: ORBIT_POSITIONS[i].x,
          y: ORBIT_POSITIONS[i].y,
          scale: ORBIT_POSITIONS[i].scale,
          rotation: ORBIT_POSITIONS[i].rotate,
        }));
        gsap.set('[data-auth-ring] circle', { drawSVG: '0% 100%' });
        gsap.set('[data-auth-card]', { autoAlpha: 1, scaleX: 1, scaleY: 1 });
        gsap.set('[data-auth-headline]', { autoAlpha: 1 });
        gsap.set('[data-auth-subtitle]', { autoAlpha: 1 });
        gsap.set('[data-auth-form-el]', { autoAlpha: 1 });
        gsap.set('[data-auth-footer]', { autoAlpha: 1 });
      });

      // Tear down the global matchMedia conditions on unmount so a later
      // ScrollTrigger.refresh() (curtain nav) can't re-run them against a stale DOM.
      return () => mm.revert();
    },
    { scope: root, dependencies: [mode] }
  );

  return (
    <div
      ref={root}
      className="sq relative flex min-h-svh items-center justify-center overflow-hidden"
      style={{
        background: 'var(--sq-inverse)',
        color: 'var(--sq-inverse-ink)',
      }}
      data-theme="dark"
    >
      {/* Three.js particle background */}
      <AuthParticles intensityRef={particleIntensityRef} />

      {/* Shockwave ring (success animation) */}
      <div
        data-auth-shockwave
        className="pointer-events-none absolute z-40 rounded-full"
        style={{
          width: '200px',
          height: '200px',
          left: '50%',
          top: '50%',
          marginLeft: '-100px',
          marginTop: '-100px',
          border: '3px solid rgba(255, 240, 220, 0.6)',
          opacity: 0,
          transform: 'scale(0)',
        }}
      />

      {/* Warm bloom → dashboard curtain. Blooms from a bright center into the
          shared handoff wash at the edges, then holds fully opaque so the
          dashboard mounts unseen behind it and reveals from this same color. */}
      <div
        data-auth-flash
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          background: `radial-gradient(circle at center, #fff5e6 0%, ${HANDOFF_WASH} 55%, ${HANDOFF_WASH} 100%)`,
          opacity: 0,
        }}
      />

      {/* Curtain line — draws across center on load */}
      <svg
        className="pointer-events-none absolute left-0 top-1/2 z-10 h-[2px] w-full -translate-y-1/2"
        viewBox="0 0 1200 2"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line
          data-auth-curtain
          x1="0"
          y1="1"
          x2="1200"
          y2="1"
          stroke="var(--sq-accent)"
          strokeWidth="2"
        />
      </svg>

      {/* Orbit ring — dashed circle behind the card */}
      <svg
        data-auth-ring
        className="pointer-events-none absolute z-10 hidden lg:block"
        style={{ width: '800px', height: '800px' }}
        viewBox="0 0 400 400"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="200"
          cy="200"
          r="186"
          stroke="var(--sq-line-strong)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="4 16"
          opacity="0.4"
        />
      </svg>

      {/* Five taxonomy silhouettes orbiting the card (desktop only) */}
      {SHAPES.map((shape, i) => (
        <svg
          key={i}
          data-auth-shape={i}
          className="pointer-events-none absolute z-10 hidden lg:block"
          style={{ width: '400px', height: '400px' }}
          viewBox="0 0 400 400"
          fill="none"
          aria-hidden="true"
        >
          <path
            d={shape}
            stroke="var(--sq-accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            {...(i === 0 ? { 'data-auth-morph-path': '' } : {})}
          />
        </svg>
      ))}

      {/* Main content: headline + auth card */}
      <div className="relative z-20 flex w-full max-w-md flex-col items-center px-5 lg:max-w-lg">
        {/* Brand mark */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 transition-opacity hover:opacity-80"
          aria-label="Struq home"
        >
          <span
            className="sq-display text-2xl tracking-tight"
            style={{ color: 'var(--sq-accent)' }}
          >
            struq
          </span>
        </Link>

        {/* Headline — SplitText animated */}
        <h1
          data-auth-headline
          className="sq-display text-center text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.12] tracking-tight"
          style={{ color: 'var(--sq-inverse-ink)' }}
        >
          {mode === 'login'
            ? 'Welkom terug.'
            : 'Begin met bouwen.'}
        </h1>

        {/* Subtitle */}
        <p
          data-auth-subtitle
          className="mt-3 text-center text-[0.95rem] leading-relaxed"
          style={{ color: 'var(--sq-inverse-soft)' }}
        >
          {mode === 'login'
            ? 'Log in en ga verder waar je gebleven was.'
            : 'Maak je gratis account aan en ontdek wat je AI kan.'}
        </p>

        {/* Auth card — frosted glass */}
        <div
          data-auth-card
          className="mt-8 w-full rounded-2xl border p-8 sm:p-10"
          style={{
            background: 'color-mix(in srgb, var(--sq-inverse-raised) 80%, transparent)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderColor: 'var(--sq-line-strong)',
            boxShadow: 'var(--sq-shadow-float)',
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name field (signup only) */}
            {mode === 'signup' && (
              <div data-auth-form-el>
                <label
                  htmlFor="auth-name"
                  className="mb-1.5 block text-sm font-medium"
                  style={{ color: 'var(--sq-inverse-soft)' }}
                >
                  Naam
                </label>
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Je volledige naam"
                  autoComplete="name"
                  required
                  className="h-12 w-full rounded-xl border px-4 text-[0.95rem] outline-none transition-all duration-200 focus:ring-2"
                  style={{
                    background: 'var(--sq-inverse)',
                    borderColor: 'var(--sq-line-strong)',
                    color: 'var(--sq-inverse-ink)',
                    // design-gate: ignore — ring uses accent token
                    ['--tw-ring-color' as string]: 'var(--sq-accent)',
                  }}
                />
              </div>
            )}

            {/* Email */}
            <div data-auth-form-el>
              <label
                htmlFor="auth-email"
                className="mb-1.5 block text-sm font-medium"
                style={{ color: 'var(--sq-inverse-soft)' }}
              >
                E-mailadres
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="naam@voorbeeld.nl"
                autoComplete="email"
                required
                className="h-12 w-full rounded-xl border px-4 text-[0.95rem] outline-none transition-all duration-200 focus:ring-2"
                style={{
                  background: 'var(--sq-inverse)',
                  borderColor: 'var(--sq-line-strong)',
                  color: 'var(--sq-inverse-ink)',
                  ['--tw-ring-color' as string]: 'var(--sq-accent)',
                }}
              />
            </div>

            {/* Password */}
            <div data-auth-form-el>
              <label
                htmlFor="auth-password"
                className="mb-1.5 block text-sm font-medium"
                style={{ color: 'var(--sq-inverse-soft)' }}
              >
                Wachtwoord
              </label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimaal 8 tekens"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
                minLength={8}
                className="h-12 w-full rounded-xl border px-4 text-[0.95rem] outline-none transition-all duration-200 focus:ring-2"
                style={{
                  background: 'var(--sq-inverse)',
                  borderColor: 'var(--sq-line-strong)',
                  color: 'var(--sq-inverse-ink)',
                  ['--tw-ring-color' as string]: 'var(--sq-accent)',
                }}
              />
            </div>

            {/* Forgot password (login only) */}
            {mode === 'login' && (
              <div data-auth-form-el className="flex justify-end">
                <button
                  type="button"
                  className="text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ color: 'var(--sq-accent)' }}
                >
                  Wachtwoord vergeten?
                </button>
              </div>
            )}

            {/* Error line */}
            {error && (
              <p
                data-auth-form-el
                role="alert"
                className="text-sm leading-relaxed"
                style={{ color: 'var(--sq-accent)' }}
              >
                {error}
              </p>
            )}

            {/* CTA */}
            <button
              data-auth-form-el
              data-auth-cta
              type="submit"
              disabled={isAnimating || submitting}
              className="sq-btn sq-btn-accent mt-1 h-12 w-full !rounded-xl !text-[0.95rem] active:scale-[0.98] disabled:opacity-60"
            >
              <SlotText>
                {submitting
                  ? mode === 'login'
                    ? 'Bezig met inloggen…'
                    : 'Account aanmaken…'
                  : mode === 'login'
                    ? 'Inloggen'
                    : 'Account aanmaken'}
              </SlotText>
              <span className="sq-btn-fill" aria-hidden="true" />
            </button>

            {/* Divider */}
            <div data-auth-form-el className="flex items-center gap-4">
              <div className="h-px flex-1" style={{ background: 'var(--sq-line-strong)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--sq-inverse-soft)' }}>
                of
              </span>
              <div className="h-px flex-1" style={{ background: 'var(--sq-line-strong)' }} />
            </div>

            {/* Social login */}
            <div data-auth-form-el className="flex gap-3">
              <button
                type="button"
                onClick={() => handleOAuth('google')}
                disabled={isAnimating || submitting}
                className="flex h-12 flex-1 items-center justify-center gap-2.5 rounded-xl border text-sm font-medium transition-all duration-200 hover:brightness-110 disabled:opacity-60"
                style={{
                  background: 'var(--sq-inverse)',
                  borderColor: 'var(--sq-line-strong)',
                  color: 'var(--sq-inverse-ink)',
                }}
              >
                {/* Google icon */}
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>

              <button
                type="button"
                onClick={() => handleOAuth('github')}
                disabled={isAnimating || submitting}
                className="flex h-12 flex-1 items-center justify-center gap-2.5 rounded-xl border text-sm font-medium transition-all duration-200 hover:brightness-110 disabled:opacity-60"
                style={{
                  background: 'var(--sq-inverse)',
                  borderColor: 'var(--sq-line-strong)',
                  color: 'var(--sq-inverse-ink)',
                }}
              >
                {/* GitHub icon */}
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub
              </button>
            </div>
          </form>
        </div>

        {/* Toggle login / signup */}
        <div data-auth-footer className="mt-6 text-center">
          <p className="text-sm" style={{ color: 'var(--sq-inverse-soft)' }}>
            {mode === 'login' ? (
              <>
                Nog geen account?{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-medium transition-opacity hover:opacity-80"
                  style={{ color: 'var(--sq-accent)' }}
                >
                  Maak er een aan
                </button>
              </>
            ) : (
              <>
                Al een account?{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-medium transition-opacity hover:opacity-80"
                  style={{ color: 'var(--sq-accent)' }}
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </div>

        {/* Back to home */}
        <Link
          href="/"
          data-auth-footer
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-80"
          style={{ color: 'var(--sq-inverse-soft)' }}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
          Terug naar struq.nl
        </Link>
      </div>
    </div>
  );
}

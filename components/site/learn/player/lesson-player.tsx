'use client';

/**
 * The lesson player: a guided, single-viewport flow. No page scroll, no
 * marketing layout. Every block is a scene; the learner moves horizontally
 * with Vorige/Volgende (or arrow keys), like a coach walking them through.
 *
 *   scene 0    - opening: what you will build, live, plus what you take home
 *   scenes 1..n - one block per scene; interactive scenes unlock "Volgende"
 *                 only after the learner has actually engaged
 *   last scene - finale: the claim moment (peak-end) and the next lane
 *
 * Scene position persists per lesson, so returning resumes exactly there.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TransitionLink as Link } from '@/components/providers/PageTransition';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { Block, LessonManifest } from '@/lib/learn/schema';
import { ARCHETYPE_META, LANE_META } from '@/lib/learn/schema';
import { LearnProgressProvider, useLearnProgress } from '@/lib/learn/progress';
import { getLessonManifest } from '@/lib/learn/lessons';
import { resolveArtifact } from '@/lib/learn/artifacts/registry';
import { ArtifactFrame } from '@/components/site/learn/blocks/artifact-frame';
import { BlockRenderer } from '@/components/site/learn/blocks/block-renderer';
import { ClaimCard } from '@/components/site/learn/player/claim-card';
import { SlotText } from '@/components/site/slot-text';

const THEME_KEY = 'sq-theme';

/** Block kinds that must be engaged with before "Volgende" unlocks. */
const INTERACTIVE_KINDS = new Set<Block['kind']>([
  'predict',
  'taste-check',
  'deconstruct-layers',
  'playground-tokens',
  'playground-motion',
  'prompt-anatomy',
  'code-reveal',
  'do-this',
]);

type Scene =
  | { kind: 'opening' }
  | {
      kind: 'block';
      block: Block;
      stepIndex: number;
      stepTitle: string;
      kicker: string;
      isLastOfStep: boolean;
    }
  | { kind: 'finale' };

function buildScenes(manifest: LessonManifest): Scene[] {
  const scenes: Scene[] = [{ kind: 'opening' }];
  manifest.steps.forEach((step, stepIndex) => {
    step.blocks.forEach((block, blockIndex) => {
      scenes.push({
        kind: 'block',
        block,
        stepIndex,
        stepTitle: step.title,
        kicker: step.kicker,
        isLastOfStep: blockIndex === step.blocks.length - 1,
      });
    });
  });
  scenes.push({ kind: 'finale' });
  return scenes;
}

export function LessonPlayer({ manifest }: { manifest: LessonManifest }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try {
      setDark(window.localStorage.getItem(THEME_KEY) === 'dark');
    } catch {
      // Stay light.
    }
  }, []);

  return (
    <div className="sq flex h-dvh flex-col overflow-hidden" data-theme={dark ? 'dark' : undefined}>
      <LearnProgressProvider>
        <PlayerInner manifest={manifest} />
      </LearnProgressProvider>
    </div>
  );
}

function PlayerInner({ manifest }: { manifest: LessonManifest }) {
  const {
    ready,
    lessons,
    markOpeningSeen,
    markStep,
    setSceneIndex,
    markComplete,
    foundSecret,
  } = useLearnProgress();
  const reducedMotion = useReducedMotion();

  const scenes = useMemo(() => buildScenes(manifest), [manifest]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [engaged, setEngaged] = useState<Record<number, boolean>>({});
  const [replayKey, setReplayKey] = useState(0);
  const resumedRef = useRef(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const lane = LANE_META[manifest.lane];
  const progress = lessons[manifest.slug];
  const OpeningArtifact = resolveArtifact(manifest.opening.artifact);
  const nextManifest = manifest.finale.nextSlug
    ? getLessonManifest(manifest.finale.nextSlug)
    : null;

  // Resume exactly where the learner left off (Zeigarnik: the open loop).
  useEffect(() => {
    if (!ready || resumedRef.current) return;
    resumedRef.current = true;
    const saved = progress?.sceneIndex ?? 0;
    if (saved > 0 && !progress?.completedAt) {
      setIndex(Math.min(saved, scenes.length - 1));
    }
  }, [ready, progress, scenes.length]);

  const scene = scenes[index];
  const isLocked =
    scene.kind === 'block' && INTERACTIVE_KINDS.has(scene.block.kind) && !engaged[index];

  const goTo = useCallback(
    (nextIndex: number, dir: number) => {
      setDirection(dir);
      setIndex(nextIndex);
      setSceneIndex(manifest.slug, nextIndex);
      mainRef.current?.scrollTo({ top: 0 });
    },
    [manifest.slug, setSceneIndex]
  );

  const goNext = useCallback(() => {
    if (index >= scenes.length - 1 || isLocked) return;
    const current = scenes[index];
    if (current.kind === 'opening') {
      markOpeningSeen(manifest.slug);
    } else if (current.kind === 'block' && current.isLastOfStep) {
      markStep(manifest.slug, manifest.steps[current.stepIndex].id);
    }
    if (index + 1 === scenes.length - 1) {
      markComplete(manifest.slug);
    }
    goTo(index + 1, 1);
  }, [index, scenes, isLocked, manifest, markOpeningSeen, markStep, markComplete, goTo]);

  const goBack = useCallback(() => {
    if (index === 0) return;
    goTo(index - 1, -1);
  }, [index, goTo]);

  // Arrow-key navigation, skipped while typing in a control.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (event.key === 'ArrowRight') goNext();
      if (event.key === 'ArrowLeft') goBack();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goBack]);

  const percent = Math.round((index / (scenes.length - 1)) * 100);
  const travel = reducedMotion ? 0 : 64;
  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? travel : -travel, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -travel : travel, opacity: 0 }),
  };

  const nextLabel =
    scene.kind === 'opening'
      ? 'Laat me zien hoe'
      : index === scenes.length - 2
        ? 'Naar je beloning'
        : 'Volgende';

  return (
    <>
      {/* Top bar */}
      <header className="shrink-0 border-b" style={{ borderColor: 'var(--sq-line)' }}>
        <div className="sq-container-wide flex h-14 items-center gap-4">
          <Link href="/learn" className="sq-link text-sm">
            Atelier
          </Link>
          <span
            className="hidden rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider sm:block"
            style={{ background: 'var(--sq-accent-wash)', color: 'var(--sq-accent-ink)' }}
          >
            {lane.label}
          </span>
          <span className="sq-faint hidden truncate md:block">{manifest.title}</span>
          <span className="ml-auto text-xs font-bold tabular-nums" style={{ color: 'var(--sq-accent-ink)' }}>
            {index + 1} / {scenes.length}
          </span>
          <span
            className="h-1.5 w-24 overflow-hidden rounded-full sm:w-36"
            style={{ background: 'var(--sq-deep)' }}
            aria-hidden="true"
          >
            <span
              className="block h-full rounded-full transition-[width] duration-700 ease-out"
              style={{ width: `${percent}%`, background: 'var(--sq-accent)' }}
            />
          </span>
        </div>
      </header>

      {/* Scene stage */}
      <main ref={mainRef} className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reducedMotion ? 0.15 : 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex min-h-full flex-col justify-center"
          >
            <div className="sq-container w-full" style={{ paddingBlock: 'clamp(2rem, 5vh, 3.5rem)' }}>
              {scene.kind === 'opening' && (
                <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
                  <div>
                    <p className="sq-eyebrow">
                      {lane.label} · {ARCHETYPE_META[manifest.archetype].label} · {manifest.minutes} min
                    </p>
                    <h1 className="sq-h2 mt-5">{manifest.opening.title}</h1>
                    <p className="sq-lead mt-5 max-w-xl">{manifest.opening.hook}</p>
                    <ul className="mt-6 space-y-2.5">
                      {manifest.opening.promise.map((line) => (
                        <li key={line} className="flex items-start gap-3 text-sm font-semibold">
                          <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0" fill="none" aria-hidden="true">
                            <path
                              d="M2.5 8.5 6 12 13.5 4"
                              stroke="var(--sq-accent)"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {line}
                        </li>
                      ))}
                    </ul>
                    <p className="sq-faint mt-6">
                      Geen scrollen, geen huiswerk. Stap voor stap, in jouw tempo.
                    </p>
                  </div>
                  <div>
                    {OpeningArtifact && (
                      <ArtifactFrame
                        caption="Dit ga je maken. Geen mockup, dit draait echt."
                        onReplay={() => setReplayKey((k) => k + 1)}
                      >
                        <OpeningArtifact replayKey={replayKey} />
                      </ArtifactFrame>
                    )}
                  </div>
                </div>
              )}

              {scene.kind === 'block' && (
                <div className="mx-auto w-full max-w-4xl">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <p className="sq-eyebrow">{scene.kicker}</p>
                    <p className="sq-faint">{scene.stepTitle}</p>
                  </div>
                  <div className="mt-6">
                    <BlockRenderer
                      block={scene.block}
                      onEngage={() => setEngaged((current) => ({ ...current, [index]: true }))}
                      onSecret={(secretId) => foundSecret(manifest.slug, secretId)}
                    />
                  </div>
                </div>
              )}

              {scene.kind === 'finale' && (
                <div className="mx-auto w-full max-w-4xl">
                  <p className="sq-eyebrow">Gelukt</p>
                  <h2 className="sq-h2 mt-4">{manifest.finale.title}</h2>
                  <p className="sq-lead mt-4 max-w-2xl">{manifest.finale.body}</p>
                  <div className="mt-8">
                    <ClaimCard manifest={manifest} />
                  </div>
                  {nextManifest && (
                    <Link
                      href={`/learn/${nextManifest.slug}`}
                      className="group sq-panel mt-6 flex flex-col gap-2 p-6 transition-transform duration-300 hover:-translate-y-1 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="sq-eyebrow">
                          Volgende laan · {LANE_META[nextManifest.lane].label}
                        </p>
                        <p className="sq-h3 mt-1.5">{nextManifest.title}</p>
                      </div>
                      <span
                        className="shrink-0 text-sm font-bold transition-transform duration-300 group-hover:translate-x-1.5"
                        style={{ color: 'var(--sq-accent-ink)' }}
                      >
                        Ga verder →
                      </span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <footer className="shrink-0 border-t" style={{ borderColor: 'var(--sq-line)', background: 'var(--sq-paper)' }}>
        <div className="sq-container-wide flex h-20 items-center gap-4">
          <button
            type="button"
            onClick={goBack}
            className="sq-btn sq-btn-ghost !px-6 !py-3 !text-sm"
            style={{ visibility: index === 0 ? 'hidden' : undefined }}
          >
            <SlotText>Vorige</SlotText>
            <span className="sq-btn-fill" aria-hidden="true" />
          </button>

          {/* Scene dots */}
          <div className="mx-auto hidden items-center gap-1.5 md:flex" aria-hidden="true">
            {scenes.map((_, dotIndex) => (
              <span
                key={dotIndex}
                className="rounded-full transition-all duration-300"
                style={{
                  width: dotIndex === index ? '1.25rem' : '0.375rem',
                  height: '0.375rem',
                  background:
                    dotIndex < index
                      ? 'var(--sq-accent)'
                      : dotIndex === index
                        ? 'var(--sq-accent)'
                        : 'var(--sq-line-strong)',
                  opacity: dotIndex < index ? 0.5 : 1,
                }}
              />
            ))}
          </div>

          <div className="ml-auto flex items-center gap-4 md:ml-0">
            <AnimatePresence>
              {isLocked && (
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="sq-faint hidden text-right sm:block"
                >
                  Probeer het eerst even hierboven
                </motion.span>
              )}
            </AnimatePresence>
            {index < scenes.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={isLocked}
                className="sq-btn sq-btn-accent !px-7 !py-3.5 !text-sm"
                style={{
                  opacity: isLocked ? 0.4 : 1,
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                }}
              >
                <SlotText>{nextLabel}</SlotText>
                <span className="sq-btn-fill" aria-hidden="true" />
              </button>
            ) : (
              <Link href="/learn" className="sq-btn sq-btn-primary !px-7 !py-3.5 !text-sm">
                <SlotText>Terug naar het Atelier</SlotText>
                <span className="sq-btn-fill" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </footer>
    </>
  );
}

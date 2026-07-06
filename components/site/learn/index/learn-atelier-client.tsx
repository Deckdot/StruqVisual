'use client';

/**
 * /learn: Het Atelier.
 * Structured like the homepage: big editorial sections, one psychological
 * goal each.
 *
 *  1. Hero          - identity: "zie eerst het eindresultaat"
 *  2. Resume card   - Zeigarnik: open loops pull people back
 *  3. Three lanes   - pick your lane (beginner/gevorderd/expert), each shows
 *                     its end result live so you know what you build up to
 *  4. Identity path - who you are becoming (never a score)
 *  5. Closing CTA   - the first step is free and small
 */

import { TransitionLink as Link } from '@/components/providers/PageTransition';
import { SiteShell } from '@/components/site/site-shell';
import { SplitHeading } from '@/components/site/split-heading';
import { Reveal } from '@/components/site/reveal';
import { SlotText } from '@/components/site/slot-text';
import { ARCHETYPE_META, IDENTITY_LEVELS, LANE_META } from '@/lib/learn/schema';
import { LESSONS } from '@/lib/learn/lessons';
import {
  LearnProgressProvider,
  lessonPercent,
  useLearnProgress,
} from '@/lib/learn/progress';
import { resolveArtifact } from '@/lib/learn/artifacts/registry';

export function LearnAtelierClient() {
  return (
    <SiteShell>
      <LearnProgressProvider>
        <AtelierInner />
      </LearnProgressProvider>
    </SiteShell>
  );
}

function AtelierInner() {
  const { ready, lessons, identity, claimCount } = useLearnProgress();

  const resumeLesson = ready
    ? LESSONS.find((manifest) => {
        const progress = lessons[manifest.slug];
        return progress && !progress.completedAt;
      })
    : undefined;

  return (
    <>
      {/* 1 — Hero */}
      <section
        className="relative overflow-hidden"
        style={{ paddingTop: 'clamp(8rem, 15vh, 12rem)', paddingBottom: 'clamp(4rem, 9vh, 7rem)' }}
      >
        <div className="sq-container">
          <div className="max-w-3xl">
            <Reveal>
              <p className="sq-eyebrow">Struq Learn · Het Atelier</p>
            </Reveal>
            <SplitHeading as="h1" className="sq-h1 mt-7" delay={0.15} start="top 100%">
              Zie eerst het eindresultaat. Bouw het daarna zelf.
            </SplitHeading>
            <Reveal delay={0.25}>
              <p className="sq-lead mt-9 max-w-xl">
                Geen cursus, geen huiswerk, geen quizjes. Elke les begint met iets
                moois dat al werkt, haalt het uit elkaar, en geeft je aan het einde
                de asset mee. Gratis, in het Nederlands.
              </p>
            </Reveal>
            {ready && claimCount > 0 && (
              <Reveal delay={0.3}>
                <p className="mt-7 inline-flex items-center gap-3 rounded-full border px-5 py-2.5 text-sm font-bold" style={{ borderColor: 'var(--sq-line-strong)' }}>
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full text-xs"
                    style={{ background: 'var(--sq-accent)', color: 'var(--sq-paper)' }}
                    aria-hidden="true"
                  >
                    {identity.label.charAt(0)}
                  </span>
                  Je bent {identity.label} · {identity.line}
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* 2 — Resume: the open loop */}
      {resumeLesson && (
        <section style={{ paddingBottom: 'clamp(2rem, 5vh, 4rem)' }}>
          <div className="sq-container">
            <Reveal>
              <Link
                href={`/learn/${resumeLesson.slug}`}
                className="group sq-panel-inverse flex flex-col gap-3 p-7 transition-transform duration-300 hover:-translate-y-1.5 md:flex-row md:items-center md:justify-between"
                style={{ boxShadow: 'var(--sq-shadow-float)' }}
              >
                <div>
                  <p className="sq-eyebrow" style={{ color: 'var(--sq-accent)' }}>
                    Je was hier gebleven · {lessonPercent(resumeLesson, lessons[resumeLesson.slug])}%
                  </p>
                  <p className="sq-h3 mt-2" style={{ color: 'var(--sq-inverse-ink)' }}>
                    {resumeLesson.title}
                  </p>
                </div>
                <span
                  className="shrink-0 text-sm font-bold transition-transform duration-300 group-hover:translate-x-1.5"
                  style={{ color: 'var(--sq-accent)' }}
                >
                  Ga verder →
                </span>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* 3 — The three lanes */}
      <section style={{ paddingBlock: 'clamp(3rem, 7vh, 5rem)' }}>
        <div className="sq-container">
          <Reveal>
            <p className="sq-eyebrow">Kies je laan</p>
          </Reveal>
          <SplitHeading className="sq-h2 mt-6 max-w-3xl">
            Begin waar jij staat. Bouw jezelf op.
          </SplitHeading>
          <Reveal delay={0.12}>
            <p className="sq-lead mt-6 max-w-2xl">
              Drie lanen, van je allereerste .md-bestand tot front-end op
              studioniveau. Elke laan laat eerst zien wat je aan het einde kunt
              maken. Daarna pas hoe.
            </p>
          </Reveal>
        </div>
      </section>

      {LESSONS.map((manifest, index) => {
        const Artifact = resolveArtifact(manifest.opening.artifact);
        const progress = ready ? lessons[manifest.slug] : undefined;
        const percent = lessonPercent(manifest, progress);
        const lane = LANE_META[manifest.lane];
        const flipped = index % 2 === 1;

        return (
          <section
            key={manifest.slug}
            style={{
              paddingBlock: 'clamp(4.5rem, 10vh, 8rem)',
              background: flipped ? 'var(--sq-sunken)' : undefined,
            }}
          >
            <div className="sq-container">
              <div
                className={`grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] ${
                  flipped ? 'lg:[direction:rtl]' : ''
                }`}
              >
                <div className="lg:[direction:ltr]">
                  <Reveal className="flex flex-wrap items-center gap-3">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                      style={{ background: 'var(--sq-accent)', color: 'var(--sq-paper)' }}
                      aria-hidden="true"
                    >
                      {lane.order}
                    </span>
                    <p className="sq-eyebrow">
                      Laan {lane.order} · {lane.label} · {manifest.minutes} min
                    </p>
                  </Reveal>
                  <SplitHeading className="sq-h2 mt-6">{manifest.title}</SplitHeading>
                  <Reveal delay={0.1}>
                    <p className="sq-lead mt-6 max-w-lg">{lane.forWho}</p>
                  </Reveal>
                  <Reveal delay={0.16}>
                    <p className="sq-muted mt-4 max-w-lg text-[0.9375rem]">
                      {ARCHETYPE_META[manifest.archetype].label}: {manifest.hook}
                    </p>
                  </Reveal>
                  <Reveal delay={0.22} className="mt-9 flex flex-wrap items-center gap-5">
                    <Link href={`/learn/${manifest.slug}`} className="sq-btn sq-btn-accent">
                      <SlotText>
                        {progress?.completedAt
                          ? 'Bekijk opnieuw'
                          : percent > 0
                            ? `Ga verder · ${percent}%`
                            : 'Start deze laan'}
                      </SlotText>
                      <span className="sq-btn-fill" aria-hidden="true" />
                    </Link>
                    <span className="sq-faint">
                      Je neemt mee: {manifest.artifact.title}
                    </span>
                  </Reveal>
                </div>

                <Reveal y={44} delay={0.1} className="lg:[direction:ltr]">
                  <div>
                    <p className="sq-faint mb-3 font-semibold">
                      Het eindresultaat van deze laan: {lane.endResult}
                    </p>
                    {Artifact && (
                      <div
                        className="pointer-events-none"
                        style={{
                          transform: `rotate(${flipped ? 1.5 : -1.5}deg)`,
                        }}
                        aria-hidden="true"
                      >
                        <Artifact compact />
                      </div>
                    )}
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        );
      })}

      {/* 4 — Identity path */}
      <section
        className="border-t"
        style={{ borderColor: 'var(--sq-line)', paddingBlock: 'clamp(5rem, 11vh, 9rem)' }}
      >
        <div className="sq-container">
          <Reveal>
            <p className="sq-eyebrow">Geen punten, geen streaks</p>
          </Reveal>
          <SplitHeading className="sq-h2 mt-6 max-w-3xl">
            Je verzamelt geen badges. Je wordt iemand.
          </SplitHeading>
          <Reveal delay={0.12}>
            <p className="sq-lead mt-6 max-w-2xl">
              Elke les eindigt met een echte asset die je meeneemt. Wie assets
              verzamelt, verandert vanzelf van kijker in architect. Dat is de hele
              gamification, en meer heeft niemand nodig.
            </p>
          </Reveal>

          <Reveal stagger={0.1} className="mt-14 grid gap-5 md:grid-cols-4">
            {IDENTITY_LEVELS.map((level) => {
              const reached = ready && claimCount >= level.minClaims;
              const isCurrent = ready && identity.id === level.id;
              return (
                <div
                  key={level.id}
                  className="sq-panel p-6"
                  style={{
                    borderColor: isCurrent ? 'var(--sq-accent)' : 'var(--sq-line)',
                    boxShadow: isCurrent ? 'var(--sq-shadow-float)' : undefined,
                    opacity: reached || !ready ? 1 : 0.55,
                  }}
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                    style={{
                      background: reached ? 'var(--sq-accent)' : 'var(--sq-deep)',
                      color: reached ? 'var(--sq-paper)' : 'var(--sq-ink-faint)',
                    }}
                    aria-hidden="true"
                  >
                    {level.label.charAt(0)}
                  </span>
                  <p className="sq-h3 mt-4">{level.label}</p>
                  <p className="sq-muted mt-1.5 text-sm">{level.line}</p>
                  <p className="sq-faint mt-3">
                    {level.minClaims === 0
                      ? 'Waar iedereen begint'
                      : `Na ${level.minClaims} ${level.minClaims === 1 ? 'asset' : 'assets'}`}
                  </p>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* 5 — Closing CTA */}
      <section
        style={{ background: 'var(--sq-sunken)', paddingBlock: 'clamp(5rem, 11vh, 9rem)' }}
      >
        <div className="sq-container text-center">
          <SplitHeading className="sq-h2 mx-auto max-w-2xl">
            De eerste les duurt tien minuten.
          </SplitHeading>
          <Reveal delay={0.15}>
            <p className="sq-lead mx-auto mt-6 max-w-xl">
              En je hoeft niets aan te maken, niets te installeren en niemand iets
              te beloven. Kijken mag ook gewoon.
            </p>
          </Reveal>
          <Reveal delay={0.22} className="mt-10">
            <Link
              href={`/learn/${LESSONS[0].slug}`}
              className="sq-btn sq-btn-accent !px-9 !py-[1.2rem] !text-base"
            >
              <SlotText>Begin met kijken</SlotText>
              <span className="sq-btn-fill" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

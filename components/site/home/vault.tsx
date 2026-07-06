'use client';

import { TransitionLink as Link } from '@/components/providers/PageTransition';
import { SplitHeading } from '@/components/site/split-heading';
import { Reveal } from '@/components/site/reveal';

/**
 * Section 7 — The product.
 * Goal: tangibility. Na de droom volgt het gereedschap: een eigen vault die
 * alles onthoudt en direct in je AI-tools zit. Dit is het "serieus product"-moment.
 */

const VAULT_POINTS = [
  {
    title: 'Eén vault voor alles wat werkt',
    body: 'Paletten, typografie, design systems, secties en media. Nooit meer zoeken in oude chats.',
  },
  {
    title: 'Kits: bundels voor je AI',
    body: 'Bundel assets tot een kit en geef je AI in één keer alles wat een project nodig heeft.',
  },
  {
    title: 'Direct in je tools',
    body: 'Via MCP praat je vault rechtstreeks met Claude Code en Cursor. Je assets zijn er gewoon, altijd.',
  },
];

export function Vault() {
  return (
    <section
      style={{
        background: 'var(--sq-sunken)',
        paddingBlock: 'clamp(7rem, 14vh, 12rem)',
      }}
    >
      <div className="sq-container grid items-center gap-16 lg:grid-cols-[5fr_7fr]">
        <div>
          <Reveal>
            <p className="sq-eyebrow">Het gereedschap</p>
          </Reveal>
          <SplitHeading className="sq-h2 mt-6">
            Jouw geheugen. Altijd bij de hand.
          </SplitHeading>
          <Reveal delay={0.12}>
            <p className="sq-lead mt-7">
              Alles wat je verzamelt en leert komt in je eigen vault terecht. Die groeit
              met je mee, project na project.
            </p>
          </Reveal>

          <Reveal stagger={0.12} className="mt-12 space-y-8">
            {VAULT_POINTS.map((point) => (
              <div key={point.title} className="flex gap-5">
                <span
                  aria-hidden="true"
                  className="mt-2 h-3 w-3 shrink-0 rounded-full"
                  style={{ background: 'var(--sq-accent)' }}
                />
                <div>
                  <h3 className="sq-h3 !text-[1.125rem]">{point.title}</h3>
                  <p className="sq-muted mt-1.5 text-[0.9375rem] leading-relaxed">{point.body}</p>
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.1} className="mt-12">
            <Link href="/auth" className="sq-btn sq-btn-ghost">
              Open je eigen vault
            </Link>
          </Reveal>
        </div>

        {/* Vault product film — replaces the static UI sketch with the real thing */}
        <Reveal y={64}>
          <div
            className="sq-panel-inverse relative overflow-hidden p-2 md:p-3"
            style={{ boxShadow: 'var(--sq-shadow-float)' }}
          >
            <video
              className="aspect-video w-full rounded-2xl object-cover"
              src="/video/struq-film.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

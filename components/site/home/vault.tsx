'use client';

import Link from 'next/link';
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

const MOCK_ASSETS = [
  { label: 'Hero · Stil en groots', tone: 'var(--sq-accent-wash)', chip: 'var(--sq-accent)' },
  { label: 'Palet · Warm papier', tone: 'var(--sq-inverse-raised)', chip: 'var(--sq-accent)' },
  { label: 'Reveal · Zachte entree', tone: 'var(--sq-inverse-raised)', chip: 'var(--sq-accent)' },
  { label: 'CLAUDE.md · Basis', tone: 'var(--sq-inverse-raised)', chip: 'var(--sq-accent)' },
  { label: 'Buttons · Magnetisch', tone: 'var(--sq-inverse-raised)', chip: 'var(--sq-accent)' },
  { label: 'Type · Comfortaa-schaal', tone: 'var(--sq-accent-wash)', chip: 'var(--sq-accent)' },
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

        {/* Vault UI sketch — inverse panel so the product feels like a cockpit */}
        <Reveal y={64}>
          <div
            className="sq-panel-inverse relative overflow-hidden p-4 md:p-6"
            style={{ boxShadow: 'var(--sq-shadow-float)' }}
          >
            <div className="flex gap-4">
              {/* Sidebar */}
              <div className="hidden w-36 shrink-0 flex-col gap-2 sm:flex">
                <p className="sq-display px-3 py-2 text-sm font-semibold" style={{ color: 'var(--sq-inverse-ink)' }}>
                  struq<span style={{ color: 'var(--sq-accent)' }}>.</span>
                </p>
                {['Vault', 'Kits', 'Projecten', 'Favorieten'].map((item, index) => (
                  <span
                    key={item}
                    className="rounded-lg px-3 py-2 text-sm"
                    style={{
                      background: index === 0 ? 'color-mix(in srgb, var(--sq-accent) 18%, transparent)' : 'transparent',
                      color: index === 0 ? 'var(--sq-accent)' : 'var(--sq-inverse-soft)',
                      fontWeight: index === 0 ? 700 : 500,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* Asset grid */}
              <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-3">
                {MOCK_ASSETS.map((asset) => (
                  <div
                    key={asset.label}
                    className="rounded-xl p-4"
                    style={{ background: 'color-mix(in srgb, var(--sq-inverse-ink) 6%, transparent)' }}
                  >
                    <span className="block h-2 w-8 rounded-full" style={{ background: asset.chip }} />
                    <p className="mt-4 text-[0.8125rem] font-semibold leading-snug" style={{ color: 'var(--sq-inverse-ink)' }}>
                      {asset.label}
                    </p>
                    <p className="mt-1 text-xs" style={{ color: 'var(--sq-inverse-soft)' }}>
                      Klaar om te plakken
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating kit card overlapping the panel edge */}
            <div
              className="sq-panel absolute -bottom-5 -right-4 w-56 rotate-[-2deg] p-5 md:-right-6"
              style={{ boxShadow: 'var(--sq-shadow-float)' }}
            >
              <p className="sq-eyebrow !text-[0.6875rem]">Kit</p>
              <p className="mt-2 font-bold">Landingspagina compleet</p>
              <p className="sq-faint mt-1">8 assets · 1 klik</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

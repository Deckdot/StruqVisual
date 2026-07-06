'use client';

import { TransitionLink } from '@/components/providers/PageTransition';
import { SplitHeading } from '@/components/site/split-heading';
import { Reveal } from '@/components/site/reveal';
import { SlotText } from '@/components/site/slot-text';

/**
 * Section 9 — Pricing.
 * Goal: risico wegnemen. Gratis is een echt plan, geen lokkertje; Pro is er
 * voor wie Struq als vaste werklaag gaat gebruiken.
 */

const FREE_FEATURES = [
  '75 assets in je eigen vault',
  '3 projecten',
  'Alle gratis visuele assets en lessen',
  'Werkt met elke AI-tool',
];

const PRO_FEATURES = [
  'Onbeperkt assets, projecten en kits',
  'Vault-koppeling in je tools via MCP',
  'Vault-export en bulk-import',
  '50 versies per asset',
];

export function Pricing() {
  return (
    <section
      id="prijzen"
      style={{ background: 'var(--sq-sunken)', paddingBlock: 'clamp(7rem, 14vh, 12rem)' }}
    >
      <div className="sq-container">
        <div className="max-w-2xl">
          <Reveal>
            <p className="sq-eyebrow">Prijzen</p>
          </Reveal>
          <SplitHeading className="sq-h2 mt-6">
            Begin gratis. Blijf gratis zolang je wilt.
          </SplitHeading>
          <Reveal delay={0.12}>
            <p className="sq-lead mt-7">
              Geen proefperiode die afloopt, geen creditcard vooraf. Upgrade pas als je
              vault te klein wordt voor je ambitie.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:gap-12">
          {/* Free */}
          <Reveal y={48}>
            <div className="sq-panel flex h-full flex-col p-9 md:p-11">
              <p className="sq-eyebrow">Gratis</p>
              <p className="sq-display mt-6 text-5xl">
                €0
                <span className="sq-muted ml-2 align-middle text-base font-normal">voor altijd</span>
              </p>
              <ul className="mt-9 space-y-4">
                {FREE_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-2 w-2 shrink-0 rounded-full"
                      style={{ background: 'var(--sq-accent)' }}
                    />
                    <span className="text-[0.9375rem]">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-10">
                <TransitionLink href="/vault" className="sq-btn sq-btn-primary w-full">
                  <SlotText>Begin gratis, geen account nodig</SlotText>
                  <span className="sq-btn-fill" aria-hidden="true" />
                </TransitionLink>
                <p className="sq-faint mt-4 text-center">Geen creditcard nodig</p>
              </div>
            </div>
          </Reveal>

          {/* Pro */}
          <Reveal y={48} delay={0.12}>
            <div
              className="sq-panel-inverse relative flex h-full flex-col overflow-hidden p-9 md:-mt-6 md:p-11"
              style={{ boxShadow: 'var(--sq-shadow-float)' }}
            >
              <span
                className="absolute right-8 top-8 rounded-full px-3.5 py-1.5 text-xs font-bold"
                style={{ background: 'var(--sq-accent)', color: '#fff8f2' }}
              >
                Meest gekozen
              </span>
              <p className="sq-eyebrow" style={{ color: 'var(--sq-accent)' }}>
                Pro
              </p>
              <p className="sq-display mt-6 text-5xl" style={{ color: 'var(--sq-inverse-ink)' }}>
                €9
                <span className="ml-2 align-middle text-base font-normal" style={{ color: 'var(--sq-inverse-soft)' }}>
                  per maand, jaarlijks
                </span>
              </p>
              <p className="mt-2 text-sm" style={{ color: 'var(--sq-inverse-soft)' }}>
                Of €12 per maand, maandelijks opzegbaar.
              </p>
              <ul className="mt-9 space-y-4">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-2 w-2 shrink-0 rounded-full"
                      style={{ background: 'var(--sq-accent)' }}
                    />
                    <span className="text-[0.9375rem]" style={{ color: 'var(--sq-inverse-ink)' }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-10">
                <TransitionLink href="/auth?next=/pro" className="sq-btn sq-btn-accent w-full">
                  <SlotText>Word Pro</SlotText>
                  <span className="sq-btn-fill" aria-hidden="true" />
                </TransitionLink>
                <p className="mt-4 text-center text-sm" style={{ color: 'var(--sq-inverse-soft)' }}>
                  Early adopter-prijs
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

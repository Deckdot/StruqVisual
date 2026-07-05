'use client';

import { Reveal } from '@/components/site/reveal';
import { Magnetic } from '@/components/site/magnetic';
import { TransitionLink } from '@/components/providers/PageTransition';

const FOOTER_COLUMNS = [
  {
    title: 'Ontdek',
    links: [
      { href: '/visueel', label: 'Wat je maakt' },
      { href: '/methode', label: 'De methode' },
      { href: '/#prijzen', label: 'Prijzen' },
      { href: '/learn', label: 'Learn' },
    ],
  },
  {
    title: 'Lezen',
    links: [
      { href: '/learn', label: 'Gratis lessen' },
      { href: '/privacy-policy', label: 'Privacy' },
    ],
  },
  {
    title: 'Account',
    links: [
      { href: '/auth', label: 'Inloggen' },
      { href: '/auth', label: 'Gratis beginnen' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: 'var(--sq-inverse)', color: 'var(--sq-inverse-ink)' }}
    >
      {/* Closing CTA */}
      <div className="sq-container relative z-10 pt-28 pb-20 md:pt-40 md:pb-28">
        <Reveal stagger={0.1}>
          <p className="sq-eyebrow" style={{ color: 'var(--sq-accent)' }}>
            Klaar om te bouwen?
          </p>
          <h2 className="sq-display mt-6 max-w-4xl text-[clamp(2.5rem,6.5vw,6rem)] leading-[1.05] tracking-tight">
            Maak iets waar mensen even stil van worden.
          </h2>
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <Magnetic>
              <TransitionLink href="/auth" className="sq-btn sq-btn-accent !px-10 !py-5 !text-base">
                Start gratis
              </TransitionLink>
            </Magnetic>
            <p className="sq-faint" style={{ color: 'var(--sq-inverse-soft)' }}>
              Geen creditcard. Geen designdiploma.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Link grid */}
      <div
        className="relative z-10 border-t"
        style={{ borderColor: 'color-mix(in srgb, var(--sq-inverse-ink) 12%, transparent)' }}
      >
        <div className="sq-container grid gap-12 py-16 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <p className="sq-display text-2xl font-semibold">
              struq<span style={{ color: 'var(--sq-accent)' }}>.</span>
            </p>
            <p className="mt-4 max-w-xs text-[0.9375rem] leading-relaxed" style={{ color: 'var(--sq-inverse-soft)' }}>
              De visuele bibliotheek voor AI-builders. Bouw front-ends waar je trots op bent, en leer onderweg hoe het werkt.
            </p>
          </div>
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="sq-eyebrow" style={{ color: 'var(--sq-inverse-soft)' }}>
                {column.title}
              </p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <TransitionLink
                      href={link.href}
                      className="text-[0.9375rem] transition-colors hover:opacity-100"
                      style={{ color: 'var(--sq-inverse-soft)' }}
                      onMouseEnter={(event) => {
                        event.currentTarget.style.color = 'var(--sq-inverse-ink)';
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.color = 'var(--sq-inverse-soft)';
                      }}
                    >
                      {link.label}
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* Meta row */}
      <div
        className="relative z-10 border-t"
        style={{ borderColor: 'color-mix(in srgb, var(--sq-inverse-ink) 12%, transparent)' }}
      >
        <div className="sq-container flex flex-wrap items-center justify-between gap-4 py-8">
          <p className="text-sm" style={{ color: 'var(--sq-inverse-soft)' }}>
            © {new Date().getFullYear()} Struq. Gemaakt in Nederland.
          </p>
          <p className="text-sm" style={{ color: 'var(--sq-inverse-soft)' }}>
            Stop met herhalen. Begin met schalen.
          </p>
        </div>
      </div>

      {/* Watermark wordmark bleeding off the bottom */}
      <div
        aria-hidden="true"
        className="sq-display pointer-events-none absolute -bottom-[0.28em] left-1/2 z-0 -translate-x-1/2 select-none whitespace-nowrap font-bold leading-none"
        style={{
          fontSize: 'clamp(8rem, 26vw, 24rem)',
          color: 'color-mix(in srgb, var(--sq-inverse-ink) 5%, transparent)',
        }}
      >
        struq
      </div>
    </footer>
  );
}

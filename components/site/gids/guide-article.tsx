'use client';

import { useState } from 'react';
import { TransitionLink as Link } from '@/components/providers/PageTransition';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { SiteShell } from '@/components/site/site-shell';
import { SplitHeading } from '@/components/site/split-heading';
import { Reveal } from '@/components/site/reveal';
import { getGuide, type GuideBlock, type GuideDef } from '@/lib/gids/guides';

/**
 * Renderer voor de AEO-gidsen (/gids/[slug]). Content-first en licht in
 * motion (alleen Reveal/SplitHeading): deze pagina's bestaan om geciteerd te
 * worden door AI-assistenten, dus semantische HTML en snelle LCP winnen het
 * van showpieces. FAQ is native <details> zodat de antwoorden zonder JS in de
 * DOM staan.
 */

function formatDutchDate(iso: string): string {
  return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(`${iso}T00:00:00`)
  );
}

function PromptBlock({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <figure className="my-6 overflow-hidden rounded-2xl border" style={{ background: 'var(--sq-sunken)', borderColor: 'var(--sq-line)' }}>
      <figcaption
        className="flex items-center justify-between gap-3 border-b px-5 py-3"
        style={{ borderColor: 'var(--sq-line)' }}
      >
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--sq-accent-ink)' }}>
          {label}
        </span>
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard
              .writeText(text)
              .then(() => {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              })
              .catch(() => undefined);
          }}
          className="flex cursor-pointer items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
          style={{ color: 'var(--sq-ink-soft)' }}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Gekopieerd' : 'Kopieer'}
        </button>
      </figcaption>
      <p className="whitespace-pre-wrap px-5 py-4 text-sm leading-relaxed" style={{ color: 'var(--sq-ink)' }}>
        {text}
      </p>
    </figure>
  );
}

function Block({ block }: { block: GuideBlock }) {
  if (block.kind === 'paragraph') {
    return (
      <p className="my-4 max-w-2xl leading-relaxed" style={{ color: 'var(--sq-ink-soft)' }}>
        {block.text}
      </p>
    );
  }
  if (block.kind === 'list') {
    const items = block.items.map((item) => (
      <li key={item} className="leading-relaxed" style={{ color: 'var(--sq-ink-soft)' }}>
        {item}
      </li>
    ));
    return block.ordered ? (
      <ol className="my-5 max-w-2xl list-decimal space-y-3 pl-5 marker:font-semibold marker:text-[color:var(--sq-accent)]">
        {items}
      </ol>
    ) : (
      <ul className="my-5 max-w-2xl list-disc space-y-3 pl-5 marker:text-[color:var(--sq-accent)]">{items}</ul>
    );
  }
  if (block.kind === 'prompt') {
    return <PromptBlock label={block.label} text={block.text} />;
  }
  return (
    <aside
      className="my-6 flex max-w-2xl flex-col gap-3 rounded-2xl px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
      style={{ background: 'var(--sq-accent-wash)' }}
    >
      <div>
        <p className="font-semibold" style={{ color: 'var(--sq-accent-ink)' }}>
          {block.title}
        </p>
        <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--sq-accent-ink)' }}>
          {block.text}
        </p>
      </div>
      <Link href={block.href} className="sq-btn sq-btn-primary !h-11 shrink-0 !px-5 !text-sm">
        {block.linkLabel}
        <ArrowUpRight className="ml-1 h-4 w-4" />
      </Link>
    </aside>
  );
}

export function GuideArticle({ guide }: { guide: GuideDef }) {
  const related = guide.related
    .map((slug) => getGuide(slug))
    .filter((entry): entry is GuideDef => entry !== null);

  return (
    <SiteShell>
      <article>
        {/* Kop */}
        <header style={{ paddingTop: 'clamp(9rem, 15vh, 12rem)', paddingBottom: 'clamp(2rem, 4vh, 3rem)' }}>
          <div className="sq-container">
            <Reveal>
              <p className="sq-eyebrow">
                <Link href="/gids" className="transition-opacity hover:opacity-70">
                  Gids
                </Link>
              </p>
            </Reveal>
            <SplitHeading as="h1" className="sq-h2 mt-6 max-w-3xl" delay={0.1} start="top 100%">
              {guide.question}
            </SplitHeading>
            <Reveal delay={0.2}>
              <p className="sq-lead mt-7 max-w-2xl">{guide.intro}</p>
            </Reveal>
            <Reveal delay={0.28}>
              <p className="sq-faint mt-5">Laatst bijgewerkt op {formatDutchDate(guide.dateModified)}</p>
            </Reveal>
          </div>
        </header>

        {/* Direct antwoord: het citeerbare blok */}
        <div className="sq-container">
          <Reveal>
            <div
              className="max-w-2xl rounded-2xl border-l-4 py-5 pl-6 pr-6"
              style={{ background: 'var(--sq-raised)', borderColor: 'var(--sq-accent)', boxShadow: 'none' }}
            >
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--sq-accent-ink)' }}>
                Direct antwoord
              </p>
              <p className="mt-2 leading-relaxed" style={{ color: 'var(--sq-ink)' }}>
                {guide.directAnswer}
              </p>
            </div>
          </Reveal>

          {/* Inhoud (anchors voor deep links en AI-extractie) */}
          <Reveal delay={0.1}>
            <nav aria-label="In deze gids" className="mt-10 max-w-2xl">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--sq-ink-faint)' }}>
                In deze gids
              </p>
              <ul className="mt-3 space-y-1.5">
                {guide.sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="sq-link !text-[0.9375rem] !font-medium">
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>
        </div>

        {/* Secties */}
        <div className="sq-container" style={{ paddingBottom: 'clamp(2rem, 4vh, 3rem)' }}>
          {guide.sections.map((section) => (
            <Reveal key={section.id} as="section" y={28}>
              <h2 id={section.id} className="sq-h3 mt-14 scroll-mt-28 max-w-2xl">
                {section.heading}
              </h2>
              {section.blocks.map((block, index) => (
                <Block key={index} block={block} />
              ))}
            </Reveal>
          ))}
        </div>

        {/* FAQ */}
        <section className="sq-container" style={{ paddingBottom: 'clamp(3rem, 6vh, 5rem)' }}>
          <Reveal>
            <h2 className="sq-h3 mt-6 max-w-2xl">Veelgestelde vragen</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-6 max-w-2xl overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--sq-line)' }}>
              {guide.faqs.map((faq, index) => (
                <details
                  key={faq.question}
                  className="group"
                  style={index > 0 ? { borderTop: '1px solid var(--sq-line)' } : undefined}
                >
                  <summary
                    className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 font-medium transition-colors [&::-webkit-details-marker]:hidden"
                    style={{ background: 'var(--sq-raised)' }}
                  >
                    {faq.question}
                    <span
                      aria-hidden
                      className="text-lg leading-none transition-transform duration-200 group-open:rotate-45"
                      style={{ color: 'var(--sq-accent)' }}
                    >
                      +
                    </span>
                  </summary>
                  <p className="px-5 pb-5 pt-1 text-[0.9375rem] leading-relaxed" style={{ color: 'var(--sq-ink-soft)' }}>
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Gerelateerd + CTA */}
        <section className="sq-container" style={{ paddingBottom: 'clamp(6rem, 10vh, 9rem)' }}>
          {related.length > 0 && (
            <Reveal>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--sq-ink-faint)' }}>
                Lees ook
              </p>
              <div className="mt-4 grid max-w-3xl gap-4 sm:grid-cols-2">
                {related.map((entry) => (
                  <Link
                    key={entry.slug}
                    href={`/gids/${entry.slug}`}
                    className="group rounded-2xl border p-5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
                    style={{ background: 'var(--sq-raised)', borderColor: 'var(--sq-line)' }}
                  >
                    <p className="sq-display text-lg leading-snug">{entry.question}</p>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed" style={{ color: 'var(--sq-ink-soft)' }}>
                      {entry.intro}
                    </p>
                  </Link>
                ))}
              </div>
            </Reveal>
          )}

          <Reveal delay={0.1} y={40}>
            <div
              className="relative mt-12 overflow-hidden rounded-[2rem] px-7 py-12 sm:px-14 sm:py-14"
              style={{ background: 'var(--sq-inverse)', color: 'var(--sq-inverse-ink)' }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-16 -right-12 h-48 w-48 rounded-full sm:h-60 sm:w-60"
                style={{ background: 'var(--sq-accent)' }}
              />
              <p className="sq-eyebrow" style={{ color: 'var(--sq-accent)' }}>
                Gratis bibliotheek
              </p>
              <h2 className="sq-display mt-4 max-w-xl text-[clamp(1.6rem,3vw,2.5rem)] leading-tight">
                Alles uit deze gids staat klaar om te kopiëren.
              </h2>
              <p className="mt-4 max-w-md" style={{ color: 'var(--sq-inverse-soft)' }}>
                Paletten, font-pairings en prompts, gecureerd en gratis. Plak ze in je AI en zie meteen verschil.
              </p>
              <Link href="/galerij" className="sq-btn sq-btn-accent mt-8">
                Open de galerij
                <ArrowUpRight className="ml-1.5 h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </section>
      </article>
    </SiteShell>
  );
}

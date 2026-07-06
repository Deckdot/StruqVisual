import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Check, Copy, Plug, Sparkles } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Pro | Struq',
  robots: { index: false, follow: false },
};

// Reads the viewer's tier to show the right state (already Pro vs. upgrade).
export const dynamic = 'force-dynamic';

/**
 * The contextual upgrade destination. Reached from a locked Pro asset, never
 * from a permanent nav item or nag banner (psychology skill: the upgrade moment
 * is contextual). Pro is anchored against the value of the library, not against
 * what free lacks. Checkout itself lands with M5/Stripe — this page states the
 * value honestly and marks the seam.
 */
export default async function ProPage() {
  const viewer = await getSessionUser();
  const isPro = viewer?.tier === 'pro';

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/vault"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary-text transition-colors duration-150 hover:text-primary-text"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Terug naar de bibliotheek
      </Link>

      <div className="mt-6">
        <p className="text-sm text-meta-text">Struq Pro</p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-wide text-primary-text">
          {isPro ? 'Je hebt Pro' : 'De hele bibliotheek, klaar voor je AI'}
        </h1>
        <p className="mt-3 leading-relaxed text-secondary-text/90">
          {isPro
            ? 'Elke prompt in de bibliotheek staat voor je open. Kopieer wat je nodig hebt en plak het in je AI.'
            : 'Gratis is echt goed: je bladert door alles, bewaart wat je mooi vindt en kopieert de gratis prompts. Pro voegt de Pro-prompts toe en straks je vault rechtstreeks in je AI-tool.'}
        </p>
      </div>

      <ul className="mt-8 space-y-4">
        <li className="flex gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-panel text-primary-text">
            <Copy className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <div>
            <p className="font-medium text-primary-text">Elke prompt kopieerbaar</p>
            <p className="mt-0.5 text-sm leading-relaxed text-secondary-text/90">
              Ook de Pro-assets. Eén kopieeractie, elk model, direct verschil.
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-panel text-primary-text">
            <Plug className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <div>
            <p className="font-medium text-primary-text">Je vault via MCP</p>
            <p className="mt-0.5 text-sm leading-relaxed text-secondary-text/90">
              Je vault praat rechtstreeks met Claude Code en Cursor. Geen kopiëren meer nodig. Binnenkort.
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-panel text-primary-text">
            <Sparkles className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <div>
            <p className="font-medium text-primary-text">Rijke previews</p>
            <p className="mt-0.5 text-sm leading-relaxed text-secondary-text/90">
              Zie precies wat een asset doet voordat je hem in je AI plakt.
            </p>
          </div>
        </li>
      </ul>

      <div className="mt-10 rounded-2xl border border-border bg-panel p-6">
        {isPro ? (
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-accent">
              <Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </span>
            <p className="font-medium text-primary-text">Je account staat op Pro. Alles is ontgrendeld.</p>
          </div>
        ) : (
          <>
            <p className="font-medium text-primary-text">Pro komt eraan</p>
            <p className="mt-1 text-sm leading-relaxed text-secondary-text/90">
              We zetten de afrekening binnenkort live. Tot die tijd blijft de gratis bibliotheek van jou.
            </p>
            <span className="mt-4 inline-flex h-9 cursor-not-allowed items-center rounded-lg border border-border px-4 text-sm font-medium text-meta-text">
              Binnenkort beschikbaar
            </span>
          </>
        )}
      </div>
    </div>
  );
}

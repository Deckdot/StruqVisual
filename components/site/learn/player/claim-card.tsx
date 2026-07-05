'use client';

/**
 * The claim moment: the artifact becomes yours. Placed at the emotional peak
 * (peak-end rule). Anonymous learners can copy or download immediately;
 * "bewaar in je vault" is the conversion moment and survives the signup
 * redirect via the pending-claim stash.
 */

import { useEffect, useState } from 'react';
import { TransitionLink as Link } from '@/components/providers/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import type { LessonManifest } from '@/lib/learn/schema';
import { stashPendingClaim, takePendingClaim, useLearnProgress } from '@/lib/learn/progress';

type VaultState = 'idle' | 'saving' | 'saved' | 'error';

async function saveToVault(manifest: LessonManifest): Promise<boolean> {
  try {
    const response = await fetch('/api/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: manifest.artifact.assetType,
        title: manifest.artifact.title,
        summary: manifest.artifact.description,
        body: manifest.artifact.body,
        tags: manifest.artifact.tags,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export function ClaimCard({ manifest }: { manifest: LessonManifest }) {
  // Auth komt in M5 (Auth.js); tot die tijd volgt iedereen het anonieme pad
  // (kopiëren/downloaden + pending-claim stash richting /auth).
  const [status] = useState<'unauthenticated' | 'authenticated' | 'loading'>('unauthenticated');
  const { lessons, markClaimed, identity } = useLearnProgress();
  const [copied, setCopied] = useState(false);
  const [vaultState, setVaultState] = useState<VaultState>('idle');

  const claimed = lessons[manifest.slug]?.claimed ?? false;
  const authenticated = status === 'authenticated';

  // Complete a claim that was stashed before the signup redirect.
  useEffect(() => {
    if (!authenticated) return;
    const pending = takePendingClaim();
    if (pending?.slug !== manifest.slug) return;
    setVaultState('saving');
    saveToVault(manifest).then((ok) => {
      setVaultState(ok ? 'saved' : 'error');
      if (ok) markClaimed(manifest.slug);
    });
  }, [authenticated, manifest, markClaimed]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(manifest.artifact.body);
      setCopied(true);
      markClaimed(manifest.slug);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard unavailable: the download path still works.
    }
  };

  const handleDownload = () => {
    const blob = new Blob([manifest.artifact.body], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = manifest.artifact.filename;
    anchor.click();
    URL.revokeObjectURL(url);
    markClaimed(manifest.slug);
  };

  const handleVault = async () => {
    if (!authenticated) {
      stashPendingClaim({ slug: manifest.slug });
      return;
    }
    setVaultState('saving');
    const ok = await saveToVault(manifest);
    setVaultState(ok ? 'saved' : 'error');
    if (ok) markClaimed(manifest.slug);
  };

  return (
    <div
      className="sq-panel-inverse p-7 md:p-9"
      style={{ boxShadow: 'var(--sq-shadow-float)' }}
    >
      <p className="sq-eyebrow" style={{ color: 'var(--sq-accent)' }}>
        Jouw asset · {manifest.artifact.assetType}
      </p>
      <p className="sq-h3 mt-3" style={{ color: 'var(--sq-inverse-ink)' }}>
        {manifest.artifact.title}
      </p>
      <p className="mt-2 max-w-xl text-sm leading-relaxed" style={{ color: 'var(--sq-inverse-soft)' }}>
        {manifest.artifact.description}
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-3.5">
        {authenticated ? (
          <button
            type="button"
            onClick={handleVault}
            disabled={vaultState === 'saving' || vaultState === 'saved'}
            className="sq-btn sq-btn-accent !px-7 !py-3.5 !text-sm"
          >
            {vaultState === 'saved'
              ? 'Staat in je vault'
              : vaultState === 'saving'
                ? 'Bewaren…'
                : 'Bewaar in je vault'}
          </button>
        ) : (
          <Link
            href="/auth"
            onClick={handleVault}
            className="sq-btn sq-btn-accent !px-7 !py-3.5 !text-sm"
          >
            Bewaar in je vault · gratis account
          </Link>
        )}

        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full border px-6 py-3 text-sm font-bold transition-transform hover:scale-[1.03] active:scale-95"
          style={{
            borderColor: 'color-mix(in srgb, var(--sq-inverse-soft) 45%, transparent)',
            color: 'var(--sq-inverse-ink)',
          }}
        >
          {copied ? 'Gekopieerd' : 'Kopieer'}
        </button>

        <button
          type="button"
          onClick={handleDownload}
          className="rounded-full border px-6 py-3 text-sm font-bold transition-transform hover:scale-[1.03] active:scale-95"
          style={{
            borderColor: 'color-mix(in srgb, var(--sq-inverse-soft) 45%, transparent)',
            color: 'var(--sq-inverse-ink)',
          }}
        >
          Download {manifest.artifact.filename}
        </button>
      </div>

      {vaultState === 'error' && (
        <p className="mt-4 text-sm" style={{ color: 'var(--sq-accent)' }}>
          Bewaren lukte even niet. Probeer het nog eens, of kopieer de asset.
        </p>
      )}

      <AnimatePresence>
        {claimed && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
            className="mt-7 flex items-center gap-4 rounded-2xl px-5 py-4"
            style={{ background: 'color-mix(in srgb, var(--sq-accent) 14%, transparent)' }}
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold"
              style={{ background: 'var(--sq-accent)', color: 'var(--sq-paper)' }}
              aria-hidden="true"
            >
              {identity.label.charAt(0)}
            </span>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--sq-inverse-ink)' }}>
                Je bent nu {identity.label}
              </p>
              <p className="text-xs" style={{ color: 'var(--sq-inverse-soft)' }}>
                {identity.line}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

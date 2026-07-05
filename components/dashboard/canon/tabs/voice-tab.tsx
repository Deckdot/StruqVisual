'use client';

// components/dashboard/canon/tabs/voice-tab.tsx
// Voice archetype cards. Ported from DesignOS VoiceTab (visual layer).

import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { CANON_VOICES } from '@/lib/canon/voices';

export function VoiceTab() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {CANON_VOICES.map((voice) => (
        <motion.div
          key={voice.id}
          className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="flex items-start justify-between border-b border-border pb-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-[1.1rem] font-medium tracking-wide text-primary-text">{voice.name}</h3>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-panel text-accent">
              <MessageSquare className="h-4.5 w-4.5" strokeWidth={1.5} aria-hidden="true" />
            </div>
          </div>

          <p className="text-[0.9rem] leading-relaxed text-secondary-text/90">{voice.summary}</p>

          {voice.sample && (
            <blockquote
              className="rounded-2xl border border-border bg-panel/60 px-4 py-3 text-[0.95rem] italic leading-relaxed text-primary-text"
            >
              “{voice.sample}”
            </blockquote>
          )}

          <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-4">
            {voice.traits.map((trait) => (
              <span
                key={trait}
                className="rounded-full border border-border bg-panel px-3 py-1 text-[0.72rem] font-medium uppercase tracking-wide text-meta-text"
              >
                {trait}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

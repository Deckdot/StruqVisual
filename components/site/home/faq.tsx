'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SplitHeading } from '@/components/site/split-heading';
import { Reveal } from '@/components/site/reveal';
import { SITE_FAQ_ITEMS } from '@/components/site/home/faq-items';

/**
 * Section 10 — FAQ.
 * Goal: laatste bezwaren wegnemen vlak voor de afsluitende CTA in de footer.
 */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" style={{ paddingBlock: 'clamp(7rem, 14vh, 12rem)' }}>
      <div className="sq-container grid gap-14 lg:grid-cols-[2fr_3fr]">
        <div>
          <Reveal>
            <p className="sq-eyebrow">Nog even eerlijk</p>
          </Reveal>
          <SplitHeading className="sq-h2 mt-6">
            Alles wat je je afvraagt.
          </SplitHeading>
          <Reveal delay={0.12}>
            <p className="sq-lead mt-7 max-w-sm">
              Staat je vraag er niet tussen? Stel hem gerust via de chat zodra je binnen
              bent.
            </p>
          </Reveal>
        </div>

        <Reveal stagger={0.07} className="divide-y" style={{ borderColor: 'var(--sq-line)' }}>
          {SITE_FAQ_ITEMS.map((item, index) => {
            const isOpen = open === index;
            return (
              <div key={item.q} style={{ borderColor: 'var(--sq-line)' }}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="sq-h3 !text-[1.0625rem] md:!text-[1.1875rem]">{item.q}</span>
                  <motion.span
                    aria-hidden="true"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-lg"
                    style={{
                      borderColor: isOpen ? 'var(--sq-accent)' : 'var(--sq-line-strong)',
                      color: isOpen ? 'var(--sq-accent)' : 'inherit',
                    }}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="sq-muted max-w-xl pb-7 leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

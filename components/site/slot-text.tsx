import type { ReactNode } from 'react';

/**
 * Slot-roll button label (casino-reel hover). Renders the label twice, stacked;
 * on `.sq-btn` hover both lines translate up in sync so the visible label rolls
 * out the top and its duplicate rolls in from below. CSS lives in globals.css
 * under `.sq-slot` (reduced-motion collapses it to a static label).
 *
 * Usage: put it around the *text* of a `.sq-btn`, keeping icons as siblings so
 * they animate on their own:
 *   <Link className="sq-btn sq-btn-primary">
 *     <SlotText>Start gratis</SlotText>
 *     <ArrowUpRight className="..." />
 *   </Link>
 */
export function SlotText({ children }: { children: ReactNode }) {
  return (
    <span className="sq-slot">
      <span className="sq-slot-line">{children}</span>
      <span className="sq-slot-line" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}

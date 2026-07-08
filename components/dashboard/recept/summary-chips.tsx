'use client';

// components/dashboard/recept/summary-chips.tsx
//
// The collapsed-summary visuals — the progressive-disclosure workhorse. Each chip
// communicates the current selection visually (recognition over recall) and is
// shared between the desktop rail's collapsed section rows and the mobile chip bar,
// so both surfaces speak one recognition language.
//
// Raw palette values render via inline style (the palette-renderer exception — same
// as ColorTab/CanonPreviewDialog); no colour utilities in className.

import { Icon } from '@iconify/react';
import type { Palette, FontPairing, IconSet, IconSemanticId } from '@/lib/canon/types';
import { fontStacksFor } from '@/lib/recept/font-stacks';

/** Five overlapping colour dots from a palette. */
export function PaletteChip({ palette }: { palette: Palette }) {
  const colors = Object.values(palette.colors);
  return (
    <span className="flex items-center">
      {colors.map((color, i) => (
        <span
          key={i}
          className="h-4 w-4 rounded-full border border-border/60"
          style={{ backgroundColor: color, marginLeft: i === 0 ? 0 : '-0.35rem' }}
        />
      ))}
    </span>
  );
}

/** "Aa" set in the pairing's actual display font. */
export function TypographyChip({ pairing }: { pairing: FontPairing }) {
  const stacks = fontStacksFor(pairing.id);
  return (
    <span className="text-[1.05rem] leading-none text-primary-text" style={{ fontFamily: stacks.display }}>
      Aa
    </span>
  );
}

const CHIP_SEMANTICS: IconSemanticId[] = ['compass', 'shield', 'activity'];

/** Three sample glyphs from the set's semanticMap. */
export function IconSetChip({ iconSet, count = 3 }: { iconSet: IconSet; count?: number }) {
  return (
    <span className="flex items-center gap-1.5 text-secondary-text">
      {CHIP_SEMANTICS.slice(0, count).map((semantic) => (
        <Icon
          key={semantic}
          icon={`${iconSet.iconifyPrefix}:${iconSet.semanticMap[semantic]}`}
          className="h-[1.05rem] w-[1.05rem]"
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

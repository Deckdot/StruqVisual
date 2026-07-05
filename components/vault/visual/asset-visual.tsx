import type {
  DesignSystemData,
  MediaData,
  PaletteData,
  SectionData,
  TypographyData,
  VaultAsset,
} from '@/lib/vault/types';

/**
 * Type-specific preview renderers — the heart of the visual-first vault.
 * Static rendering only (tokens/CSS), never live dependencies. Palette and
 * media render literal asset colors by definition (rendering exception,
 * see frontend skill).
 */

function PaletteVisual({ data }: { data: PaletteData }) {
  const { colors } = data;
  const swatches = [colors.background, colors.surface, colors.accent, colors.accentAlt, colors.text];
  return (
    <div
      className="flex h-full w-full items-end gap-0 overflow-hidden"
      style={{ background: colors.background }}
      aria-label={`Palet: ${data.mood}`}
    >
      {swatches.map((color, index) => (
        <div
          key={`${color}-${index}`}
          className="h-full flex-1 transition-transform duration-200 ease-out hover:scale-y-[1.04] origin-bottom"
          style={{ background: color, height: index === 2 ? '100%' : `${88 - index * 9}%` }}
        />
      ))}
    </div>
  );
}

function TypographyVisual({ data }: { data: TypographyData }) {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-1.5 bg-panel px-6">
      <p
        className="text-[2rem] leading-tight text-primary-text"
        style={{ fontFamily: data.display.stack }}
      >
        Aa Bb Cc
      </p>
      <p className="text-sm text-secondary-text" style={{ fontFamily: data.body.stack }}>
        {data.display.name} · {data.body.name}
      </p>
    </div>
  );
}

function SectionVisual({ data }: { data: SectionData }) {
  const isHero = data.kind === 'hero';
  const isDense = data.densitySupport.includes('dense') && !data.densitySupport.includes('airy');
  return (
    <div className="flex h-full w-full flex-col gap-1.5 bg-panel p-5" aria-label={`Sectie: ${data.kind}`}>
      {isHero ? (
        <>
          <div className="mt-2 h-3 w-3/5 rounded-sm bg-primary-text/80" />
          <div className="h-3 w-2/5 rounded-sm bg-primary-text/80" />
          <div className="mt-2 h-1.5 w-1/2 rounded-sm bg-muted-foreground/40" />
          <div className="mt-3 h-4 w-16 rounded-full bg-accent" />
        </>
      ) : isDense ? (
        <>
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent/70" />
              <div className="h-1.5 flex-1 rounded-sm bg-muted-foreground/35" />
            </div>
          ))}
        </>
      ) : (
        <div className="grid flex-1 grid-cols-3 gap-2">
          {[0, 1, 2].map((col) => (
            <div key={col} className="flex flex-col gap-1.5 rounded-md border border-border bg-card p-2">
              <div className="h-6 rounded-sm bg-accent/15" />
              <div className="h-1.5 w-4/5 rounded-sm bg-muted-foreground/35" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DesignSystemVisual({ data, palette }: { data: DesignSystemData; palette?: PaletteData }) {
  const colors = palette?.colors;
  return (
    <div
      className="flex h-full w-full flex-col justify-between p-5"
      style={{ background: colors?.background ?? 'var(--color-panel)' }}
    >
      <div className="flex items-center gap-2">
        {colors &&
          [colors.accent, colors.accentAlt, colors.text].map((color, index) => (
            <span key={index} className="h-3.5 w-3.5 rounded-full" style={{ background: color }} />
          ))}
        <span className="text-xs font-medium" style={{ color: colors?.text ?? 'var(--color-primary-text)' }}>
          {data.silhouette.name}
        </span>
      </div>
      <div className="flex items-end gap-1" aria-label="Sectieritme">
        {data.silhouette.sectionOrder.map((kind, index) => (
          <div
            key={`${kind}-${index}`}
            className="flex-1 rounded-t-sm"
            style={{
              height: `${kind === 'hero' ? 44 : kind === 'cta' ? 30 : 16 + (index % 3) * 7}px`,
              background: colors ? colors.surface : 'var(--color-muted)',
              borderTop: `2px solid ${colors?.accent ?? 'var(--color-accent)'}`,
            }}
            title={kind}
          />
        ))}
      </div>
    </div>
  );
}

function MediaVisual({ data }: { data: MediaData }) {
  return (
    <div className="relative h-full w-full" style={{ background: data.placeholder }}>
      <span className="absolute bottom-3 left-4 rounded-full bg-black/35 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
        {data.category} · {data.aspectRatio}
      </span>
    </div>
  );
}

export function AssetVisual({ asset, paletteLookup }: { asset: VaultAsset; paletteLookup?: (ref: string) => PaletteData | undefined }) {
  switch (asset.type) {
    case 'palette':
      return <PaletteVisual data={asset.data as PaletteData} />;
    case 'typography':
      return <TypographyVisual data={asset.data as TypographyData} />;
    case 'section':
      return <SectionVisual data={asset.data as SectionData} />;
    case 'design_system': {
      const data = asset.data as DesignSystemData;
      return <DesignSystemVisual data={data} palette={paletteLookup?.(data.paletteRef)} />;
    }
    case 'media':
      return <MediaVisual data={asset.data as MediaData} />;
  }
}

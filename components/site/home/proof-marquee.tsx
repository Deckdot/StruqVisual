/**
 * Section 2 — Marquee.
 * Goal: momentum and concreteness. In two seconds the visitor sees hoeveel
 * er klaarstaat, zonder een enkele feature-bullet te lezen.
 */

const ROW_ONE = [
  'Hero-secties met karakter',
  'Scroll-reveals',
  'Kleursysteem Warm Papier',
  'Micro-interacties',
  'Pinned storytelling',
  'Typografie met smaak',
];

const ROW_TWO = [
  'Buttons met gevoel',
  'Animatie-recepten',
  'Paletten met karakter',
  'Design-tokens',
  '3D-achtergronden',
  'Secties met ritme',
];

function MarqueeRow({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="sq-marquee overflow-hidden">
      <div
        className="sq-marquee-track items-center gap-0"
        style={reverse ? { animationDirection: 'reverse' } : undefined}
      >
        {doubled.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center">
            <span className="sq-display whitespace-nowrap px-6 text-[clamp(1.5rem,3vw,2.5rem)] font-medium md:px-10">
              {item}
            </span>
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: 'var(--sq-accent)' }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

export function ProofMarquee() {
  return (
    <section
      aria-label="Voorbeelden uit de bibliotheek"
      className="rotate-[-1.5deg] scale-[1.02] border-y py-10 md:py-14"
      style={{ background: 'var(--sq-sunken)', borderColor: 'var(--sq-line)' }}
    >
      <div className="space-y-6">
        <MarqueeRow items={ROW_ONE} />
        <MarqueeRow items={ROW_TWO} reverse />
      </div>
    </section>
  );
}

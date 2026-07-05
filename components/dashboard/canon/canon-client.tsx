'use client';

// components/dashboard/canon/canon-client.tsx
//
// The Canon (Taste Library) shell — ported from DesignOS BuildingBlocksClient,
// token-remapped to Struq's app register and translated to Dutch. Centered
// animated heading (title + subtitle per tab) → centered tab reel → AnimatePresence
// tab content. Seven tabs (guardrails dropped per scope).

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Compass,
  LayoutGrid,
  Type,
  Palette,
  Shapes,
  Globe,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ColorTab } from './tabs/color-tab';
import { TypographyTab } from './tabs/typography-tab';
import { VoiceTab } from './tabs/voice-tab';
import { RecipesTab } from './tabs/recipes-tab';
import { SectionsTab } from './tabs/sections-tab';
import { BrandsTab } from './tabs/brands-tab';
import { IconsTab } from './tabs/icons-tab';

type TabDef = { id: string; label: string; icon: LucideIcon };

const TABS: TabDef[] = [
  { id: 'recipes', label: 'Recepten', icon: Compass },
  { id: 'sections', label: 'Secties', icon: LayoutGrid },
  { id: 'typography', label: 'Typografie', icon: Type },
  { id: 'color', label: 'Kleur', icon: Palette },
  { id: 'icons', label: 'Iconen', icon: Shapes },
  { id: 'brands', label: 'Merken', icon: Globe },
  { id: 'voice', label: 'Stem', icon: MessageSquare },
];

const HEADINGS: Record<string, { title: string; subtitle: string }> = {
  recipes: { title: 'Volledige recepten', subtitle: 'Complete combinaties van richting, stem en structuur' },
  sections: { title: 'Structurele secties', subtitle: 'De bouwstenen van een pagina' },
  typography: { title: 'Typografie-canon', subtitle: 'Goedgekeurde pairings en schalen' },
  color: { title: 'Kleur-canon', subtitle: 'Goedgekeurde paletten en stemmingen' },
  icons: { title: 'Iconensystemen', subtitle: 'Curated iconensets en imports' },
  brands: { title: 'Merk-designsystemen', subtitle: 'Curated merkrichtingen — bekijk en vergelijk' },
  voice: { title: 'Stem-archetypes', subtitle: 'Vaste taalrichtingen voor je merk' },
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] } },
};
const tabContentVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: [0.5, 0, 0.75, 0] as [number, number, number, number] } },
};

export function CanonClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') ?? 'recipes';

  const selectTab = useCallback(
    (tab: string) => {
      router.replace(`/canon?tab=${tab}`, { scroll: false });
    },
    [router]
  );

  const onTabKeyDown = (e: React.KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.id === activeTab);
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = (i + 1) % TABS.length;
    else if (e.key === 'ArrowLeft') next = (i - 1 + TABS.length) % TABS.length;
    if (next !== null) {
      e.preventDefault();
      selectTab(TABS[next]!.id);
    }
  };

  const heading = HEADINGS[activeTab] ?? { title: 'Canon', subtitle: 'Gedeelde smaakcanon' };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-10">
      <motion.div variants={itemVariants} className="flex flex-col gap-8">
        {/* Centered heading */}
        <div className="text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
              className="flex flex-col items-center gap-2"
            >
              <h2 className="text-xl font-medium tracking-wide text-primary-text">{heading.title}</h2>
              <p className="text-sm text-secondary-text/80">{heading.subtitle}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Tab reel */}
        <div
          className="mx-auto flex flex-wrap items-center justify-center gap-1.5 self-center rounded-2xl border border-border bg-panel/70 p-2 shadow-sm"
          role="tablist"
          onKeyDown={onTabKeyDown}
        >
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                aria-controls={`canon-panel-${tab.id}`}
                id={`canon-tab-${tab.id}`}
                onClick={() => selectTab(tab.id)}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-widest transition-all',
                  active
                    ? 'border border-border bg-card text-primary-text shadow-sm'
                    : 'text-meta-text hover:bg-card/70 hover:text-primary-text'
                )}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={active ? 2.4 : 2} aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="min-h-[560px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              role="tabpanel"
              id={`canon-panel-${activeTab}`}
              aria-labelledby={`canon-tab-${activeTab}`}
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {activeTab === 'recipes' && <RecipesTab />}
              {activeTab === 'sections' && <SectionsTab />}
              {activeTab === 'typography' && <TypographyTab />}
              {activeTab === 'color' && <ColorTab />}
              {activeTab === 'icons' && <IconsTab />}
              {activeTab === 'brands' && <BrandsTab />}
              {activeTab === 'voice' && <VoiceTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

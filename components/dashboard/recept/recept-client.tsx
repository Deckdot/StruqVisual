'use client';

// components/dashboard/recept/recept-client.tsx
//
// The Recept-bouwer orchestrator. Owns useReceptDraft() + viewport state and splits
// the desktop (rail + canvas) and mobile (preview + thumb deck) compositions at the
// lg breakpoint — same discipline as Sidebar/BottomNav: two compositions, one state
// hook. Wires Kopieer/Bewaar into the maturity disclosure system.

import { useCallback, useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useMaturity } from '@/components/maturity-provider';
import { useIconCandidates } from '@/lib/canon/use-icon-candidates';
import { useReceptDraft } from '@/lib/recept/use-recept-draft';
import { resolveDraft, shuffleDraft } from '@/lib/recept/defaults';
import { buildReceptPrompt } from '@/lib/recept/prompt';
import { ControlRail } from './control-rail';
import { ReceptPreview } from './preview/recept-preview';
import { PreviewToolbar, type Viewport } from './preview/preview-toolbar';
import { ReceptMobile } from './mobile/recept-mobile';

export function ReceptClient() {
  const api = useReceptDraft();
  const { candidates } = useIconCandidates();
  const { recordCopy, recordSave } = useMaturity();
  const reduce = useReducedMotion();
  const [viewport, setViewport] = useState<Viewport>('desktop');

  const resolved = useMemo(() => resolveDraft(api.draft, candidates), [api.draft, candidates]);

  const handleShuffle = useCallback(() => api.applyDraft(shuffleDraft(api.draft)), [api]);

  const handleCopy = useCallback(async (): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(buildReceptPrompt(api.draft, candidates));
      recordCopy();
      return true;
    } catch {
      return false;
    }
  }, [api.draft, candidates, recordCopy]);

  const handleSave = useCallback(() => {
    api.saveCurrent(candidates);
    recordSave();
  }, [api, candidates, recordSave]);

  // Shared bits handed to both compositions.
  const shared = {
    api,
    candidates,
    resolved,
    onShuffle: handleShuffle,
    onCopy: handleCopy,
    onSave: handleSave,
  };

  return (
    <>
      {/* Desktop composition: rail + framed live canvas */}
      <div className="hidden h-full min-h-0 gap-4 p-4 lg:flex">
        <div className="w-[19rem] shrink-0 overflow-hidden xl:w-[20rem]">
          <ControlRail
            resolved={resolved}
            name={api.draft.name}
            saved={api.saved}
            candidates={candidates}
            onSetName={api.setName}
            onSelectPalette={api.setPalette}
            onSelectTypography={api.setTypography}
            onSelectIconSet={api.setIconSet}
            onLoadSaved={api.loadSaved}
            onDeleteSaved={api.deleteSaved}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <PreviewToolbar
            viewport={viewport}
            onViewport={setViewport}
            onShuffle={handleShuffle}
            onCopy={handleCopy}
            onSave={handleSave}
          />
          {/* The preview is the Von Restorff hero — a framed artwork on the app floor. */}
          <div className="flex min-h-0 flex-1 justify-center rounded-2xl bg-canvas p-3">
            <div
              className="h-full overflow-hidden rounded-xl border border-border shadow-md"
              style={{
                width: viewport === 'mobile' ? '390px' : '100%',
                transition: reduce ? undefined : 'width 200ms ease',
              }}
            >
              <div className="h-full overflow-y-auto">
                <ReceptPreview resolved={resolved} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile composition: preview IS the screen, controls are a thumb deck */}
      <div className="h-full lg:hidden">
        <ReceptMobile {...shared} />
      </div>
    </>
  );
}

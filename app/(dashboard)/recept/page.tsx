import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ReceptClient } from '@/components/dashboard/recept/recept-client';
import { RECEPT_FONT_VARS } from './fonts';

export const metadata: Metadata = {
  title: 'Recept | Struq',
  robots: { index: false, follow: false },
};

/**
 * Recept-bouwer — the flagship live-preview creation surface. Full-bleed inside the
 * app shell (see app-frame FULL_BLEED_ROUTES). Attaches the route-scoped preview
 * fonts and renders the client orchestrator in a Suspense boundary (it reads
 * useSearchParams for ?basis=).
 */
export default function ReceptPage() {
  return (
    <div className={`h-full ${RECEPT_FONT_VARS}`}>
      <Suspense>
        <ReceptClient />
      </Suspense>
    </div>
  );
}

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CanonClient } from '@/components/dashboard/canon/canon-client';

export const metadata: Metadata = {
  title: 'Canon | Struq',
  robots: { index: false, follow: false },
};

export default function CanonPage() {
  return (
    <Suspense>
      <CanonClient />
    </Suspense>
  );
}

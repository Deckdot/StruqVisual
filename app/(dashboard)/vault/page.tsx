import { Suspense } from 'react';
import { VaultBrowser } from '@/components/vault/vault-browser';

export default function VaultPage() {
  return (
    <Suspense>
      <VaultBrowser />
    </Suspense>
  );
}

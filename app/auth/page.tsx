import type { Metadata } from 'next';
import { AuthClient } from '@/components/site/auth/auth-client';

export const metadata: Metadata = {
  title: 'Inloggen | Struq',
  description:
    'Log in of maak een gratis Struq-account aan. Paletten, typografie, design systems, secties en media direct in je AI.',
  robots: { index: false, follow: false },
};

export default function AuthPage() {
  return <AuthClient />;
}

import type { Metadata, Viewport } from 'next';
import { Comfortaa, Urbanist } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

const comfortaa = Comfortaa({
  subsets: ['latin'],
  variable: '--font-comfortaa',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-urbanist',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
  adjustFontFallback: true,
  // design-gate: ignore
});

export const metadata: Metadata = {
  ...generateSEOMetadata({ locale: 'nl' }),
  title: 'Struq',
  description:
    'Struq is de visuele bibliotheek voor AI-native builders. Paletten, typografie, design systems, secties en media die je direct in elke AI gebruikt. Gratis starten.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#171310' },
    { media: '(prefers-color-scheme: light)', color: '#fbf8f2' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className="light" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="alternate" hrefLang="nl" href="https://struq.nl" />
        <link rel="alternate" hrefLang="x-default" href="https://struq.nl" />
        <link rel="apple-touch-icon" href="/brand/struq-mark-256.png" />
      </head>
      <body className={`${comfortaa.variable} ${urbanist.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

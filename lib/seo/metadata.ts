import { Metadata } from 'next';
import { SITE_URL } from './config';

export const siteConfig = {
  name: 'Struq',
  description: {
    en: 'Struq is the visual library for AI-native builders. Curated palettes, typography, design systems, sections and media your AI can use directly.',
    nl: 'Struq is de visuele bibliotheek voor AI-native builders. Paletten, typografie, design systems, secties en media die je direct in elke AI gebruikt.',
  },
  url: SITE_URL,
  ogImage: '/1200x630notext.png',
  logo: '/brand/struq-mark-256.png',
  links: {},
};

const googleSiteVerification =
  process.env.GOOGLE_SITE_VERIFICATION ||
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export function generateMetadata({
  title,
  description,
  image,
  url,
  noIndex = false,
  locale = 'nl',
  type = 'website',
}: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  noIndex?: boolean;
  locale?: 'en' | 'nl';
  type?: 'website' | 'article';
}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const pageDescription = description || siteConfig.description[locale];
  const pageImage = image || siteConfig.ogImage;
  const pageUrl = url || siteConfig.url;
  const keywords =
    locale === 'nl'
      ? [
          'kleurenpalet website',
          'design tokens',
          'typografie combinaties',
          'design system',
          'AI frontend bouwen',
          'vibe coding',
          'mooie website met AI',
          'claude code design',
          'cursor design',
          'visuele bibliotheek',
          'AI workflow',
        ]
      : [
          'color palettes',
          'design tokens',
          'font pairings',
          'design system library',
          'AI frontend design',
          'vibe coding',
          'build beautiful sites with AI',
          'visual library',
        ];

  return {
    title: pageTitle,
    description: pageDescription,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: pageUrl,
    },
    
    // Basic metadata
    applicationName: siteConfig.name,
    generator: 'Next.js',
    keywords,
    category: 'developer tools',
    icons: {
      icon: [
        { url: siteConfig.logo, sizes: '256x256', type: 'image/png' },
        { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      ],
      shortcut: siteConfig.logo,
      apple: [
        { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      ],
    },
    
    // Robots
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Open Graph
    openGraph: {
      type: type,
      locale: 'nl_NL',
      url: pageUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
          type: 'image/png',
        },
        {
          url: '/600x600.png',
          width: 600,
          height: 600,
          alt: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
          type: 'image/png',
        },
      ],
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: pageImage,
          alt: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
        },
      ],
    },
    verification: googleSiteVerification
      ? {
          google: googleSiteVerification,
        }
      : undefined,
  };
}

// Helper for article metadata
export function generateArticleMetadata({
  title,
  description,
  image,
  slug,
  publishedTime,
  modifiedTime,
  authors,
  tags,
  locale = 'nl',
}: {
  title: string;
  description: string;
  image?: string;
  slug: string;
  publishedTime: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  locale?: 'en' | 'nl';
}): Metadata {
  const metadata = generateMetadata({
    title,
    description,
    image,
    url: `${siteConfig.url}/blog/${slug}`,
    locale,
    type: 'article',
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime: modifiedTime || publishedTime,
      authors: authors || ['Struq'],
      tags,
    },
  };
}

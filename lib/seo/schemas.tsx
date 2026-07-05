import { siteConfig } from './metadata';

export interface SchemaProps {
  id?: string;
}

// Organization Schema
export function generateOrganizationSchema(): object {
  const sameAs = Object.values(siteConfig.links).filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}${siteConfig.logo}`,
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
    description: siteConfig.description.nl,
  };
}

// WebSite Schema
export function generateWebsiteSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    alternateName: 'Struq.nl',
    inLanguage: 'nl-NL',
    description: siteConfig.description.nl,
    publisher: {
      '@id': `${siteConfig.url}/#organization`,
    },
  };
}

// SoftwareApplication Schema
export function generateSoftwareApplicationSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${siteConfig.url}/#software`,
    name: siteConfig.name,
    url: siteConfig.url,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      description: 'Gratis starten, Pro vanaf EUR 9 per maand bij jaarlijkse facturatie.',
    },
    description: siteConfig.description.nl,
    screenshot: `${siteConfig.url}${siteConfig.ogImage}`,
    author: {
      '@id': `${siteConfig.url}/#organization`,
    },
  };
}

// Article / BlogPosting Schema
export function generateArticleSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  authorName = 'Struq Team',
  url,
  inLanguage = 'nl-NL',
  wordCount,
}: {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  url: string;
  inLanguage?: string;
  wordCount?: number;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    image: image
      ? image.startsWith('http')
        ? image
        : `${siteConfig.url}${image}`
      : `${siteConfig.url}${siteConfig.ogImage}`,
    datePublished,
    dateModified: dateModified || datePublished,
    inLanguage,
    ...(wordCount !== undefined ? { wordCount } : {}),
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@id': `${siteConfig.url}/#organization`,
    },
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

// FAQ Schema
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// BreadcrumbList Schema
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function JsonLd({ schema, id }: { schema: object | object[]; id?: string }) {
  const json = JSON.stringify(schema, null, 2).replace(/</g, '\\u003c');

  return (
    <script
      id={id}
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: json,
      }}
    />
  );
}

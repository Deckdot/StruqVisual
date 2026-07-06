import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, siteConfig } from '@/lib/seo/metadata';
import { JsonLd, generateBreadcrumbSchema } from '@/lib/seo/schemas';
import { GidsIndex } from '@/components/site/gids/gids-index';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Gids: bouwen met AI in het Nederlands',
  description:
    'Nederlandse gidsen over vibe coding, mooie websites bouwen met AI en design-prompts die werken. Concrete antwoorden, kopieerbare voorbeelden, geen jargon.',
  url: `${siteConfig.url}/gids`,
  locale: 'nl',
});

export default function GidsPage() {
  return (
    <>
      <JsonLd
        schema={generateBreadcrumbSchema([
          { name: 'Home', url: siteConfig.url },
          { name: 'Gids', url: `${siteConfig.url}/gids` },
        ])}
      />
      <GidsIndex />
    </>
  );
}

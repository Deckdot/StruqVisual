import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, siteConfig } from '@/lib/seo/metadata';
import { JsonLd, generateBreadcrumbSchema } from '@/lib/seo/schemas';
import { LearnAtelierClient } from '@/components/site/learn/index/learn-atelier-client';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Struq Learn: zie eerst het eindresultaat, bouw het daarna zelf',
  description:
    'Gratis interactieve lessen voor AI-builders. Elke les begint met het eindresultaat, haalt het uit elkaar en geeft je de asset mee. Zonder jargon, in het Nederlands.',
  url: `${siteConfig.url}/learn`,
  locale: 'nl',
});

export default function LearnPage() {
  return (
    <>
      <JsonLd
        schema={generateBreadcrumbSchema([
          { name: 'Home', url: siteConfig.url },
          { name: 'Learn', url: `${siteConfig.url}/learn` },
        ])}
      />
      <LearnAtelierClient />
    </>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateMetadata as generateSEOMetadata, siteConfig } from '@/lib/seo/metadata';
import {
  JsonLd,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '@/lib/seo/schemas';
import { GUIDES, getGuide } from '@/lib/gids/guides';
import { GuideArticle } from '@/components/site/gids/guide-article';

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: 'Gids niet gevonden' };

  return generateSEOMetadata({
    title: guide.seo.title,
    description: guide.seo.description,
    url: `${siteConfig.url}/gids/${guide.slug}`,
    locale: 'nl',
    type: 'article',
  });
}

export default async function GidsGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const url = `${siteConfig.url}/gids/${guide.slug}`;

  return (
    <>
      <JsonLd
        schema={[
          generateArticleSchema({
            headline: guide.question,
            description: guide.seo.description,
            datePublished: guide.datePublished,
            dateModified: guide.dateModified,
            url,
          }),
          generateFAQSchema(guide.faqs.map((faq) => ({ question: faq.question, answer: faq.answer }))),
          generateBreadcrumbSchema([
            { name: 'Home', url: siteConfig.url },
            { name: 'Gids', url: `${siteConfig.url}/gids` },
            { name: guide.question, url },
          ]),
        ]}
      />
      <GuideArticle guide={guide} />
    </>
  );
}

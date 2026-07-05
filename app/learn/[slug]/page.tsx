import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateMetadata as generateSEOMetadata, siteConfig } from '@/lib/seo/metadata';
import { JsonLd, generateBreadcrumbSchema } from '@/lib/seo/schemas';
import { LESSONS, getLessonManifest } from '@/lib/learn/lessons';
import { LessonPlayer } from '@/components/site/learn/player/lesson-player';

export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLessonManifest(slug);
  if (!lesson) return { title: 'Les niet gevonden' };

  return generateSEOMetadata({
    title: lesson.seo.title,
    description: lesson.seo.description,
    url: `${siteConfig.url}/learn/${lesson.slug}`,
    locale: 'nl',
    type: 'article',
  });
}

export default async function LearnLessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLessonManifest(slug);
  if (!lesson) notFound();

  return (
    <>
      <JsonLd
        schema={generateBreadcrumbSchema([
          { name: 'Home', url: siteConfig.url },
          { name: 'Learn', url: `${siteConfig.url}/learn` },
          { name: lesson.title, url: `${siteConfig.url}/learn/${lesson.slug}` },
        ])}
      />
      <LessonPlayer manifest={lesson} />
    </>
  );
}

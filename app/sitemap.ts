import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/config';
import { LESSONS } from '@/lib/learn/lessons';
import { GUIDES } from '@/lib/gids/guides';

/**
 * Sitemap voor alle publieke marketing- en contentpagina's.
 * Dashboard, vault en auth blijven bewust buiten beeld (zie app/robots.ts).
 */

const STATIC_ROUTES: Array<{
  path: string;
  priority: number;
  changeFrequency: 'daily' | 'weekly' | 'monthly';
}> = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/galerij', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/gids', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/learn', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/visueel', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/methode', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/pro', priority: 0.6, changeFrequency: 'monthly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const guideEntries: MetadataRoute.Sitemap = GUIDES.map((guide) => ({
    url: `${SITE_URL}/gids/${guide.slug}`,
    lastModified: new Date(`${guide.dateModified}T00:00:00Z`),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const lessonEntries: MetadataRoute.Sitemap = LESSONS.map((lesson) => ({
    url: `${SITE_URL}/learn/${lesson.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticEntries, ...guideEntries, ...lessonEntries];
}

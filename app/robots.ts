import type { MetadataRoute } from 'next';
import { SITEMAP_URL } from '@/lib/seo/config';

/**
 * Robots-beleid: alles wat publiek is, is ook crawlbaar, en AI-crawlers zijn
 * expliciet welkom. Struq wil geciteerd worden door ChatGPT, Claude, Gemini en
 * Perplexity; de expliciete regels overleven eventuele strengere defaults van
 * die crawlers. Privéroutes (app, auth, api) blijven overal buiten.
 */

const PRIVATE_PATHS = ['/dashboard', '/vault', '/canon', '/auth', '/api/'];

const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'Google-Extended',
  'Gemini-Deep-Research',
  'PerplexityBot',
  'CCBot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE_PATHS },
      { userAgent: AI_CRAWLERS, allow: '/', disallow: PRIVATE_PATHS },
    ],
    sitemap: SITEMAP_URL,
  };
}

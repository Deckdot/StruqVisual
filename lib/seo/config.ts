const DEFAULT_SITE_URL = 'https://struq.nl';

function normalizeSiteUrl(url: string): string {
  const normalized = url.replace(/\/+$/, '');

  try {
    const parsed = new URL(normalized);

    if (parsed.hostname === 'www.struq.nl' || parsed.hostname === 'struq.app') {
      parsed.hostname = 'struq.nl';
      parsed.protocol = 'https:';
      parsed.port = '';
    }

    return parsed.toString().replace(/\/+$/, '');
  } catch {
    return normalized;
  }
}

export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
);

export const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

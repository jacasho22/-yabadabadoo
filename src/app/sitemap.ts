import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { locales } from '@/i18n';

type RouteDef = { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number };

const routes: RouteDef[] = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/camper', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/reservar', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/rutas', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/legal/aviso-legal', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/legal/privacidad', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/legal/cookies', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/legal/condiciones', changeFrequency: 'yearly', priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}/es${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(locales.map((locale) => [locale, `${SITE_URL}/${locale}${path}`])),
    },
  }));
}

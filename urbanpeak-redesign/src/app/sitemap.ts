import type { MetadataRoute } from 'next';
import { getPublishedProjects } from '@/lib/data';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://urbanpeak.co.kr';
  return [
    '',
    '/studio',
    '/projects',
    '/crew',
    '/contact',
    '/merchandise',
    ...(await getPublishedProjects()).map(p => '/projects/' + p.id),
  ].map(p => ({ url: base + p }));
}

import type { MetadataRoute } from 'next';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://nomorequiet.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/landing-page',
    '/map-of-lights',
    '/pricing',
    '/sign-up-login-screen',
    '/journal-screen',
    '/dashboard',
    '/voices',
    '/portal',
    '/personal-arc',
  ];

  const lastModified = new Date();

  return routes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: path === '' || path === '/landing-page' ? 'weekly' : 'monthly',
    priority: path === '' || path === '/landing-page' ? 1 : 0.7,
  }));
}

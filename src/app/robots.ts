import type { MetadataRoute } from 'next';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://nomorequiet.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/portal/', '/dashboard/', '/user-settings/', '/payment/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

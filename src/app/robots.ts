import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/api/',
        '/auth/',
        '/settings/',
        '/validate/',
        '/payment/',
        '/test-payment/',
      ],
    },
    sitemap: 'https://validflow.io/sitemap.xml',
  }
} 
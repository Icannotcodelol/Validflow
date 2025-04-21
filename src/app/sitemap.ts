import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://validflow.io'
  
  // Define your routes
  const routes = [
    '',
    '/features',
    '/about',
    '/pricing',
    '/signin',
    '/signup',
    '/legal/privacy-policy',
    '/legal/terms-of-service',
    '/legal/cookie-policy',
    '/legal/refund-policy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return routes
} 
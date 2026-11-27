import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/clients', '/quotes', '/invoices', '/expenses', '/profile', '/settings'], // On cache les pages privées
    },
    sitemap: 'https://devfact-flow.vercel.app/sitemap.xml',
  }
}
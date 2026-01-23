import { MetadataRoute } from 'next'
import { searchVendors } from '@/api/user/public.api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caterbazar.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/vendors`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  // Dynamic vendor pages
  let vendorPages: MetadataRoute.Sitemap = []

  try {
    // Fetch all vendors for sitemap (limit to reasonable number for performance)
    const vendorResponse = await searchVendors({
      page: 1,
      limit: 100, // Adjust based on total vendors
      caterbazarChoice: true, // Prioritize top vendors
    })

    if (vendorResponse.success && vendorResponse.data.vendors.length > 0) {
      vendorPages = vendorResponse.data.vendors.map((vendor: any) => ({
        url: `${baseUrl}/vendors/${vendor.userId._id}`,
        lastModified: new Date(vendor.updatedAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: vendor.isCaterbazarChoice ? 0.8 : 0.6,
      }))
    }
  } catch (error) {
    console.error('Error fetching vendors for sitemap:', error)
    // Continue with static pages only
  }

  return [...staticPages, ...vendorPages]
}

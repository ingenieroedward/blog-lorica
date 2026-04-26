import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'
import { getAllPostSlugs } from '@/lib/posts'
import { getAllCategorySlugs } from '@/lib/categories'
import { getAllAuthorSlugs } from '@/lib/authors'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postSlugs, categorySlugs, authorSlugs] = await Promise.all([
    getAllPostSlugs(),
    getAllCategorySlugs(),
    getAllAuthorSlugs(),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                 priority: 1.0, changeFrequency: 'daily'  },
    { url: `${SITE_URL}/blog`,       priority: 0.9, changeFrequency: 'daily'  },
    { url: `${SITE_URL}/privacidad`, priority: 0.3, changeFrequency: 'yearly' },
  ]

  const postPages: MetadataRoute.Sitemap = postSlugs.map(({ slug, updatedAt }) => ({
    url:             `${SITE_URL}/blog/${slug}`,
    lastModified:    updatedAt,
    priority:        0.8,
    changeFrequency: 'weekly',
  }))

  const categoryPages: MetadataRoute.Sitemap = categorySlugs.map(({ slug }) => ({
    url:             `${SITE_URL}/categoria/${slug}`,
    priority:        0.7,
    changeFrequency: 'weekly',
  }))

  const authorPages: MetadataRoute.Sitemap = authorSlugs.map(({ slug }) => ({
    url:             `${SITE_URL}/autor/${slug}`,
    priority:        0.6,
    changeFrequency: 'monthly',
  }))

  return [...staticPages, ...postPages, ...categoryPages, ...authorPages]
}

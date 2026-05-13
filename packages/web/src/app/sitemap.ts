import type {MetadataRoute} from 'next'
import {isSanityConfigured, sanityFetch} from '@/lib/sanity/client'
import {blogPostSlugsQuery, pageSlugsQuery, siteProfileQuery} from '@/lib/sanity/queries'

function normalizeSiteUrl(websiteUrl?: string): string | null {
  if (!websiteUrl) return null

  const trimmed = websiteUrl.trim()
  if (!trimmed) return null

  try {
    const url = new URL(trimmed)
    return url.toString().replace(/\/$/, '')
  } catch {
    return null
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isSanityConfigured) {
    return []
  }

  const profile = await sanityFetch<{websiteUrl?: string}>(siteProfileQuery)
  const siteUrl = normalizeSiteUrl(profile?.websiteUrl)
  if (!siteUrl) {
    return []
  }

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  const rows = await sanityFetch<Array<{slug?: string}>>(pageSlugsQuery)
  const pageRoutes = (rows ?? [])
    .map((row) => row.slug?.trim())
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({
      url: `${siteUrl}/${slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  const blogRows = await sanityFetch<Array<{slug?: string; publishedAt?: string; _updatedAt?: string}>>(
    blogPostSlugsQuery,
  )

  const blogRoutes = (blogRows ?? [])
    .map((row) => ({
      slug: row.slug?.trim(),
      lastModified: row._updatedAt ?? row.publishedAt,
    }))
    .filter((row): row is {slug: string; lastModified: string | undefined} => Boolean(row.slug))
    .map((row) => ({
      url: `${siteUrl}/blog/${row.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      ...(row.lastModified ? {lastModified: row.lastModified} : {}),
    }))

  return [...routes, ...pageRoutes, ...blogRoutes]
}

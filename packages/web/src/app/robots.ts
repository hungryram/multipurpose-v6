import type {MetadataRoute} from 'next'
import {isSanityConfigured, sanityFetch} from '@/lib/sanity/client'
import {siteProfileQuery} from '@/lib/sanity/queries'

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

export default async function robots(): Promise<MetadataRoute.Robots> {
  const profile = isSanityConfigured
    ? await sanityFetch<{websiteUrl?: string}>(siteProfileQuery)
    : null
  const siteUrl = normalizeSiteUrl(profile?.websiteUrl)

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    ...(siteUrl ? {sitemap: `${siteUrl}/sitemap.xml`} : {}),
  }
}

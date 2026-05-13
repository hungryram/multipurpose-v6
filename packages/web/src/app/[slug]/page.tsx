import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {cache} from 'react'
import {PageBuilder, type HomePageData} from '@/components/page-builder'
import {isSanityConfigured, sanityClient, sanityFetch} from '@/lib/sanity/client'
import {pageBySlugQuery, pageSlugsQuery} from '@/lib/sanity/queries'

export const revalidate = 60

type PageParams = {
  slug: string
}

type PageProps = {
  params: Promise<PageParams>
}

const getPageData = cache(async function getPageData(slug: string) {
  return sanityClient?.fetch<HomePageData>(pageBySlugQuery, {slug}) ?? null
})

export async function generateStaticParams() {
  if (!isSanityConfigured) return []

  const rows = await sanityFetch<Array<{slug?: string}>>(pageSlugsQuery)
  return (rows ?? [])
    .map((row) => row.slug?.trim())
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({slug}))
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  if (!isSanityConfigured) {
    return {
      title: 'Website',
    }
  }

  const {slug} = await params
  const data = await getPageData(slug)
  const siteName = data?.profile?.companyName?.trim() || 'Website'
  const titleValue = data?.home?.seoTitle?.trim() || data?.home?.title?.trim() || siteName
  const description = data?.home?.seoDescription?.trim() || undefined
  const siteUrl = data?.profile?.websiteUrl?.trim()
  const pageUrl = siteUrl ? `${siteUrl.replace(/\/$/, '')}/${slug}` : `/${slug}`

  return {
    title: titleValue,
    ...(description ? {description} : {}),
    alternates: {canonical: `/${slug}`},
    openGraph: {
      title: titleValue,
      siteName,
      ...(description ? {description} : {}),
      url: pageUrl,
      type: 'website',
    },
  }
}

export default async function SlugPage({params}: PageProps) {
  if (!isSanityConfigured) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Configure Sanity Environment Variables
        </h1>
        <p className="mt-4 max-w-xl text-zinc-600">
          Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in your
          environment to load CMS content.
        </p>
      </main>
    )
  }

  const {slug} = await params
  const data = await getPageData(slug)

  if (!data?.home) {
    notFound()
  }

  return <PageBuilder data={data} />
}

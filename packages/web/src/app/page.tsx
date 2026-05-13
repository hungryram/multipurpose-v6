import type {Metadata} from 'next'
import {cache} from 'react'
import {PageBuilder, type HomePageData} from '@/components/page-builder'
import {isSanityConfigured, sanityFetch} from '@/lib/sanity/client'
import {homePageQuery} from '@/lib/sanity/queries'

export const revalidate = 60

const getHomePageData = cache(async function getHomePageData() {
  return sanityFetch<HomePageData>(homePageQuery)
})

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomePageData()
  const siteName = data?.profile?.companyName?.trim() || 'Website'
  const titleValue = data?.home?.seoTitle?.trim() || data?.home?.title?.trim() || siteName
  const description = data?.home?.seoDescription?.trim() || undefined
  const siteUrl = data?.profile?.websiteUrl?.trim()

  return {
    title: titleValue,
    ...(description ? {description} : {}),
    alternates: {canonical: '/'},
    openGraph: {
      title: titleValue,
      siteName,
      ...(description ? {description} : {}),
      url: siteUrl || '/',
      type: 'website',
    },
  }
}

export default async function Home() {
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

  const data = await getHomePageData()

  if (!data?.home) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          No Active Home Page Selected
        </h1>
        <p className="mt-4 max-w-xl text-zinc-600">
          In CMS, open Appearance and select an Active Home Page.
        </p>
      </main>
    )
  }

  return <PageBuilder data={data} />
}

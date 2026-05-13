import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {cache} from 'react'
import {ImageWrapper} from '@/components/ui/image-wrapper'
import {RichContent} from '@/components/portable-text'
import type {PortableTextValue} from '@/components/pagebuilder/types'
import {isSanityConfigured, sanityClient, sanityFetch} from '@/lib/sanity/client'
import {resolveImageAlt, urlForImage} from '@/lib/sanity/image'
import {blogPostBySlugQuery, blogPostSlugsQuery} from '@/lib/sanity/queries'

export const revalidate = 60

type PageParams = {
  slug: string
}

type PageProps = {
  params: Promise<PageParams>
}

type BlogPostData = {
  title?: string
  slug?: string
  excerpt?: string
  authorName?: string
  publishedAt?: string
  _updatedAt?: string
  seoTitle?: string
  seoDescription?: string
  featuredImage?: {
    alt?: string
    assetAltText?: string
    asset?: {_ref?: string; _type?: string; url?: string}
  }
  content?: PortableTextValue
}

type BlogPostPageData = {
  profile?: {
    companyName?: string
    websiteUrl?: string
  }
  post?: BlogPostData
}

const getBlogPostData = cache(async function getBlogPostData(slug: string) {
  return sanityClient?.fetch<BlogPostPageData>(blogPostBySlugQuery, {slug}) ?? null
})

function formatDate(value?: string) {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function toJsonLdString(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

export async function generateStaticParams() {
  if (!isSanityConfigured) return []

  const rows = await sanityFetch<Array<{slug?: string}>>(blogPostSlugsQuery)
  return (rows ?? [])
    .map((row) => row.slug?.trim())
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({slug}))
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  if (!isSanityConfigured) {
    return {
      title: 'Blog',
    }
  }

  const {slug} = await params
  const data = await getBlogPostData(slug)
  const siteName = data?.profile?.companyName?.trim() || 'Website'
  const titleValue =
    data?.post?.seoTitle?.trim() || data?.post?.title?.trim() || `Blog | ${siteName}`
  const description =
    data?.post?.seoDescription?.trim() || data?.post?.excerpt?.trim() || undefined
  const siteUrl = data?.profile?.websiteUrl?.trim()?.replace(/\/$/, '')
  const pageUrl = siteUrl ? `${siteUrl}/blog/${slug}` : `/blog/${slug}`

  return {
    title: titleValue,
    ...(description ? {description} : {}),
    alternates: {canonical: pageUrl},
    metadataBase: siteUrl ? new URL(`${siteUrl}/`) : undefined,
    openGraph: {
      title: titleValue,
      siteName,
      ...(description ? {description} : {}),
      url: pageUrl,
      type: 'article',
      ...(data?.post?.publishedAt ? {publishedTime: data.post.publishedAt} : {}),
      ...(data?.post?.authorName ? {authors: [data.post.authorName]} : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: titleValue,
      ...(description ? {description} : {}),
    },
  }
}

export default async function BlogPostPage({params}: PageProps) {
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
  const data = await getBlogPostData(slug)

  if (!data?.post) {
    notFound()
  }

  const imageUrl = data.post.featuredImage
    ? urlForImage(data.post.featuredImage)?.width(2000).height(1200).url() ??
      data.post.featuredImage.asset?.url
    : null

  const siteName = data.profile?.companyName?.trim() || 'Website'
  const siteUrl = data.profile?.websiteUrl?.trim()?.replace(/\/$/, '')
  const postUrl = siteUrl ? `${siteUrl}/blog/${slug}` : `/blog/${slug}`

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.post.title,
    ...(data.post.excerpt ? {description: data.post.excerpt} : {}),
    ...(data.post.publishedAt ? {datePublished: data.post.publishedAt} : {}),
    ...(data.post._updatedAt ? {dateModified: data.post._updatedAt} : {}),
    ...(imageUrl ? {image: [imageUrl]} : {}),
    ...(data.post.authorName
      ? {
          author: {
            '@type': 'Person',
            name: data.post.authorName,
          },
        }
      : {}),
    publisher: {
      '@type': 'Organization',
      name: siteName,
      ...(siteUrl ? {url: siteUrl} : {}),
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
  }

  return (
    <>
      <main className="mx-auto w-full max-w-4xl px-4 py-12 lg:px-8">
        <article className="space-y-8">
          <header className="space-y-4 pb-8">
            <h1 className="text-4xl font-semibold tracking-tight">{data.post.title}</h1>
            <div className="text-sm">
              {formatDate(data.post.publishedAt) ? <span>{formatDate(data.post.publishedAt)}</span> : null}
              {formatDate(data.post.publishedAt) && data.post.authorName ? <span> • </span> : null}
              {data.post.authorName ? <span>{data.post.authorName}</span> : null}
            </div>
          </header>

          {imageUrl ? (
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-zinc-200">
              <ImageWrapper
                src={imageUrl}
                alt={resolveImageAlt(data.post.featuredImage, data.post.title ?? 'Blog post image')}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
                preload
              />
            </div>
          ) : null}

          <div className="prose max-w-none">
            <RichContent value={data.post.content} />
          </div>
        </article>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: toJsonLdString(articleJsonLd)}}
      />
    </>
  )
}

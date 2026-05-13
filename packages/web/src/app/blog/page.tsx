import type {Metadata} from 'next'
import Link from 'next/link'
import {cache} from 'react'
import {ImageWrapper} from '@/components/ui/image-wrapper'
import {isSanityConfigured, sanityFetch} from '@/lib/sanity/client'
import {resolveImageAlt, urlForImage} from '@/lib/sanity/image'
import {blogListQuery} from '@/lib/sanity/queries'

export const revalidate = 60

type BlogPostCard = {
  _key?: string
  title?: string
  slug?: string
  excerpt?: string
  authorName?: string
  publishedAt?: string
  featuredImage?: {
    alt?: string
    assetAltText?: string
    asset?: {_ref?: string; _type?: string; url?: string}
  }
}

type BlogListData = {
  profile?: {
    companyName?: string
    websiteUrl?: string
  }
  posts?: Array<BlogPostCard>
}

const getBlogListData = cache(async function getBlogListData() {
  return sanityFetch<BlogListData>(blogListQuery)
})

function toJsonLdString(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

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

export async function generateMetadata(): Promise<Metadata> {
  const data = await getBlogListData()
  const siteName = data?.profile?.companyName?.trim() || 'Website'
  const titleValue = `Blog | ${siteName}`
  const description = `Read the latest articles and updates from ${siteName}.`
  const siteUrl = data?.profile?.websiteUrl?.trim()?.replace(/\/$/, '')
  const pageUrl = siteUrl ? `${siteUrl}/blog` : '/blog'

  return {
    title: titleValue,
    description,
    alternates: {canonical: '/blog'},
    openGraph: {
      title: titleValue,
      description,
      siteName,
      url: pageUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titleValue,
      description,
    },
  }
}

export default async function BlogPage() {
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

  const data = await getBlogListData()
  const posts = data?.posts ?? []
  const siteUrl = data?.profile?.websiteUrl?.trim()?.replace(/\/$/, '')

  const blogListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${data?.profile?.companyName?.trim() || 'Website'} Blog`,
    ...(siteUrl ? {url: `${siteUrl}/blog`} : {}),
    blogPost: posts
      .filter((post) => Boolean(post.slug))
      .slice(0, 50)
      .map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        ...(post.publishedAt ? {datePublished: post.publishedAt} : {}),
        ...(siteUrl && post.slug ? {url: `${siteUrl}/blog/${post.slug}`} : {}),
      })),
  }

  return (
    <>
      <main className="mx-auto w-full max-w-6xl px-4 py-12 lg:px-8">
        <header className="mb-10 border-b border-zinc-200 pb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Editorial</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">Blog</h1>
          <p className="mt-4 max-w-2xl text-zinc-600">
            Fresh updates, tactical insights, and practical guidance.
          </p>
        </header>

        {posts.length === 0 ? (
          <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-center">
            <h2 className="text-xl font-medium text-zinc-900">No posts published yet</h2>
            <p className="mt-3 text-zinc-600">Create your first Blog Post in Sanity to populate this page.</p>
          </section>
        ) : (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post, index) => {
              const slug = post.slug?.trim()
              const href = slug ? `/blog/${slug}` : '#'
              const imageUrl = post.featuredImage
                ? urlForImage(post.featuredImage)?.width(1200).height(800).url() ?? post.featuredImage.asset?.url
                : null
              const dateLabel = formatDate(post.publishedAt)

              return (
                <article
                  key={post._key ?? `${post.slug}-${index}`}
                  className="group overflow-hidden rounded-xl border border-zinc-200 bg-white transition-colors hover:border-zinc-400"
                >
                  {imageUrl ? (
                    <Link href={href} className="block">
                      <div className="relative aspect-[16/10] overflow-hidden border-b border-zinc-200">
                        <ImageWrapper
                          src={imageUrl}
                          alt={resolveImageAlt(post.featuredImage, post.title ?? 'Blog post image')}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                    </Link>
                  ) : null}

                  <div className="space-y-3 p-5">
                    <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                      {dateLabel ? <span>{dateLabel}</span> : null}
                      {dateLabel && post.authorName ? <span> • </span> : null}
                      {post.authorName ? <span>{post.authorName}</span> : null}
                    </div>

                    <h2 className="text-xl font-semibold leading-tight tracking-tight text-zinc-900">
                      <Link href={href} className="hover:underline">
                        {post.title || 'Untitled post'}
                      </Link>
                    </h2>

                    {post.excerpt ? <p className="text-sm leading-6 text-zinc-600">{post.excerpt}</p> : null}
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: toJsonLdString(blogListJsonLd)}}
      />
    </>
  )
}

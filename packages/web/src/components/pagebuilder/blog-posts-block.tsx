import Link from 'next/link'
import type {Block} from './types'
import {RichContent} from '../portable-text'
import {BlockButtons} from '../block-buttons'
import {ImageWrapper} from '../ui/image-wrapper'
import {resolveImageAlt, urlForImage} from '@/lib/sanity/image'

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

export function BlogPostsBlock({block}: {block: Block}) {
  const posts = (block.posts ?? []).slice(0, Math.max(1, Math.min(12, block.postCount ?? 3)))

  return (
    <section className="space-y-6">
      <RichContent value={block.content} />
      <BlockButtons buttons={block.buttons} textAlign={block.layout?.textAlign} />

      {posts.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 p-6 text-center">
          No blog posts available yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post, index) => {
            const href = post.slug ? `/blog/${post.slug}` : '#'
            const imageUrl = post.featuredImage
              ? urlForImage(post.featuredImage)?.width(1200).height(800).url() ??
                post.featuredImage.asset?.url
              : null
            const dateLabel = formatDate(post.publishedAt)
            const showMeta = (block.showPublishedDate !== false && dateLabel) || (block.showAuthor !== false && post.authorName)

            return (
              <article
                key={post._key ?? `${post.slug}-${index}`}
                className="group overflow-hidden rounded-xl border border-zinc-200 transition-colors"
              >
                {block.showFeaturedImage !== false && imageUrl ? (
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
                  {showMeta ? (
                    <div className="text-xs uppercase">
                      {block.showPublishedDate !== false && dateLabel ? <span>{dateLabel}</span> : null}
                      {block.showPublishedDate !== false && dateLabel && block.showAuthor !== false && post.authorName ? (
                        <span> • </span>
                      ) : null}
                      {block.showAuthor !== false && post.authorName ? <span>{post.authorName}</span> : null}
                    </div>
                  ) : null}

                  <h3 className="text-base!">
                    <Link href={href} className="hover:underline">
                      {post.title || 'Untitled post'}
                    </Link>
                  </h3>

                  {block.showExcerpt !== false && post.excerpt ? (
                    <p className="text-smtext-zinc-600">{post.excerpt}</p>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

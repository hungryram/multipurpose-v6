import type {Block} from './types'
import {RichContent} from '../portable-text'
import {BlockButtons} from '../block-buttons'
import {ImageWrapper} from '../ui/image-wrapper'
import {resolveImageAlt, urlForImage} from '@/lib/sanity/image'

function getItemButtons(item: NonNullable<Block['items']>[number]) {
  const hasLabel = Boolean(item.button?.label?.trim())
  const hasDestination = Boolean(item.button?.href || item.button?.slug)
  if (!item.button || !hasLabel || !hasDestination) return undefined
  return [item.button]
}

export function FeatureGridBlock({block}: {block: Block}) {
  const columns = block.gridColumns ?? 3
  const layoutType = block.featureGridLayoutType ?? 'imageTopCards'
  const gridClass =
    columns === 1
      ? 'grid grid-cols-1 gap-4'
      : columns === 2
        ? 'grid grid-cols-1 gap-4 md:grid-cols-2'
        : columns === 4
          ? 'grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4'
          : 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'

  if (layoutType === 'imageLeftList') {
    return (
      <section className="space-y-6">
        <RichContent value={block.content} />
        <BlockButtons buttons={block.buttons} textAlign={block.layout?.textAlign} />
        <div className="space-y-4">
          {block.items?.map((item) => {
            const imageUrl = item.image ? urlForImage(item.image)?.width(1200).url() : null
            const itemButtons = getItemButtons(item)
            return (
              <article
                key={item._key}
                className="grid grid-cols-[120px_1fr] items-center gap-4 border p-4 sm:grid-cols-[180px_1fr] md:grid-cols-[240px_1fr]"
              >
                {imageUrl ? (
                  <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
                    <ImageWrapper
                      src={imageUrl}
                      alt={resolveImageAlt(item.image, 'Feature image')}
                      fill
                      sizes="(max-width: 768px) 100vw, 240px"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="min-w-0">
                  <RichContent value={item.content} />
                  <BlockButtons buttons={itemButtons} textAlign={block.layout?.textAlign} />
                </div>
              </article>
            )
          })}
        </div>
      </section>
    )
  }

  if (layoutType === 'imageOverlayCards') {
    return (
      <section className="space-y-6">
        <RichContent value={block.content} />
        <BlockButtons buttons={block.buttons} textAlign={block.layout?.textAlign} />
        <div className={gridClass}>
          {block.items?.map((item) => {
            const imageUrl = item.image ? urlForImage(item.image)?.width(1600).url() : null
            const itemButtons = getItemButtons(item)
            return (
              <article key={item._key} className="relative min-h-[260px] overflow-hidden border bg-zinc-100">
                {imageUrl ? (
                  <>
                    <ImageWrapper
                      src={imageUrl}
                      alt={resolveImageAlt(item.image, 'Feature image')}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/45" />
                  </>
                ) : null}
                <div className="relative z-10 p-5 text-white">
                  <RichContent value={item.content} />
                  <BlockButtons buttons={itemButtons} textAlign={block.layout?.textAlign} />
                </div>
              </article>
            )
          })}
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <RichContent value={block.content} />
      <BlockButtons buttons={block.buttons} textAlign={block.layout?.textAlign} />
      <div className={gridClass}>
        {block.items?.map((item) => {
          const imageUrl = item.image ? urlForImage(item.image)?.width(1400).url() : null
          const itemButtons = getItemButtons(item)
          return (
            <article key={item._key} className="overflow-hidden border">
              {imageUrl ? (
                <div className="relative aspect-[4/3] overflow-hidden border-b border-zinc-200 bg-zinc-100">
                  <ImageWrapper
                    src={imageUrl}
                    alt={resolveImageAlt(item.image, 'Feature image')}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div className="p-5">
                <RichContent value={item.content} />
                <BlockButtons buttons={itemButtons} textAlign={block.layout?.textAlign} />
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

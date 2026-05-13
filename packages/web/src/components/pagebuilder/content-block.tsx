import type {Block} from './types'
import {RichContent} from '../portable-text'
import {ImageWrapper} from '../ui/image-wrapper'
import {resolveImageAlt, urlForImage} from '@/lib/sanity/image'
import {BlockButtons} from '../block-buttons'

export function ContentBlock({block}: {block: Block}) {
  const layout = block.contentLayoutType ?? 'textOnly'
  const imageUrl = block.image ? urlForImage(block.image)?.width(2000).url() : null
  const hasImage = Boolean(imageUrl)

  if (layout === 'imageTop' && hasImage) {
    return (
      <section className="space-y-6">
        <div className="relative aspect-[5/3] overflow-hidden rounded-xl">
          <ImageWrapper
            src={imageUrl!}
            alt={resolveImageAlt(block.image, 'Content image')}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-cover"
          />
        </div>
        <div className="prose max-w-none">
          <RichContent value={block.content} />
        </div>
        <BlockButtons buttons={block.buttons} textAlign={block.layout?.textAlign} />
      </section>
    )
  }

  if (layout === 'imageBottom' && hasImage) {
    return (
      <section className="space-y-6">
        <div className="prose max-w-none">
          <RichContent value={block.content} />
        </div>
        <BlockButtons buttons={block.buttons} textAlign={block.layout?.textAlign} />
        <div className="relative aspect-[5/3] overflow-hidden rounded-xl">
          <ImageWrapper
            src={imageUrl!}
            alt={resolveImageAlt(block.image, 'Content image')}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-cover"
          />
        </div>
      </section>
    )
  }

  if ((layout === 'imageLeft' || layout === 'imageRight') && hasImage) {
    const isRight = layout === 'imageRight'
    return (
      <section className="grid items-center gap-8 md:grid-cols-2">
        <div className={isRight ? 'order-2' : 'order-1'}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <ImageWrapper
              src={imageUrl!}
              alt={resolveImageAlt(block.image, 'Content image')}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className={`${isRight ? 'order-1' : 'order-2'} prose max-w-none`}>
          <RichContent value={block.content} />
          <BlockButtons buttons={block.buttons} textAlign={block.layout?.textAlign} />
        </div>
      </section>
    )
  }

  return (
    <section className="prose max-w-none">
      <RichContent value={block.content} />
      <BlockButtons buttons={block.buttons} textAlign={block.layout?.textAlign} />
    </section>
  )
}

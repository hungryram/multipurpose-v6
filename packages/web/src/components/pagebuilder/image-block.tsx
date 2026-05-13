import {ImageWrapper} from '../ui/image-wrapper'
import {resolveImageAlt, urlForImage} from '@/lib/sanity/image'
import type {Block} from './types'
import {BlockButtons} from '../block-buttons'

export function ImageBlock({block}: {block: Block}) {
  if (!block.image) return null

  const imageUrl = block.image.asset?.url
  const builtUrl = urlForImage(block.image)?.url()
  const src = builtUrl ?? imageUrl

  if (!src) return null

  return (
    <section className="space-y-6">
      <ImageWrapper
        src={src}
        alt={resolveImageAlt(block.image)}
        width={1200}
        height={800}
        className="h-auto w-full"
      />
      <BlockButtons buttons={block.buttons} textAlign={block.layout?.textAlign} />
    </section>
  )
}

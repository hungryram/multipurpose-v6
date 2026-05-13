import {createImageUrlBuilder, type SanityImageSource} from '@sanity/image-url'
import {sanityClient} from './client'

const builder = sanityClient ? createImageUrlBuilder(sanityClient) : null

export function urlForImage(source: SanityImageSource) {
  if (!builder) {
    return null
  }

  return builder.image(source)
}

export function resolveImageAlt(
  image?: {alt?: string; assetAltText?: string} | null,
  fallback = 'Image',
): string {
  const directAlt = image?.alt?.trim()
  if (directAlt) return directAlt

  const mediaAlt = image?.assetAltText?.trim()
  if (mediaAlt) return mediaAlt

  return fallback
}

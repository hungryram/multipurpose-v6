import {ImageWrapper} from '../ui/image-wrapper'
import {resolveImageAlt, urlForImage} from '@/lib/sanity/image'
import type { Block } from './types'
import { RichContent } from '../portable-text'
import { BlockButtons } from '../block-buttons'

const heightMap: Record<string, string> = {
    small: 'min-h-[320px]',
    medium: 'min-h-[420px]',
    large: 'min-h-[600px]',
}

export function HeroBlock({ block }: { block: Block }) {
    const heroImage = block.image ? urlForImage(block.image)?.width(2400).url() : null
    const rgb = block.imageOverlayColor?.rgb
    const overlayColor =
        rgb?.r !== undefined && rgb?.g !== undefined && rgb?.b !== undefined
            ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a ?? 0.45})`
            : (block.imageOverlayColor?.hex ?? 'rgba(0, 0, 0, 0.45)')
    const hasImage = Boolean(heroImage)
    const displayMode = block.imageDisplayMode || 'fill'
    const shouldPrioritize = block.prioritizeImage !== false // default true

    // Determine height class and style
    const heightClass =
        block.heroHeight && block.heroHeight !== 'custom'
            ? heightMap[block.heroHeight]
            : 'min-h-[420px]'
    const heightStyle =
        block.heroHeight === 'custom' && block.customHeroHeight
            ? { minHeight: block.customHeroHeight }
            : {}

    return (
        <section className="relative overflow-hidden">
            {hasImage && displayMode === 'fill' && (
                <>
                    <ImageWrapper
                        src={heroImage!}
                        alt={resolveImageAlt(block.image, 'Hero image')}
                        fill
                        sizes="100vw"
                        loading="eager"
                        {...(shouldPrioritize && {fetchPriority: 'high'})}
                        preload
                        className="object-cover"
                    />
                    <div
                        className="absolute inset-0"
                        style={{ backgroundColor: overlayColor }}
                    />
                </>
            )}

            {hasImage && displayMode === 'fullImage' && (
                <ImageWrapper
                    src={heroImage!}
                    alt={resolveImageAlt(block.image, 'Hero image')}
                    width={2400}
                    height={1350}
                    className="w-full h-auto"
                    loading="eager"
                    {...(shouldPrioritize && {fetchPriority: 'high'})}
                    preload
                />
            )}

            <div
                className={`relative z-10 flex flex-col items-center justify-center ${heightClass}`}
                style={heightStyle}
            >
                <RichContent value={block.content} />
                <BlockButtons buttons={block.buttons} textAlign={block.layout?.textAlign} />
            </div>
        </section>
    )
}

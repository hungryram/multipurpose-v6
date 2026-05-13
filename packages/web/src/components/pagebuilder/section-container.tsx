import type {PropsWithChildren} from 'react'
import {urlForImage} from '@/lib/sanity/image'

type Layout = {
  containerWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'fluid' | 'full'
  textAlign?: 'left' | 'center' | 'right'
  paddingTop?: 'none' | 'small' | 'medium' | 'large' | 'custom'
  paddingBottom?: 'none' | 'small' | 'medium' | 'large' | 'custom'
  customPaddingTop?: string
  customPaddingBottom?: string
  marginTop?: 'none' | 'small' | 'medium' | 'large' | 'custom'
  marginBottom?: 'none' | 'small' | 'medium' | 'large' | 'custom'
  customMarginTop?: string
  customMarginBottom?: string
  backgroundType?: 'none' | 'color' | 'image'
  backgroundColor?: {_type: 'color'; hex?: string; rgb?: {r: number; g: number; b: number; a?: number}}
  backgroundImage?: {_type: 'image'; asset?: {_ref: string; _type: string}; alt?: string}
  backgroundOverlayColor?: {_type: 'color'; hex?: string; rgb?: {r: number; g: number; b: number; a?: number}}
}

export function widthClass(containerWidth?: Layout['containerWidth']) {
  if (containerWidth === 'full') {
    return 'relative left-1/2 right-1/2 -translate-x-1/2 max-w-none'
  }
  if (containerWidth === 'fluid') return 'max-w-none md:px-8 px-4'
  if (containerWidth === 'xl') return 'max-w-7xl'
  if (containerWidth === 'md') return 'max-w-4xl'
  if (containerWidth === 'sm') return 'max-w-2xl'
  return 'max-w-6xl'
}

function textAlignClass(textAlign?: Layout['textAlign']) {
  if (textAlign === 'center') return 'text-center'
  if (textAlign === 'right') return 'text-right'
  return 'text-left'
}

function spacingValue(preset?: string, custom?: string): string {
  if (!preset || preset === 'none') return '0'
  if (preset === 'small') return '1rem'
  if (preset === 'medium') return '3rem'
  if (preset === 'large') return '5rem'
  if (preset === 'custom' && custom) return custom
  return '0'
}

function getBackgroundStyle(layout?: Layout): React.CSSProperties {
  if (!layout?.backgroundType || layout.backgroundType === 'none') {
    return {}
  }

  if (layout.backgroundType === 'color' && layout.backgroundColor) {
    const color = layout.backgroundColor
    if (color.rgb) {
      const {r, g, b, a = 1} = color.rgb
      return {backgroundColor: `rgba(${r}, ${g}, ${b}, ${a})`}
    }
    if (color.hex) {
      return {backgroundColor: color.hex}
    }
  }

  if (layout.backgroundType === 'image' && layout.backgroundImage) {
    const imageUrl = urlForImage(layout.backgroundImage)?.width(1920).url()
    const overlayColor = layout.backgroundOverlayColor
    
    let overlayStyle = 'rgba(0, 0, 0, 0.3)'
    if (overlayColor) {
      if (overlayColor.rgb) {
        const {r, g, b, a = 0.3} = overlayColor.rgb
        overlayStyle = `rgba(${r}, ${g}, ${b}, ${a})`
      } else if (overlayColor.hex) {
        overlayStyle = overlayColor.hex
      }
    }

    return {
      backgroundImage: imageUrl ? `linear-gradient(${overlayStyle}, ${overlayStyle}), url('${imageUrl}')` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }
  }

  return {}
}

export function SectionContainer({
  layout,
  className,
  children,
}: PropsWithChildren<{layout?: Layout; className?: string}>) {
  const horizontalPaddingClass = layout?.containerWidth === 'full' ? '' : 'lg:px-8 px-4'

  return (
    <div
      style={{
        ...getBackgroundStyle(layout),
        paddingTop: spacingValue(layout?.paddingTop, layout?.customPaddingTop),
        paddingBottom: spacingValue(layout?.paddingBottom, layout?.customPaddingBottom),
        marginTop: spacingValue(layout?.marginTop, layout?.customMarginTop),
        marginBottom: spacingValue(layout?.marginBottom, layout?.customMarginBottom),
      }}
    >
      <div
        className={`mx-auto w-full ${horizontalPaddingClass} ${widthClass(layout?.containerWidth)} ${textAlignClass(layout?.textAlign)} ${className ?? ''}`.trim()}
      >
        {children}
      </div>
    </div>
  )
}

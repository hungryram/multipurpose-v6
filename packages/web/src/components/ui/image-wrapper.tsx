'use client'

import Image, {type ImageProps} from 'next/image'
import {useEffect, useRef, useState} from 'react'

type ImageWrapperProps = Omit<ImageProps, 'onLoad'> & {
  accentClassName?: string
}

export function ImageWrapper({accentClassName = 'bg-zinc-100', className, alt, ...props}: ImageWrapperProps) {
  const [loaded, setLoaded] = useState(false)
  const imageRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    if (imageRef.current?.complete) {
      setLoaded(true)
    }
  }, [])

  return (
    <Image
      ref={imageRef}
      alt={alt}
      {...props}
      onLoad={() => setLoaded(true)}
      className={[
        accentClassName,
        'transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform',
        loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.015]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}

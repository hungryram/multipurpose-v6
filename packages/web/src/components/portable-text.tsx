import {PortableText, type PortableTextComponents} from '@portabletext/react'
import type {PortableTextValue} from './pagebuilder/types'

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({children}) => <p className="mt-4 leading-7 first:mt-0">{children}</p>,
    h1: ({children}) => <h1 className="mt-10 first:mt-0">{children}</h1>,
    h2: ({children}) => <h2 className="mt-8 first:mt-0">{children}</h2>,
    h3: ({children}) => <h3 className="mt-7 first:mt-0">{children}</h3>,
    h4: ({children}) => <h4 className="mt-6 first:mt-0">{children}</h4>,
    h5: ({children}) => <h5 className="mt-5 first:mt-0">{children}</h5>,
    h6: ({children}) => <h6 className="mt-5 first:mt-0">{children}</h6>,
  },
  marks: {
    link: ({children, value}) => {
      const href = (value?.href as string | undefined) ?? '#'
      const openInNewTab = Boolean(value?.openInNewTab)
      return (
        <a
          href={href}
          target={openInNewTab ? '_blank' : undefined}
          rel={openInNewTab ? 'noopener noreferrer' : undefined}
          className="underline decoration-zinc-400 underline-offset-4 hover:decoration-zinc-900"
        >
          {children}
        </a>
      )
    },
    color: ({children, value}) => {
      let colorValue = 'inherit'
      
      // Handle nested color object from @sanity/color-input
      if (value?.hex) {
        if (typeof value.hex === 'string') {
          colorValue = value.hex
        } else if (typeof value.hex === 'object' && value.hex.hex) {
          colorValue = value.hex.hex
        }
      }
      
      return (
        <span style={{color: colorValue}}>
          {children}
        </span>
      )
    },
  },
}

export function RichContent({value}: {value?: PortableTextValue}) {
  if (!value) return null
  return <PortableText value={value} components={portableTextComponents} />
}

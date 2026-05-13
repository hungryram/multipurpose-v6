import Link from 'next/link'
import type {Block} from './pagebuilder/types'

type ButtonItem = NonNullable<Block['buttons']>[number]

function buttonClass(style: ButtonItem['style']) {
  
  if (style === 'secondary') {
    return 'inline-flex rounded-md border border-current/70 px-4 py-2 text-sm font-medium text-current'
  }

  if (style === 'ghost') {
    return 'inline-flex rounded-md px-4 py-2 text-sm font-medium text-current underline decoration-current/70 underline-offset-4'
  }

  // PRIMARY
  return 'inline-flex rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white'
}

function justifyClass(textAlign?: 'left' | 'center' | 'right') {
  if (textAlign === 'center') return 'justify-center'
  if (textAlign === 'right') return 'justify-end'
  return 'justify-start'
}

export function BlockButtons({
  buttons,
  textAlign,
}: {
  buttons?: Block['buttons']
  textAlign?: 'left' | 'center' | 'right'
}) {
  if (!buttons?.length) return null

  return (
    <div className={`mt-6 flex flex-wrap gap-3 ${justifyClass(textAlign)}`.trim()}>
      {buttons.map((button: ButtonItem, index) => (
        (() => {
          const key = button._key ?? `${button.href}-${index}`
          const href =
            button.href ??
            (button.pageType === 'home'
              ? '/'
              : button.pageType === 'blogPost' && button.slug
                ? `/blog/${button.slug}`
                : button.slug
                  ? `/${button.slug}`
                  : '#')
          const isInternal = href.startsWith('/')

          if (isInternal) {
            return (
              <Link key={key} className={buttonClass(button.style)} href={href}>
                {button.label}
              </Link>
            )
          }

          return (
            <a
              key={key}
              className={buttonClass(button.style)}
              href={href}
              target={button.openInNewTab ? '_blank' : undefined}
              rel={button.openInNewTab ? 'noopener noreferrer' : undefined}
            >
              {button.label}
            </a>
          )
        })()
      ))}
    </div>
  )
}

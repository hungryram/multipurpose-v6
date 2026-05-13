import Link from 'next/link'
import type {NavItem} from './pagebuilder/types'
import type {PortableTextValue} from './pagebuilder/types'
import {RichContent} from './portable-text'

function resolveNavHref(item: NavItem) {
  if (item.url) return item.url
  if (item.pageType === 'home') return '/'
  if (item.pageType === 'blogPost' && item.slug) return `/blog/${item.slug}`
  if (item.slug) return `/${item.slug}`
  return '#'
}

function containerClass(containerWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'fluid' | 'full') {
  if (containerWidth === 'full') {
    return 'relative left-1/2 right-1/2 w-screen -translate-x-1/2 max-w-none'
  }
  if (containerWidth === 'fluid') return 'max-w-none'
  if (containerWidth === 'xl') return 'max-w-7xl'
  if (containerWidth === 'md') return 'max-w-4xl'
  if (containerWidth === 'sm') return 'max-w-2xl'
  return 'max-w-6xl'
}

export function Footer({
  disclaimer,
  items,
  containerWidth,
}: {
  disclaimer?: PortableTextValue
  items?: Array<NavItem>
  containerWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'fluid' | 'full'
}) {
  const currentYear = new Date().getFullYear()

  if (!disclaimer && !items?.length) return null

  return (
    <footer className="mt-10 border-t">
      <div className={`mx-auto w-full py-6 text-sm ${containerClass(containerWidth)}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm">
            {disclaimer ? <RichContent value={disclaimer} /> : null}
          </div>
          {!!items?.length && (
            <nav className="flex flex-wrap items-center gap-4">
              {items.map((item) => (
                <Link
                  key={`${item.label}-${item.slug}-${item.url}`}
                  href={resolveNavHref(item)}
                  target={item.openInNewTab ? '_blank' : undefined}
                  rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="mt-4 border-t border-zinc-200 pt-4 text-xs text-zinc-600">
          <p>Copyright © {currentYear}. All rights reserved.</p>
          <p className="mt-1">
            Built by{' '}
            <Link href="https://hungryram.com" target="_blank" rel="noopener noreferrer" className="underline">
              Hungry Ram LLC
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}
'use client'

import Link from 'next/link'
import type {NavItem} from './pagebuilder/types'
import Image from 'next/image'
import {resolveImageAlt, urlForImage} from '@/lib/sanity/image'
import {ChevronDownIcon, MenuIcon, XIcon} from 'lucide-react'
import {useState} from 'react'

function resolveNavHref(item: NavItem) {
  if (item.url) return item.url
  if (item.pageType === 'home') return '/'
  if (item.pageType === 'blogPost' && item.slug) return `/blog/${item.slug}`
  if (item.slug) return `/${item.slug}`
  return '#'
}

function hasNavigableHref(item: NavItem) {
  return Boolean(item.url || item.slug)
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

export function Header({
  items,
  containerWidth,
  logo,
  logoSize,
}: {
  items?: Array<NavItem>
  containerWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'fluid' | 'full'
  logo?: {alt?: string; assetAltText?: string; asset?: {_ref?: string; _type?: string; url?: string}}
  logoSize?: 'sm' | 'md' | 'lg'
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMobileSubmenuIndex, setOpenMobileSubmenuIndex] = useState<number | null>(null)

  const logoUrl = logo ? urlForImage(logo)?.width(800).url() ?? logo.asset?.url : null
  const logoWidth = logoSize === 'sm' ? 96 : logoSize === 'lg' ? 180 : 140
  const logoHeight = logoSize === 'sm' ? 28 : logoSize === 'lg' ? 56 : 40

  if (!logoUrl && !items?.length) return null

  return (
    <header className="border-b">
      <div className={`mx-auto flex w-full items-center justify-between gap-4 py-4 lg:px-8 px-4 text-sm ${containerClass(containerWidth)}`}>
        {logoUrl ?
          (
            <Link href="/" className="inline-flex cursor-pointer items-center" onClick={() => setMobileOpen(false)}>
              <Image
                src={logoUrl}
                alt={resolveImageAlt(logo, 'Site logo')}
                width={logoWidth}
                height={logoHeight}
                priority
                sizes={`${logoWidth}px`}
                className="h-auto w-auto object-contain"
              />
            </Link>
          ) : (
            <Link href="/" className="cursor-pointer text-base" onClick={() => setMobileOpen(false)}>
              Hungryram
            </Link>
          )}

        {!!items?.length && (
          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 transition-colors hover:bg-zinc-100 md:hidden"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        )}

        {!!items?.length && (
          <nav className="hidden md:flex md:flex-wrap md:items-center md:gap-6">
            {items.map((item) => (
              <div key={`${item.label}-${item.slug}-${item.url}`} className="relative group">
                <Link
                  href={resolveNavHref(item)}
                  target={item.openInNewTab ? '_blank' : undefined}
                  rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                  className="inline-flex cursor-pointer items-center gap-1"
                >
                  {item.label}
                  {!!item.submenuItems?.length && (
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="size-4 transition-transform duration-200 group-hover:rotate-180"
                    />
                  )}
                </Link>

                {!!item.submenuItems?.length && (
                  <div className="pointer-events-none invisible absolute left-0 top-[calc(100%+0.375rem)] z-20 flex min-w-48 flex-col gap-1 rounded-md border border-zinc-200 bg-white p-2 opacity-0 shadow-lg transition-all duration-200 ease-out before:absolute before:-top-1.5 before:left-0 before:h-1.5 before:w-full before:content-[''] group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                    {item.submenuItems.map((sub) => (
                      <Link
                        key={`${sub.label}-${sub.slug}-${sub.url}`}
                        href={resolveNavHref(sub)}
                        target={sub.openInNewTab ? '_blank' : undefined}
                        rel={sub.openInNewTab ? 'noopener noreferrer' : undefined}
                        className="block cursor-pointer rounded-sm px-2 py-1 hover:bg-zinc-100"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        )}
      </div>

      {!!items?.length && (
        <div className={`${containerClass(containerWidth)} mx-auto w-full md:hidden`}>
          <nav
            className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:block md:opacity-100 ${
              mobileOpen
                ? 'grid-rows-[1fr] opacity-100 pb-4 pointer-events-auto'
                : 'grid-rows-[0fr] opacity-0 pb-0 pointer-events-none'
            } md:pb-0`}
          >
            <div className="overflow-hidden md:overflow-visible px-4">
              <ul className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
              {items.map((item, index) => (
                <li key={`${item.label}-${item.slug}-${item.url}`} className="md:relative md:group">
                {!!item.submenuItems?.length ? (
                  <>
                    <button
                      type="button"
                      className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-sm px-1 py-1 text-left hover:bg-zinc-100"
                      aria-label={`Toggle ${item.label} submenu`}
                      onClick={() =>
                        setOpenMobileSubmenuIndex((prev) => (prev === index ? null : index))
                      }
                    >
                      <span>{item.label}</span>
                      <span className="inline-flex items-center justify-center rounded-sm p-1">
                        <ChevronDownIcon
                          className={`size-4 transition-transform duration-200 ${
                            openMobileSubmenuIndex === index ? 'rotate-180' : ''
                          }`}
                        />
                      </span>
                    </button>

                    <div
                      className={`ml-3 mt-1 grid border-l border-zinc-200 pl-3 transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        openMobileSubmenuIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="flex flex-col gap-1 pb-1">
                        {hasNavigableHref(item) && (
                          <Link
                            href={resolveNavHref(item)}
                            target={item.openInNewTab ? '_blank' : undefined}
                            rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                            className="cursor-pointer rounded-sm px-2 py-1 text-zinc-700 hover:bg-zinc-100"
                            onClick={() => setMobileOpen(false)}
                          >
                            {item.label}
                          </Link>
                        )}
                        {item.submenuItems.map((sub) => (
                          <Link
                            key={`${sub.label}-${sub.slug}-${sub.url}`}
                            href={resolveNavHref(sub)}
                            target={sub.openInNewTab ? '_blank' : undefined}
                            rel={sub.openInNewTab ? 'noopener noreferrer' : undefined}
                            className="cursor-pointer rounded-sm px-2 py-1 hover:bg-zinc-100"
                            onClick={() => setMobileOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={resolveNavHref(item)}
                    target={item.openInNewTab ? '_blank' : undefined}
                    rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                    className="inline-flex cursor-pointer py-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
                </li>
              ))}
              </ul>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
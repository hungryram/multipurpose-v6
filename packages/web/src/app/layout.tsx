import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import {cache, type CSSProperties} from 'react'
import "./globals.css";
import { cn } from "@/lib/utils";
import {Header} from '@/components/header'
import {Footer} from '@/components/footer'
import type {NavItem, PortableTextValue} from '@/components/pagebuilder/types'
import {isSanityConfigured, sanityFetch} from '@/lib/sanity/client'
import {siteChromeQuery, siteProfileQuery} from '@/lib/sanity/queries'

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type SiteProfile = {
  companyName?: string
  websiteUrl?: string
  contactEmail?: string
  contactPhone?: string
  address?: string
  city?: string
  state?: string
  zip?: string
}

type SiteChromeData = {
  primaryColor?: {_type: 'color'; hex?: string; rgb?: {r: number; g: number; b: number; a?: number}}
  secondaryColor?: {_type: 'color'; hex?: string; rgb?: {r: number; g: number; b: number; a?: number}}
  buttonPrimaryColor?: {_type: 'color'; hex?: string; rgb?: {r: number; g: number; b: number; a?: number}}
  buttonPrimaryTextColor?: {_type: 'color'; hex?: string; rgb?: {r: number; g: number; b: number; a?: number}}
  buttonSecondaryColor?: {_type: 'color'; hex?: string; rgb?: {r: number; g: number; b: number; a?: number}}
  buttonSecondaryTextColor?: {_type: 'color'; hex?: string; rgb?: {r: number; g: number; b: number; a?: number}}
  backgroundColor?: {_type: 'color'; hex?: string; rgb?: {r: number; g: number; b: number; a?: number}}
  foregroundColor?: {_type: 'color'; hex?: string; rgb?: {r: number; g: number; b: number; a?: number}}
  headingColor?: {_type: 'color'; hex?: string; rgb?: {r: number; g: number; b: number; a?: number}}
  footerColor?: {_type: 'color'; hex?: string; rgb?: {r: number; g: number; b: number; a?: number}}
  headerContainerWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'fluid' | 'full'
  headerLogoSize?: 'sm' | 'md' | 'lg'
  headerLogo?: {
    alt?: string
    asset?: {_ref?: string; _type?: string; url?: string}
  }
  headerNavigation?: Array<NavItem>
  footerDisclaimer?: PortableTextValue
  footerContainerWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'fluid' | 'full'
  footerNavigation?: Array<NavItem>
}

function colorToCss(color?: {_type: 'color'; hex?: string; rgb?: {r: number; g: number; b: number; a?: number}}) {
  if (!color) {
    return undefined
  }

  if (color.rgb) {
    const {r, g, b, a = 1} = color.rgb
    return `rgba(${r}, ${g}, ${b}, ${a})`
  }

  return color.hex
}

const getSiteProfile = cache(async function getSiteProfile() {
  if (!isSanityConfigured) {
    return null
  }

  return sanityFetch<SiteProfile>(siteProfileQuery)
})

const getSiteChrome = cache(async function getSiteChrome() {
  if (!isSanityConfigured) {
    return null
  }

  return sanityFetch<SiteChromeData>(siteChromeQuery)
})

function toMetadataBase(websiteUrl?: string): URL | undefined {
  if (!websiteUrl) return undefined

  const normalized = websiteUrl.trim()
  if (!normalized) return undefined

  try {
    return new URL(normalized)
  } catch {
    return undefined
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getSiteProfile()
  const siteName = profile?.companyName?.trim() || 'Website'
  const metadataBase = toMetadataBase(profile?.websiteUrl)
  const description = siteName === 'Website' ? undefined : `Official website of ${siteName}.`

  return {
    metadataBase,
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    openGraph: {
      type: 'website',
      siteName,
      ...(description ? {description} : {}),
    },
    twitter: {
      card: 'summary_large_image',
      ...(description ? {description} : {}),
    },
  }
}

function toJsonLdString(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

function buildOrganizationSchema(profile: SiteProfile | null) {
  const name = profile?.companyName?.trim()
  const url = profile?.websiteUrl?.trim()
  const email = profile?.contactEmail?.trim()
  const telephone = profile?.contactPhone?.trim()
  const streetAddress = profile?.address?.trim()
  const addressLocality = profile?.city?.trim()
  const addressRegion = profile?.state?.trim()
  const postalCode = profile?.zip?.trim()

  if (!name && !url) {
    return null
  }

  const hasPostalAddress = Boolean(
    streetAddress || addressLocality || addressRegion || postalCode,
  )

  return {
    '@context': 'https://schema.org',
    '@type': hasPostalAddress ? 'LocalBusiness' : 'Organization',
    ...(name ? {name} : {}),
    ...(url ? {url} : {}),
    ...(email ? {email} : {}),
    ...(telephone ? {telephone} : {}),
    ...(hasPostalAddress
      ? {
          address: {
            '@type': 'PostalAddress',
            ...(streetAddress ? {streetAddress} : {}),
            ...(addressLocality ? {addressLocality} : {}),
            ...(addressRegion ? {addressRegion} : {}),
            ...(postalCode ? {postalCode} : {}),
          },
        }
      : {}),
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [profile, siteChrome] = await Promise.all([getSiteProfile(), getSiteChrome()])
  const organizationSchema = buildOrganizationSchema(profile)
  const themeStyle = {
    '--site-background': colorToCss(siteChrome?.backgroundColor),
    '--site-foreground': colorToCss(siteChrome?.foregroundColor),
    '--site-primary': colorToCss(siteChrome?.primaryColor),
    '--site-secondary': colorToCss(siteChrome?.secondaryColor),
    '--site-footer': colorToCss(siteChrome?.footerColor),
    '--site-heading-color': colorToCss(siteChrome?.headingColor),
    '--site-button-primary': colorToCss(siteChrome?.buttonPrimaryColor),
    '--site-button-primary-text': colorToCss(siteChrome?.buttonPrimaryTextColor),
    '--site-button-secondary': colorToCss(siteChrome?.buttonSecondaryColor),
    '--site-button-secondary-text': colorToCss(siteChrome?.buttonSecondaryTextColor),
    '--primary': colorToCss(siteChrome?.primaryColor),
    '--secondary': colorToCss(siteChrome?.secondaryColor),
    '--button-primary': colorToCss(siteChrome?.buttonPrimaryColor),
    '--button-primary-text': colorToCss(siteChrome?.buttonPrimaryTextColor),
    '--button-secondary': colorToCss(siteChrome?.buttonSecondaryColor),
    '--button-secondary-text': colorToCss(siteChrome?.buttonSecondaryTextColor),
  } as CSSProperties

  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
      style={themeStyle}
    >
      <body className="min-h-full flex flex-col">
        {organizationSchema ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{__html: toJsonLdString(organizationSchema)}}
          />
        ) : null}
        <Header
          items={siteChrome?.headerNavigation}
          containerWidth={siteChrome?.headerContainerWidth}
          logo={siteChrome?.headerLogo}
          logoSize={siteChrome?.headerLogoSize}
        />
        {children}
        <Footer
          disclaimer={siteChrome?.footerDisclaimer}
          items={siteChrome?.footerNavigation}
          containerWidth={siteChrome?.footerContainerWidth}
        />
      </body>
    </html>
  );
}

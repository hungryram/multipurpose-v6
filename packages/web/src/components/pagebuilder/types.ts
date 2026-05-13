export type PortableTextValue = Array<Record<string, unknown>> | null | undefined

export type NavItem = {
  label?: string
  openInNewTab?: boolean
  url?: string
  pageType?: 'home' | 'page' | 'blogPost'
  slug?: string
  submenuItems?: Array<NavItem>
}

export type BlockLayout = {
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
  backgroundImage?: {
    _type: 'image'
    asset?: {_ref: string; _type: string}
    alt?: string
    assetAltText?: string
  }
  backgroundOverlayColor?: {_type: 'color'; hex?: string; rgb?: {r: number; g: number; b: number; a?: number}}
}

export type Block = {
  _key?: string
  _type?: string
  layout?: BlockLayout
  gridColumns?: 1 | 2 | 3 | 4
  contentLayoutType?:
    | 'textOnly'
    | 'imageLeft'
    | 'imageRight'
    | 'imageTop'
    | 'imageBottom'
  featureGridLayoutType?: 'imageTopCards' | 'imageLeftList' | 'imageOverlayCards'
  postCount?: number
  showFeaturedImage?: boolean
  showExcerpt?: boolean
  showAuthor?: boolean
  showPublishedDate?: boolean
  content?: PortableTextValue
  posts?: Array<{
    _key?: string
    title?: string
    slug?: string
    excerpt?: string
    authorName?: string
    publishedAt?: string
    featuredImage?: {
      alt?: string
      assetAltText?: string
      asset?: {_ref?: string; _type?: string; url?: string}
    }
  }>
  items?: Array<{
    question?: string
    content?: PortableTextValue
    _key?: string
    image?: {
      alt?: string
      assetAltText?: string
      asset?: {_ref?: string; _type?: string; url?: string}
    }
    button?: {
      _key?: string
      label?: string
      href?: string
      pageType?: 'home' | 'page' | 'blogPost'
      slug?: string
      openInNewTab?: boolean
      style?: 'primary' | 'secondary' | 'ghost'
    }
  }>
  buttons?: Array<{
    _key?: string
    label?: string
    href?: string
    pageType?: 'home' | 'page' | 'blogPost'
    slug?: string
    openInNewTab?: boolean
    style?: 'primary' | 'secondary' | 'ghost'
  }>
  image?: {
    alt?: string
    asset?: {_ref?: string; _type?: string; url?: string}
    assetAltText?: string
  }
  imageOverlayColor?: {
    hex?: string
    rgb?: {r?: number; g?: number; b?: number; a?: number}
  }
  questionColor?: {
    hex?: string
    rgb?: {r?: number; g?: number; b?: number; a?: number}
  }
  contentColor?: {
    hex?: string
    rgb?: {r?: number; g?: number; b?: number; a?: number}
  }
  faqSchemaEnabled?: boolean
  heroHeight?: 'small' | 'medium' | 'large' | 'custom'
  customHeroHeight?: string
  imageDisplayMode?: 'fill' | 'fullImage'
  prioritizeImage?: boolean
  submitLabel?: string
  successMessage?: string
  errorMessage?: string
  successRedirectPath?: string
  destinationEmail?: string
  postmarkFromEmail?: string
  postmarkFromName?: string
  postmarkSubject?: string
  sheetsSheetId?: string
  sheetsSheetName?: string
  formFields?: Array<{
    _key?: string
    name?: string
    label?: string
    fieldType?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox'
    required?: boolean
    placeholder?: string
    helpText?: string
    width?: 'full' | 'half'
    options?: Array<string>
  }>
}

type HomePayload = {
  title?: string
  slug?: {current?: string}
  seoTitle?: string
  seoDescription?: string
  blocks?: Array<Block>
}

export type HomePageData = {
  profile?: {
    companyName?: string
    websiteUrl?: string
  }
  headerContainerWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'fluid' | 'full'
  headerLogoSize?: 'sm' | 'md' | 'lg'
  headerLogo?: {
    alt?: string
    asset?: {_ref?: string; _type?: string; url?: string}
    assetAltText?: string
  }
  headerNavigation?: Array<NavItem>
  footerDisclaimer?: PortableTextValue
  footerContainerWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'fluid' | 'full'
  footerNavigation?: Array<NavItem>
  home?: HomePayload
}

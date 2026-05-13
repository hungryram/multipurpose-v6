import type {ReactElement} from 'react'
import type {Block, HomePageData} from './pagebuilder/types'
import {HeroBlock} from './pagebuilder/hero-block'
import {ContentBlock} from './pagebuilder/content-block'
import {FeatureGridBlock} from './pagebuilder/feature-grid-block'
import {BlogPostsBlock} from './pagebuilder/blog-posts-block'
import {ContactFormBlock} from './pagebuilder/contact-form-block'
import {AccordionBlock} from './pagebuilder/accordion-block'
import {ImageBlock} from './pagebuilder/image-block'
import {SectionContainer} from './pagebuilder/section-container'

export type {HomePageData} from './pagebuilder/types'

function BlockRenderer({block}: {block: Block}) {
  if (!block._type) return null

  let rendered: ReactElement | null = null

  if (block._type === 'heroBlock') rendered = <HeroBlock block={block} />
  if (block._type === 'contentBlock') rendered = <ContentBlock block={block} />
  if (block._type === 'featureGridBlock') rendered = <FeatureGridBlock block={block} />
  if (block._type === 'blogPostsBlock') rendered = <BlogPostsBlock block={block} />
  if (block._type === 'contactFormBlock') rendered = <ContactFormBlock block={block} />
  if (block._type === 'accordionBlock') rendered = <AccordionBlock block={block} />
  if (block._type === 'imageBlock') rendered = <ImageBlock block={block} />

  if (!rendered) return null

  return <SectionContainer layout={block.layout}>{rendered}</SectionContainer>
}

export function PageBuilder({data}: {data: HomePageData}) {
  const blocks = data.home?.blocks ?? []

  return (
    <main>
      {blocks.map((block, index) => (
        <BlockRenderer key={block._key ?? `${block._type}-${index}`} block={block} />
      ))}
    </main>
  )
}

import type {Block} from './types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'
import {RichContent} from '../portable-text'
import {BlockButtons} from '../block-buttons'

function toTextColorStyle(color?: {hex?: string; rgb?: {r?: number; g?: number; b?: number; a?: number}}) {
  if (!color) return undefined

  if (color.rgb) {
    const {r = 0, g = 0, b = 0, a = 1} = color.rgb
    return {color: `rgba(${r}, ${g}, ${b}, ${a})`}
  }

  if (color.hex) {
    return {color: color.hex}
  }

  return undefined
}

function portableTextToPlainText(value: unknown): string {
  if (!Array.isArray(value)) return ''

  const lines = value
    .map((block) => {
      if (!block || typeof block !== 'object') return ''
      const maybeBlock = block as {children?: Array<{text?: string}>}
      if (!Array.isArray(maybeBlock.children)) return ''
      return maybeBlock.children
        .map((child) => child?.text?.trim() ?? '')
        .filter(Boolean)
        .join(' ')
    })
    .filter(Boolean)

  return lines.join(' ').trim()
}

function toJsonLdString(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

export function AccordionBlock({block}: {block: Block}) {
  const questionColorStyle = toTextColorStyle(block.questionColor)
  const contentColorStyle = toTextColorStyle(block.contentColor)
  const faqEntities = (block.items ?? [])
    .map((item) => {
      const question = item.question?.trim()
      const answer = portableTextToPlainText(item.content)
      if (!question || !answer) return null

      return {
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      }
    })
    .filter((entity): entity is NonNullable<typeof entity> => Boolean(entity))

  const faqJsonLd =
    block.faqSchemaEnabled && faqEntities.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqEntities,
        }
      : null

  return (
    <section className="space-y-4">
      <RichContent value={block.content} />
      <BlockButtons buttons={block.buttons} textAlign={block.layout?.textAlign} />
      <Accordion type="single" collapsible className="space-y-3">
        {block.items?.map((item) => (
          <AccordionItem
            key={item._key}
            value={item._key ?? item.question ?? 'item'}
            className="overflow-hidden border"
          >
            <AccordionTrigger className="px-4 py-4" style={questionColorStyle}>
              {item.question}
            </AccordionTrigger>
            <AccordionContent
              className="border-t border-zinc-200 px-4 py-4"
              style={contentColorStyle}
            >
              <RichContent value={item.content} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: toJsonLdString(faqJsonLd)}}
        />
      ) : null}
    </section>
  )
}

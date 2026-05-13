import type {Block} from './types'
import {RichContent} from '../portable-text'
import {BlockButtons} from '../block-buttons'
import {ContactFormClient} from './contact-form-client'

export function ContactFormBlock({block}: {block: Block}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6">
      <RichContent value={block.content} />
      <BlockButtons buttons={block.buttons} textAlign={block.layout?.textAlign} />
      <ContactFormClient block={block} />
    </section>
  )
}

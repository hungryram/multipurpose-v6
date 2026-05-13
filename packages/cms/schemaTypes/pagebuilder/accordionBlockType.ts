import {defineArrayMember, defineField, defineType} from 'sanity'

export const accordionBlockType = defineType({
  name: 'accordionBlock',
  title: 'Accordion',
  type: 'object',
  fieldsets: [
    {
      name: 'settings',
      title: 'Block Settings',
      options: {collapsible: true, collapsed: true},
    },
  ],
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'content',
    }),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'buttons',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'accordionItem',
          title: 'Accordion Item',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (rule) => rule.required().max(120),
            }),
            defineField({
              name: 'content',
              title: 'Content',
              type: 'content',
            }),
          ],
          preview: {
            select: {title: 'question'},
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(20),
    }),
    defineField({
      name: 'questionColor',
      title: 'Question Color',
      type: 'color',
      fieldset: 'settings',
    }),
    defineField({
      name: 'contentColor',
      title: 'Content Color',
      type: 'color',
      fieldset: 'settings',
    }),
    defineField({
      name: 'faqSchemaEnabled',
      title: 'Enable FAQ Schema',
      description: 'When enabled, this block outputs FAQPage JSON-LD for search engines.',
      type: 'boolean',
      initialValue: false,
      fieldset: 'settings',
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'blockLayout',
      fieldset: 'settings',
    }),
  ],
  preview: {
    select: {
      firstLine: 'content.0.children.0.text',
      itemCount: 'items.length',
    },
    prepare({firstLine, itemCount}) {
      return {
        title: 'Accordion',
        subtitle: `${firstLine || 'No intro content'} • ${itemCount || 0} item${itemCount === 1 ? '' : 's'}`,
      }
    },
  },
})

import {defineField, defineType} from 'sanity'

export const imageBlockType = defineType({
  name: 'imageBlock',
  title: 'Image',
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
      name: 'buttons',
      title: 'Buttons',
      type: 'buttons',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (rule) => rule.required().max(140),
        }),
      ],
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
      media: 'image',
      alt: 'image.alt',
      firstLine: 'content.0.children.0.text',
    },
    prepare({media, alt, firstLine}) {
      return {
        title: 'Image',
        subtitle: firstLine || alt || 'No caption content',
        media,
      }
    },
  },
})

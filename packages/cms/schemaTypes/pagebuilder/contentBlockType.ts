import {defineField, defineType} from 'sanity'

export const contentBlockType = defineType({
  name: 'contentBlock',
  title: 'Content',
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
      name: 'contentLayoutType',
      title: 'Content Layout Type',
      type: 'string',
      initialValue: 'textOnly',
      options: {
        list: [
          {title: 'Text Only', value: 'textOnly'},
          {title: 'Image Left', value: 'imageLeft'},
          {title: 'Image Right', value: 'imageRight'},
          {title: 'Image Top', value: 'imageTop'},
          {title: 'Image Bottom', value: 'imageBottom'},
        ],
        layout: 'dropdown',
      },
      fieldset: 'settings',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      hidden: ({parent}) => !parent?.contentLayoutType || parent?.contentLayoutType === 'textOnly',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
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
      firstLine: 'content.0.children.0.text',
      contentLayoutType: 'contentLayoutType',
      media: 'image',
    },
    prepare({firstLine, contentLayoutType, media}) {
      return {
        title: 'Content',
        subtitle: `${contentLayoutType || 'textOnly'} • ${firstLine || 'No content yet'}`,
        media,
      }
    },
  },
})

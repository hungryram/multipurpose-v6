import {defineArrayMember, defineField, defineType} from 'sanity'

export const blockContent = defineArrayMember({
  type: 'block',
  styles: [
    {title: 'Normal', value: 'normal'},
    {title: 'Heading 1', value: 'h1'},
    {title: 'Heading 2', value: 'h2'},
    {title: 'Heading 3', value: 'h3'},
    {title: 'Heading 4', value: 'h4'},
    {title: 'Heading 5', value: 'h5'},
    {title: 'Heading 6', value: 'h6'},
    {title: 'Quote', value: 'blockquote'},
  ],
  lists: [{title: 'Bullet', value: 'bullet'}, {title: 'Number', value: 'number'}],
  marks: {
    decorators: [
      {title: 'Strong', value: 'strong'},
      {title: 'Emphasis', value: 'em'},
      {title: 'Underline', value: 'underline'},
    ],
    annotations: [
      {
        name: 'link',
        title: 'Link',
        type: 'object',
        fields: [
          defineField({
            name: 'href',
            title: 'URL',
            type: 'url',
            validation: (rule) => rule.required(),
          }),
          defineField({
            name: 'openInNewTab',
            title: 'Open In New Tab',
            type: 'boolean',
            initialValue: false,
          }),
        ],
      },
      {
        name: 'color',
        title: 'Color',
        type: 'object',
        icon: () => '🎨',
        fields: [
          defineField({
            name: 'hex',
            title: 'Text Color',
            type: 'color',
          }),
        ],
        preview: {
          select: {'hex': 'hex.hex'},
          prepare({hex}) {
            return {
              title: 'Color',
              subtitle: hex ?? 'Not set',
            }
          },
        },
      },
    ],
  },
})

export const contentBlockType = defineType({
  name: 'content',
  title: 'Content',
  type: 'array',
  of: [blockContent],
})

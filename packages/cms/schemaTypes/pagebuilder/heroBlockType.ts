import {defineField, defineType} from 'sanity'

export const heroBlockType = defineType({
  name: 'heroBlock',
  title: 'Hero Block',
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
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (rule) => rule.max(140),
        }),
      ],
    }),
    defineField({
      name: 'imageOverlayColor',
      title: 'Image Overlay Color',
      type: 'color',
      hidden: ({parent}) => !parent?.image,
    }),
    defineField({
      name: 'heroHeight',
      title: 'Hero Height',
      type: 'string',
      options: {
        list: [
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'},
          {title: 'Custom', value: 'custom'},
        ],
      },
      initialValue: 'medium',
      fieldset: 'settings',
    }),
    defineField({
      name: 'customHeroHeight',
      title: 'Custom Height (e.g., 500px, 60vh)',
      type: 'string',
      hidden: ({parent}) => parent?.heroHeight !== 'custom',
      fieldset: 'settings',
    }),
    defineField({
      name: 'imageDisplayMode',
      title: 'Image Display Mode',
      type: 'string',
      options: {
        list: [
          {title: 'Fill (constrained to container)', value: 'fill'},
          {title: 'Full Image (show entire image)', value: 'fullImage'},
        ],
      },
      initialValue: 'fill',
      hidden: ({parent}) => !parent?.image,
      fieldset: 'settings',
    }),
    defineField({
      name: 'prioritizeImage',
      title: 'Prioritize Image Loading (if above the fold)',
      description: 'Enable if this hero is visible on page load. Improves LCP.',
      type: 'boolean',
      initialValue: true,
      hidden: ({parent}) => !parent?.image,
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
      buttonCount: 'buttons.length',
      media: 'image',
    },
    prepare({firstLine, buttonCount, media}) {
      const text = firstLine || 'No content yet'
      const buttons = buttonCount ? ` • ${buttonCount} button${buttonCount > 1 ? 's' : ''}` : ''
      return {
        title: 'Hero',
        subtitle: `${text}${buttons}`,
        media,
      }
    },
  },
})

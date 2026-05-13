import {defineArrayMember, defineField, defineType} from 'sanity'

export const featureGridBlockType = defineType({
  name: 'featureGridBlock',
  title: 'Feature Grid',
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
      title: 'Features',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'featureItem',
          title: 'Feature Item',
          fields: [
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
              name: 'content',
              title: 'Content',
              type: 'content',
            }),
            defineField({
              name: 'button',
              title: 'Button',
              type: 'object',
              fields: [
                defineField({
                  name: 'label',
                  title: 'Label',
                  type: 'string',
                }),
                defineField({
                  name: 'href',
                  title: 'URL',
                  type: 'url',
                  description: 'Use for external links. Leave empty if selecting a Page.',
                }),
                defineField({
                  name: 'page',
                  title: 'Page',
                  type: 'reference',
                  to: [{type: 'home'}, {type: 'page'}],
                  description: 'Use for internal links. Leave empty if using URL.',
                }),
                defineField({
                  name: 'openInNewTab',
                  title: 'Open In New Tab',
                  type: 'boolean',
                  initialValue: false,
                }),
                defineField({
                  name: 'style',
                  title: 'Style',
                  type: 'string',
                  initialValue: 'primary',
                  options: {
                    list: [
                      {title: 'Primary', value: 'primary'},
                      {title: 'Secondary', value: 'secondary'},
                      {title: 'Ghost', value: 'ghost'},
                    ],
                    layout: 'radio',
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: 'content.0.children.0.text',
              media: 'image',
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(12),
    }),
    defineField({
      name: 'featureGridLayoutType',
      title: 'Feature Grid Layout Type',
      type: 'string',
      initialValue: 'imageTopCards',
      options: {
        list: [
          {title: 'Image Top Cards', value: 'imageTopCards'},
          {title: 'Image Left List', value: 'imageLeftList'},
          {title: 'Image Overlay Cards', value: 'imageOverlayCards'},
        ],
        layout: 'dropdown',
      },
      fieldset: 'settings',
    }),
    defineField({
      name: 'gridColumns',
      title: 'Grid Columns',
      type: 'number',
      initialValue: 3,
      options: {
        list: [
          {title: '1 Column', value: 1},
          {title: '2 Columns', value: 2},
          {title: '3 Columns', value: 3},
          {title: '4 Columns', value: 4},
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required().min(1).max(4),
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
      gridColumns: 'gridColumns',
      featureGridLayoutType: 'featureGridLayoutType',
    },
    prepare({firstLine, itemCount, gridColumns, featureGridLayoutType}) {
      return {
        title: 'Feature Grid',
        subtitle: `${featureGridLayoutType || 'imageTopCards'} • ${firstLine || 'No intro content'} • ${itemCount || 0} item${itemCount === 1 ? '' : 's'} • ${gridColumns || 3} col`,
      }
    },
  },
})

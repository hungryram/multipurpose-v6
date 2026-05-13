import {defineField, defineType} from 'sanity'

export const blockLayoutType = defineType({
  name: 'blockLayout',
  title: 'Block Layout',
  type: 'object',
  fields: [
    defineField({
      name: 'containerWidth',
      title: 'Container Width',
      type: 'string',
      initialValue: 'lg',
      options: {
        list: [
          {title: 'Small', value: 'sm'},
          {title: 'Medium', value: 'md'},
          {title: 'Large (Default)', value: 'lg'},
          {title: 'Extra Large', value: 'xl'},
          {title: 'Fluid', value: 'fluid'},
          {title: 'Full Width', value: 'full'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'textAlign',
      title: 'Text Align',
      type: 'string',
      initialValue: 'left',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'paddingTop',
      title: 'Padding Top',
      type: 'string',
      initialValue: 'medium',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'},
          {title: 'Custom', value: 'custom'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'customPaddingTop',
      title: 'Custom Padding Top',
      type: 'string',
      hidden: ({parent}) => parent?.paddingTop !== 'custom',
      placeholder: 'e.g., 1rem, 10px, 2.5rem',
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom',
      type: 'string',
      initialValue: 'medium',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'},
          {title: 'Custom', value: 'custom'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'customPaddingBottom',
      title: 'Custom Padding Bottom',
      type: 'string',
      hidden: ({parent}) => parent?.paddingBottom !== 'custom',
      placeholder: 'e.g., 1rem, 10px, 2.5rem',
    }),
    defineField({
      name: 'marginTop',
      title: 'Margin Top',
      type: 'string',
      initialValue: 'none',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'},
          {title: 'Custom', value: 'custom'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'customMarginTop',
      title: 'Custom Margin Top',
      type: 'string',
      hidden: ({parent}) => parent?.marginTop !== 'custom',
      placeholder: 'e.g., 1rem, 10px, 2.5rem',
    }),
    defineField({
      name: 'marginBottom',
      title: 'Margin Bottom',
      type: 'string',
      initialValue: 'none',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'},
          {title: 'Custom', value: 'custom'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'customMarginBottom',
      title: 'Custom Margin Bottom',
      type: 'string',
      hidden: ({parent}) => parent?.marginBottom !== 'custom',
      placeholder: 'e.g., 1rem, 10px, 2.5rem',
    }),
    defineField({
      name: 'backgroundType',
      title: 'Background',
      type: 'string',
      initialValue: 'none',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Color', value: 'color'},
          {title: 'Image', value: 'image'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'color',
      hidden: ({parent}) => parent?.backgroundType !== 'color',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      hidden: ({parent}) => parent?.backgroundType !== 'image',
    }),
    defineField({
      name: 'backgroundOverlayColor',
      title: 'Background Overlay Color',
      type: 'color',
      hidden: ({parent}) => parent?.backgroundType !== 'image',
      description: 'Optional overlay on top of the background image',
    }),
  ],
})

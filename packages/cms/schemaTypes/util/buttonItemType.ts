import {defineField, defineType} from 'sanity'

export const buttonItemType = defineType({
  name: 'buttonItem',
  title: 'Button',
  type: 'object',
  validation: (rule) =>
    rule.custom((button) => {
      const hasUrl = Boolean((button as {href?: string} | undefined)?.href)
      const hasPage = Boolean(
        (button as {page?: {_ref?: string}} | undefined)?.page?._ref,
      )

      if (!hasUrl && !hasPage) return 'Set URL or select Page.'
      if (hasUrl && hasPage) return 'Use either URL or Page, not both.'
      return true
    }),
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required().max(30),
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
      to: [{type: 'home'}, {type: 'page'}, {type: 'blogPost'}],
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
  preview: {
    select: {
      title: 'label',
      href: 'href',
      pageTitle: 'page.title',
    },
    prepare({title, href, pageTitle}) {
      return {
        title,
        subtitle: href || pageTitle || 'No destination',
      }
    },
  },
})

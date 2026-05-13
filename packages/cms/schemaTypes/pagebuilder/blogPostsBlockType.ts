import {defineField, defineType} from 'sanity'

export const blogPostsBlockType = defineType({
  name: 'blogPostsBlock',
  title: 'Blog Posts',
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
      name: 'postCount',
      title: 'Number of Posts',
      type: 'number',
      initialValue: 3,
      options: {
        list: [
          {title: '3 Posts', value: 3},
          {title: '6 Posts', value: 6},
          {title: '9 Posts', value: 9},
          {title: '12 Posts', value: 12},
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required().min(1).max(12),
      fieldset: 'settings',
    }),
    defineField({
      name: 'showFeaturedImage',
      title: 'Show Featured Image',
      type: 'boolean',
      initialValue: true,
      fieldset: 'settings',
    }),
    defineField({
      name: 'showExcerpt',
      title: 'Show Excerpt',
      type: 'boolean',
      initialValue: true,
      fieldset: 'settings',
    }),
    defineField({
      name: 'showAuthor',
      title: 'Show Author',
      type: 'boolean',
      initialValue: true,
      fieldset: 'settings',
    }),
    defineField({
      name: 'showPublishedDate',
      title: 'Show Published Date',
      type: 'boolean',
      initialValue: true,
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
      postCount: 'postCount',
    },
    prepare({firstLine, postCount}) {
      return {
        title: 'Blog Posts',
        subtitle: `${firstLine || 'No intro content'} • ${postCount || 3} post${postCount === 1 ? '' : 's'}`,
      }
    },
  },
})
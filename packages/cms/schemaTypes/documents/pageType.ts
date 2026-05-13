import {defineArrayMember, defineField, defineType} from 'sanity'

export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().min(2).max(90),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'blocks',
      title: 'Page Blocks',
      type: 'array',
      of: [
        defineArrayMember({type: 'heroBlock'}),
        defineArrayMember({type: 'contentBlock'}),
        defineArrayMember({type: 'featureGridBlock'}),
        defineArrayMember({type: 'blogPostsBlock'}),
        defineArrayMember({type: 'contactFormBlock'}),
        defineArrayMember({type: 'accordionBlock'}),
        defineArrayMember({type: 'imageBlock'}),
      ],
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      description: 'Optional title for browser tab and search/social previews.',
      type: 'string',
      validation: (rule) => rule.max(70),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      description: 'Optional meta description for search and social previews.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(160),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
    },
    prepare({title, subtitle}) {
      return {
        title,
        subtitle: subtitle ? `/${subtitle}` : 'No slug',
      }
    },
  },
})

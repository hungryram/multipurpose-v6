import {defineArrayMember, defineField, defineType} from 'sanity'

export const appearanceType = defineType({
  name: 'appearance',
  title: 'Appearance',
  type: 'document',
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'header', title: 'Header'},
    {name: 'footer', title: 'Footer'},
  ],
  fields: [
    defineField({
      name: 'activeHomePage',
      title: 'Active Home Page',
      description: 'Select which Home document should be used as the live homepage.',
      type: 'reference',
      group: 'general',
      to: [{type: 'home'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'primaryColor',
      title: 'Primary Color',
      description: 'Used for primary theme surfaces and accents.',
      type: 'color',
      group: 'general',
    }),
    defineField({
      name: 'secondaryColor',
      title: 'Secondary Color',
      description: 'Used for secondary theme surfaces and accents.',
      type: 'color',
      group: 'general',
    }),
    defineField({
      name: 'buttonPrimaryColor',
      title: 'Button Primary Color',
      description: 'Background color for primary buttons.',
      type: 'color',
      group: 'general',
    }),
    defineField({
      name: 'buttonPrimaryTextColor',
      title: 'Button Primary Text Color',
      description: 'Text color for primary buttons.',
      type: 'color',
      group: 'general',
    }),
    defineField({
      name: 'buttonSecondaryColor',
      title: 'Button Secondary Color',
      description: 'Background color for secondary buttons.',
      type: 'color',
      group: 'general',
    }),
    defineField({
      name: 'buttonSecondaryTextColor',
      title: 'Button Secondary Text Color',
      description: 'Text color for secondary buttons.',
      type: 'color',
      group: 'general',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      description: 'Default page background color.',
      type: 'color',
      group: 'general',
    }),
    defineField({
      name: 'foregroundColor',
      title: 'Foreground Color',
      description: 'Default body text color.',
      type: 'color',
      group: 'general',
    }),
    defineField({
      name: 'headingColor',
      title: 'Heading Color',
      description: 'Color used for headings.',
      type: 'color',
      group: 'general',
    }),
    defineField({
      name: 'footerColor',
      title: 'Footer Color',
      description: 'Background color for the site footer.',
      type: 'color',
      group: 'general',
    }),
    defineField({
      name: 'headerNavigation',
      title: 'Header Navigation',
      description: 'Menu items shown in the site header.',
      type: 'array',
      group: 'header',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'navigationItem',
          title: 'Navigation Item',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required().min(1).max(40),
            }),
            defineField({
              name: 'page',
              title: 'Internal Page',
              description: 'Link to a Home or Page document.',
              type: 'reference',
              to: [{type: 'home'}, {type: 'page'}, {type: 'blogPost'}],
            }),
            defineField({
              name: 'url',
              title: 'External URL',
              type: 'url',
            }),
            defineField({
              name: 'openInNewTab',
              title: 'Open In New Tab',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'submenuItems',
              title: 'Submenu Items',
              description: 'Optional child links shown in a dropdown.',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'submenuItem',
                  title: 'Submenu Item',
                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Label',
                      type: 'string',
                      validation: (rule) => rule.required().min(1).max(40),
                    }),
                    defineField({
                      name: 'page',
                      title: 'Internal Page',
                      description: 'Link to a Home or Page document.',
                      type: 'reference',
                      to: [{type: 'home'}, {type: 'page'}, {type: 'blogPost'}],
                    }),
                    defineField({
                      name: 'url',
                      title: 'External URL',
                      type: 'url',
                    }),
                    defineField({
                      name: 'openInNewTab',
                      title: 'Open In New Tab',
                      type: 'boolean',
                      initialValue: false,
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'label',
                      pageTitle: 'page.title',
                      url: 'url',
                    },
                    prepare({title, pageTitle, url}) {
                      return {
                        title: title || 'Untitled submenu item',
                        subtitle: pageTitle
                          ? `Internal: ${pageTitle}`
                          : url || 'No link set',
                      }
                    },
                  },
                  validation: (rule) =>
                    rule.custom((value) => {
                      if (!value || typeof value !== 'object') {
                        return true
                      }

                      const hasPage = !!value.page
                      const hasUrl = !!value.url

                      if (!hasPage && !hasUrl) {
                        return 'Set an Internal Page or External URL.'
                      }

                      if (hasPage && hasUrl) {
                        return 'Use either Internal Page or External URL, not both.'
                      }

                      return true
                    }),
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: 'label',
              pageTitle: 'page.title',
              url: 'url',
              submenuCount: 'submenuItems.length',
            },
            prepare({title, pageTitle, url, submenuCount}) {
              return {
                title: title || 'Untitled nav item',
                subtitle: submenuCount
                  ? `${submenuCount} submenu item${submenuCount > 1 ? 's' : ''}`
                  : pageTitle
                    ? `Internal: ${pageTitle}`
                    : url || 'No link set',
              }
            },
          },
          validation: (rule) =>
            rule.custom((value) => {
              if (!value || typeof value !== 'object') {
                return true
              }

              const hasPage = !!value.page
              const hasUrl = !!value.url
              const submenuCount = Array.isArray(value.submenuItems)
                ? value.submenuItems.length
                : 0

              if (hasPage && hasUrl) {
                return 'Use either Internal Page or External URL, not both.'
              }

              if (!hasPage && !hasUrl && submenuCount === 0) {
                return 'Set an Internal Page, External URL, or at least one Submenu Item.'
              }

              return true
            }),
        }),
      ],
    }),
    defineField({
      name: 'headerContainerWidth',
      title: 'Header Container Width',
      type: 'string',
      group: 'header',
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
      name: 'headerLogo',
      title: 'Header Logo',
      type: 'image',
      group: 'header',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'headerLogoSize',
      title: 'Header Logo Size',
      type: 'string',
      group: 'header',
      initialValue: 'md',
      options: {
        list: [
          {title: 'Small', value: 'sm'},
          {title: 'Medium', value: 'md'},
          {title: 'Large', value: 'lg'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'footerDisclaimer',
      title: 'Footer Disclaimer',
      type: 'content',
      group: 'footer',
      description: 'Rich text disclaimer shown in the footer.',
    }),
    defineField({
      name: 'footerNavigation',
      title: 'Footer Navigation',
      description: 'Optional links shown in the footer.',
      type: 'array',
      group: 'footer',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'footerNavigationItem',
          title: 'Footer Navigation Item',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required().min(1).max(40),
            }),
            defineField({
              name: 'page',
              title: 'Internal Page',
              type: 'reference',
              to: [{type: 'home'}, {type: 'page'}, {type: 'blogPost'}],
            }),
            defineField({
              name: 'url',
              title: 'External URL',
              type: 'url',
            }),
            defineField({
              name: 'openInNewTab',
              title: 'Open In New Tab',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: 'label',
              pageTitle: 'page.title',
              url: 'url',
            },
            prepare({title, pageTitle, url}) {
              return {
                title: title || 'Untitled footer item',
                subtitle: pageTitle ? `Internal: ${pageTitle}` : url || 'No link set',
              }
            },
          },
          validation: (rule) =>
            rule.custom((value) => {
              if (!value || typeof value !== 'object') {
                return true
              }

              const hasPage = !!value.page
              const hasUrl = !!value.url

              if (!hasPage && !hasUrl) {
                return 'Set an Internal Page or External URL.'
              }

              if (hasPage && hasUrl) {
                return 'Use either Internal Page or External URL, not both.'
              }

              return true
            }),
        }),
      ],
    }),
    defineField({
      name: 'footerContainerWidth',
      title: 'Footer Container Width',
      type: 'string',
      group: 'footer',
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
  ],
  preview: {
    select: {
      title: 'activeHomePage.title',
    },
    prepare({title}) {
      return {
        title: 'Appearance',
        subtitle: title ? `Home: ${title}` : 'No Home page selected',
      }
    },
  },
})

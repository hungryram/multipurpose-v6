import {defineField, defineType} from 'sanity'

export const contactFormBlockType = defineType({
  name: 'contactFormBlock',
  title: 'Contact Form',
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
      name: 'formFields',
      title: 'Form Builder Fields',
      description: 'Build your form fields and ordering here.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'contactFormField',
          fields: [
            defineField({
              name: 'name',
              title: 'Field Name',
              type: 'string',
              description: 'Used in payload keys. Example: fullName, companyName, projectType',
              validation: (rule) =>
                rule
                  .required()
                  .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, {
                    name: 'field key',
                    invert: false,
                  }),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required().max(80),
            }),
            defineField({
              name: 'fieldType',
              title: 'Field Type',
              type: 'string',
              initialValue: 'text',
              options: {
                list: [
                  {title: 'Text', value: 'text'},
                  {title: 'Email', value: 'email'},
                  {title: 'Tel', value: 'tel'},
                  {title: 'Textarea', value: 'textarea'},
                  {title: 'Select', value: 'select'},
                  {title: 'Checkbox', value: 'checkbox'},
                ],
                layout: 'dropdown',
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'required',
              title: 'Required',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
              validation: (rule) => rule.max(120),
            }),
            defineField({
              name: 'helpText',
              title: 'Help Text',
              type: 'string',
              validation: (rule) => rule.max(160),
            }),
            defineField({
              name: 'width',
              title: 'Field Width',
              type: 'string',
              initialValue: 'full',
              options: {
                list: [
                  {title: 'Full Width', value: 'full'},
                  {title: 'Half Width', value: 'half'},
                ],
                layout: 'radio',
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'options',
              title: 'Select Options',
              description: 'Only used when Field Type is Select.',
              type: 'array',
              of: [{type: 'string'}],
              hidden: ({parent}) => parent?.fieldType !== 'select',
              validation: (rule) =>
                rule.custom((value, context) => {
                  const parent = context.parent as {fieldType?: string} | undefined
                  if (parent?.fieldType !== 'select') return true
                  if (!Array.isArray(value) || value.length < 1) {
                    return 'Add at least one option for select fields'
                  }
                  return true
                }),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              type: 'fieldType',
              required: 'required',
            },
            prepare({title, type, required}) {
              return {
                title: title || 'Untitled field',
                subtitle: `${type || 'text'}${required ? ' • required' : ''}`,
              }
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(1).max(20),
    }),
    defineField({
      name: 'submitLabel',
      title: 'Submit Label',
      type: 'string',
      fieldset: 'settings',
      initialValue: 'Send Message',
      validation: (rule) => rule.required().max(30),
    }),
    defineField({
      name: 'successMessage',
      title: 'Success Message',
      type: 'string',
      fieldset: 'settings',
      initialValue: 'Thanks! We received your message and will get back to you shortly.',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'errorMessage',
      title: 'Error Message',
      type: 'string',
      fieldset: 'settings',
      initialValue: 'Something went wrong. Please try again in a moment.',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'successRedirectPage',
      title: 'Success Redirect Page',
      description:
        'Optional. Redirect users to this page after successful submission. If empty, success message is shown.',
      type: 'reference',
      to: [{type: 'home'}, {type: 'page'}],
      fieldset: 'settings',
    }),
    defineField({
      name: 'postmarkFromEmail',
      title: 'Postmark From Email',
      description:
        'Optional. Must be a sender signature/domain verified in Postmark. Falls back to forms@hungryramwebdesign.com when empty.',
      type: 'string',
      fieldset: 'settings',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'postmarkFromName',
      title: 'Postmark From Name',
      description: 'Optional display name for the sender (for example: Hungryram Web Design).',
      type: 'string',
      fieldset: 'settings',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'destinationEmail',
      title: 'Destination Email',
      description: 'Primary inbox recipient for submissions.',
      type: 'string',
      fieldset: 'settings',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'postmarkSubject',
      title: 'Postmark Subject',
      type: 'string',
      fieldset: 'settings',
      initialValue: 'New contact form submission',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'sheetsSheetId',
      title: 'Google Sheets ID',
      description: 'Optional. The spreadsheet ID from your Google Sheet URL.',
      type: 'string',
      fieldset: 'settings',
    }),
    defineField({
      name: 'sheetsSheetName',
      title: 'Google Sheets Sheet Name',
      description: 'Optional. The sheet name within the spreadsheet (e.g., "Form Submissions").',
      type: 'string',
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
      email: 'destinationEmail',
      fieldCount: 'formFields.length',
    },
    prepare({firstLine, email, fieldCount}) {
      return {
        title: 'Contact Form',
        subtitle: `${firstLine || 'No intro content'}${email ? ` • ${email}` : ''}${typeof fieldCount === 'number' ? ` • ${fieldCount} fields` : ''}`,
      }
    },
  },
})

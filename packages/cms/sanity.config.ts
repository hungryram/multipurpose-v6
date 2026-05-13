import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {colorInput} from '@sanity/color-input'
import {media} from 'sanity-plugin-media'
import {schemaTypes} from './schemaTypes'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? 'yourProjectId'
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production'
const singletonTypes = ['profile', 'appearance']
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'default',
  title: 'Hungryram CMS',
  projectId,
  dataset,
  plugins: [
    colorInput(),
    deskTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Profile')
              .id('profile')
              .child(
                S.editor()
                  .id('profile')
                  .schemaType('profile')
                  .documentId('profile'),
              ),
            S.listItem()
              .title('Appearance')
              .id('appearance')
              .child(
                S.editor()
                  .id('appearance')
                  .schemaType('appearance')
                  .documentId('appearance'),
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem) => listItem.getId() === 'home',
            ),
            ...S.documentTypeListItems().filter(
              (listItem) => listItem.getId() === 'page',
            ),
            ...S.documentTypeListItems().filter(
              (listItem) => listItem.getId() === 'blogPost',
            ),
            ...S.documentTypeListItems().filter(
              (listItem) => {
                const id = listItem.getId() ?? ''
                return (
                  !singletonTypes.includes(id) &&
                  id !== 'home' &&
                  id !== 'page' &&
                  id !== 'blogPost' &&
                  id !== 'sanity.imageasset' &&
                  id !== 'sanity.fileasset' &&
                  id !== 'mediaTag'
                )
              },
            ),
          ]),
    }),
    media(),
  ],
  document: {
    actions: (previousActions, context) =>
      singletonTypes.includes(context.schemaType)
        ? previousActions.filter((action) =>
            action.action ? singletonActions.has(action.action) : false,
          )
        : previousActions,
  },
  schema: {
    // Keep this minimal and composable for a page-builder workflow.
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(
        ({schemaType}) => !singletonTypes.includes(schemaType),
      ),
  },
})

'use client'

/**
 * Sanity Studio configuration, mounted at /studio.
 * Staff sign in with their Sanity account; access is controlled by project
 * roles at sanity.io/manage (Administrator / Editor / Viewer).
 */
import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'

import {apiVersion, dataset, projectId} from './src/sanity/env'
import {resolve} from './src/sanity/presentation'
import {schemaTypes, singletonTypes} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

const singletonActions = new Set(['publish', 'discardChanges', 'restore', 'unpublish'])

export default defineConfig({
  name: 'iwc',
  title: 'IWC Website',
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Singletons can't be created from the "new document" menu.
    templates: (templates) => templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },
  document: {
    // Singletons can't be duplicated or deleted.
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({action}) => action && singletonActions.has(action))
        : input,
  },
  plugins: [
    structureTool({structure, title: 'Content'}),
    presentationTool({
      title: 'Preview',
      resolve,
      previewUrl: {previewMode: {enable: '/api/draft-mode/enable'}},
    }),
    // GROQ playground, only useful to developers.
    ...(process.env.NODE_ENV === 'development' ? [visionTool({defaultApiVersion: apiVersion})] : []),
  ],
})

// Public Sanity configuration. These values are safe to expose to the browser:
// the dataset only serves *published* documents without a token.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
export const apiVersion = '2026-09-01'
export const studioUrl = '/studio'

export const isSanityConfigured = Boolean(projectId)

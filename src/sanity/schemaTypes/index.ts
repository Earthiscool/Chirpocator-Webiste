import {editorialReview, pageHeadings} from './objects/editorial'
import {accessibleImage, articleBody, cta, richText, seo, titledItem} from './objects/shared'
import {
  article,
  bookingOption,
  chatKnowledge,
  faq,
  legalPage,
  pathway,
  provider,
  service,
  testimonial,
} from './documents'
import {
  aboutPage,
  bookingPage,
  faqPage,
  homePage,
  navigation,
  providersPage,
  resourcesPage,
  siteSettings,
  startHerePage,
  teamPage,
} from './singletons'

export const schemaTypes = [
  // objects
  accessibleImage,
  editorialReview,
  pageHeadings,
  cta,
  seo,
  richText,
  articleBody,
  titledItem,
  // documents
  pathway,
  service,
  provider,
  testimonial,
  faq,
  article,
  bookingOption,
  legalPage,
  chatKnowledge,
  // singletons
  siteSettings,
  navigation,
  homePage,
  startHerePage,
  aboutPage,
  providersPage,
  bookingPage,
  faqPage,
  resourcesPage,
  teamPage,
]

/** Singleton document types, one fixed document each, id === type name. */
export const singletonTypes = new Set([
  'siteSettings',
  'navigation',
  'homePage',
  'startHerePage',
  'aboutPage',
  'providersPage',
  'bookingPage',
  'faqPage',
  'resourcesPage',
  'teamPage',
])

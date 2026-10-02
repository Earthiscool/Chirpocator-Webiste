import {defineDocuments, defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

/** Where each document type appears on the site, for side-by-side preview. */
export const resolve: PresentationPluginOptions['resolve'] = {
  mainDocuments: defineDocuments([
    {route: '/', filter: `_type == "homePage"`},
    {route: '/start-here', filter: `_type == "startHerePage"`},
    {route: '/about', filter: `_type == "aboutPage"`},
    {route: '/team', filter: `_type == "teamPage"`},
    {route: '/resources', filter: `_type == "resourcesPage"`},
    {route: '/for-providers', filter: `_type == "providersPage"`},
    {route: '/book', filter: `_type == "bookingPage"`},
    {route: '/faq', filter: `_type == "faqPage"`},
    {route: '/how-we-help/:slug', filter: `_type == "pathway" && slug.current == $slug`},
    {route: '/services/:slug', filter: `_type == "service" && slug.current == $slug`},
    {route: '/resources/:slug', filter: `_type == "article" && slug.current == $slug`},
    {route: '/team/:slug', filter: `_type == "provider" && slug.current == $slug`},
    {route: '/:slug', filter: `_type == "legalPage" && slug.current == $slug`},
  ]),
  locations: {
    pathway: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [
          {title: doc?.title || 'Pathway', href: `/how-we-help/${doc?.slug}`},
          {title: 'Homepage', href: '/'},
          {title: 'Start Here', href: '/start-here'},
        ],
      }),
    }),
    service: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => ({locations: [{title: doc?.title || 'Service', href: `/services/${doc?.slug}`}]}),
    }),
    article: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [
          {title: doc?.title || 'Article', href: `/resources/${doc?.slug}`},
          {title: 'Resources', href: '/resources'},
        ],
      }),
    }),
    provider: defineLocations({
      select: {title: 'name', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [
          {title: doc?.title || 'Team member', href: `/team/${doc?.slug}`},
          {title: 'Team', href: '/team'},
        ],
      }),
    }),
    faq: defineLocations({
      select: {title: 'question'},
      resolve: () => ({locations: [{title: 'FAQ / What to Expect', href: '/faq'}]}),
    }),
    testimonial: defineLocations({
      select: {title: 'attribution'},
      resolve: () => ({locations: [{title: 'Homepage', href: '/'}]}),
    }),
    bookingOption: defineLocations({
      select: {title: 'label'},
      resolve: () => ({locations: [{title: 'Book a Visit', href: '/book'}]}),
    }),
    siteSettings: defineLocations({
      message: 'Used on every page (header, footer, contact details)',
      tone: 'positive',
    }),
    navigation: defineLocations({message: 'Used in the header and footer of every page', tone: 'positive'}),
  },
}

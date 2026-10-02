import {defineArrayMember, defineField, defineType} from 'sanity'

const seoField = defineField({name: 'seo', title: 'Search & sharing', type: 'seo', group: 'seo'})
const seoGroup = {name: 'seo', title: 'SEO'}

/* -------------------------------------------------------------------------- */
/*  Site settings                                                             */
/* -------------------------------------------------------------------------- */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    {name: 'practice', title: 'Practice details', default: true},
    {name: 'visit', title: 'Visiting'},
    {name: 'brand', title: 'Brand'},
    {name: 'assistant', title: 'Website assistant'},
    seoGroup,
  ],
  fields: [
    defineField({name: 'practiceName', type: 'string', group: 'practice', validation: (r) => r.required()}),
    defineField({name: 'shortName', type: 'string', group: 'practice', initialValue: 'IWC'}),
    defineField({name: 'brandLine', type: 'string', group: 'brand', initialValue: 'Pain | Performance | Prevention'}),
    defineField({name: 'logo', title: 'Logo (optional, replaces the text wordmark)', type: 'accessibleImage', group: 'brand'}),
    defineField({
      name: 'phone',
      title: 'Phone (display)',
      type: 'string',
      group: 'practice',
      description: 'As it should appear, e.g. 610-298-5873',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'phoneE164',
      title: 'Phone (for tap-to-call)',
      type: 'string',
      group: 'practice',
      description: 'International format, e.g. +16102985873',
      validation: (r) => r.required().regex(/^\+1\d{10}$/, {name: 'US phone'}),
    }),
    defineField({name: 'email', title: 'Public email', type: 'string', group: 'practice', validation: (r) => r.required().email()}),
    defineField({
      name: 'providerEmail',
      title: 'Professional / referral contact email',
      type: 'string',
      group: 'practice',
      description: 'Shown on For Providers. Leave empty to use the public email.',
      validation: (r) => r.email(),
    }),
    defineField({
      name: 'address',
      type: 'object',
      group: 'practice',
      fields: [
        defineField({name: 'street', type: 'string'}),
        defineField({name: 'suite', type: 'string'}),
        defineField({name: 'city', type: 'string'}),
        defineField({name: 'region', title: 'State', type: 'string'}),
        defineField({name: 'postalCode', type: 'string'}),
      ],
    }),
    defineField({name: 'mapUrl', title: 'Directions link (Google Maps)', type: 'url', group: 'visit'}),
    defineField({
      name: 'hours',
      type: 'array',
      group: 'visit',
      description: 'Leave empty to hide hours. e.g. "Monday" / "9:00 am – 6:00 pm".',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'hoursRow',
          fields: [
            defineField({name: 'days', type: 'string'}),
            defineField({name: 'hours', type: 'string'}),
          ],
          preview: {select: {title: 'days', subtitle: 'hours'}},
        }),
      ],
    }),
    defineField({name: 'parking', title: 'Parking & arrival', type: 'text', rows: 3, group: 'visit'}),
    defineField({
      name: 'socials',
      type: 'array',
      group: 'practice',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'social',
          fields: [
            defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'url', type: 'url', validation: (r) => r.required()}),
          ],
          preview: {select: {title: 'label', subtitle: 'url'}},
        }),
      ],
    }),
    defineField({
      name: 'publishStructuredData',
      title: 'Publish business details to search engines (structured data)',
      type: 'boolean',
      group: 'seo',
      description: 'Turn on only after name, address and phone match your Google Business Profile exactly.',
      initialValue: false,
    }),
    defineField({name: 'defaultSeo', title: 'Default search & sharing', type: 'seo', group: 'seo'}),
    defineField({
      name: 'clinicalDisclaimer',
      title: 'Site-wide clinical disclaimer (footer)',
      type: 'text',
      rows: 3,
      group: 'practice',
    }),
    defineField({name: 'assistantEnabled', title: 'Show the website assistant', type: 'boolean', group: 'assistant', initialValue: true}),
    defineField({name: 'assistantWelcome', title: 'Welcome message', type: 'text', rows: 3, group: 'assistant'}),
    defineField({
      name: 'assistantSuggestions',
      title: 'Suggested questions',
      type: 'array',
      group: 'assistant',
      of: [{type: 'string'}],
      validation: (r) => r.max(4),
    }),
    defineField({name: 'assistantNotice', title: 'Privacy notice', type: 'text', rows: 2, group: 'assistant'}),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                */
/* -------------------------------------------------------------------------- */
const navLink = defineArrayMember({
  type: 'object',
  name: 'navLink',
  fields: [
    defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'href',
      type: 'string',
      validation: (r) => r.required().custom((v) => (!v || /^(\/|https:\/\/)/.test(v) ? true : 'Start with "/" or https://')),
    }),
    defineField({name: 'description', type: 'string', description: 'Optional one-liner shown in dropdowns.'}),
  ],
  preview: {select: {title: 'label', subtitle: 'href'}},
})

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  description:
    'The approved top navigation is: Start Here · How We Help · About · Resources · For Providers · Book a Visit. Keep it short. Services belong under pathways.',
  fields: [
    defineField({
      name: 'main',
      title: 'Main menu',
      type: 'array',
      validation: (r) => r.max(6).warning('The brand strategy asks for a short, need-based menu.'),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'navItem',
          fields: [
            defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'href', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'children', title: 'Dropdown links', type: 'array', of: [navLink]}),
          ],
          preview: {select: {title: 'label', subtitle: 'href'}},
        }),
      ],
    }),
    defineField({name: 'bookLabel', title: 'Persistent booking button label', type: 'string', initialValue: 'Book a Visit'}),
    defineField({
      name: 'footerGroups',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'footerGroup',
          fields: [
            defineField({name: 'title', type: 'string'}),
            defineField({name: 'links', type: 'array', of: [navLink]}),
          ],
          preview: {select: {title: 'title'}},
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Navigation'})},
})

/* -------------------------------------------------------------------------- */
/*  Homepage, guided clinical conversation, in the blueprint's order         */
/* -------------------------------------------------------------------------- */
export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  groups: [
    {name: 'hero', title: '1 · Hero', default: true},
    {name: 'trust', title: '2 · Trust strip'},
    {name: 'recognition', title: '3 · Recognition'},
    {name: 'reframe', title: '4 · The IWC difference'},
    {name: 'pathways', title: '5 · Pathways'},
    {name: 'process', title: '6 · How care works'},
    {name: 'drjenn', title: '7 · Meet Dr. Jenn'},
    {name: 'proof', title: '8 · Proof'},
    {name: 'tools', title: '9 · Services in context'},
    {name: 'expect', title: '10 · What to expect'},
    {name: 'education', title: '11 · Education'},
    {name: 'final', title: '12 · Final invitation'},
    seoGroup,
  ],
  fields: [
    defineField({name: 'heroEyebrow', title: 'Eyebrow', type: 'string', group: 'hero'}),
    defineField({name: 'heroHeadline', title: 'Headline', type: 'text', rows: 2, group: 'hero', validation: (r) => r.required().max(140)}),
    defineField({name: 'heroSubhead', title: 'Supporting message', type: 'text', rows: 3, group: 'hero', validation: (r) => r.max(320)}),
    defineField({name: 'heroPrimaryCta', title: 'Primary button', type: 'cta', group: 'hero'}),
    defineField({name: 'heroSecondaryCta', title: 'Secondary button', type: 'cta', group: 'hero'}),
    defineField({
      name: 'heroImage',
      title: 'Hero photograph (optional)',
      type: 'accessibleImage',
      group: 'hero',
      description: 'When added, appears beside the headline. Use authentic IWC photography only.',
    }),
    defineField({
      name: 'mapFactors',
      title: '"Whole picture" map: factors',
      type: 'array',
      group: 'hero',
      of: [{type: 'string'}],
      description: 'Words in the connection graphic (6–9). The ones ticked below are highlighted as "what matters for you".',
      validation: (r) => r.min(5).max(10),
    }),
    defineField({name: 'mapHighlighted', title: 'Highlighted factors', type: 'array', group: 'hero', of: [{type: 'string'}], validation: (r) => r.max(4)}),
    defineField({
      name: 'trustItems',
      title: 'Trust strip items',
      type: 'array',
      group: 'trust',
      of: [{type: 'titledItem'}],
      validation: (r) => r.max(4),
    }),
    defineField({name: 'recognitionHeading', type: 'string', group: 'recognition'}),
    defineField({name: 'recognitionCards', type: 'array', group: 'recognition', of: [{type: 'string'}], validation: (r) => r.max(6)}),
    defineField({name: 'recognitionCoda', title: 'Closing line', type: 'string', group: 'recognition'}),
    defineField({name: 'reframeHeading', type: 'string', group: 'reframe'}),
    defineField({name: 'reframeBody', type: 'richText', group: 'reframe'}),
    defineField({name: 'reframePull', title: 'Pull quote', type: 'string', group: 'reframe'}),
    defineField({name: 'pathwaysHeading', type: 'string', group: 'pathways'}),
    defineField({name: 'pathwaysIntro', type: 'text', rows: 2, group: 'pathways'}),
    defineField({name: 'processHeading', type: 'string', group: 'process'}),
    defineField({name: 'processSteps', type: 'array', group: 'process', of: [{type: 'titledItem'}], validation: (r) => r.max(6)}),
    defineField({name: 'processNote', title: 'Microcopy', type: 'text', rows: 2, group: 'process'}),
    defineField({name: 'drJennHeading', type: 'string', group: 'drjenn'}),
    defineField({name: 'drJennBody', type: 'richText', group: 'drjenn'}),
    defineField({name: 'drJennProvider', title: 'Provider', type: 'reference', to: [{type: 'provider'}], group: 'drjenn'}),
    defineField({name: 'drJennImage', title: 'Photo (overrides provider photo)', type: 'accessibleImage', group: 'drjenn'}),
    defineField({name: 'drJennHighlights', title: 'Highlights', type: 'array', group: 'drjenn', of: [{type: 'string'}], validation: (r) => r.max(5)}),
    defineField({name: 'drJennCta', type: 'cta', group: 'drjenn'}),
    defineField({name: 'proofHeading', type: 'string', group: 'proof'}),
    defineField({
      name: 'proofPoints',
      title: 'Verified trust markers',
      type: 'array',
      group: 'proof',
      description: 'Only facts the practice can verify. Testimonials appear automatically when "permission on file" + "feature on homepage" are ticked.',
      of: [{type: 'titledItem'}],
    }),
    defineField({name: 'toolsHeading', type: 'string', group: 'tools'}),
    defineField({name: 'toolsIntro', type: 'text', rows: 2, group: 'tools'}),
    defineField({
      name: 'toolGroups',
      type: 'array',
      group: 'tools',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'toolGroup',
          fields: [
            defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'body', type: 'text', rows: 2}),
            defineField({name: 'items', type: 'array', of: [{type: 'string'}]}),
          ],
          preview: {select: {title: 'title'}},
        }),
      ],
      validation: (r) => r.max(4),
    }),
    defineField({name: 'toolsCta', type: 'cta', group: 'tools'}),
    defineField({name: 'expectHeading', type: 'string', group: 'expect'}),
    defineField({name: 'expectItems', type: 'array', group: 'expect', of: [{type: 'titledItem'}]}),
    defineField({name: 'expectCta', type: 'cta', group: 'expect'}),
    defineField({name: 'educationHeading', type: 'string', group: 'education'}),
    defineField({
      name: 'educationArticles',
      title: 'Featured articles',
      type: 'array',
      group: 'education',
      of: [{type: 'reference', to: [{type: 'article'}]}],
      validation: (r) => r.max(3),
    }),
    defineField({name: 'finalHeading', type: 'string', group: 'final'}),
    defineField({name: 'finalBody', type: 'text', rows: 2, group: 'final'}),
    defineField({name: 'finalPrimaryCta', type: 'cta', group: 'final'}),
    defineField({name: 'finalSecondaryCta', type: 'cta', group: 'final'}),
    seoField,
  ],
  preview: {prepare: () => ({title: 'Homepage'})},
})

/* -------------------------------------------------------------------------- */
/*  Other page singletons                                                     */
/* -------------------------------------------------------------------------- */
const pageHeroFields = (group = 'content') => [
  defineField({name: 'eyebrow', type: 'string', group}),
  defineField({name: 'headline', title: 'Headline (H1)', type: 'string', group, validation: (r) => r.required()}),
  defineField({name: 'intro', type: 'text', rows: 3, group}),
]

export const startHerePage = defineType({
  name: 'startHerePage',
  title: 'Start Here page',
  type: 'document',
  groups: [{name: 'content', title: 'Content', default: true}, seoGroup],
  fields: [
    ...pageHeroFields(),
    defineField({name: 'selectorPrompt', title: 'Selector prompt', type: 'string', group: 'content'}),
    defineField({name: 'reassurance', title: 'Reassurance note', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'unsureHeading', title: '"Still not sure?" heading', type: 'string', group: 'content'}),
    defineField({name: 'unsureBody', type: 'text', rows: 2, group: 'content'}),
    seoField,
  ],
  preview: {prepare: () => ({title: 'Start Here page'})},
})

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About / Dr. Jenn page',
  type: 'document',
  groups: [{name: 'content', title: 'Content', default: true}, seoGroup],
  fields: [
    ...pageHeroFields(),
    defineField({name: 'provider', title: 'Featured provider', type: 'reference', to: [{type: 'provider'}], group: 'content'}),
    defineField({name: 'portrait', type: 'accessibleImage', group: 'content', description: 'Overrides the provider photo.'}),
    defineField({
      name: 'sections',
      title: 'Story sections',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'storySection',
          fields: [
            defineField({name: 'kicker', type: 'string'}),
            defineField({name: 'heading', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'body', type: 'richText'}),
          ],
          preview: {select: {title: 'heading', subtitle: 'kicker'}},
        }),
      ],
    }),
    defineField({name: 'philosophy', title: 'Clinical philosophy (short lines)', type: 'array', group: 'content', of: [{type: 'titledItem'}]}),
    defineField({name: 'benefitsHeading', type: 'string', group: 'content'}),
    defineField({name: 'benefits', title: 'The benefits of choosing IWC', type: 'array', group: 'content', of: [{type: 'string'}]}),
    defineField({name: 'collaboration', title: 'Trusted collaboration', type: 'richText', group: 'content'}),
    defineField({name: 'closing', title: 'Personal close', type: 'text', rows: 3, group: 'content'}),
    seoField,
  ],
  preview: {prepare: () => ({title: 'About / Dr. Jenn page'})},
})

export const providersPage = defineType({
  name: 'providersPage',
  title: 'For Providers page',
  type: 'document',
  groups: [{name: 'content', title: 'Content', default: true}, seoGroup],
  fields: [
    ...pageHeroFields(),
    defineField({name: 'audience', title: 'Who we collaborate with', type: 'array', group: 'content', of: [{type: 'string'}]}),
    defineField({name: 'promise', title: 'Core promise', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'clinicalFit', title: 'Clinical fit', type: 'array', group: 'content', of: [{type: 'string'}]}),
    defineField({name: 'whatWeDo', type: 'array', group: 'content', of: [{type: 'titledItem'}]}),
    defineField({name: 'whatWeDoNot', title: 'What we do not do', type: 'array', group: 'content', of: [{type: 'string'}]}),
    defineField({name: 'communication', type: 'richText', group: 'content'}),
    defineField({
      name: 'referralNotice',
      title: 'Secure referral notice',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Explain how to send patient details securely. The website form never accepts patient health information.',
    }),
    seoField,
  ],
  preview: {prepare: () => ({title: 'For Providers page'})},
})

const simplePage = (name: string, title: string, extra: ReturnType<typeof defineField>[] = []) =>
  defineType({
    name,
    title,
    type: 'document',
    groups: [{name: 'content', title: 'Content', default: true}, seoGroup],
    fields: [...pageHeroFields(), ...extra, seoField],
    preview: {prepare: () => ({title})},
  })

export const bookingPage = simplePage('bookingPage', 'Book / Contact page', [
  defineField({name: 'firstVisitNote', title: 'First-visit note', type: 'richText', group: 'content'}),
  defineField({name: 'formIntro', title: 'Contact form intro', type: 'text', rows: 2, group: 'content'}),
])
export const faqPage = simplePage('faqPage', 'FAQ / What to Expect page', [
  defineField({name: 'expectations', title: 'What you can expect (principles)', type: 'array', group: 'content', of: [{type: 'string'}]}),
  defineField({name: 'firstVisitSteps', title: 'First visit steps', type: 'array', group: 'content', of: [{type: 'titledItem'}]}),
])
export const resourcesPage = simplePage('resourcesPage', 'Resources page', [
  defineField({name: 'newsletterHeading', type: 'string', group: 'content'}),
  defineField({name: 'newsletterBody', type: 'text', rows: 2, group: 'content'}),
  defineField({name: 'substackUrl', title: 'Substack / newsletter link', type: 'url', group: 'content'}),
])
export const teamPage = simplePage('teamPage', 'Team page', [
  defineField({name: 'collectiveNote', title: 'How the team works together', type: 'text', rows: 3, group: 'content'}),
])

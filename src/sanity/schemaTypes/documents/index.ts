import {defineArrayMember, defineField, defineType} from 'sanity'

const slugField = (source = 'title') =>
  defineField({
    name: 'slug',
    title: 'URL slug',
    type: 'slug',
    options: {source, maxLength: 80},
    description: 'The web address for this page. Changing it breaks existing links, so ask your developer to add a redirect.',
    validation: (rule) => rule.required(),
  })

const seoField = defineField({name: 'seo', title: 'Search & sharing', type: 'seo', group: 'seo'})

const pathwayAccents = [
  {title: 'Teal (Pain + Recovery)', value: 'teal'},
  {title: 'Gold (Performance)', value: 'gold'},
  {title: 'Sky (Prevention + Active Aging)', value: 'sky'},
  {title: 'Navy (Functional Health)', value: 'navy'},
]

/* -------------------------------------------------------------------------- */
/*  Pathway, the four "How We Help" entry points                             */
/* -------------------------------------------------------------------------- */
export const pathway = defineType({
  name: 'pathway',
  title: 'Pathway',
  type: 'document',
  groups: [
    {name: 'card', title: 'Card & Start Here', default: true},
    {name: 'page', title: 'Page content'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', type: 'string', group: 'card', validation: (r) => r.required()}),
    slugField(),
    defineField({
      name: 'order',
      type: 'number',
      group: 'card',
      description: 'Position in menus and cards (1 = first).',
      validation: (r) => r.required().min(1).max(10),
    }),
    defineField({name: 'accent', type: 'string', group: 'card', options: {list: pathwayAccents}, initialValue: 'teal'}),
    defineField({
      name: 'patientVoice',
      title: 'In the patient\'s words',
      type: 'string',
      group: 'card',
      description: 'One sentence, first person. e.g. "Help me understand what keeps coming back."',
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: 'cardSummary',
      title: 'Card summary',
      type: 'text',
      rows: 2,
      group: 'card',
      description: 'Plain-language description of who this is for (shown on homepage cards). Max ~140 characters.',
      validation: (r) => r.required().max(180),
    }),
    defineField({
      name: 'startHereExplanation',
      title: 'Start Here explanation',
      type: 'text',
      rows: 3,
      group: 'card',
      description: 'Shown after a visitor picks this path on Start Here. Reassuring, 1–2 sentences.',
    }),
    defineField({
      name: 'nextSteps',
      title: 'Start Here next steps',
      type: 'array',
      group: 'card',
      description: 'Two or three choices max. Avoid turning this into a quiz.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'nextStep',
          fields: [
            defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'body', title: 'When to choose this', type: 'text', rows: 2}),
            defineField({name: 'cta', type: 'cta', validation: (r) => r.required()}),
          ],
          preview: {select: {title: 'title', subtitle: 'cta.label'}},
        }),
      ],
      validation: (r) => r.max(3),
    }),
    defineField({name: 'heroHeadline', title: 'Page headline (H1)', type: 'string', group: 'page', validation: (r) => r.required()}),
    defineField({name: 'heroIntro', title: 'Intro', type: 'text', rows: 3, group: 'page'}),
    defineField({name: 'heroImage', title: 'Hero image', type: 'accessibleImage', group: 'page'}),
    defineField({
      name: 'recognition',
      title: 'Sound familiar? (recognition list)',
      type: 'array',
      group: 'page',
      of: [{type: 'string'}],
      description: '3–6 situations in the patient\'s language.',
    }),
    defineField({name: 'approachHeading', type: 'string', group: 'page'}),
    defineField({name: 'approach', title: 'How we think about it', type: 'richText', group: 'page'}),
    defineField({
      name: 'tools',
      title: 'Tools we may use (in context)',
      type: 'array',
      group: 'page',
      description: 'Modalities appear as tools inside an approach, not a menu. Link a service page where one exists.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'tool',
          fields: [
            defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'description', type: 'text', rows: 2}),
            defineField({name: 'service', title: 'Related service page', type: 'reference', to: [{type: 'service'}]}),
          ],
          preview: {select: {title: 'name', subtitle: 'description'}},
        }),
      ],
    }),
    defineField({
      name: 'outcomes',
      title: 'What we work toward',
      type: 'array',
      group: 'page',
      of: [{type: 'string'}],
      description: 'Realistic goals, never guarantees.',
    }),
    defineField({name: 'whatToExpect', title: 'What to expect', type: 'array', group: 'page', of: [{type: 'titledItem'}]}),
    defineField({name: 'faqs', title: 'FAQs on this page', type: 'array', group: 'page', of: [{type: 'reference', to: [{type: 'faq'}]}]}),
    defineField({name: 'primaryCta', title: 'Primary button', type: 'cta', group: 'page'}),
    seoField,
  ],
  orderings: [{title: 'Display order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'patientVoice'}},
})

/* -------------------------------------------------------------------------- */
/*  Service / program                                                         */
/* -------------------------------------------------------------------------- */
export const service = defineType({
  name: 'service',
  title: 'Service / Program',
  type: 'document',
  groups: [
    {name: 'basics', title: 'Basics', default: true},
    {name: 'content', title: 'Page content'},
    {name: 'logistics', title: 'Logistics'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', type: 'string', group: 'basics', validation: (r) => r.required()}),
    slugField(),
    defineField({
      name: 'kind',
      type: 'string',
      group: 'basics',
      options: {list: ['service', 'program'], layout: 'radio'},
      initialValue: 'service',
    }),
    defineField({
      name: 'pathways',
      title: 'Belongs to pathway(s)',
      type: 'array',
      group: 'basics',
      of: [{type: 'reference', to: [{type: 'pathway'}]}],
      validation: (r) => r.required().min(1),
    }),
    defineField({name: 'summary', title: 'Short summary', type: 'text', rows: 2, group: 'basics', validation: (r) => r.required().max(200)}),
    defineField({name: 'heroHeadline', title: 'Page headline (H1)', type: 'string', group: 'content', validation: (r) => r.required()}),
    defineField({name: 'heroIntro', title: 'Intro', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'heroImage', title: 'Hero image', type: 'accessibleImage', group: 'content'}),
    defineField({name: 'recognition', title: 'Why am I here? (3–6 situations)', type: 'array', group: 'content', of: [{type: 'string'}]}),
    defineField({name: 'whatItIs', title: 'What it is', type: 'richText', group: 'content'}),
    defineField({name: 'howWeUseIt', title: 'How IWC uses it', type: 'richText', group: 'content'}),
    defineField({name: 'mayFit', title: 'Who it may fit', type: 'array', group: 'content', of: [{type: 'string'}]}),
    defineField({
      name: 'boundaries',
      title: 'Boundaries / when it is not the right fit',
      type: 'array',
      group: 'content',
      of: [{type: 'string'}],
    }),
    defineField({name: 'whatToExpect', title: 'What to expect', type: 'array', group: 'content', of: [{type: 'titledItem'}]}),
    defineField({name: 'rationale', title: 'Why it might make sense (evidence)', type: 'richText', group: 'content'}),
    defineField({name: 'faqs', type: 'array', group: 'content', of: [{type: 'reference', to: [{type: 'faq'}]}]}),
    defineField({name: 'providers', title: 'Who provides it', type: 'array', group: 'logistics', of: [{type: 'reference', to: [{type: 'provider'}]}]}),
    defineField({name: 'visitLength', type: 'string', group: 'logistics', description: 'e.g. "About 60 minutes"'}),
    defineField({
      name: 'pricingNote',
      title: 'Pricing note',
      type: 'string',
      group: 'logistics',
      description: 'Shown on the service page only (never the homepage). Leave empty to hide.',
    }),
    defineField({name: 'bookingOption', title: 'Booking option', type: 'reference', to: [{type: 'bookingOption'}], group: 'logistics'}),
    defineField({name: 'primaryCta', title: 'Primary button', type: 'cta', group: 'logistics'}),
    defineField({name: 'disclaimer', type: 'text', rows: 2, group: 'logistics', description: 'Optional page-specific disclaimer.'}),
    seoField,
  ],
  preview: {select: {title: 'title', subtitle: 'summary', media: 'heroImage'}},
})

/* -------------------------------------------------------------------------- */
/*  Provider (team profile)                                                   */
/* -------------------------------------------------------------------------- */
export const provider = defineType({
  name: 'provider',
  title: 'Team member',
  type: 'document',
  groups: [
    {name: 'profile', title: 'Profile', default: true},
    {name: 'details', title: 'Details'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'name', type: 'string', group: 'profile', validation: (r) => r.required()}),
    slugField('name'),
    defineField({name: 'credentials', title: 'Credential letters', type: 'string', group: 'profile', description: 'e.g. "DC, LMT"'}),
    defineField({name: 'role', type: 'string', group: 'profile', validation: (r) => r.required(), description: 'e.g. "Chiropractic Physician"'}),
    defineField({
      name: 'headline',
      type: 'string',
      group: 'profile',
      description: 'Role + the specific human value. Not a title alone.',
      validation: (r) => r.max(140),
    }),
    defineField({name: 'photo', type: 'accessibleImage', group: 'profile'}),
    defineField({name: 'order', type: 'number', group: 'profile', validation: (r) => r.required()}),
    defineField({name: 'bio', title: 'Short bio', type: 'richText', group: 'details'}),
    defineField({name: 'bestFit', title: 'Best fit for', type: 'array', group: 'details', of: [{type: 'string'}], validation: (r) => r.max(6)}),
    defineField({name: 'approach', title: 'How they work', type: 'text', rows: 4, group: 'details'}),
    defineField({name: 'services', title: 'Services they personally offer', type: 'array', group: 'details', of: [{type: 'reference', to: [{type: 'service'}]}]}),
    defineField({
      name: 'credentialGroups',
      title: 'Credentials (grouped)',
      type: 'array',
      group: 'details',
      description: 'Selective, organized, verifiable. 3–5 groups.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'credentialGroup',
          fields: [
            defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'items', type: 'array', of: [{type: 'string'}]}),
          ],
          preview: {select: {title: 'label'}},
        }),
      ],
    }),
    defineField({name: 'personal', title: 'Personal note', type: 'text', rows: 3, group: 'details'}),
    defineField({name: 'bookingOption', title: 'Book with this provider', type: 'reference', to: [{type: 'bookingOption'}], group: 'details'}),
    seoField,
  ],
  orderings: [{title: 'Display order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'name', subtitle: 'role', media: 'photo'}},
})

/* -------------------------------------------------------------------------- */
/*  Testimonial, only shown with permission on file                          */
/* -------------------------------------------------------------------------- */
export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      type: 'text',
      rows: 4,
      description: 'Use the patient\'s own words. Ask what changed in their understanding, confidence, or function.',
      validation: (r) => r.required().max(600),
    }),
    defineField({
      name: 'attribution',
      type: 'string',
      description: 'How the patient agreed to be named, e.g. "Sarah K., Radnor" or "Collegiate rower".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'theme',
      type: 'string',
      options: {
        list: [
          {title: 'Clarity', value: 'clarity'},
          {title: 'Recurring pain', value: 'recurring-pain'},
          {title: 'Return to activity', value: 'return-to-activity'},
          {title: 'Athlete', value: 'athlete'},
          {title: 'Complex case', value: 'complex-case'},
          {title: 'Functional health', value: 'functional-health'},
        ],
      },
    }),
    defineField({name: 'pathways', type: 'array', of: [{type: 'reference', to: [{type: 'pathway'}]}]}),
    defineField({name: 'provider', type: 'reference', to: [{type: 'provider'}]}),
    defineField({
      name: 'permissionOnFile',
      title: 'Written permission on file',
      type: 'boolean',
      description: 'Required. The testimonial will NOT appear on the site until this is ticked.',
      initialValue: false,
      validation: (r) => r.required(),
    }),
    defineField({name: 'permissionDate', type: 'date'}),
    defineField({name: 'featured', title: 'Feature on homepage', type: 'boolean', initialValue: false}),
  ],
  preview: {
    select: {title: 'attribution', subtitle: 'quote', ok: 'permissionOnFile'},
    prepare: ({title, subtitle, ok}) => ({title: `${ok ? '' : '⚠︎ No permission, hidden · '}${title ?? ''}`, subtitle}),
  },
})

/* -------------------------------------------------------------------------- */
/*  FAQ                                                                       */
/* -------------------------------------------------------------------------- */
export const faqCategories = [
  {title: 'Your first visit', value: 'first-visit'},
  {title: 'Scheduling & logistics', value: 'scheduling'},
  {title: 'Payment & insurance', value: 'payment'},
  {title: 'Care approach', value: 'approach'},
  {title: 'Functional health', value: 'functional-health'},
  {title: 'Performance & golf', value: 'performance'},
  {title: 'For providers', value: 'providers'},
]

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({name: 'question', type: 'string', validation: (r) => r.required().max(160)}),
    defineField({name: 'answer', type: 'richText', validation: (r) => r.required()}),
    defineField({name: 'category', type: 'string', options: {list: faqCategories}, validation: (r) => r.required()}),
    defineField({name: 'order', type: 'number', initialValue: 10}),
    defineField({
      name: 'includeInChat',
      title: 'Website assistant may use this answer',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [{title: 'Category, order', name: 'cat', by: [{field: 'category', direction: 'asc'}, {field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'question', subtitle: 'category'}},
})

/* -------------------------------------------------------------------------- */
/*  Article                                                                   */
/* -------------------------------------------------------------------------- */
export const articleTopics = [
  {title: 'Persistent pain', value: 'persistent-pain'},
  {title: 'Sports + recovery', value: 'sports-recovery'},
  {title: 'Golf', value: 'golf'},
  {title: 'Active aging', value: 'active-aging'},
  {title: 'Functional health', value: 'functional-health'},
  {title: 'Gut / Holobiome', value: 'gut'},
  {title: 'Recovery technology', value: 'recovery-technology'},
  {title: 'Post-surgical / scar', value: 'post-surgical'},
]

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'links', title: 'Next step'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', type: 'string', group: 'content', validation: (r) => r.required().max(120)}),
    slugField(),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'The real question this article answers, in one or two sentences.',
      validation: (r) => r.required().max(240),
    }),
    defineField({name: 'topic', type: 'string', group: 'content', options: {list: articleTopics}, validation: (r) => r.required()}),
    defineField({name: 'publishedAt', type: 'datetime', group: 'content', validation: (r) => r.required()}),
    defineField({name: 'author', type: 'reference', group: 'content', to: [{type: 'provider'}]}),
    defineField({name: 'mainImage', type: 'accessibleImage', group: 'content'}),
    defineField({name: 'body', type: 'articleBody', group: 'content', validation: (r) => r.required()}),
    defineField({name: 'featured', title: 'Feature on homepage', type: 'boolean', group: 'content', initialValue: false}),
    defineField({name: 'pathway', title: 'Related pathway', type: 'reference', group: 'links', to: [{type: 'pathway'}]}),
    defineField({name: 'services', title: 'Related services', type: 'array', group: 'links', of: [{type: 'reference', to: [{type: 'service'}]}]}),
    seoField,
  ],
  orderings: [{title: 'Newest', name: 'newest', by: [{field: 'publishedAt', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'topic', media: 'mainImage'}},
})

/* -------------------------------------------------------------------------- */
/*  Booking option, one scheduling entry point                               */
/* -------------------------------------------------------------------------- */
export const bookingOption = defineType({
  name: 'bookingOption',
  title: 'Booking option',
  type: 'document',
  fields: [
    defineField({name: 'label', title: 'Visit name', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'situation',
      title: '"I am here for…"',
      type: 'string',
      description: 'How a visitor would describe their reason, e.g. "A new pain or musculoskeletal problem".',
      validation: (r) => r.required(),
    }),
    defineField({name: 'description', type: 'text', rows: 2}),
    defineField({name: 'duration', type: 'string'}),
    defineField({name: 'priceNote', title: 'Price note', type: 'string'}),
    defineField({name: 'audience', type: 'string', options: {list: ['new', 'existing', 'any'], layout: 'radio'}, initialValue: 'new'}),
    defineField({
      name: 'bookingUrl',
      title: 'Online booking link',
      type: 'url',
      description:
        'Paste the exact scheduling link for this visit type. If empty, the site shows "Call to book" and a request form instead. It never invents a link.',
      validation: (r) => r.uri({scheme: ['https']}),
    }),
    defineField({name: 'order', type: 'number', validation: (r) => r.required()}),
  ],
  orderings: [{title: 'Display order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'label', subtitle: 'situation', url: 'bookingUrl'},
    prepare: ({title, subtitle, url}) => ({title, subtitle: `${url ? '🔗 ' : '☎︎ call-to-book · '}${subtitle}`}),
  },
})

/* -------------------------------------------------------------------------- */
/*  Legal / utility page                                                      */
/* -------------------------------------------------------------------------- */
export const legalPage = defineType({
  name: 'legalPage',
  title: 'Legal / utility page',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    slugField(),
    defineField({name: 'intro', type: 'text', rows: 2}),
    defineField({name: 'body', type: 'articleBody', validation: (r) => r.required()}),
    defineField({name: 'lastUpdated', type: 'date', validation: (r) => r.required()}),
    defineField({
      name: 'reviewStatus',
      title: 'Practice / legal review',
      type: 'string',
      options: {list: ['draft-template', 'practice-reviewed', 'legal-reviewed'], layout: 'radio'},
      initialValue: 'draft-template',
      description: 'Internal only. Do not launch with "draft-template".',
    }),
    seoField,
  ],
})

/* -------------------------------------------------------------------------- */
/*  Chatbot knowledge, approved facts for the website assistant              */
/* -------------------------------------------------------------------------- */
export const chatKnowledge = defineType({
  name: 'chatKnowledge',
  title: 'Assistant knowledge',
  type: 'document',
  description: 'Approved facts the website assistant may use. Only published entries are used.',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'body',
      title: 'Approved information',
      type: 'text',
      rows: 8,
      description:
        'Plain facts in short sentences. Do not include patient information, internal notes, or anything you would not publish on the website.',
      validation: (r) => r.required().max(3000),
    }),
    defineField({name: 'relatedPath', title: 'Page to link', type: 'string', description: 'Optional site path, e.g. /book'}),
    defineField({name: 'active', type: 'boolean', initialValue: true}),
  ],
  preview: {select: {title: 'title', subtitle: 'body'}},
})

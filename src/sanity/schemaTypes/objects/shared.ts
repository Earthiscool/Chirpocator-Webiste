import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Image with required alt text. Editors must describe the image unless they
 * explicitly mark it decorative, this keeps the site accessible by default.
 */
export const accessibleImage = defineType({
  name: 'accessibleImage',
  title: 'Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description:
        'Describe what the image shows for people using screen readers, e.g. "Dr. Jenn assessing a golfer\'s hip rotation". Leave empty only if the image is purely decorative.',
      validation: (rule) =>
        rule.custom((alt, context) => {
          const parent = context.parent as {decorative?: boolean; asset?: unknown} | undefined
          if (!parent?.asset) return true
          if (parent.decorative) return true
          return alt && alt.trim().length > 3 ? true : 'Add alt text, or tick "Decorative image".'
        }),
    }),
    defineField({
      name: 'decorative',
      title: 'Decorative image',
      type: 'boolean',
      description: 'Tick only if the image adds no information (screen readers will skip it).',
      initialValue: false,
    }),
    defineField({
      name: 'credit',
      title: 'Photo credit / usage note',
      type: 'string',
      description: 'Internal note: photographer, license, or consent status. Not shown on the site.',
    }),
  ],
})

/** A call-to-action link. Pick an internal page OR type a link, not both. */
export const cta = defineType({
  name: 'cta',
  title: 'Button / link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      validation: (rule) => rule.required().max(40),
      description: 'Short and specific, e.g. "Start Here" or "Book a Visit".',
    }),
    defineField({
      name: 'internal',
      title: 'Link to a page on this site',
      type: 'reference',
      to: [
        {type: 'pathway'},
        {type: 'service'},
        {type: 'article'},
        {type: 'provider'},
        {type: 'legalPage'},
      ],
      description: 'Choose a page from the CMS. Use the field below for fixed pages like /start-here.',
    }),
    defineField({
      name: 'href',
      title: 'Or type a link',
      type: 'string',
      description:
        'Site pages start with "/" (e.g. /start-here, /book, /about, /for-providers, /faq). External links start with https://. Phone: tel:+16102985873.',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {internal?: unknown} | undefined
          if (!value && !parent?.internal) return 'Choose a page or type a link.'
          if (value && !/^(\/|https:\/\/|tel:|mailto:|#)/.test(value))
            return 'Links must start with "/", "https://", "tel:", "mailto:" or "#".'
          return true
        }),
    }),
  ],
  preview: {select: {title: 'label', subtitle: 'href'}},
})

export const seo = defineType({
  name: 'seo',
  title: 'Search & sharing',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'title',
      title: 'Page title (search results)',
      type: 'string',
      description: 'About 50–60 characters. Example: "Golf Performance & Injury Care in Wayne, PA | IWC".',
      validation: (rule) => rule.max(70).warning('Titles longer than ~60 characters get cut off in Google.'),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description: 'About 140–160 characters. Say who the page is for and what it helps with.',
      validation: (rule) => rule.max(180).warning('Descriptions longer than ~160 characters get cut off.'),
    }),
    defineField({name: 'image', title: 'Social sharing image', type: 'accessibleImage'}),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})

/** Simple portable text: paragraphs, h3, lists, bold/italic, links. No raw HTML. */
export const richText = defineType({
  name: 'richText',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Paragraph', value: 'normal'},
        {title: 'Heading', value: 'h3'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullets', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'href',
                type: 'string',
                validation: (rule) =>
                  rule
                    .required()
                    .custom((v) =>
                      !v || /^(\/|https:\/\/|tel:|mailto:)/.test(v)
                        ? true
                        : 'Use a site path (/about) or a full https:// link.',
                    ),
              }),
            ],
          }),
        ],
      },
    }),
  ],
})

/** Long-form article body: rich text plus inline images and a callout. */
export const articleBody = defineType({
  name: 'articleBody',
  title: 'Article body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Paragraph', value: 'normal'},
        {title: 'Heading', value: 'h2'},
        {title: 'Subheading', value: 'h3'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullets', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [defineField({name: 'href', type: 'string', validation: (r) => r.required()})],
          }),
        ],
      },
    }),
    defineArrayMember({type: 'accessibleImage'}),
    defineArrayMember({
      name: 'callout',
      title: 'Callout',
      type: 'object',
      fields: [
        defineField({name: 'title', type: 'string'}),
        defineField({name: 'body', type: 'text', rows: 3, validation: (r) => r.required()}),
      ],
      preview: {select: {title: 'title', subtitle: 'body'}},
    }),
  ],
})

/** A titled item with a short description, used for lists across the site. */
export const titledItem = defineType({
  name: 'titledItem',
  title: 'Item',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'body', title: 'Description', type: 'text', rows: 3}),
  ],
  preview: {select: {title: 'title', subtitle: 'body'}},
})

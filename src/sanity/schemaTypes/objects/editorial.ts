import {defineField, defineType} from 'sanity'

export const pageHeadings = defineType({
  name: 'pageHeadings',
  title: 'Page-specific headings',
  type: 'object',
  options: {collapsible: true, collapsed: false},
  fields: ['recognition', 'definition', 'approach', 'fit', 'expect', 'rationale', 'tools', 'faqs', 'final'].map(
    (name) => defineField({name, type: 'string', validation: (r) => r.max(100)}),
  ),
})
export const editorialReview = defineType({
  name: 'editorialReview',
  title: 'Editorial approval record',
  type: 'object',
  description:
    'Internal record only. Missing metadata does not change existing publication status. Review drafts before publishing.',
  fields: [
    defineField({name: 'status', type: 'string', options: {list: ['working', 'clinical-review', 'approved']}}),
    defineField({name: 'owner', type: 'string'}),
    defineField({name: 'reviewedAt', type: 'datetime'}),
    defineField({name: 'notes', type: 'text', rows: 3}),
  ],
})

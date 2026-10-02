import type {StructureResolver} from 'sanity/structure'

const singleton = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type).title(title))

/**
 * Editor-friendly Studio layout. Pages are grouped the way staff think about
 * the website, and singleton pages open directly (no "create new" confusion).
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('IWC website')
    .items([
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items([
              singleton(S, 'homePage', 'Homepage'),
              singleton(S, 'startHerePage', 'Start Here'),
              singleton(S, 'aboutPage', 'About / Dr. Jenn'),
              singleton(S, 'teamPage', 'Team'),
              singleton(S, 'resourcesPage', 'Resources'),
              singleton(S, 'providersPage', 'For Providers'),
              singleton(S, 'bookingPage', 'Book / Contact'),
              singleton(S, 'faqPage', 'FAQ / What to Expect'),
            ]),
        ),
      S.documentTypeListItem('pathway').title('Pathways (How We Help)'),
      S.documentTypeListItem('service').title('Services & programs'),
      S.divider(),
      S.documentTypeListItem('article').title('Articles'),
      S.documentTypeListItem('faq').title('FAQs'),
      S.documentTypeListItem('testimonial').title('Testimonials'),
      S.documentTypeListItem('provider').title('Team members'),
      S.divider(),
      S.documentTypeListItem('bookingOption').title('Booking options'),
      singleton(S, 'siteSettings', 'Contact details & settings'),
      singleton(S, 'navigation', 'Navigation'),
      S.documentTypeListItem('chatKnowledge').title('Website assistant knowledge'),
      S.documentTypeListItem('legalPage').title('Legal pages'),
    ])

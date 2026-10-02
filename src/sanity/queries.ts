import {defineQuery} from 'next-sanity'

/* Shared projections ------------------------------------------------------- */

const image = /* groq */ `{alt, decorative, hotspot, crop, asset->{_id, url, metadata{lqip, dimensions{width, height, aspectRatio}}}}`

/** Resolves a `cta` object to {label, href}, preferring the internal page. */
const cta = /* groq */ `{
  label,
  "href": coalesce(
    select(
      internal->_type == "pathway" => "/how-we-help/" + internal->slug.current,
      internal->_type == "service" => "/services/" + internal->slug.current,
      internal->_type == "article" => "/resources/" + internal->slug.current,
      internal->_type == "provider" => "/team/" + internal->slug.current,
      internal->_type == "legalPage" => "/" + internal->slug.current
    ),
    href
  )
}`

const seo = /* groq */ `seo{title, description, noIndex, image${image}}`

const pathwayCard = /* groq */ `{
  _id, title, "slug": slug.current, order, accent, patientVoice, cardSummary, startHereExplanation,
  nextSteps[]{_key, title, body, cta${cta}}
}`

const serviceCard = /* groq */ `{_id, title, "slug": slug.current, kind, summary}`
const providerCard = /* groq */ `{_id, name, "slug": slug.current, credentials, role, headline, photo${image}}`
const faqItem = /* groq */ `{_id, question, answer, category}`
const bookingOption = /* groq */ `{_id, label, situation, description, duration, priceNote, audience, bookingUrl}`

/** Testimonials are only ever returned when written permission is on file. */
const approvedTestimonials = /* groq */ `_type == "testimonial" && permissionOnFile == true`
const testimonial = /* groq */ `{_id, quote, attribution, theme}`

const articleCard = /* groq */ `{
  _id, title, "slug": slug.current, excerpt, topic, publishedAt, mainImage${image}, author->${providerCard}, reviewedBy->${providerCard}, reviewedAt,
  "readingMinutes": round(length(pt::text(body)) / 5 / 220)
}`

/* Global ------------------------------------------------------------------- */

export const settingsQuery = defineQuery(`*[_id == "siteSettings"][0]{
  ..., logo${image}, clinicImage${image}, defaultSeo{title, description, image${image}}
}`)

export const navigationQuery = defineQuery(`*[_id == "navigation"][0]{main, bookLabel, footerGroups}`)

/* Homepage ------------------------------------------------------------------ */

export const homeQuery = defineQuery(`*[_id == "homePage"][0]{
  ...,
  heroPrimaryCta${cta}, heroSecondaryCta${cta}, heroImage${image}, reframeImage${image},
  drJennProvider->${providerCard}, drJennImage${image}, drJennCta${cta},
  toolsCta${cta}, expectCta${cta}, toolGroups[]{..., cta${cta}},
  educationArticles[]->${articleCard},
  finalPrimaryCta${cta}, finalSecondaryCta${cta},
  ${seo},
  "pathways": *[_type == "pathway" && defined(slug.current)] | order(order asc) ${pathwayCard},
  "testimonials": *[${approvedTestimonials} && featured == true][0...5] ${testimonial},
  "latestArticles": *[_type == "article" && defined(slug.current)] | order(publishedAt desc)[0...3] ${articleCard}
}`)

/* Pathways ------------------------------------------------------------------ */

export const pathwayCardsQuery = defineQuery(
  `*[_type == "pathway" && defined(slug.current)] | order(order asc) ${pathwayCard}`,
)

export const pathwaySlugsQuery = defineQuery(`*[_type == "pathway" && defined(slug.current)].slug.current`)

export const pathwayQuery = defineQuery(`*[_type == "pathway" && slug.current == $slug][0]{
  ...${pathwayCard},
  heroHeadline, heroIntro, heroImage${image}, approachImage${image}, pageHeadings, movementPrinciples, recognition, approachHeading, approach,
  tools[]{_key, name, description, "service": service->{title, "slug": slug.current}},
  outcomes, whatToExpect, faqs[]->${faqItem}, primaryCta${cta}, ${seo},
  "services": *[_type == "service" && references(^._id)] | order(title asc) ${serviceCard},
  "testimonials": *[${approvedTestimonials} && references(^._id)][0...3] ${testimonial}
}`)

/* Services ------------------------------------------------------------------ */

export const serviceSlugsQuery = defineQuery(`*[_type == "service" && defined(slug.current)].slug.current`)

export const serviceQuery = defineQuery(`*[_type == "service" && slug.current == $slug][0]{
  ...${serviceCard},
  "pathways": pathways[]->{title, "slug": slug.current, accent},
  heroHeadline, heroIntro, heroImage${image}, approachImage${image}, pageHeadings, nextSteps[]{_key, title, body, cta${cta}}, recognition, whatItIs, howWeUseIt, mayFit, boundaries,
  whatToExpect, rationale, faqs[]->${faqItem}, providers[]->${providerCard},
  visitLength, pricingNote, bookingOption->${bookingOption}, primaryCta${cta}, disclaimer, ${seo},
  "testimonials": *[${approvedTestimonials} && references(^.pathways[]._ref)][0...2] ${testimonial},
  "related": relatedServices[defined(reason) && length(reason) > 0]{"reason": reason, ...service->${serviceCard}}
}`)

/* Team ---------------------------------------------------------------------- */

export const providersQuery = defineQuery(
  `*[_type == "provider" && defined(slug.current)] | order(order asc) ${providerCard}`,
)
export const providerSlugsQuery = defineQuery(`*[_type == "provider" && defined(slug.current)].slug.current`)

const providerFull = /* groq */ `{
  ...${providerCard}, bio, bestFit, approach, services[]->${serviceCard}, credentialGroups, personal,
  bookingOption->${bookingOption}, ${seo}
}`

export const providerQuery = defineQuery(`*[_type == "provider" && slug.current == $slug][0]${providerFull}`)

/* Articles ------------------------------------------------------------------ */

export const articlesQuery = defineQuery(
  `*[_type == "article" && defined(slug.current)] | order(publishedAt desc) ${articleCard}`,
)
export const articleSlugsQuery = defineQuery(`*[_type == "article" && defined(slug.current)].slug.current`)

export const articleQuery = defineQuery(`*[_type == "article" && slug.current == $slug][0]{
  ...${articleCard}, body, sources,
  pathway->{title, "slug": slug.current, patientVoice},
  services[]->${serviceCard}, ${seo},
  "related": *[_type == "article" && _id != ^._id && topic == ^.topic] | order(publishedAt desc)[0...2] ${articleCard}
}`)

/* FAQ & booking ------------------------------------------------------------- */

export const faqsQuery = defineQuery(`*[_type == "faq"] | order(category asc, order asc) ${faqItem}`)
export const bookingOptionsQuery = defineQuery(
  `*[_type == "bookingOption"] | order(order asc) { ...${bookingOption}, "providers": *[_type == "provider" && bookingOption._ref == ^._id] ${providerCard} }`,
)

/* Page singletons ----------------------------------------------------------- */

export const startHerePageQuery = defineQuery(`*[_id == "startHerePage"][0]{..., ${seo}}`)
export const aboutPageQuery = defineQuery(`*[_id == "aboutPage"][0]{
  ..., provider->${providerFull}, portrait${image}, ${seo},
  "testimonials": *[${approvedTestimonials} && provider._ref == ^.provider._ref][0...3] ${testimonial}
}`)
export const providersPageQuery = defineQuery(`*[_id == "providersPage"][0]{..., ${seo}}`)
export const bookingPageQuery = defineQuery(`*[_id == "bookingPage"][0]{..., ${seo}}`)
export const faqPageQuery = defineQuery(`*[_id == "faqPage"][0]{..., ${seo}}`)
export const resourcesPageQuery = defineQuery(`*[_id == "resourcesPage"][0]{..., ${seo}}`)
export const teamPageQuery = defineQuery(`*[_id == "teamPage"][0]{..., ${seo}}`)

export const legalPageQuery = defineQuery(`*[_type == "legalPage" && slug.current == $slug][0]{
  title, "slug": slug.current, intro, body, lastUpdated, ${seo}
}`)

/* Sitemap ------------------------------------------------------------------- */

export const sitemapQuery = defineQuery(`{
  "pathways": *[_type == "pathway" && defined(slug.current) && seo.noIndex != true]{"slug": slug.current, _updatedAt},
  "services": *[_type == "service" && defined(slug.current) && seo.noIndex != true]{"slug": slug.current, _updatedAt},
  "articles": *[_type == "article" && defined(slug.current) && seo.noIndex != true]{"slug": slug.current, _updatedAt},
  "providers": *[_type == "provider" && defined(slug.current) && seo.noIndex != true]{"slug": slug.current, _updatedAt},
  "legal": *[_type == "legalPage" && defined(slug.current) && seo.noIndex != true]{"slug": slug.current, _updatedAt}
}`)

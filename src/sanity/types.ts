import type {PortableTextBlock} from 'next-sanity'

export interface SanityImage {
  _type?: 'image' | 'accessibleImage'
  alt?: string
  decorative?: boolean
  hotspot?: {x: number; y: number; width: number; height: number}
  crop?: {top: number; bottom: number; left: number; right: number}
  asset?: {
    _id: string
    url: string
    metadata?: {lqip?: string; dimensions?: {width: number; height: number; aspectRatio: number}}
  }
}

export interface Cta {
  label: string
  href: string | null
}

export interface Seo {
  title?: string
  description?: string
  image?: SanityImage
  noIndex?: boolean
}

export interface TitledItem {
  _key?: string
  title: string
  body?: string
}

export type RichText = PortableTextBlock[]

export interface SiteSettings {
  practiceName: string
  shortName?: string
  brandLine?: string
  logo?: SanityImage
  phone: string
  phoneE164: string
  email: string
  providerEmail?: string
  address?: {street?: string; suite?: string; city?: string; region?: string; postalCode?: string}
  mapUrl?: string
  hours?: {_key: string; days: string; hours: string}[]
  parking?: string
  socials?: {_key: string; label: string; url: string}[]
  publishStructuredData?: boolean
  defaultSeo?: Seo
  clinicalDisclaimer?: string
  assistantEnabled?: boolean
  assistantWelcome?: string
  assistantSuggestions?: string[]
  assistantNotice?: string
}

export interface NavLink {
  _key?: string
  label: string
  href: string
  description?: string
}
export interface NavItem extends NavLink {
  children?: NavLink[]
}
export interface Navigation {
  main?: NavItem[]
  bookLabel?: string
  footerGroups?: {_key: string; title: string; links: NavLink[]}[]
}

export type Accent = 'teal' | 'gold' | 'sky' | 'navy'

export interface PathwayCard {
  _id: string
  title: string
  slug: string
  order: number
  accent: Accent
  patientVoice: string
  cardSummary: string
  startHereExplanation?: string
  nextSteps?: {_key: string; title: string; body?: string; cta: Cta}[]
}

export interface FaqItem {
  _id: string
  question: string
  answer: RichText
  category: string
}

export interface Testimonial {
  _id: string
  quote: string
  attribution: string
  theme?: string
}

export interface ToolItem {
  _key: string
  name: string
  description?: string
  service?: {title: string; slug: string} | null
}

export interface Pathway extends PathwayCard {
  heroHeadline: string
  heroIntro?: string
  heroImage?: SanityImage
  recognition?: string[]
  approachHeading?: string
  approach?: RichText
  tools?: ToolItem[]
  outcomes?: string[]
  whatToExpect?: TitledItem[]
  faqs?: FaqItem[]
  primaryCta?: Cta
  services?: ServiceCard[]
  testimonials?: Testimonial[]
  seo?: Seo
}

export interface ServiceCard {
  _id: string
  title: string
  slug: string
  kind: 'service' | 'program'
  summary: string
}

export interface BookingOption {
  _id: string
  label: string
  situation: string
  description?: string
  duration?: string
  priceNote?: string
  audience?: 'new' | 'existing' | 'any'
  bookingUrl?: string
}

export interface ProviderCard {
  _id: string
  name: string
  slug: string
  credentials?: string
  role: string
  headline?: string
  photo?: SanityImage
}

export interface Provider extends ProviderCard {
  bio?: RichText
  bestFit?: string[]
  approach?: string
  services?: ServiceCard[]
  credentialGroups?: {_key: string; label: string; items?: string[]}[]
  personal?: string
  bookingOption?: BookingOption | null
  seo?: Seo
}

export interface Service extends ServiceCard {
  pathways?: {title: string; slug: string; accent: Accent}[]
  heroHeadline: string
  heroIntro?: string
  heroImage?: SanityImage
  recognition?: string[]
  whatItIs?: RichText
  howWeUseIt?: RichText
  mayFit?: string[]
  boundaries?: string[]
  whatToExpect?: TitledItem[]
  rationale?: RichText
  faqs?: FaqItem[]
  providers?: ProviderCard[]
  visitLength?: string
  pricingNote?: string
  bookingOption?: BookingOption | null
  primaryCta?: Cta
  disclaimer?: string
  testimonials?: Testimonial[]
  related?: ServiceCard[]
  seo?: Seo
}

export interface ArticleCard {
  _id: string
  title: string
  slug: string
  excerpt: string
  topic: string
  publishedAt: string
  mainImage?: SanityImage
  readingMinutes?: number
}

export interface Article extends ArticleCard {
  body: RichText
  author?: ProviderCard | null
  pathway?: {title: string; slug: string; patientVoice: string} | null
  services?: ServiceCard[]
  related?: ArticleCard[]
  seo?: Seo
}

export interface HomePage {
  heroEyebrow?: string
  heroHeadline: string
  heroSubhead?: string
  heroPrimaryCta?: Cta
  heroSecondaryCta?: Cta
  heroImage?: SanityImage
  mapFactors?: string[]
  mapHighlighted?: string[]
  trustItems?: TitledItem[]
  recognitionHeading?: string
  recognitionCards?: string[]
  recognitionCoda?: string
  reframeHeading?: string
  reframeBody?: RichText
  reframePull?: string
  pathwaysHeading?: string
  pathwaysIntro?: string
  processHeading?: string
  processSteps?: TitledItem[]
  processNote?: string
  drJennHeading?: string
  drJennBody?: RichText
  drJennProvider?: ProviderCard | null
  drJennImage?: SanityImage
  drJennHighlights?: string[]
  drJennCta?: Cta
  proofHeading?: string
  proofPoints?: TitledItem[]
  toolsHeading?: string
  toolsIntro?: string
  toolGroups?: {_key: string; title: string; body?: string; items?: string[]}[]
  toolsCta?: Cta
  expectHeading?: string
  expectItems?: TitledItem[]
  expectCta?: Cta
  educationHeading?: string
  educationArticles?: ArticleCard[]
  finalHeading?: string
  finalBody?: string
  finalPrimaryCta?: Cta
  finalSecondaryCta?: Cta
  seo?: Seo
  pathways?: PathwayCard[]
  testimonials?: Testimonial[]
  latestArticles?: ArticleCard[]
}

export interface SimplePage {
  eyebrow?: string
  headline: string
  intro?: string
  seo?: Seo
}

export interface StartHerePage extends SimplePage {
  selectorPrompt?: string
  reassurance?: string
  unsureHeading?: string
  unsureBody?: string
}

export interface AboutPage extends SimplePage {
  provider?: Provider | null
  portrait?: SanityImage
  sections?: {_key: string; kicker?: string; heading: string; body?: RichText}[]
  philosophy?: TitledItem[]
  benefitsHeading?: string
  benefits?: string[]
  collaboration?: RichText
  closing?: string
  testimonials?: Testimonial[]
}

export interface ProvidersPage extends SimplePage {
  audience?: string[]
  promise?: string
  clinicalFit?: string[]
  whatWeDo?: TitledItem[]
  whatWeDoNot?: string[]
  communication?: RichText
  referralNotice?: string
}

export interface BookingPage extends SimplePage {
  firstVisitNote?: RichText
  formIntro?: string
}

export interface FaqPage extends SimplePage {
  expectations?: string[]
  firstVisitSteps?: TitledItem[]
}

export interface ResourcesPage extends SimplePage {
  newsletterHeading?: string
  newsletterBody?: string
  substackUrl?: string
}

export interface TeamPage extends SimplePage {
  collectiveNote?: string
}

export interface LegalPage {
  title: string
  slug: string
  intro?: string
  body: RichText
  lastUpdated: string
  seo?: Seo
}

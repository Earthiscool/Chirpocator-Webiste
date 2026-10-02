import 'server-only'

import {client} from '@/sanity/client'
import {isSanityConfigured} from '@/sanity/env'

/**
 * Retrieval layer for the website assistant.
 *
 * Source of truth = PUBLISHED CMS content, fetched with the tokenless client
 * (which cannot read drafts) and an explicit drafts filter as a second guard.
 * When staff publish a change in the Studio, the assistant's knowledge
 * updates with the same cache tags — no prompt rewriting required.
 */
export interface KnowledgeChunk {
  id: string
  title: string
  url?: string
  text: string
  core?: boolean
}

const NOT_DRAFT = `!(_id in path("drafts.**"))`

const knowledgeQuery = `{
  "settings": *[_id == "siteSettings"][0]{practiceName, phone, email, address, hours, parking},
  "booking": *[_type == "bookingOption" && ${NOT_DRAFT}] | order(order asc){label, situation, description, duration, priceNote, "online": defined(bookingUrl)},
  "pathways": *[_type == "pathway" && ${NOT_DRAFT}]{title, "slug": slug.current, patientVoice, cardSummary, heroIntro, recognition, "approach": pt::text(approach), "tools": tools[].name, outcomes},
  "services": *[_type == "service" && ${NOT_DRAFT}]{title, "slug": slug.current, summary, heroIntro, "whatItIs": pt::text(whatItIs), "how": pt::text(howWeUseIt), mayFit, boundaries, visitLength, pricingNote, "providers": providers[]->name},
  "providers": *[_type == "provider" && ${NOT_DRAFT}]{name, "slug": slug.current, credentials, role, headline, "bio": pt::text(bio), bestFit, approach, "credentials2": credentialGroups[]{label, items}},
  "faqs": *[_type == "faq" && includeInChat != false && ${NOT_DRAFT}]{_id, question, "answer": pt::text(answer)},
  "articles": *[_type == "article" && ${NOT_DRAFT}] | order(publishedAt desc){title, "slug": slug.current, excerpt, "body": pt::text(body)},
  "knowledge": *[_type == "chatKnowledge" && active != false && ${NOT_DRAFT}]{_id, title, body, relatedPath}
}`

type Raw = {
  settings?: {practiceName?: string; phone?: string; email?: string; address?: Record<string, string>; hours?: {days: string; hours: string}[]; parking?: string}
  booking?: {label: string; situation: string; description?: string; duration?: string; priceNote?: string; online: boolean}[]
  pathways?: {title: string; slug: string; patientVoice: string; cardSummary: string; heroIntro?: string; recognition?: string[]; approach?: string; tools?: string[]; outcomes?: string[]}[]
  services?: {title: string; slug: string; summary: string; heroIntro?: string; whatItIs?: string; how?: string; mayFit?: string[]; boundaries?: string[]; visitLength?: string; pricingNote?: string; providers?: string[]}[]
  providers?: {name: string; slug: string; credentials?: string; role: string; headline?: string; bio?: string; bestFit?: string[]; approach?: string; credentials2?: {label: string; items?: string[]}[]}[]
  faqs?: {_id: string; question: string; answer: string}[]
  articles?: {title: string; slug: string; excerpt: string; body?: string}[]
  knowledge?: {_id: string; title: string; body: string; relatedPath?: string}[]
}

const join = (arr?: (string | undefined | null)[], sep = '; ') => (arr ?? []).filter(Boolean).join(sep)

export const STATIC_PAGES: {url: string; title: string}[] = [
  {url: '/', title: 'Home'},
  {url: '/start-here', title: 'Start Here — guided selector'},
  {url: '/how-we-help', title: 'How We Help — all pathways'},
  {url: '/about', title: 'About Dr. Jenn'},
  {url: '/team', title: 'Team'},
  {url: '/resources', title: 'Resources / articles'},
  {url: '/faq', title: 'FAQ / What to Expect'},
  {url: '/for-providers', title: 'For Providers / referrals'},
  {url: '/book', title: 'Book a Visit / Contact'},
]

export async function loadKnowledge(): Promise<KnowledgeChunk[]> {
  if (!isSanityConfigured) return []
  let raw: Raw
  try {
    raw = await client.fetch<Raw>(knowledgeQuery, {}, {next: {revalidate: 300, tags: ['siteSettings', 'bookingOption', 'pathway', 'service', 'provider', 'faq', 'article', 'chatKnowledge']}})
  } catch (e) {
    console.error('[chat] knowledge fetch failed', (e as Error).message)
    return []
  }

  const chunks: KnowledgeChunk[] = []
  const s = raw.settings
  if (s) {
    const a = s.address
    chunks.push({
      id: 'contact',
      title: 'Contact, location, and hours',
      url: '/book',
      core: true,
      text: join(
        [
          `${s.practiceName}.`,
          s.phone && `Phone: ${s.phone}.`,
          s.email && `Email: ${s.email}.`,
          a?.street && `Address: ${join([a.street, a.suite, a.city, a.region, a.postalCode], ', ')}.`,
          s.hours?.length ? `Hours: ${s.hours.map((h) => `${h.days} ${h.hours}`).join('; ')}.` : 'Office hours are not published on the website; visitors should call for current hours.',
          s.parking ? `Parking: ${s.parking}` : 'Parking details are not published on the website.',
        ],
        ' ',
      ),
    })
  }
  if (raw.booking?.length) {
    chunks.push({
      id: 'booking',
      title: 'Visit types and how to book',
      url: '/book',
      core: true,
      text:
        'Book by phone, email, or the Book a Visit page (/book). Visit types: ' +
        raw.booking
          .map((b) => `${b.label} (for: ${b.situation}${b.duration ? `; ${b.duration}` : ''}${b.priceNote ? `; fee ${b.priceNote}` : ''}${b.online ? '; online booking available on /book' : '; book by calling or emailing the office'})`)
          .join('. ') +
        '.',
    })
  }
  for (const p of raw.pathways ?? []) {
    chunks.push({
      id: `pathway-${p.slug}`,
      title: `${p.title} pathway`,
      url: `/how-we-help/${p.slug}`,
      text: join([`"${p.patientVoice}" ${p.cardSummary}`, p.heroIntro, p.recognition && `Common situations: ${join(p.recognition)}.`, p.approach, p.tools && `Tools that may be used: ${join(p.tools, ', ')}.`, p.outcomes && `Goals: ${join(p.outcomes)}.`], ' '),
    })
  }
  for (const sv of raw.services ?? []) {
    chunks.push({
      id: `service-${sv.slug}`,
      title: sv.title,
      url: `/services/${sv.slug}`,
      text: join([sv.summary, sv.heroIntro, sv.whatItIs, sv.how, sv.mayFit && `May fit: ${join(sv.mayFit)}.`, sv.boundaries && `Boundaries: ${join(sv.boundaries)}.`, sv.visitLength && `Visit length: ${sv.visitLength}.`, sv.pricingNote && `Pricing: ${sv.pricingNote}.`, sv.providers?.length ? `Provided by: ${join(sv.providers, ", ")}.` : null], ' '),
    })
  }
  for (const pr of raw.providers ?? []) {
    chunks.push({
      id: `provider-${pr.slug}`,
      title: `${pr.name}${pr.credentials ? `, ${pr.credentials}` : ''} — ${pr.role}`,
      url: `/team/${pr.slug}`,
      text: join([pr.headline, pr.bio, pr.approach, pr.bestFit && `Best fit: ${join(pr.bestFit)}.`, pr.credentials2?.map((c) => `${c.label}: ${join(c.items, ', ')}`).join('. ')], ' '),
    })
  }
  for (const f of raw.faqs ?? []) chunks.push({id: f._id, title: `FAQ: ${f.question}`, text: f.answer, url: '/faq'})
  for (const ar of raw.articles ?? []) {
    chunks.push({id: `article-${ar.slug}`, title: `Article: ${ar.title}`, url: `/resources/${ar.slug}`, text: `${ar.excerpt} ${(ar.body ?? '').slice(0, 1400)}`})
  }
  for (const k of raw.knowledge ?? []) {
    chunks.push({id: k._id, title: k.title, url: k.relatedPath, text: k.body, core: /safety|emergenc/i.test(k.title)})
  }
  return chunks
}

/* ------------------------------------------------------------- ranking */
const STOP = new Set('a an and are as at be by can do does for from have how i if in is it me my of on or our so that the this to was we what when where which who why will with you your'.split(' '))
const tokenize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP.has(t))
    .map((t) => t.replace(/(ing|ed|es|s)$/, ''))

/** Lightweight BM25 ranking over the chunks — no vector database required. */
export function selectContext(chunks: KnowledgeChunk[], query: string, budget = 7000): KnowledgeChunk[] {
  const q = [...new Set(tokenize(query))]
  const docs = chunks.map((c) => ({c, toks: tokenize(`${c.title} ${c.title} ${c.text}`)}))
  const N = docs.length || 1
  const avg = docs.reduce((n, d) => n + d.toks.length, 0) / N || 1
  const df = new Map<string, number>()
  for (const d of docs) for (const t of new Set(d.toks)) df.set(t, (df.get(t) ?? 0) + 1)

  const scored = docs.map(({c, toks}) => {
    const tf = new Map<string, number>()
    for (const t of toks) tf.set(t, (tf.get(t) ?? 0) + 1)
    let score = 0
    for (const t of q) {
      const f = tf.get(t)
      if (!f) continue
      const idf = Math.log(1 + (N - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5))
      score += idf * ((f * 2.2) / (f + 1.2 * (0.25 + 0.75 * (toks.length / avg))))
    }
    return {c, score}
  })

  const picked: KnowledgeChunk[] = chunks.filter((c) => c.core)
  let used = picked.reduce((n, c) => n + c.text.length, 0)
  for (const {c} of scored.filter((s) => s.score > 0 && !s.c.core).sort((a, b) => b.score - a.score)) {
    if (used + c.text.length > budget) continue
    picked.push(c)
    used += c.text.length
    if (picked.length >= 10) break
  }
  return picked
}

/** Neutralize anything in CMS text that could impersonate our prompt delimiters. */
export function sanitizeForPrompt(text: string) {
  return text.replace(/<\/?\s*(approved_site_content|source|system|instructions?)[^>]*>/gi, '').slice(0, 4000)
}

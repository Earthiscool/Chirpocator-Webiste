import {expect, test} from '@playwright/test'

const ROUTES = [
  '/',
  '/start-here',
  '/how-we-help',
  '/how-we-help/pain-recovery',
  '/how-we-help/performance',
  '/how-we-help/prevention-active-aging',
  '/how-we-help/functional-health',
  '/services/chiropractic-sports-chiropractic',
  '/services/golf-performance',
  '/services/therapeutic-massage',
  '/services/holobiome-gut-restoration',
  '/services/scar-release-functional-restoration',
  '/services/direct-access-lab-testing',
  '/about',
  '/team',
  '/team/dr-jenn-hartmann',
  '/team/dr-irene-londer',
  '/team/amie-hamel',
  '/resources',
  '/resources/why-does-my-back-pain-keep-coming-back',
  '/for-providers',
  '/book',
  '/faq',
  '/privacy',
  '/terms',
  '/accessibility',
  '/disclaimer',
]

test.describe('every primary route', () => {
  for (const path of ROUTES) {
    test(`${path} renders with sound SEO basics`, async ({page}) => {
      const res = await page.goto(path)
      expect(res?.status()).toBe(200)
      await expect(page.locator('h1')).toHaveCount(1)
      const title = await page.title()
      expect(title.length).toBeGreaterThan(10)
      expect(title.length).toBeLessThan(80)
      const description = await page.locator('meta[name="description"]').getAttribute('content')
      expect(description?.length ?? 0).toBeGreaterThan(50)
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
      expect(canonical).toMatch(new RegExp(`${path === '/' ? '/?' : path}$`))
      // No leftover template/placeholder copy.
      const text = await page.locator('main').innerText()
      expect(text).not.toMatch(/lorem ipsum|TODO|placeholder|undefined|\[object Object\]/i)
    })
  }
})

test('unknown pages return 404 with a way forward', async ({page}) => {
  const res = await page.goto('/this-page-does-not-exist')
  expect(res?.status()).toBe(404)
  await expect(page.getByRole('link', {name: 'Start Here'}).first()).toBeVisible()
})

test('legacy Wix URLs 301-redirect to the new architecture', async ({request}) => {
  const map: Record<string, string> = {
    '/book-online': '/book',
    '/schedule-online': '/book',
    '/golf-performance-expert-wayne-pa': '/about',
    '/dr-irene-londer': '/team/dr-irene-londer',
    '/amie-hamel-massage-therapy-wayne-pa': '/team/amie-hamel',
    '/functional-gut-health-wayne-pa': '/services/holobiome-gut-restoration',
    '/service-page/on-demand-lab-testing': '/services/direct-access-lab-testing',
    '/privacy-practices-policies': '/privacy',
    '/post/elevate-your-health-with-integrative-wellbeing-chiropractic-services': '/resources',
    '/news/5-most-promising-fintech-startups': '/resources',
  }
  for (const [from, to] of Object.entries(map)) {
    const res = await request.get(from, {maxRedirects: 0})
    expect(res.status(), from).toBe(301)
    expect(new URL(res.headers()['location'], 'http://x').pathname).toBe(to)
  }
})

test('sitemap lists published pages only; robots blocks non-production', async ({request}) => {
  const sitemap = await (await request.get('/sitemap.xml')).text()
  for (const p of ['/how-we-help/pain-recovery', '/services/golf-performance', '/resources/which-labs-are-useful', '/team/amie-hamel', '/privacy']) {
    expect(sitemap).toContain(p)
  }
  expect(sitemap).not.toContain('/studio')
  expect(sitemap).not.toContain('drafts.')
  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toMatch(/Disallow: \//) // test servers are not production
})

test('CMS and API are excluded from indexing', async ({request}) => {
  const studio = await request.get('/studio')
  expect(studio.headers()['x-robots-tag']).toContain('noindex')
  const api = await request.get('/api/chat')
  expect(api.headers()['x-robots-tag']).toContain('noindex')
})

test('structured data: business, breadcrumbs, article', async ({page}) => {
  await page.goto('/')
  const home = await page.locator('script[type="application/ld+json"]').allTextContents()
  const business = home.map((t) => JSON.parse(t)).find((d) => d['@type'] === 'Chiropractor')
  expect(business?.telephone).toBe('+16102985873')
  expect(business?.address?.postalCode).toBe('19087')

  await page.goto('/resources/why-does-my-back-pain-keep-coming-back')
  const article = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((t) => JSON.parse(t))
  expect(article.some((d) => d['@type'] === 'Article')).toBe(true)
  expect(article.some((d) => d['@type'] === 'BreadcrumbList')).toBe(true)
})

test('homepage keeps the blueprint narrative order', async ({page}) => {
  await page.goto('/')
  const ids = await page.locator('main section[id]').evaluateAll((els) => els.map((e) => e.id))
  const order = ['hero', 'recognition', 'difference', 'pathways', 'how-it-works', 'dr-jenn', 'proof', 'toolbox', 'what-to-expect', 'education']
  expect(ids.filter((id) => order.includes(id))).toEqual(order)
  // No prices on the homepage (blueprint: pricing belongs on booking/service pages).
  expect(await page.locator('main').innerText()).not.toMatch(/\$\d/)
})

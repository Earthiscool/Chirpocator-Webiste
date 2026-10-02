import {expect, test} from '@playwright/test'

for (const [name, slug] of [
  ['Pain + Recovery', 'pain-recovery'],
  ['Performance', 'performance'],
  ['Prevention + Active Aging', 'prevention-active-aging'],
  ['Functional Health', 'functional-health'],
]) {
  test(`Start Here: ${name} has focus, state and real next steps`, async ({page, request}) => {
    await page.goto('/start-here')
    const choice = page.getByRole('button', {name: new RegExp(name.replace(/\+/g, '\\+'))})
    await choice.focus()
    await page.keyboard.press('Enter')
    await expect(choice).toHaveAttribute('aria-pressed', 'true')
    await expect(page).toHaveURL(new RegExp(`goal=${slug}`))
    await expect(page.locator('#your-starting-point h2')).toBeFocused()
    const hrefs = await page
      .locator('#your-starting-point ol a')
      .evaluateAll((as) => as.map((a) => a.getAttribute('href')!))
    expect(hrefs.length).toBeGreaterThanOrEqual(2)
    expect(hrefs.length).toBeLessThanOrEqual(3)
    for (const href of hrefs) expect((await request.get(href.split('#')[0])).status(), href).toBe(200)
    await page.goBack()
    await expect(choice).toHaveAttribute('aria-pressed', 'false')
  })
}

test('all twelve homepage sections are in order and visible without JavaScript', async ({browser}) => {
  const context = await browser.newContext({javaScriptEnabled: false})
  const page = await context.newPage()
  await page.goto('http://localhost:3100/')
  expect(await page.locator('main section[id]').evaluateAll((els) => els.map((e) => e.id))).toEqual([
    'hero',
    'trust',
    'recognition',
    'difference',
    'pathways',
    'how-it-works',
    'dr-jenn',
    'proof',
    'toolbox',
    'what-to-expect',
    'education',
    'final-cta',
  ])
  await expect(page.locator('#recognition li').first()).toBeVisible()
  // Dr. Jenn's interim photo was removed at the practice's request; the hero is text-only until a new portrait is added.
  await expect(page.locator('#hero img')).toHaveCount(0)
  await expect(page.locator('#hero h1')).toBeVisible()
  await context.close()
})

// Pending: checks Codex review copy (content/redesign-review.json), applied only via scripts/rebuild-drafts.mjs after client approval.
test.fixme('massage and golf preserve actual provider ownership; recommendations are explicitly curated', async ({page}) => {
  await page.goto('/services/therapeutic-massage')
  await expect(page.getByRole('definition').filter({hasText: 'Amie Hamel'})).toHaveCount(1)
  await expect(page.locator('main')).not.toContainText('Direct Access Lab Testing')
  await page.goto('/services/golf-performance')
  await expect(page.getByRole('definition').filter({hasText: 'Dr. Jenn Hartmann'})).toHaveCount(1)
  await expect(page.locator('main')).not.toContainText('Dr. Irene Londer')
  await page.goto('/services/direct-access-lab-testing')
  await expect(page.getByRole('link', {name: 'Ask about ordering'})).toHaveAttribute('href', '/book#contact')
  await expect(page.getByRole('link', {name: 'Arrange a consultation'})).toHaveAttribute(
    'href',
    '/book#booking-functional',
  )
  await expect(page.locator('main')).not.toContainText('Therapeutic Massage')
})

test('provider request is retained through the booking email action', async ({page}) => {
  await page.goto('/team/amie-hamel')
  await page.getByRole('link', {name: 'Arrange a visit with Amie', exact: true}).first().click()
  await expect(page).toHaveURL(/provider=amie-hamel#booking-massage/)
  await expect(page.locator('main')).toContainText('Your provider request: Amie Hamel')
  const email = await page.locator('#booking-massage a[href^="mailto:"]').getAttribute('href')
  expect(decodeURIComponent(email!)).toContain('provider request: Amie Hamel')
})

test('production assistant stays unavailable with a key but without approval/shared limits', async ({request}) => {
  const response = await request.get('http://localhost:3104/api/chat')
  expect(await response.json()).toEqual({available: false})
  const post = await request.post('http://localhost:3104/api/chat', {
    headers: {Origin: 'http://localhost:3104'},
    data: {messages: [{role: 'user', content: 'What visits do you offer?'}]},
  })
  expect(post.status()).toBe(503)
})

test('assistant handles unknown/unsupported fixtures, bounds output, and reports upstream failure', async ({
  request,
}) => {
  // These validate application plumbing with authored fixtures, not live model accuracy.
  const post = (content: string) =>
    request.post('/api/chat', {
      headers: {Origin: 'http://localhost:3100', 'x-forwarded-for': '192.0.2.44'},
      data: {messages: [{role: 'user', content}]},
    })
  const unknown = await post('IWC_MOCK_UNKNOWN: Do you offer a treatment not listed on the site?')
  expect(unknown.status()).toBe(200)
  expect(await unknown.text()).toContain("I don't have that information")
  const claim = await post('IWC_MOCK_CLAIM: Can you guarantee an outcome?')
  expect(await claim.text()).toContain('cannot predict outcomes')
  const long = await post('IWC_MOCK_LONG: output bound fixture')
  expect((await long.text()).length).toBeLessThanOrEqual(6000)
  const outage = await post('IWC_MOCK_OUTAGE: error fixture')
  expect(outage.status()).toBe(502)
  expect((await outage.json()).message).toContain('610-298-5873')
})

test('Start Here offers useful pathways before JavaScript is available', async ({browser}) => {
  const context = await browser.newContext({javaScriptEnabled: false})
  const page = await context.newPage()
  await page.goto('http://localhost:3100/start-here')
  for (const slug of ['pain-recovery', 'performance', 'prevention-active-aging', 'functional-health']) {
    await expect(page.locator(`main a[href="/how-we-help/${slug}"]`)).toBeVisible()
  }
  await context.close()
})

// Pending: checks Codex review copy (content/redesign-review.json), applied only via scripts/rebuild-drafts.mjs after client approval.
test.fixme('failed portraits become descriptive text instead of empty panels', async ({page}) => {
  await page.route('**/_next/image?**', (route) => route.abort())
  await page.goto('/team/dr-jenn-hartmann')
  await expect(page.locator('main img')).toHaveCount(0)
  await expect(page.locator('main')).toContainText(
    'wearing glasses and a white polo shirt, resting her hand near her chin',
  )
})

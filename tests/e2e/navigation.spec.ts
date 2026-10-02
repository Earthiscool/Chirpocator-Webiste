import {expect, test} from '@playwright/test'

test('main navigation matches the approved architecture', async ({page}) => {
  await page.goto('/')
  const nav = page.getByRole('navigation', {name: 'Main'})
  for (const label of ['Start Here', 'How We Help', 'About', 'Resources', 'For Providers']) {
    await expect(nav.getByText(label, {exact: true})).toBeVisible()
  }
  await expect(page.getByRole('banner').getByRole('link', {name: 'Book a Visit'})).toBeVisible()
})

test('How We Help dropdown is keyboard operable', async ({page}) => {
  await page.goto('/')
  const trigger = page.getByRole('button', {name: 'How We Help'})
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  const panel = page.getByRole('link', {name: /Pain \+ Recovery/}).first()
  await expect(panel).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
})

// Pending: checks Codex review copy (content/redesign-review.json), applied only via scripts/rebuild-drafts.mjs after client approval.
test.fixme('dropdown links navigate to pathway pages', async ({page}) => {
  await page.goto('/')
  await page.getByRole('button', {name: 'How We Help'}).click()
  await page
    .getByRole('link', {name: /^Functional Health/})
    .first()
    .click()
  await expect(page).toHaveURL(/\/how-we-help\/functional-health$/)
  await expect(page.locator('h1')).toContainText('Make room for the full conversation.')
})

test('skip link moves focus to main content', async ({page}) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', {name: 'Skip to content'})
  await expect(skip).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#main$/)
})

test('important internal links resolve (no broken links on key pages)', async ({page, request}) => {
  const checked = new Set<string>()
  for (const path of [
    '/',
    '/how-we-help/pain-recovery',
    '/services/golf-performance',
    '/about',
    '/book',
    '/faq',
    '/resources',
  ]) {
    await page.goto(path)
    const hrefs = await page
      .locator('a[href^="/"]')
      .evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute('href')!))
    for (const href of hrefs) {
      const clean = href.split('#')[0].split('?')[0]
      if (!clean || checked.has(clean) || clean.startsWith('/api/')) continue
      checked.add(clean)
      const res = await request.get(clean)
      expect(res.status(), `${href} (linked from ${path})`).toBeLessThan(400)
    }
  }
  expect(checked.size).toBeGreaterThan(20)
})

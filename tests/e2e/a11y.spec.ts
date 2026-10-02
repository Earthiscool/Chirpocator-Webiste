import AxeBuilder from '@axe-core/playwright'
import {expect, test} from '@playwright/test'

const PAGES = ['/', '/start-here?goal=performance', '/how-we-help/pain-recovery', '/services/holobiome-gut-restoration', '/about', '/team/amie-hamel', '/book', '/for-providers', '/faq', '/resources', '/resources/which-labs-are-useful', '/privacy']

for (const path of PAGES) {
  test(`WCAG 2.2 AA automated checks: ${path}`, async ({page}) => {
    await page.emulateMedia({reducedMotion: 'reduce'})
    await page.goto(path)
    // Reveal-on-scroll content must be visible for contrast checks.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 20))
      }
    })
    const results = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
    const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`)
    expect(summary).toEqual([])
  })
}

test('chat panel passes automated accessibility checks', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'}) // measure the settled panel, not mid-fade
  await page.goto('/')
  await page.getByRole('button', {name: /Questions\? Ask IWC/}).click()
  await expect(page.getByRole('dialog', {name: 'How can we help?'})).toBeVisible()
  const results = await new AxeBuilder({page}).include('#iwc-assistant').withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze()
  expect(results.violations.map((v) => v.id)).toEqual([])
})

test('reduced motion: content is visible without animation', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'})
  await page.goto('/')
  const opacity = await page.locator('.reveal').first().evaluate((el) => getComputedStyle(el).opacity)
  expect(Number(opacity)).toBe(1)
})

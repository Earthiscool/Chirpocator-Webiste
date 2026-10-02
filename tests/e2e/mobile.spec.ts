import {expect, test} from '@playwright/test'

test('mobile menu opens, traps focus, and closes with Escape', async ({page}) => {
  await page.goto('/')
  const open = page.getByRole('button', {name: 'Open menu'})
  await open.click()
  const dialog = page.getByRole('dialog', {name: 'Menu'})
  await expect(dialog).toBeVisible()
  await expect(page.getByRole('button', {name: 'Close menu'})).toBeFocused()
  // Focus stays inside the drawer.
  for (let i = 0; i < 25; i++) await page.keyboard.press('Tab')
  expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true)
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})

test('mobile menu navigates via pathway group', async ({page}) => {
  await page.goto('/')
  await page.getByRole('button', {name: 'Open menu'}).click()
  await page.getByRole('dialog').getByText('How We Help').click()
  await page.getByRole('dialog').getByRole('link', {name: 'Performance'}).click()
  await expect(page).toHaveURL(/\/how-we-help\/performance$/)
  await expect(page.getByRole('dialog')).toBeHidden()
})

test('persistent mobile actions: call, assistant, book', async ({page}) => {
  await page.goto('/how-we-help/pain-recovery')
  const bar = page.getByRole('region', {name: 'Quick actions'})
  await expect(bar).toBeVisible()
  await expect(bar.getByRole('link', {name: 'Book a Visit'})).toHaveAttribute('href', '/book')
  await expect(bar.getByRole('link', {name: 'Call the office'})).toHaveAttribute('href', /^tel:\+1/)
  // Assistant opens from the bar on phones (no floating button covering content).
  await expect(page.getByRole('button', {name: /Questions\? Ask IWC/})).toBeHidden()
  await bar.getByRole('button', {name: /assistant/}).click()
  await expect(page.getByRole('dialog', {name: 'How can we help?'})).toBeVisible()
})

test('no horizontal overflow on key pages at phone width', async ({page}) => {
  for (const p of ['/', '/start-here?goal=performance', '/book', '/about', '/services/holobiome-gut-restoration', '/for-providers']) {
    await page.goto(p)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow, p).toBeLessThanOrEqual(0)
  }
})

test('touch targets in the action bar are at least 44px', async ({page}) => {
  await page.goto('/')
  const sizes = await page
    .getByRole('region', {name: 'Quick actions'})
    .locator('a, button')
    .evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).map((r) => Math.min(r.width, r.height)))
  for (const s of sizes) expect(s).toBeGreaterThanOrEqual(44)
})

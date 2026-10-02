import {expect, test} from '@playwright/test'

test('choosing a goal shows 2–3 real next steps and updates the URL', async ({page, request}) => {
  await page.goto('/start-here')
  const choice = page.getByRole('button', {name: /Pain \+ Recovery/})
  await expect(choice).toHaveAttribute('aria-pressed', 'false')
  await choice.click()
  await expect(page).toHaveURL(/goal=pain-recovery/)
  await expect(choice).toHaveAttribute('aria-pressed', 'true')

  const result = page.locator('#your-starting-point')
  await expect(result.getByRole('heading', {name: 'Pain + Recovery'})).toBeFocused()
  const steps = result.locator('ol > li a')
  const count = await steps.count()
  expect(count).toBeGreaterThanOrEqual(2)
  expect(count).toBeLessThanOrEqual(3)
  // Every next step leads to a real page.
  for (const href of await steps.evaluateAll((as) => as.map((a) => a.getAttribute('href')!))) {
    const res = await request.get(href.split('#')[0])
    expect(res.status(), href).toBe(200)
  }
})

test('browser Back returns to the unselected state', async ({page}) => {
  await page.goto('/start-here')
  await page.getByRole('button', {name: /Performance/}).click()
  await expect(page).toHaveURL(/goal=performance/)
  await page.goBack()
  await expect(page).not.toHaveURL(/goal=/)
  await expect(page.locator('#your-starting-point ol')).toHaveCount(0)
})

test('selector is fully keyboard operable', async ({page}) => {
  await page.goto('/start-here')
  await page.getByRole('button', {name: /Functional Health/}).focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/goal=functional-health/)
  await expect(page.locator('#your-starting-point').getByRole('heading', {name: 'Functional Health'})).toBeFocused()
})

test('shared links open with the choice preselected', async ({page}) => {
  await page.goto('/start-here?goal=prevention-active-aging')
  await expect(page.getByRole('button', {name: /Prevention \+ Active Aging/})).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('#your-starting-point ol > li')).toHaveCount(3)
})

test('no medical questionnaire: the page asks for no personal input', async ({page}) => {
  await page.goto('/start-here')
  await expect(page.locator('main input, main textarea, main select')).toHaveCount(0)
})

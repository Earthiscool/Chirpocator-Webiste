import {expect, test} from '@playwright/test'

const MOCK = 'http://localhost:4010'
type Recorded = {body: {body: Record<string, unknown> & {to?: string[]; text?: string; email?: string}; path?: string}; count: number}
const last = async (kind: string) => (await (await fetch(`${MOCK}/__last/${kind}`)).json()) as Recorded

test('booking page offers every blueprint entry point with a real action', async ({page}) => {
  await page.goto('/book')
  for (const id of ['booking-new-patient', 'booking-athlete', 'booking-performance', 'booking-functional', 'booking-massage', 'booking-existing']) {
    const card = page.locator(`#${id}`)
    await expect(card).toBeVisible()
    const hrefs = await card.locator('a').evaluateAll((as) => as.map((a) => a.getAttribute('href')!))
    // Either a configured https booking link, or call/email, never an invented URL.
    expect(hrefs.every((h) => /^(https:\/\/|tel:\+1\d{10}$|mailto:)/.test(h))).toBe(true)
  }
})

test('deep links from pathways highlight the right visit', async ({page}) => {
  await page.goto('/how-we-help/performance')
  await page.getByRole('link', {name: 'Book a Performance Evaluation'}).first().click()
  await expect(page).toHaveURL(/\/book#booking-performance$/)
  await expect(page.locator('#booking-performance')).toBeInViewport()
})

test('contact form validates on the server and shows accessible errors', async ({page}) => {
  await page.goto('/book#contact')
  await page.waitForTimeout(2700) // anti-spam: humans spend a moment on the page
  await page.getByRole('button', {name: 'Send message'}).click()
  const alert = page.getByRole('alert').filter({hasText: 'Please check the highlighted fields.'})
  await expect(alert).toBeVisible()
  await expect(page.getByLabel('Name')).toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByText('Please enter a valid email address.')).toBeVisible()
})

test('contact form delivers through the email service and redacts identifiers', async ({page}) => {
  const before = (await last('email')).count
  await page.goto('/book#contact')
  await page.getByLabel('Name').fill('Test Visitor')
  await page.getByRole('textbox', {name: 'Email'}).fill('visitor@example.test')
  await page.getByLabel('What is this about?').selectOption('A question before booking')
  await page.getByLabel('Message').fill('Do you have early appointments? My member ID is ABC12345678, DOB 04/12/1980.')
  await page.getByLabel(/I understand this form is for general questions only/).check()
  await page.waitForTimeout(2700)
  await page.getByRole('button', {name: 'Send message'}).click()
  await expect(page.getByRole('status')).toContainText('Your message has been sent')

  const sent = await last('email')
  expect(sent.count).toBe(before + 1)
  expect(sent.body.body.to).toEqual(['frontdesk@example.test'])
  expect(sent.body.body.reply_to).toBe('visitor@example.test')
  expect(sent.body.body.subject).toBe('Website inquiry: A question before booking')
  expect(sent.body.body.text).toContain('Do you have early appointments?')
  expect(sent.body.body.text).not.toContain('ABC12345678')
  expect(sent.body.body.text).not.toContain('04/12/1980')
})

test('honeypot submissions are silently dropped', async ({page}) => {
  const before = (await last('email')).count
  await page.goto('/book#contact')
  await page.getByLabel('Name').fill('Bot')
  await page.getByRole('textbox', {name: 'Email'}).fill('bot@example.test')
  await page.locator('input[name="website"]').evaluate((el: HTMLInputElement) => (el.value = 'http://spam.example'))
  await page.waitForTimeout(2700)
  await page.getByRole('button', {name: 'Send message'}).click()
  await expect(page.getByRole('status')).toBeVisible()
  expect((await last('email')).count).toBe(before)
})

test('provider form sends clinician details only, to the referral inbox', async ({page}) => {
  await page.goto('/for-providers#refer')
  await expect(page.getByText('No patient information here.')).toBeVisible()
  await page.getByLabel('Your name').fill('Dr. Test Referrer')
  await page.getByLabel('Role / credentials').fill('Orthopedic surgeon')
  await page.getByLabel('Professional email').fill('referrer@example.test')
  await page.getByLabel('Reason').selectOption('Refer a patient (please call me)')
  await page.getByLabel(/I confirm this message contains no patient/).check()
  await page.waitForTimeout(2700)
  await page.getByRole('button', {name: 'Request a call'}).click()
  await expect(page.getByRole('status')).toContainText('secure way to share patient information')
  const sent = await last('email')
  expect(sent.body.body.to).toEqual(['referrals@example.test'])
  expect(sent.body.body.text).toContain('no patient health information')
})

test('newsletter sign-up adds the contact to the audience', async ({page}) => {
  await page.goto('/resources')
  await page.getByLabel('Email address').fill('reader@example.test')
  await page.waitForTimeout(2700)
  await page.getByRole('button', {name: 'Subscribe'}).click()
  await expect(page.getByRole('status')).toContainText("You're on the list")
  const added = await last('audience')
  expect(added.body.path).toBe('/audiences/aud_test/contacts')
  expect(added.body.body.email).toBe('reader@example.test')
})

test('without an email service the form says so honestly (no fake success)', async ({page}) => {
  await page.goto('http://localhost:3101/book#contact')
  await page.getByLabel('Name').fill('Test Visitor')
  await page.getByRole('textbox', {name: 'Email'}).fill('visitor@example.test')
  await page.getByLabel('What is this about?').selectOption('Something else')
  await page.getByLabel('Message').fill('Testing the unconfigured state.')
  await page.getByLabel(/I understand this form is for general questions only/).check()
  await page.waitForTimeout(2700)
  await page.getByRole('button', {name: 'Send message'}).click()
  await expect(page.getByRole('alert').filter({hasText: "isn't connected yet"})).toBeVisible()
  await expect(page.getByLabel('Name')).toHaveValue('Test Visitor') // nothing typed is lost
})

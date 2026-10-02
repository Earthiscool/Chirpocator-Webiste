import {readdirSync, readFileSync, statSync} from 'node:fs'
import path from 'node:path'

import {expect, test} from '@playwright/test'

/** Walk the client bundle and served HTML for anything secret-shaped. */
function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f)
    return statSync(p).isDirectory() ? files(p) : [p]
  })
}

test('no server secrets in client JavaScript', () => {
  const env = readFileSync('.env.local', 'utf8')
  const secrets = env
    .split('\n')
    .filter((l) => /^(SANITY_API_(READ|WRITE)_TOKEN|SANITY_REVALIDATE_SECRET|OPENAI_API_KEY|RESEND_API_KEY)=/.test(l))
    .map((l) => l.split('=').slice(1).join('='))
    .filter((v) => v.length > 8)
  expect(secrets.length).toBeGreaterThan(0)
  const bundle = files('.next/static').filter((f) => f.endsWith('.js'))
  for (const f of bundle) {
    const js = readFileSync(f, 'utf8')
    for (const s of secrets) expect(js.includes(s), `secret found in ${f}`).toBe(false)
    expect(js).not.toContain('test-key-not-real')
  }
})

test('no secrets in rendered HTML or API responses', async ({request}) => {
  const html = await (await request.get('/')).text()
  expect(html).not.toMatch(/sk-[A-Za-z0-9]{20,}|test-key-not-real|SANITY_API_(READ|WRITE)_TOKEN/)
  const status = await (await request.get('/api/chat')).json()
  expect(Object.keys(status)).toEqual(['available'])
})

test('draft mode cannot be enabled without a Studio-issued secret', async ({request}) => {
  const res = await request.get('/api/draft-mode/enable?sanity-preview-secret=guess&sanity-preview-pathname=/', {maxRedirects: 0})
  expect(res.status()).toBe(401)
  const cookies = res.headers()['set-cookie'] ?? ''
  expect(cookies).not.toContain('__prerender_bypass')
})

test('revalidation webhook rejects unsigned requests', async ({request}) => {
  const res = await request.post('/api/revalidate', {data: {_type: 'faq'}})
  expect(res.status()).toBe(401)
})

test('security headers are set', async ({request}) => {
  const h = (await request.get('/')).headers()
  expect(h['x-content-type-options']).toBe('nosniff')
  expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin')
  expect(h['content-security-policy']).toContain("frame-ancestors 'self'")
  expect(h['x-powered-by']).toBeUndefined()
})

test('testimonials without written permission never render', async ({request}) => {
  // The query layer filters on permissionOnFile == true; verify no testimonial section
  // appears while none are approved (the seeded dataset contains none).
  const html = await (await request.get('/')).text()
  expect(html).not.toContain('In patients&#x27; words')
})

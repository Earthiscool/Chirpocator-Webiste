import {expect, test} from '@playwright/test'

// Runs last (file order) against the keyless server so earlier tests aren't throttled.
test('chat endpoint rate-limits bursts', async ({request}) => {
  const statuses: number[] = []
  for (let i = 0; i < 14; i++) {
    const res = await request.post('http://localhost:3101/api/chat', {
      data: {messages: [{role: 'user', content: `question ${i}`}]},
      headers: {Origin: 'http://localhost:3101'},
    })
    statuses.push(res.status())
    if (res.status() === 429) {
      expect(Number(res.headers()['retry-after'])).toBeGreaterThan(0)
      break
    }
  }
  expect(statuses).toContain(429)
})

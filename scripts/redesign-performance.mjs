import {chromium} from '@playwright/test'
import {writeFile} from 'node:fs/promises'

const base = process.env.EVIDENCE_URL || 'http://localhost:3100'
const browser = await chromium.launch()
const measurements = []
for (const width of [375, 1280]) {
  const context = await browser.newContext({
    viewport: {width, height: width === 375 ? 812 : 900},
  })
  const page = await context.newPage()
  await page.addInitScript(() => {
    window.__iwcMetrics = {lcp: 0, cls: 0}
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.__iwcMetrics.lcp = e.startTime
    }).observe({type: 'largest-contentful-paint', buffered: true})
    new PerformanceObserver((list) => {
      for (const e of list.getEntries())
        if (!e.hadRecentInput) window.__iwcMetrics.cls += e.value
    }).observe({type: 'layout-shift', buffered: true})
  })
  for (const route of [
    '/',
    '/start-here',
    '/services/therapeutic-massage',
    '/book',
    '/resources/which-labs-are-useful',
  ]) {
    const cdp = await context.newCDPSession(page)
    await cdp.send('Network.clearBrowserCache')
    const response = await page.goto(base + route, {waitUntil: 'networkidle'})
    await page.waitForTimeout(1000)
    const stats = await page.evaluate(() => {
      const n = performance.getEntriesByType('navigation')[0]
      return {
        ...window.__iwcMetrics,
        ttfbMs: n.responseStart - n.requestStart,
        domContentLoadedMs: n.domContentLoadedEventEnd,
        loadMs: n.loadEventEnd,
        resources: performance.getEntriesByType('resource').length,
        knownTransferBytes: performance
          .getEntriesByType('resource')
          .reduce((sum, r) => sum + r.transferSize, 0),
      }
    })
    measurements.push({route, width, status: response.status(), ...stats})
    await cdp.detach()
  }
  await context.close()
}
await browser.close()
const result = {
  base,
  capturedAt: new Date().toISOString(),
  method:
    'Local production build. Chromium, cold browser cache per route, warm application cache, no CPU/network throttling. Navigation and PerformanceObserver measurements; not Lighthouse, field Core Web Vitals, or clinical acceptance.',
  measurements,
}
await writeFile(
  'docs/redesign/PERFORMANCE.json',
  JSON.stringify(result, null, 2),
)
console.log(JSON.stringify(result, null, 2))

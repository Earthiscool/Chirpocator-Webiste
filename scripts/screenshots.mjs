#!/usr/bin/env node
/**
 * Capture full-page screenshots at the four review widths.
 *   node scripts/screenshots.mjs [baseUrl] [outDir] [paths...]
 */
import {mkdirSync} from 'node:fs'

import {chromium} from '@playwright/test'

const [base = 'http://localhost:3000', out = 'screenshots', ...paths] = process.argv.slice(2)
const routes = paths.length ? paths : ['/']
const widths = [375, 768, 1280, 1600]

mkdirSync(out, {recursive: true})
const browser = await chromium.launch()
for (const width of widths) {
  const ctx = await browser.newContext({viewport: {width, height: 900}, deviceScaleFactor: 1, reducedMotion: 'reduce'})
  const page = await ctx.newPage()
  for (const route of routes) {
    await page.goto(base + route, {waitUntil: 'networkidle'})
    // Reveal-on-scroll content: scroll through once so everything is visible.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 40))
      }
      window.scrollTo(0, 0)
    })
    await page.waitForTimeout(300)
    const name = `${route === '/' ? 'home' : route.replace(/^\//, '').replace(/[/#?]/g, '_')}-${width}.png`
    await page.screenshot({path: `${out}/${name}`, fullPage: true})
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    console.log(`${name}${overflow > 0 ? `  ⚠ horizontal overflow ${overflow}px` : ''}`)
  }
  await ctx.close()
}
await browser.close()

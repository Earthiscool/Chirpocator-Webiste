import {chromium} from '@playwright/test'
import {mkdir, writeFile} from 'node:fs/promises'

const base = process.env.EVIDENCE_URL || 'http://localhost:3100'
const directory = 'docs/redesign/evidence'
await mkdir(directory, {recursive: true})
const routes = [
  ['home', '/'],
  ['start-here', '/start-here?goal=performance'],
  ['pathways', '/how-we-help'],
  ['pain', '/how-we-help/pain-recovery'],
  ['performance', '/how-we-help/performance'],
  ['prevention', '/how-we-help/prevention-active-aging'],
  ['functional', '/how-we-help/functional-health'],
  ['chiropractic', '/services/chiropractic-sports-chiropractic'],
  ['golf', '/services/golf-performance'],
  ['massage', '/services/therapeutic-massage'],
  ['scar', '/services/scar-release-functional-restoration'],
  ['holobiome', '/services/holobiome-gut-restoration'],
  ['labs', '/services/direct-access-lab-testing'],
  ['about', '/about'],
  ['team', '/team'],
  ['jenn', '/team/dr-jenn-hartmann'],
  ['irene', '/team/dr-irene-londer'],
  ['amie', '/team/amie-hamel'],
  ['resources', '/resources'],
  ['article', '/resources/which-labs-are-useful'],
  ['providers', '/for-providers'],
  ['book', '/book'],
  ['faq', '/faq'],
  ['legal', '/privacy'],
  ['not-found', '/missing-redesign-page'],
]
const browser = await chromium.launch()
const manifest = []
for (const width of [375, 768, 1280, 1600]) {
  const context = await browser.newContext({
    viewport: {width, height: width === 375 ? 812 : 900},
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  for (const [name, route] of routes) {
    const consoleErrors = [],
      errors = [],
      failed = []
    const onError = (e) => errors.push(e.message)
    const onResponse = (res) => {
      if (res.status() >= 400 && !(name === 'not-found' && res.url() === base + route))
        failed.push({status: res.status(), url: res.url()})
    }
    const onConsole = (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    }
    page.on('console', onConsole)
    page.on('pageerror', onError)
    page.on('response', onResponse)
    const response = await page.goto(base + route, {waitUntil: 'networkidle'})
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 30))
      }
    })
    await page.locator('img').evaluateAll(async (images) => {
      await Promise.all(images.map((img) => img.decode().catch(() => {})))
    })
    await page.evaluate(() => scrollTo(0, 0))
    await page.waitForTimeout(100)
    const facts = await page.evaluate(() => ({
      height: document.body.scrollHeight,
      overflow: document.documentElement.scrollWidth - innerWidth,
      h1: document.querySelector('h1')?.textContent,
      images: [...document.querySelectorAll('main img')].map((i) => ({
        alt: i.alt,
        loaded: i.complete && i.naturalWidth > 0,
      })),
      words: document.querySelector('main')?.innerText.trim().split(/\s+/).length,
    }))
    const filename = `after-${name}-${width}.${name === 'home' && [375, 1280].includes(width) ? 'png' : 'jpg'}`
    await page.screenshot({
      path: `${directory}/${filename}`,
      fullPage: true,
      ...(filename.endsWith('.jpg') ? {quality: 75} : {}),
    })
    manifest.push({name, route, width, status: response.status(), filename, ...facts, errors, failed})
    page.off('console', onConsole)
    page.off('pageerror', onError)
    page.off('response', onResponse)
    console.log(
      JSON.stringify({
        name,
        width,
        status: response.status(),
        overflow: facts.overflow,
        errors: errors.length,
        failed: failed.length,
      }),
    )
  }
  await context.close()
}
await browser.close()
await writeFile(
  `${directory}/manifest.json`,
  JSON.stringify({base, capturedAt: new Date().toISOString(), pages: manifest}, null, 2),
)
await writeFile(
  `${directory}/GALLERY.md`,
  '# Browser evidence\n\nLocal review copy; existing CMS data. Full page screenshots at four widths. See manifest for image/network/overflow checks.\n\n' +
    routes
      .map(
        ([name, route]) =>
          `## ${name}: ${route}\n\n` +
          [375, 768, 1280, 1600]
            .map((w) => `[${w}px](after-${name}-${w}.${name === 'home' && [375, 1280].includes(w) ? 'png' : 'jpg'})`)
            .join(' · '),
      )
      .join('\n\n') +
    '\n',
)

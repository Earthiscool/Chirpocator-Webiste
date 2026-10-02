# Deployment and launch runbook

Don't launch publicly until the 🔴 items in [`CLIENT_APPROVAL_CHECKLIST.md`](CLIENT_APPROVAL_CHECKLIST.md) are resolved.

## 1. Hosting (Vercel)

1. Import the GitHub repository into Vercel (Framework: Next.js, default build command). Node 20.9+.
2. Add environment variables (Production **and** Preview) from `.env.example`:
   - Required: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`, `SANITY_REVALIDATE_SECRET`.
   - For the assistant: `OPENAI_API_KEY` (create a dedicated, spend-limited project key at platform.openai.com).
   - For forms: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` (+ optional `PROVIDER_TO_EMAIL`, `RESEND_AUDIENCE_ID`).
   - For rate limiting: Vercel → **Storage / Marketplace → Upstash Redis**. It injects `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
   - Optional: `NEXT_PUBLIC_GA_MEASUREMENT_ID`, Turnstile keys.
   - **Never** add `SANITY_API_WRITE_TOKEN` to Vercel. It's only for local seeding.
3. Preview deployments stay `noindex` automatically (robots disallow everything unless `VERCEL_ENV=production`). Keep Vercel Deployment Protection on for previews.

## 2. Sanity

1. **CORS:** sanity.io/manage → project → API → CORS origins → add `https://www.iwcmainline.com` (and the Vercel preview domain pattern) with **Allow credentials** on. Without this, `/studio` shows "Connect this Studio."
2. **Publish webhook:** API → Webhooks → *Create*:
   - URL `https://www.iwcmainline.com/api/revalidate`
   - Dataset `production` · Trigger on create, update, delete · Filter: leave empty
   - Projection `{_type}` · HTTP method POST · Secret = `SANITY_REVALIDATE_SECRET`
3. **Members:** invite staff as **Editor**. Keep Administrator to the web team and practice owner.
4. **Tokens:** the "Next.js preview (viewer)" token is used by the site. Rotate any token that leaves your control.
5. **Backups:** `npx sanity dataset export production backups/$(date +%F).tar.gz` monthly.

## 3. Domain and redirects

1. Point `www.iwcmainline.com` (and apex) to Vercel. Set the apex to redirect to `www`.
2. Every URL from the current Wix sitemap 301-redirects to its new home (`next.config.ts → legacyRedirects`). After DNS cutover, spot-check: `/book-online`, `/golf-performance-expert-wayne-pa`, `/dr-irene-londer`, `/amie-hamel-massage-therapy-wayne-pa`, `/functional-gut-health-wayne-pa`, `/service-page/*`, `/post/*`, `/news/*`.
3. ⚠️ The current Wix Bookings links stop working at cutover. Set the new scheduling URLs in **Booking options** *before* switching DNS.

## 4. Email (Resend)

1. Create a Resend account owned by IWC. Verify the `iwcmainline.com` sending domain (DNS records).
2. Set `CONTACT_FROM_EMAIL=website@iwcmainline.com` and the inbox(es).
3. Send a test from `/book#contact` and `/for-providers#refer` on the live site and confirm arrival.

## 5. Analytics and search

1. Create a GA4 property, set `NEXT_PUBLIC_GA_MEASUREMENT_ID`, and mark `book_click`, `phone_click` and `contact_submit` as key events.
2. **Search Console:** add the domain property (DNS TXT), submit `https://www.iwcmainline.com/sitemap.xml`, and watch Coverage for redirected Wix URLs.
3. Validate structured data with Google's Rich Results Test. Turn **Settings → SEO → Publish business details** off if the name, address and phone don't exactly match the Google Business Profile.
4. Link Google Business Profile to the new site and check NAP consistency.

## 6. Launch-day checks

- [ ] `npm run check && npm run build && npm run test:e2e` pass on the release commit
- [ ] Every page reviewed at phone and desktop sizes (`npm run screenshots`)
- [ ] Assistant answers a test question on production. Logs show `outcome: ok` (Vercel → Logs, filter `[chat]`).
- [ ] Contact and provider forms deliver to the right inboxes
- [ ] Publish an FAQ edit in the Studio and confirm it's live within seconds (webhook)
- [ ] `https://www.iwcmainline.com/robots.txt` allows crawling and lists the sitemap
- [ ] Old URLs redirect (301)
- [ ] PageSpeed Insights on the homepage and one pathway page (targets: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS < 0.1)

# Implementation status

What's built, how it was verified, and what still depends on someone outside this codebase. "Verified" means exercised by an automated test or a recorded run, not just "the code exists."

_Last verified: 2026-10-01._ Production build of this commit, Sanity project `xtyxg1gp` / `production`.

## Verified

| Area | Evidence |
|---|---|
| All 27 primary routes + legal pages render (200), one H1, title, meta description, canonical | `tests/e2e/routes.spec.ts` |
| Homepage keeps the blueprint's 12-section order; no prices on homepage | `routes.spec.ts → homepage keeps the blueprint narrative order` |
| Navigation matches approved IA; dropdown keyboard-operable; skip link | `navigation.spec.ts` |
| No broken internal links across key pages (20+ unique targets) | `navigation.spec.ts` |
| Mobile drawer: focus trap, Escape, navigation; persistent Call/Ask/Book bar; 44px targets; no horizontal overflow | `mobile.spec.ts` (iPhone 13 profile) |
| Start Here: one choice → 2–3 real next steps; URL state; Back button; keyboard; shared links; no questionnaire | `start-here.spec.ts` |
| Booking page: all six blueprint entry points, each with a real action (no invented URLs); deep links from pathways | `booking-forms.spec.ts` |
| Contact form: server validation + accessible errors; delivery via email API; ID/DOB redaction; honeypot; honest "not connected" state with values preserved | `booking-forms.spec.ts` (against a local Resend-compatible mock) |
| Provider form → referral inbox, no-PHI confirmation; newsletter → audience | `booking-forms.spec.ts` |
| Assistant: opens, streams, renders only internal links, focus management; request uses `store:false`, token limit, hashed id, grounded content; identifier redaction; emergency short-circuit (no model call); validation; origin check; unavailable state without a key; rate limiting | `chat.spec.ts`, `z-rate-limit.spec.ts` (OpenAI-compatible streaming mock) |
| Assistant uses **published** content only: draft FAQ excluded → published FAQ retrieved → removed FAQ dropped | `scripts/chat-knowledge-test.mjs` (real Sanity) |
| **CMS workflow** for FAQ, article, team profile, homepage section: draft hidden publicly → visible in Preview → publish → live → revise → live → unpublish → gone → restored (**39/39**) | `scripts/cms-workflow-test.mjs` (real Sanity, production build, signed webhook) |
| Studio loads; sign-in gate; desk structure; singletons; Presentation preview renders the site in draft mode | Headless browser run with an editor token (screenshots in the session log) |
| Schema valid; all 56 seeded documents pass the CMS's own validation rules | `npx sanity schema validate`, `npx sanity documents validate` |
| WCAG 2.2 AA automated checks (axe) on 12 pages + chat panel: 0 violations; reduced motion respected | `a11y.spec.ts` |
| No server secrets in client JS or HTML; draft mode needs Studio secret; webhook needs signature; security headers | `security.spec.ts` |
| SEO: sitemap (published only), robots (non-prod disallow), noindex on `/studio` + `/api`, Chiropractor/Breadcrumb/Article JSON-LD, 301 map for every old Wix URL | `routes.spec.ts` |
| TypeScript, ESLint, production build | `npm run check`, `npm run build` |
| Visual review at 375 / 768 / 1280 / 1600 px for every template; issues found were fixed (map label clipping, invisible on-navy button, mobile header wrap, drawer overlap, contrast) | `scripts/screenshots.mjs` |

Final run: **83/83 Playwright tests passed** (desktop + mobile projects).

## Built, but needs external credentials to verify live

| Area | What's missing | Until then |
|---|---|---|
| Real OpenAI responses | `OPENAI_API_KEY` | The full request/stream path is tested against a protocol-compatible mock. The site shows an honest "unavailable" state. |
| Real email delivery | Resend account + verified domain | Tested against a mock of Resend's API. Forms say "not connected yet — please call." |
| Production rate limiting | Upstash Redis | Per-instance memory limits (fine locally, weak on serverless) |
| Instant cache refresh on publish | Sanity webhook to the production URL | Published edits appear within 5 minutes |
| GA4 events | Measurement ID | Events are wired and log to the console in development |
| Search Console / Business Profile | Account access | — |
| Core Web Vitals in the field | Real-user data after launch | Static generation, `next/font`, AVIF/WebP images, lazy-loaded assistant, minimal client JS. Measure with PageSpeed/CrUX after launch. |

## Not done, by design (needs a decision)

- Online booking URLs (current Wix links won't survive the move). Configurable per visit type in the CMS.
- Secure PHI referral channel (form vendor with BAA, secure fax, or portal).
- Testimonials, awards, final photography, official colors/logo/fonts, legal review. See the approval checklist.
- Prevention membership, newsletter lead magnet (open questions in the handwritten notes).

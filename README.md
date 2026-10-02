# Integrative Wellbeing & Chiropractic — website

The rebuilt website for **Integrative Wellbeing & Chiropractic (IWC)**, Dr. Jenn Hartmann's practice in Wayne, PA, built from the *IWC Web Revamp Brand Strategy* and *Rebuild Blueprint*.

> **Status:** feature-complete and tested, **not yet approved for launch.** Content is working copy pending practice approval, and several external accounts still need connecting. See [`docs/CLIENT_APPROVAL_CHECKLIST.md`](docs/CLIENT_APPROVAL_CHECKLIST.md) and [`docs/IMPLEMENTATION_STATUS.md`](docs/IMPLEMENTATION_STATUS.md).

| | |
|---|---|
| Framework | Next.js 16 (App Router, React 19, TypeScript), Tailwind CSS 4 |
| CMS | Sanity (Studio embedded at `/studio`, Presentation preview, draft mode) |
| Website assistant | OpenAI Responses API (official `openai` SDK), server-side, streaming |
| Forms | Server Actions → Resend email API |
| Rate limiting | Upstash Redis (in-memory fallback for local dev) |
| Analytics | GA4 (optional), privacy-safe custom events |
| Tests | Playwright end-to-end + axe accessibility, CMS workflow and assistant-knowledge scripts |
| Hosting | Built for Vercel (any Node 20+ host works) |

---

## Quick start

```bash
npm install
cp .env.example .env.local      # fill in the Sanity values at minimum
npm run dev                     # http://localhost:3000   ·  CMS: http://localhost:3000/studio
```

To seed an **empty** dataset with the approved working copy (safe to re-run; it never overwrites existing documents unless you pass `--force`):

```bash
npm run seed
# optional: upload interim team headshots kept OUTSIDE the repo
SEED_ASSETS_DIR=/path/to/photos npm run seed
```

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Local development server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run check` | TypeScript + ESLint |
| `npm run test:e2e` | Playwright suite (run `npm run build` first). Starts a mock OpenAI/Resend server plus two production instances. |
| `npm run seed` | Seed CMS content (non-destructive) |
| `npm run screenshots -- http://localhost:3000 ./shots / /book` | Full-page screenshots at 375 / 768 / 1280 / 1600 px |
| `node --env-file=.env.local scripts/cms-workflow-test.mjs <url>` | Live CMS publishing workflow check (draft → preview → publish → revise → unpublish) |
| `node --env-file=.env.local scripts/chat-knowledge-test.mjs <url>` | Verifies the assistant uses published content only |
| `npx sanity schema validate` · `npx sanity documents validate` | Validate schema and all content |

---

## Project structure

```
sanity.config.ts            Studio config (structure, Presentation preview, singletons)
scripts/seed/               Initial content (working copy) + non-destructive seeder
src/app/(site)/             Public pages (homepage, pathways, services, team, resources…)
src/app/studio/             Embedded Sanity Studio (/studio)
src/app/api/chat            Website assistant endpoint (streaming)
src/app/api/revalidate      Sanity publish webhook → cache refresh
src/app/api/draft-mode/*    Preview (draft mode) enable/disable
src/components/             UI: sections, layout, chat, forms, Start Here selector
src/lib/chat/               Retrieval over published CMS content, safety screen, prompt
src/lib/forms/              Validation, anti-spam, delivery, server actions
src/sanity/                 Client, typed GROQ queries, schema types, Presentation map
src/app/globals.css         Design tokens (colours, type scale) — PROVISIONAL brand values
tests/e2e/                  Playwright specs   ·   tests/mocks/  OpenAI + Resend mock
docs/                       Approval checklist, implementation status, editor guide, deployment
```

## Design system

Tokens live in one place: `src/app/globals.css` (`@theme`). Navy, teal, gold and sky were **sampled from the current IWC logo** because official values haven't been supplied yet. Swap the hex values there once they're approved. Orange is reserved for "Book a Visit" (client request). Type: Newsreader (display, optical sizes) + Hanken Grotesk (body).

The signature element is the **"whole picture" map** in the hero (`src/components/home/WholePictureMap.tsx`). It's pure SVG/CSS: every factor connects, then the web quiets and a few factors light up as "the pieces that matter for you." Editors control the words and highlights in the CMS. Under `prefers-reduced-motion`, it renders static.

Images come from the CMS with editor-controlled crop/hotspot and **required alt text**. Where no photo exists yet, an intentional graphic slot renders; we never use stock people as IWC staff or patients.

---

## CMS (Sanity)

- **Studio:** `/studio`. Staff sign in with a Sanity account (Google, GitHub, or email). Access is managed at [sanity.io/manage](https://www.sanity.io/manage) → project → Members. Give staff the **Editor** role.
- **Content model:** homepage (12 sections in blueprint order), Start Here, About, Team, Resources, For Providers, Book, FAQ pages (singletons); pathways; services/programs; team members; testimonials (hidden unless *written permission on file* is ticked); FAQs; articles; booking options; site settings (contact details, hours, socials, structured-data switch, assistant settings); navigation; legal pages; assistant knowledge.
- **Preview:** Studio → **Preview** tab shows the real site with drafts and click-to-edit. Visitors can't enable this: it requires a short-lived secret issued by the Studio.
- **Publishing:** published changes show up straight away once the webhook is configured (see deployment), and within 5 minutes without it.
- Staff guide: [`docs/EDITOR_GUIDE.md`](docs/EDITOR_GUIDE.md).

## Website assistant

- `POST /api/chat`: same-origin only, ≤24 KB bodies, ≤12 turns, ≤800 characters per message. Rate limited (10 per 5 min, 60 per day per hashed IP).
- **Grounding:** each question retrieves the most relevant **published** CMS content (pathways, services, team, FAQs, articles, booking options, contact details, *Assistant knowledge* entries) with a lightweight BM25 ranker. It's wrapped in `<approved_site_content>` and treated as data, not instructions. Drafts are unreachable: the client has no token, and queries also filter drafts out.
- **Safety:** possible emergencies get 911/988 guidance immediately, without calling the model. Insurance and member IDs, dates of birth, emails, phone numbers and card-like numbers are redacted before anything leaves the server. The prompt forbids diagnosis, treatment advice, invented facts, and external links. The UI renders only internal links.
- **Privacy:** conversations aren't stored by IWC. OpenAI requests use `store: false` and a hashed `safety_identifier`. Logs record status, latency and token counts only, never message text.
- **No key = honest fallback:** without `OPENAI_API_KEY`, the panel says the assistant is unavailable and offers phone and email. There are no fake replies.
- Model: `OPENAI_MODEL` (default `gpt-5-mini`, low reasoning effort, 900 max output tokens).

## Forms

Contact (`/book#contact`), provider referral (`/for-providers#refer`) and newsletter (`/resources`) use Server Actions with zod validation, a honeypot, a signed time token, optional Turnstile, and rate limiting. Delivery goes through Resend. Without `RESEND_API_KEY`, forms tell visitors to call or email instead of pretending to send. Message text is scrubbed of IDs and dates before emailing. **No form collects clinical details**; the provider form requires confirming no patient information is included.

## SEO and analytics

Per-page titles, descriptions, canonicals and Open Graph come from CMS fields. There's an XML sitemap (published pages only) and robots rules (indexing is blocked everywhere — robots.txt plus an `X-Robots-Tag: noindex` header — until `SITE_INDEXABLE=true` is set at launch; `/studio` and `/api` are never indexed). JSON-LD covers Chiropractor (behind a CMS switch), BreadcrumbList, Article and Person. There's a full **301 redirect map** from every URL in the current Wix sitemap (`next.config.ts`).

Analytics events (GA4 via `NEXT_PUBLIC_GA_MEASUREMENT_ID`): `start_here_select`, `start_here_next_step`, `book_click`, `phone_click`, `email_click`, `contact_submit` (form + status), `resource_view`, `resource_next_step`, `chat_open`, `chat_message` (turn number only), `chat_link_click`. **No event includes form or chat content.**

## Security

Secrets are server-only. The test suite scans the client bundle and HTML for every secret. Draft mode requires a Studio-issued secret. The revalidation webhook requires a valid signature. Headers include `nosniff`, `frame-ancestors 'self'`, HSTS and `Referrer-Policy`, and `X-Powered-By` is removed. JSON-LD is escaped. Rich text renders through Portable Text (no raw HTML).

`npm audit` reports advisories in **Sanity Studio's build-time tooling** (`undici`, `uuid` via module-federation/typeid). The only "fix" offered downgrades Sanity to v5. These packages don't run in the public site's request path. Re-check on each Sanity release.

## Deployment

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md): Vercel project, environment variables, domain, Sanity CORS + webhook, Upstash, Resend, GA4, Search Console, and the launch checklist.

## Maintenance

- Dependencies: `npm outdated`, then update Next/Sanity together and run `npm run check && npm run build && npm run test:e2e`.
- Content changes never need a developer. Structural changes (new page types, new fields) go in `src/sanity/schemaTypes` and need a deploy.
- Back up content with `npx sanity dataset export production backup.tar.gz` (monthly, or before large edits).

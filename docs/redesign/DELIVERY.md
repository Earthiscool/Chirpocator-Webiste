# IWC visual rebuild delivery

The application is rebuilt across the homepage, four pathways, six services, Start Here, About, Team and individual profiles, Resources and articles, professional contact, booking, FAQ, footer and legal pages. This is a review build. Clinical photography, content approval, and production integrations remain incomplete.

Branch: `codex/iwc-visual-rebuild`. The final commit is reported in the delivery message and can be retrieved with `git rev-parse HEAD`. Repository baseline and remote main were `0bd3ef23f977d424403fe9f29776f1978adfcae1`. The original checkout and the existing server on port 3000 were preserved; work lives in the isolated `iwc-rebuild` clone. The live website was inspected separately. Its deployed commit was not conclusively identified.

## Run and review

The local production review is served at **http://localhost:3100**. It is a local server, not a Vercel preview deployment. Nothing was deployed to production.

From `/Users/agastyabhadani/Documents/ChatGPT/Chiropractor/iwc-rebuild`:

```sh
npm ci
npm run build
npm run start -- --port 3100
```

For further editing, stop the production server and run `npm run dev -- --port 3100`. The existing, ignored `.env.local` contains only public Sanity project/dataset configuration, the local canonical URL, and `IWC_REDESIGN_REVIEW=true`. To reproduce that file on another machine, use `.env.example`, set the public project ID to `xtyxg1gp`, dataset to `production`, local site URL to `http://localhost:3100`, and the review flag to `true`. Do not run the seed script.

The review flag applies `content/redesign-review.json` after published CMS fetches. This file contains proposed editable content deltas, not approved clinical copy. Authenticated Sanity draft mode continues to show actual CMS drafts instead of the local layer. The local layer is disabled on Vercel production and never enters assistant retrieval. With the flag off, existing published content remains the source of truth. Preview canonicals use the preview host; indexing stays blocked for review builds and previews.

## What changed

- The hero introduces Dr. Jenn immediately using her actual interim CMS portrait. The constellation, decorative image slots and orbital CTA artwork are absent from the presentation. Type, radii, spacing and action hierarchy are centralized; practical headings use Hanken Grotesk and display serif is reserved for introductions.
- All twelve homepage sections remain in order with distinct weights: human introduction, trust row, open recognition, focused narrative, four decisions, compact five-step process, practitioner story, compact factual proof, linked care categories, first-visit details, editorial resources and a single invitation.
- Pain recognition moves into its introduction. Performance adds editable mobility/stability/strength explanations. Prevention opens on active living. Functional Health presents consultation, labs and Holobiome as separate choices. Contextual photo fields work without showing blank panels when photographs are missing.
- Service pages retain their full explanation, fit, scope, boundaries, expectations, FAQs and next action. Headings are editable and specific. Golf begins with assessment priorities; massage features Amie. Owner and visit details are visible. Labs separate ordering information from interpretation. Related services require an explicit selection and patient-relevant reason.
- Booking becomes an open visit directory. Real phone/email links remain across all six categories. Provider-profile requests carry the practitioner's name into the booking request. No scheduler, calendar or confirmation was invented. Unconfirmed fees and appointment lengths are omitted from review copy; original CMS values remain intact for approval.
- Start Here retains URL state, selection, two or three destinations, focus and Back. Before JavaScript loads, it offers direct pathway links. FAQ practical answers now precede philosophy. Resources show real publication dates and honest IWC attribution; reviewer/source fields are supported without assigning a false reviewer.
- Essential content is visible in the server response. Images retain crop/hotspot, responsive sizing, reserved dimensions, accurate proposed alt text and a descriptive failure fallback. Menus, form error focus, accordions and mobile actions are preserved.
- The assistant uses published settings and knowledge even with preview cookies. Production activation requires approval plus durable rate limiting. Input, total request timeout, token and streamed output limits remain bounded. Unknown/error paths retain useful contact actions, and no green active indicator is shown. Missing form signing setup now reports unavailable instead of falsely blaming an expired form. Unauthorized preview/webhook requests reject cleanly.

## Evidence and actual checks

See [requirements matrix](REQUIREMENTS.md), [browser gallery](evidence/GALLERY.md), [capture manifest](evidence/manifest.json), [performance measurements](PERFORMANCE.json), [CMS read check](CMS_READ_CHECK.json) and command logs below.

Before screenshots were taken from the live website; after screenshots are from this local review build. Full-page screenshots can be large, so review the first viewport and deeper sections separately.

| Evidence | Before | After |
|---|---|---|
| Desktop, 1280 px | [Homepage](evidence/before-home-1280.png) | [Homepage](evidence/after-home-1280.png) |
| Mobile, 375 px | [Homepage](evidence/before-home-375.png) | [Homepage](evidence/after-home-375.png) |

The browser capture covers 25 route examples at 375, 768, 1280 and 1600 px, including every pathway and service, all three profiles, FAQ, forms, resources/article, legal and a 404. An initial visual pass was followed by refinement of mobile portrait framing, light newsletter contrast, footer density, navigation/action styling, practical details and loading/error fallbacks. The final capture repeats the refined production render. A 90-second comprehension review by an unfamiliar human remains a client acceptance step; no usability-study result is claimed.

| Command | Result / evidence boundary |
|---|---|
| `npm ci` | Completed; dependencies match lockfile. Node v25.9.0 emitted an engine warning for nanoid. No dependency upgrade was made. |
| `npm run check` | Passed TypeScript and ESLint with no warnings; [check log](check.log). |
| `npm run build` | Passed optimized Next 16.3.8 production build; [build log](build.log). A Node local-storage warning is environmental; no application build error. |
| `npm run test:e2e` | **94 passed (42.8 seconds)**; final result in [test log](e2e.log). Existing behavioral checks retained; the obsolete Functional Health headline assertion was updated. Added all four selector branches, no-JS content, provider ownership/request continuity, production assistant gating, output/error fixtures, and image failure. |
| `node scripts/redesign-evidence.mjs` | Four-width production capture and image/overflow/network/console inventory; [capture log](evidence/capture.log). |
| `node scripts/redesign-performance.mjs` | Actual local Chromium navigation/LCP/CLS observations. Cold browser cache, warm application cache, no throttling. These are not Lighthouse scores or field Core Web Vitals. |
| `node --env-file=.env.local scripts/rebuild-drafts.mjs` | Read-only migration plan, [plan](CMS_PLAN.json). No draft creation or publication. |
| Public CMS revision comparison | All 59 published records unchanged from the saved baseline. This verifies reads and preservation, not editor workflows. |
| `git diff --check` | Whitespace check before commit. |

Tests read the real public Sanity dataset and exercise real local production application routes. OpenAI Responses, Resend email and newsletter APIs are **local mocks** on port 4010, with test-only keys and example.test identities. Recorded mock requests verify grounding, identifier removal, server-only keys, bounds, useful links, errors and unavailable states. Unknown/unsupported responses are authored fixtures; they do not establish real model accuracy. No real email was sent, no real subscriber enrolled, and no live AI answer was obtained. Real CMS draft/publish/revise/unpublish, scheduler completion, shared Redis behavior, inbox delivery and GA4 event receipt are unverified because their authorized configuration was unavailable.

## Reversible CMS support

Only optional schema fields were added: contextual assessment/clinic photos, page-specific headings, category links, explicit related-service selection/reason, movement principles, separate service choices, article reviewer/date/sources, and internal editorial approval records. Existing IDs, slugs, references and image crop/hotspot data remain intact. Missing approval metadata does not change existing publication state.

`rebuild-drafts.mjs` defaults to a read-only plan. With an editor token, `--apply-drafts` creates new drafts only, copies the existing published records, deep-merges reviewed deltas, and records a backup. It refuses to overwrite any existing draft and uses atomic `create` operations to protect concurrent edits. It never publishes or replaces a published document. `--rollback=<backup>` removes only newly created drafts whose revisions are unchanged, preserving subsequent client edits. Neither mutation mode was executed. Review the plan with the client before supplying a write token. Do not use the older general workflow test against existing client records.

The authentic staff-editor workflow still needs a Sanity viewer token, editor access and revalidation setup. Use an isolated disposable test record; demonstrate draft invisibility publicly and to chat, authenticated preview, publish, revise and unpublish, then restore/remove only that test record.

## Exact assets and approvals still needed

No clinical, movement, golf, functional-consultation, clinic/exterior, article or official logo assets were present in the public dataset. Three casual portraits were present and inspected. They are interim identity assets, not treatment photographs; usage rights and approval still need confirmation. The photographic identity is incomplete.

| Needed asset | Intended field/use and crop |
|---|---|
| Candid Dr. Jenn encounter | `homePage.heroImage`: square desktop / 4:3 mobile. Deliver at least 2400 px with both subjects inside the safe center; approved patient consent. |
| Dr. Jenn portrait and assessment | Coherent 4:5 portrait at least 1600 × 2000 for `provider.photo` and About; assessment 5:3 for `homePage.reframeImage`. |
| Pain assessment | Pathway `heroImage` 5:4; `approachImage` 4:3. Actual IWC assessment, including the relevant clinician. |
| Athlete/movement and golf assessment | Performance and Golf `heroImage` 5:4; contextual rotation/movement 4:3. No unrelated athlete or course presented as IWC work. |
| Capable adults doing everyday activity | Prevention `heroImage` 5:4 / contextual 4:3, varied ages with consent, no alarmist before/after framing. |
| Functional-health interpretation | Functional pathway, labs and Holobiome consultation images 5:4 / 4:3. No legible patient results or invented programme scenes. |
| Coherent team portraits | Dr. Jenn, Dr. Irene and Amie: 4:5 source portraits, plus a square-safe crop for massage introduction. Consistent setting, light and accurate individual alt text. |
| Appropriate care details | Chiropractic, massage and scar evaluation: 4:3 contextual work and 5:4 hero where used. Consent, comfort and actual provider ownership; no dramatic scar outcome image. |
| Clinic and Wayne exterior | `siteSettings.clinicImage` on Book/Contact: 5:3, at least 2000 × 1200, actual approved location. |
| Three resource images | `article.mainImage`: 16:9 article and 5:2 list crop; genuine subject context after clinician review. |
| Official logo | Approved SVG, current crown vs wave decision, usage rules and light/dark variants. Text fallback remains until supplied. |

Client/clinical decisions: approve all revised review copy; exact experience and regulated credentials (including nutrition and sports titles); provider roles; provisional palette and fonts; process terminology; Body Blueprint Scan description/scope; fatigue/fine-results language; Holobiome phases, deliverables, GLP-1 boundaries and programme fee; current visit fees/lengths; email/NAP, hours, parking, payment/insurance, cancellation and forms. Review the existing long-form claims and legal templates before launch. Existing articles need genuine author/reviewer assignment, review dates and sources for research claims. Proof needs patient permissions or dated recognition evidence. Memberships, giveaways and discounts remain unresolved ideas and are not implemented.

## Exact configuration still needed

- Approved scheduler destination and provider/visit ownership for each of six booking categories. Until then phone/email requests remain the real action.
- Sanity read token for authenticated preview; authorized editor membership/write access for isolated workflow checks; webhook shared secret and registered endpoint; named account/maintenance owner.
- Server-side OpenAI key and model/configuration approval, `IWC_ASSISTANT_APPROVED=true`, Upstash URL/token, and a private rate-limit salt. Confirm data handling and test real grounding, unknowns, unsupported claims, links, timeouts and outages before activation. No values should be sent in chat or committed.
- Resend key, verified sender, confirmed general and professional inbox owners, private form-signing secret, and newsletter audience/consent/subscription-management configuration. Optional Turnstile site/secret keys must be paired. Perform authorized test delivery only to a designated test inbox/audience.
- Practice-approved secure clinical referral channel. The current provider form is ordinary professional contact, not clinical intake.
- Approved production canonical domain and launch indexing decision. GA4 ID/access and an authorized conversion-event receipt test. No analytics connection or field performance result is claimed.

These dependencies do not block reviewing the implemented code and layout. They do block describing the site as ready for clinical production launch.

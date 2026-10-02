# Client approval checklist

Everything on the site today is **working copy**. It's grounded in the Brand Strategy Brief, the Build Blueprint (including Dr. Jenn's handwritten notes), and facts already published on iwcmainline.com. The items below need IWC's confirmation before launch. Most can be changed by staff in the CMS (`/studio`) without a developer.

Legend: 🔴 blocks launch · 🟠 should be resolved before launch · 🟢 can follow launch

---

## 1. Brand

| | Item | What we did | What we need |
|---|---|---|---|
| 🔴 | **Official brand colors** | Both documents say official HEX/RGB/CMYK values are "to be inserted by brand owner." Provisional navy `#0B1F4A`, teal `#3F948A` / `#2E7068`, gold `#C9A673` / `#765524` and sky `#A8D4F8` were **sampled from the current website logo** and adjusted to pass WCAG AA contrast. They're defined in one place: `src/app/globals.css`. | Official values. The swap is a 10-minute change. |
| 🔴 | **Orange CTA** | Dr. Jenn's handwritten notes say "orange button" and "orange for CTA" twice. "Book a Visit" uses provisional orange `#C24E18` (white text passes AA at 4.8:1). Orange is used *only* for booking. | Confirm, or supply the exact orange. |
| 🔴 | **Logo** | The brief describes a "three-point gold crown" logo, but the current site uses a wave-in-circle mark. Until official files arrive, the header uses a typographic wordmark. | Official logo files (SVG preferred) and which mark is current. Upload in **Contact details & settings → Brand → Logo**. |
| 🟠 | **Fonts** | Handwritten note: "Fonts." Provisional pairing: **Newsreader** (editorial display, with optical sizes) + **Hanken Grotesk** (body). Both are free Google Fonts. | Approve, or name licensed brand fonts. |

## 2. Facts that conflict between sources

| | Item | Conflict | Site currently says |
|---|---|---|---|
| 🔴 | **Years of experience** | The brief and blueprint say "25+ years"; Dr. Jenn's current bio says "nearly two decades"; the current homepage says "over 50 years of experience" (combined?). | "More than 25 years across health, sports medicine, manual therapy, nutrition, movement, and performance" (blueprint wording). |
| 🔴 | **"Dietitian" credential** | Listed on the current site and on LinkedIn. "Dietitian" can be a regulated title. | Listed under *Nutrition → Dietitian*. Confirm exact credential (e.g. RD/LDN) and state licensure. |
| 🟠 | **"Certified Chiropractic Sports Provider"** | LinkedIn says "ICCSP." | "Certified Chiropractic Sports Provider." Confirm exact credential. |
| 🟠 | **Division 1 background** | The blueprint's About story arc mentions "D1 athletic background." It's unclear whether this is Dr. Jenn's own background. | Not stated as hers. Only her commitment to young athletes aiming for D1 (from the current bio). |
| 🟠 | **Amie Hamel's title** | The current site says "Founder & Licensed Massage Therapist" and "Practice Manager." | "Lead Massage Therapist & Practice Manager." Confirm whether "Founder" should appear. |
| 🟠 | **Practice email** | Bio pages show `info@iwcmain-line.com` (hyphen); the footer shows `info@iwcmainline.com`. | `info@iwcmainline.com`. Confirm. |
| 🟠 | **Address / NAP** | "123 Bloomingdale Ave, Suite 302, Wayne, PA 19087" appears on every current page but couldn't be independently confirmed online. | Used in the footer, contact page and business structured data. Confirm it matches the Google Business Profile exactly. Structured data can be switched off in **Settings → SEO**. |

## 3. Handwritten edits applied, please confirm

These came from Dr. Jenn's annotations in the Build Blueprint and have been implemented:

- "Dry Needling" removed everywhere. "Body Blueprint Scan" added as a Pain + Recovery tool. **🔴 We need a one-line description of Body Blueprint Scan**; it currently appears as a name only.
- "Postural assessment" added to the Performance pathway (athlete row).
- Functional Health opens with "Tired of being tired for no reason?" and includes "I'm told I'm fine. So why do I feel bad?"
- "Primary Jobs to Be Done" renamed to **"The benefits of choosing IWC"** (About page).
- For Providers audience adds **concierge physicians** and **agents for professional athletes**.
- Notes used in copy: "Pain is only part of the story," "Start understanding why, stop chasing," "We treat based on your goals, not our bottom line," "Depth without the disconnect," "Trusted for thoughtful, personalized care," "Ready to understand what your body has been trying to tell you?," "curated / high touch & individualized care."
- FAQ topics from the handwritten list: new-patient appointment, who do I work with, recurring problems / do I have to come back, gut restoration, how to schedule.
- **Process steps:** the blueprint has five steps (Listen → Assess → Connect the dots → Build the plan → Measure progress). The handwritten page suggests "Listen/Understand → Assess/Connect → Build a better way" and "Understand / Restore / Build / Thrive." The site uses the blueprint's five steps. **🟠 Choose one.** It's editable in the CMS (Homepage → 6 · How care works).
- **"Several opportunities to book or call"** (handwritten) vs. blueprint's "one primary CTA per block": reconciled with a persistent header Book button, a persistent mobile Call / Ask / Book bar, and one primary CTA per section.

## 4. Open questions from the handwritten notes (not implemented)

- 🟠 **Prevention membership.** The handwritten notes ask whether to offer one (with possible product discounts and a monthly check-in). Not published. Decide on offer, terms and price.
- 🟠 **Newsletter lead magnet** ("free something given when they sign up"). Sign-up form is built. Decide what's offered.
- 🟢 A name written on the FAQ notes page. Unclear; not used.

## 5. Proof and testimonials

- 🔴 **No testimonials are published.** The current site's "Emily / Bob / Tom" quotes look like template filler and weren't reused. The homepage handwriting lists five patient names as candidates; we haven't put any names in the code or the CMS. To add one: **Testimonials → +**, paste the patient's own words, and tick **Written permission on file**. Untick it and the quote is hidden.
- 🟠 **Awards** (Main Line Parent / Best Chiropractor / Best Sports Chiropractor / Family Favorite). Listed in the brief, but year, publication and approved logos aren't provided. Not shown.
- 🟠 **Referral-trust claims.** "Trusted by physicians, neurosurgeons, and orthopedists" and "professional athletes in baseball, basketball, football, golf, cycling, and triathlon" come from Dr. Jenn's current bio. Confirm they can stay. Named organizations would need permission.

## 6. Photography

- 🔴 Only casual headshots exist (taken from the current site and uploaded to the CMS as interim images). The design has art-directed **image slots** for hero, pathways, services, articles and team. They show a quiet graphic, never stock people presented as IWC.
- Schedule the half-day brand shoot (blueprint shot list: Dr. Jenn listening, movement assessment, non-aggressive hands-on work, golf rotation, athlete return-to-movement, functional-health conversation, team portraits, Wayne exterior, detail shots).
- Confirm consent for any patient who appears.

## 7. Scheduling, pricing, policies

- 🔴 **Online booking links.** The current booking pages are Wix Bookings and will stop working when the domain moves off Wix. Every visit type on `/book` currently shows **Call to book / Request by email**. Paste the real scheduling URL for each visit type in **Booking options**. Nothing is invented.
- 🔴 **Prices** shown on service and booking pages are copied from the current booking pages (New patient $175–275, Follow-up $75–140, Massage initial $150, Athlete evaluation $150–250, Holobiome program $1,997). Confirm they're current. Durations and fees for **Performance/Golf Evaluation** and **Functional Health Consultation** are unknown and left blank.
- 🔴 **Insurance / payment positioning.** The FAQ says "contact the office." Supply approved language.
- 🟠 Hours, parking and arrival details, cancellation policy, new-patient forms. Fields exist in **Contact details & settings**; they stay hidden until filled.
- 🟠 Fullscript dispensary link and Journeys lab-ordering link (not found on the current site).
- 🟠 Holobiome page: the current site's GLP-1 messaging was softened to one recognition line ("Using, considering, or stopping a GLP-1 medication…"). An FDA-style disclaimer was added. Please review.
- 🟢 "Dr. Jenn's Favorites" Amazon list and the old Wix store/"news" product pages are retired and redirected. Decide whether a curated resource page returns in Phase 2.

## 8. Legal and privacy

- 🔴 **Privacy, Terms, Accessibility and Disclaimer pages are drafts** (CMS status "draft-template"). They need practice/legal review. The privacy text describes the forms, analytics and assistant accurately as built.
- 🔴 **HIPAA / PHI review.** Marketing forms collect no clinical details. The provider form explicitly forbids patient information. A **secure referral method** (secure fax, patient portal, or HIPAA-compliant form vendor with a BAA) still needs choosing.
- 🔴 **Website assistant data handling.** Conversations aren't stored by IWC. Requests use `store: false`, and identifiers are redacted before sending. OpenAI's data-processing terms and any BAA need assessing before the assistant handles anything beyond general questions. The assistant isn't presented as HIPAA-compliant.
- 🟠 Testimonial and photo release forms.

## 9. Articles

- 🟠 Three flagship articles (back pain recurrence, mobility vs. stability for golf, which labs are useful) are written in the blueprint voice and published **without an author byline** ("IWC"). Dr. Jenn should review and approve before her name is attached (**Articles → Author**).

## 10. Accounts and ownership

- 🔴 The Sanity project "IWC Website" (`xtyxg1gp`) was created in the web team's Sanity organization. Invite IWC staff as **Editors** (sanity.io/manage → Members), and decide whether to transfer the project to an IWC-owned organization.
- 🔴 Production accounts IWC should own: domain/DNS, Vercel (hosting), OpenAI, Resend (email), Upstash (rate limiting), Google Analytics 4, Google Search Console, Google Business Profile.
- 🟠 Final approvers and content owner (brief §16–17 were left blank).

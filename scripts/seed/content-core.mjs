// Seed content: settings, navigation, booking options, team, pathways, services.
// Sources: IWC Brand Strategy Brief, IWC Build Blueprint (incl. Dr. Jenn's
// handwritten edits), and facts published on www.iwcmainline.com (Sept 2026).
// Everything here is WORKING COPY for practice approval — see docs/CLIENT_APPROVAL_CHECKLIST.md.
import {cta, ctaRef, h3, items, key, keyed, pt, ref, ref1, seo, ul} from './pt.mjs'

const PHONE = '610-298-5873'

/* ------------------------------------------------------------------ settings */
export const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  practiceName: 'Integrative Wellbeing & Chiropractic',
  shortName: 'IWC',
  brandLine: 'Pain | Performance | Prevention',
  phone: PHONE,
  phoneE164: '+16102985873',
  email: 'info@iwcmainline.com',
  address: {street: '123 Bloomingdale Ave', suite: 'Suite 302', city: 'Wayne', region: 'PA', postalCode: '19087'},
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=123+Bloomingdale+Ave+Suite+302+Wayne+PA+19087',
  hours: [],
  socials: keyed([
    {_type: 'social', label: 'Instagram', url: 'https://www.instagram.com/iwcmainline/'},
    {_type: 'social', label: 'Facebook', url: 'https://www.facebook.com/people/Integrative-Wellbeing-Chiropractic/61572432279177/'},
    {_type: 'social', label: 'Substack', url: 'https://substack.com/@thewellbeingfix'},
  ]),
  publishStructuredData: true,
  defaultSeo: seo(
    'Integrative Wellbeing & Chiropractic | Wayne, PA',
    'Whole-person, evidence-informed care for pain, performance, and prevention in Wayne, PA on the Philadelphia Main Line.',
  ),
  clinicalDisclaimer:
    'Information on this website is general education, not medical advice. It does not create a patient relationship or replace an individual evaluation. In an emergency, call 911.',
  assistantEnabled: true,
  assistantWelcome:
    'Welcome to IWC. I can help you explore our approach, find information about services, or choose a starting point. What would you like to know?',
  assistantSuggestions: [
    "I'm not sure which service I need. Where do I start?",
    'What happens at a first visit?',
    'Do you work with golfers?',
    'How do I book an appointment?',
  ],
  assistantNotice:
    "I share general information about IWC and can't give medical advice. Please don't enter personal health details, insurance numbers, or other sensitive information.",
}

/* ---------------------------------------------------------------- navigation */
export const navigation = {
  _id: 'navigation',
  _type: 'navigation',
  bookLabel: 'Book a Visit',
  main: keyed([
    {_type: 'navItem', label: 'Start Here', href: '/start-here'},
    {
      _type: 'navItem',
      label: 'How We Help',
      href: '/how-we-help',
      children: keyed([
        {_type: 'navLink', label: 'Pain + Recovery', href: '/how-we-help/pain-recovery', description: 'Something hurts, keeps coming back, or limits what you can do.'},
        {_type: 'navLink', label: 'Performance', href: '/how-we-help/performance', description: 'Move, train, golf, or compete with fewer limitations.'},
        {_type: 'navLink', label: 'Prevention + Active Aging', href: '/how-we-help/prevention-active-aging', description: 'Stay ahead of the next problem and keep doing what you love.'},
        {_type: 'navLink', label: 'Functional Health', href: '/how-we-help/functional-health', description: 'A clearer plan for nutrition, labs, gut health, and recovery.'},
      ]),
    },
    {
      _type: 'navItem',
      label: 'About',
      href: '/about',
      children: keyed([
        {_type: 'navLink', label: 'Dr. Jenn', href: '/about', description: 'Clinical story, philosophy, and approach.'},
        {_type: 'navLink', label: 'Team', href: '/team', description: 'The practitioners of the IWC collective.'},
        {_type: 'navLink', label: 'FAQ / What to Expect', href: '/faq', description: 'Your first visit, scheduling, and logistics.'},
      ]),
    },
    {_type: 'navItem', label: 'Resources', href: '/resources'},
    {_type: 'navItem', label: 'For Providers', href: '/for-providers'},
  ]),
  footerGroups: keyed([
    {
      _type: 'footerGroup',
      title: 'How we help',
      links: keyed([
        {_type: 'navLink', label: 'Start Here', href: '/start-here'},
        {_type: 'navLink', label: 'Pain + Recovery', href: '/how-we-help/pain-recovery'},
        {_type: 'navLink', label: 'Performance', href: '/how-we-help/performance'},
        {_type: 'navLink', label: 'Prevention + Active Aging', href: '/how-we-help/prevention-active-aging'},
        {_type: 'navLink', label: 'Functional Health', href: '/how-we-help/functional-health'},
      ]),
    },
    {
      _type: 'footerGroup',
      title: 'Services & programs',
      links: keyed([
        {_type: 'navLink', label: 'Chiropractic & Sports Chiropractic', href: '/services/chiropractic-sports-chiropractic'},
        {_type: 'navLink', label: 'Golf Performance', href: '/services/golf-performance'},
        {_type: 'navLink', label: 'Therapeutic Massage', href: '/services/therapeutic-massage'},
        {_type: 'navLink', label: 'Scar Release + Functional Restoration', href: '/services/scar-release-functional-restoration'},
        {_type: 'navLink', label: 'Holobiome Gut Restoration', href: '/services/holobiome-gut-restoration'},
        {_type: 'navLink', label: 'Direct Access Lab Testing', href: '/services/direct-access-lab-testing'},
      ]),
    },
    {
      _type: 'footerGroup',
      title: 'Practice',
      links: keyed([
        {_type: 'navLink', label: 'About Dr. Jenn', href: '/about'},
        {_type: 'navLink', label: 'Team', href: '/team'},
        {_type: 'navLink', label: 'Resources', href: '/resources'},
        {_type: 'navLink', label: 'FAQ / What to Expect', href: '/faq'},
        {_type: 'navLink', label: 'For Providers', href: '/for-providers'},
        {_type: 'navLink', label: 'Book a Visit', href: '/book'},
      ]),
    },
  ]),
}

/* ----------------------------------------------------------- booking options */
// Entry points from the Blueprint's "Scheduling page entry points" table.
// Durations/prices are from the current booking pages on iwcmainline.com.
// bookingUrl is intentionally EMPTY: the existing links are Wix Bookings pages
// that will not survive the platform move. The site falls back to call/email.
export const bookingOptions = [
  {
    _id: 'booking-new-patient',
    label: 'New Patient Comprehensive Evaluation',
    situation: 'A new pain or musculoskeletal problem',
    description: 'History, assessment, a clear explanation, and treatment when appropriate.',
    duration: 'About 60 minutes',
    priceNote: '$175–275',
    audience: 'new',
    order: 1,
  },
  {
    _id: 'booking-athlete',
    label: 'Athlete Injury Evaluation',
    situation: 'A sports injury or athlete assessment',
    description: 'For athletes of any level who want to understand an injury and plan a return to sport.',
    duration: 'About 60 minutes',
    priceNote: '$150–250',
    audience: 'new',
    order: 2,
  },
  {
    _id: 'booking-performance',
    label: 'Performance or Golf Evaluation',
    situation: 'Golf, movement, or performance goals',
    description: 'A movement assessment built around your sport, training, or golf game.',
    audience: 'new',
    order: 3,
  },
  {
    _id: 'booking-functional',
    label: 'Functional Health Consultation',
    situation: 'Functional health, gut health, or labs',
    description: 'Talk through symptoms, goals, nutrition, and any existing lab results.',
    audience: 'new',
    order: 4,
  },
  {
    _id: 'booking-massage',
    label: 'Therapeutic Massage — Initial Visit',
    situation: 'Therapeutic massage',
    description: 'Includes a short assessment so the session is focused where it helps most.',
    duration: 'About 60 minutes',
    priceNote: '$150',
    audience: 'new',
    order: 5,
  },
  {
    _id: 'booking-existing',
    label: 'Existing Patient Visit',
    situation: "I'm already an IWC patient",
    description: 'Follow-up care and reassessment.',
    duration: 'About 30 minutes',
    priceNote: '$75–140',
    audience: 'existing',
    order: 6,
  },
].map((o) => ({_type: 'bookingOption', ...o}))

/* ---------------------------------------------------------------------- team */
export const providers = [
  {
    _id: 'provider-jenn-hartmann',
    _type: 'provider',
    name: 'Dr. Jenn Hartmann',
    slug: {_type: 'slug', current: 'dr-jenn-hartmann'},
    credentials: 'DC',
    role: 'Chiropractic Physician · Sports Chiropractic & Functional Health',
    headline: 'Connects the dots across pain, movement, recovery, and nutrition — then gives you a plan you understand.',
    order: 1,
    bio: pt(
      'Dr. Jennifer Hartmann is a Pennsylvania board-certified chiropractic physician whose work spans more than 25 years across health, sports medicine, manual therapy, nutrition, movement, and performance.',
      'Many patients call her "the fixer." She sees herself as a facilitator: helping people understand the why behind their pain and limitations, and giving them the tools to move more often, with more ease, on a foundation of strength and resilience.',
    ),
    bestFit: [
      'Recurring or complicated pain — the "I have tried everything" cases',
      'Athletes, from young competitors to professionals',
      'Golfers who want comfort and longevity in the game',
      'Active professionals and executives who are short on time',
      'People who want functional health guidance that stays practical',
    ],
    approach:
      'Listen first. Assess what matters. Explain it plainly. Build a plan around your goals — and refer when someone else is the better next step.',
    services: [
      ref('service-chiropractic'),
      ref('service-golf'),
      ref('service-scar'),
      ref('service-holobiome'),
      ref('service-labs'),
    ],
    credentialGroups: keyed([
      {_type: 'credentialGroup', label: 'Education', items: ['Doctor of Chiropractic — National University of Health Sciences', "Bachelor's degree in Human Anatomy — National University of Health Sciences"]},
      {_type: 'credentialGroup', label: 'Licensure', items: ['Pennsylvania board-certified chiropractic physician', 'Licensed Massage Therapist']},
      {_type: 'credentialGroup', label: 'Sports & movement', items: ['Certified Chiropractic Sports Provider', 'Functional Movement Specialist', 'Golf Fitness Instructor']},
      {_type: 'credentialGroup', label: 'Nutrition', items: ['Dietitian']},
      {
        _type: 'credentialGroup',
        label: 'Athletes',
        items: [
          'Professional athletes in baseball, basketball, football, golf, cycling, and triathlon',
          'Top-level amateurs in tennis, squash, and golf',
        ],
      },
    ]),
    personal:
      'Her love of sport started at five years old. She is especially invested in young athletes — helping them reduce injuries, improve performance, and pursue their goals, including competing at the Division 1 level.',
    bookingOption: ref1('booking-new-patient'),
    seo: seo(
      'Dr. Jenn Hartmann | Sports Chiropractor & Functional Health',
      'Dr. Jenn Hartmann connects pain, movement, recovery, and nutrition into one practical plan. Sports chiropractic, golf performance, and functional health in Wayne, PA.',
    ),
  },
  {
    _id: 'provider-irene-londer',
    _type: 'provider',
    name: 'Dr. Irene Londer',
    slug: {_type: 'slug', current: 'dr-irene-londer'},
    credentials: 'DC',
    role: 'Chiropractic Physician & Myofascial Release Specialist',
    headline: 'Listens closely, works gently, and helps patients get unstuck from long-standing pain patterns.',
    order: 2,
    bio: pt(
      'Dr. Irene Londer has spent 25 years helping patients move past pain and return to work, home, and activity with more ease. Her interest in natural, whole-body care began early, volunteering in hospitals, nursing homes, and pain management practices.',
      'She graduated from Temple University and earned her Doctor of Chiropractic cum laude from Pennsylvania Chiropractic College in 1995, and has cared for patients in South Philadelphia, King of Prussia, and Devon.',
    ),
    bestFit: [
      'Long-standing pain patterns',
      'Patients who prefer a gentle approach',
      'Myofascial pain and restriction',
      'People who want tools to keep their progress at home',
    ],
    approach:
      'Her care starts with listening and working collaboratively. She uses gentle spinal manipulation, soft-tissue techniques, and individual strategies — functional exercise, postural corrections, and nutritional guidance — to help patients reduce pain, restore mobility, and keep their progress.',
    services: [ref('service-chiropractic')],
    credentialGroups: keyed([
      {_type: 'credentialGroup', label: 'Education', items: ['Temple University', 'Doctor of Chiropractic, cum laude — Pennsylvania Chiropractic College (1995)']},
      {_type: 'credentialGroup', label: 'Professional memberships', items: ['Pennsylvania Chiropractic Association', 'American Chiropractic Association']},
    ]),
    personal: 'She lives in Collegeville, PA, with her husband and children.',
    bookingOption: ref1('booking-new-patient'),
    seo: seo('Dr. Irene Londer, DC | Chiropractic & Myofascial Release | IWC Wayne', 'Gentle chiropractic and myofascial care for long-standing pain patterns, with Dr. Irene Londer at IWC in Wayne, PA.'),
  },
  {
    _id: 'provider-amie-hamel',
    _type: 'provider',
    name: 'Amie Hamel',
    slug: {_type: 'slug', current: 'amie-hamel'},
    credentials: 'LMT',
    role: 'Lead Massage Therapist & Practice Manager',
    headline: 'Finds where tension is coming from and works there — with more than 20 years of hands-on experience.',
    order: 3,
    bio: pt(
      "Amie has practiced massage therapy for more than 20 years. She is IWC's lead massage therapist and practice manager.",
      'Her individual assessments and focused technique help people find sustained relief from pain and live with more balance.',
    ),
    bestFit: [
      'Persistent muscle tension and soreness',
      'Athletes in training or recovery',
      'Post-surgical scar and tissue work, once cleared',
      'Prenatal massage',
      'Regular soft-tissue care as part of staying active',
    ],
    approach:
      'Each session starts with an individual assessment. Amie draws on postural assessment, myofascial techniques, scar work, trigger point therapy, cupping, gua sha, active isolated and assisted stretching, and sports and prenatal massage.',
    services: [ref('service-massage'), ref('service-scar')],
    credentialGroups: keyed([
      {_type: 'credentialGroup', label: 'Licensure', items: ['Licensed Massage Therapist']},
      {
        _type: 'credentialGroup',
        label: 'Training',
        items: ['Postural assessment', 'Myofascial techniques and scar work', 'Trigger point therapy', 'Cupping and gua sha', 'Active isolated stretching', 'Sports and prenatal massage'],
      },
    ]),
    personal: 'Outside the treatment room, Amie enjoys yoga, time with family, and being in nature — and has a well-documented love of coffee.',
    bookingOption: ref1('booking-massage'),
    seo: seo('Amie Hamel, LMT | Therapeutic Massage in Wayne, PA | IWC', 'Therapeutic massage guided by assessment, with more than 20 years of experience. Amie Hamel, LMT, at IWC in Wayne, PA.'),
  },
]

/* ------------------------------------------------------------------ pathways */
const step = (title, body, label, href) => ({_key: key(), _type: 'nextStep', title, body, cta: cta(label, href)})
const tool = (name, description, serviceId) => ({
  _key: key(),
  _type: 'tool',
  name,
  ...(description ? {description} : {}),
  ...(serviceId ? {service: ref1(serviceId)} : {}),
})

export const pathways = [
  {
    _id: 'pathway-pain-recovery',
    title: 'Pain + Recovery',
    slug: {_type: 'slug', current: 'pain-recovery'},
    order: 1,
    accent: 'teal',
    patientVoice: 'Help me understand what keeps coming back.',
    cardSummary: 'Something hurts, keeps coming back, or limits what you can do — and you want a plan, not another temporary fix.',
    startHereExplanation:
      "Start with an evaluation. We'll look at the painful area and the larger movement, tissue, and load picture, explain what seems to matter, and decide together what comes next — including a referral if another specialist is the better step.",
    nextSteps: [
      step('New Patient Comprehensive Evaluation', 'A new or recurring pain, or a problem that has not settled.', 'Book an evaluation', '/book#booking-new-patient'),
      step('Athlete Injury Evaluation', 'A sports injury, or you want to keep training while it is addressed.', 'Book an athlete evaluation', '/book#booking-athlete'),
      step('Ask a question first', 'Surgery, several providers already, or you would like to talk before booking.', 'Contact the office', '/book#contact'),
    ],
    heroHeadline: 'Pain that keeps returning deserves more than another temporary fix.',
    heroIntro:
      'When the same area flares again and again, the painful spot is only part of the story. We assess it in the context of how you move, load, recover, and live — then build a plan around what is relevant to you.',
    recognition: [
      'Back or neck pain that settles, then returns',
      'A sports injury that never quite resolved',
      'Restriction or discomfort after surgery',
      'Foot, knee, hip, or back problems that seem connected',
      'Soft-tissue or fascial tightness that keeps rebuilding',
      'Pain that changes with training, travel, or long days at a desk',
    ],
    approachHeading: 'Look at the painful area — and the bigger picture around it.',
    approach: pt(
      'Pain is real, and it deserves a careful look at where it hurts. But recurring pain is often shaped by more than one thing: how load is distributed, how tissue has adapted after an old injury or surgery, how you recover, and what your days and training actually demand.',
      'Our job is not to chase every theoretical contributor. It is to identify the pieces that are relevant for you, explain them plainly, and choose the next right step — hands-on care, movement work, a change in load, or a referral for imaging or another specialist.',
    ),
    tools: [
      tool('Chiropractic & sports chiropractic', 'Hands-on joint and spinal care, guided by assessment.', 'service-chiropractic'),
      tool('Fascial Manipulation', 'A hands-on method for the connective tissue that links muscles across regions, when it appears to be contributing.'),
      tool('Photobiomodulation (LZ30 laser)', 'Low-level light therapy, used as a supporting recovery tool in some plans.'),
      tool('Therapeutic massage', 'Assessment-led soft-tissue work.', 'service-massage'),
      tool('Scar release', 'For surgical and injury scars that affect movement.', 'service-scar'),
      tool('Orthotics & foot mechanics', 'How the feet contribute up the chain, with orthotic support when it helps.'),
      tool('Body Blueprint Scan'),
      tool('Movement work', 'Targeted exercise so progress continues between visits.'),
    ],
    outcomes: [
      'Return to the activities that matter to you',
      'Fewer recurrences — and knowing what to do when something flares',
      'A clearer picture, including when imaging or a referral makes sense',
      'Better mobility and function in daily life',
    ],
    whatToExpect: items([
      ['A conversation first', "We start with your history, what you've already tried, and what you want to get back to."],
      ['A focused assessment', 'We look at the painful area, and at movement, tissue, and load where they are relevant.'],
      ['A plan you understand', "You'll leave knowing what we think matters, what we're watching, and what happens next."],
    ]),
    faqs: [ref('faq-first-visit'), ref('faq-come-back'), ref('faq-referral'), ref('faq-adjusted')],
    primaryCta: cta('Start With an Evaluation', '/book#booking-new-patient'),
    seo: seo(
      'Pain & Injury Recovery Care in Wayne, PA | IWC',
      'Recurring back, neck, or sports pain? IWC in Wayne, PA looks at the whole picture — movement, tissue, load, and recovery — and builds a practical plan.',
    ),
  },
  {
    _id: 'pathway-performance',
    title: 'Performance',
    slug: {_type: 'slug', current: 'performance'},
    order: 2,
    accent: 'gold',
    patientVoice: 'Help me move, recover, and perform better.',
    cardSummary: "You're not necessarily injured, but you want to move, train, golf, or compete with fewer limitations.",
    startHereExplanation:
      'Performance care starts with how you move and what your sport or training demands. We look at mobility, stability, and strength in that context — and at recovery when it is relevant.',
    nextSteps: [
      step('Performance or Golf Evaluation', 'You want to move, train, or play better, and you are not currently injured.', 'Book a performance evaluation', '/book#booking-performance'),
      step('Golf Performance', 'See how we approach rotation, comfort, and longevity in the game.', 'Explore golf performance', '/services/golf-performance'),
      step('Athlete Injury Evaluation', 'Something is hurt and you want to keep training safely.', 'Book an athlete evaluation', '/book#booking-athlete'),
    ],
    heroHeadline: 'Move better. Recover better. Perform with fewer avoidable limitations.',
    heroIntro:
      'There is a difference between being out of pain and being ready to perform. We help athletes, golfers, and active professionals close that gap with an approach built on movement, tissue quality, load, and recovery.',
    recognition: [
      "Recurring tightness or an asymmetry you can't shake",
      'Returning to sport after an injury and unsure you are ready',
      'A golf swing limited by rotation, stiffness, or discomfort',
      'Training hard but recovering poorly',
      'Performing well — and wanting to keep it that way as you age',
    ],
    approachHeading: 'Mobility creates options. Stability creates control. Strength creates capacity.',
    approach: pt(
      'We assess movement in the context of what you actually do — your sport, your training load, your season, your schedule. Mobility, stability, and strength are built in that order, because each depends on the one before it.',
      'When it is relevant, we also consider tissue quality, recovery, sleep, and fueling. The goal is not a generic program. It is a clear picture of your limitations and a plan to address them.',
    ),
    tools: [
      tool('Sports chiropractic', 'Assessment-led manual care with an understanding of training and return to play.', 'service-chiropractic'),
      tool('Functional movement assessment', 'A structured look at how you move, to find the limitations that matter for your goals.'),
      tool('Postural assessment', 'How you stand, sit, and load — and where that changes under fatigue.'),
      tool('Golf performance', 'Swing-specific mobility, stability, and strength.', 'service-golf'),
      tool('Manual therapy & Fascial Manipulation', 'Hands-on work for restricted tissue and movement.'),
      tool('Recovery support', 'Therapeutic massage and photobiomodulation (LZ30 laser) as supporting tools.'),
      tool('Orthotics & foot mechanics', 'For athletes whose feet are part of the picture.'),
      tool('Nutrition & labs, when relevant', 'Fueling and recovery questions, with testing only when it changes the plan.', 'service-labs'),
    ],
    outcomes: ['Confidence under load', 'More efficient movement', 'A clear return-to-training plan', 'Comfort and longevity in your golf game', 'Resilience through a season or a demanding year'],
    whatToExpect: items([
      ['Movement first', 'We watch how you move and ask what your sport or training requires.'],
      ['Context matters', 'Training history, past injuries, and current load shape the plan.'],
      ['A plan that travels', 'Clear priorities and exercises you can take into your training.'],
    ]),
    faqs: [ref('faq-train-while-injured'), ref('faq-golf-coach'), ref('faq-referral')],
    primaryCta: cta('Book a Performance Evaluation', '/book#booking-performance'),
    seo: seo(
      'Sports Chiropractic & Performance Care in Wayne, PA | IWC',
      'Athletes, golfers, and active professionals: move better, recover better, and perform with fewer limitations. Sports chiropractic and performance care in Wayne, PA.',
    ),
  },
  {
    _id: 'pathway-prevention',
    title: 'Prevention + Active Aging',
    slug: {_type: 'slug', current: 'prevention-active-aging'},
    order: 3,
    accent: 'sky',
    patientVoice: 'Help me stay ahead of the next problem.',
    cardSummary: 'You want to stay active, age well, and catch small problems before they become bigger interruptions.',
    startHereExplanation:
      'Prevention starts with a movement screen and an honest conversation about your goals. We look for small limitations that are adding up and build a plan you can sustain.',
    nextSteps: [
      step('Start with a full picture', 'An evaluation that includes a movement screen and your goals.', 'Book an evaluation', '/book#booking-new-patient'),
      step('Therapeutic massage', 'Regular soft-tissue care as part of a maintenance routine.', 'Explore massage', '/services/therapeutic-massage'),
      step('Already an IWC patient?', 'Book a tune-up or reassessment.', 'Book a follow-up', '/book#booking-existing'),
    ],
    heroHeadline: 'Stay capable for the life you want to keep living.',
    heroIntro:
      "Don't wait for pain to be the only signal that something needs attention. We help active adults build capacity, restore options, and keep doing what they love — with a plan they can sustain.",
    recognition: [
      'Small limitations that seem to be adding up',
      'Stiffness from travel, long days at a desk, or both',
      "An old injury or surgery you don't want to become a new problem",
      'Wanting to keep training, playing, and moving well past 50',
      "Not in pain — but not moving the way you used to",
    ],
    approachHeading: 'Build capacity before pain becomes the reason to pay attention.',
    approach: pt(
      'We screen how you move, restore range where it has been lost, strengthen the weak links, and help you build self-care habits that fit your life.',
      "Prevention isn't about frequent appointments. It's about knowing what to watch, what to work on, and when a check-in is worthwhile.",
    ),
    tools: [
      tool('Movement screen', 'A baseline of how you move now, so changes are easy to spot.'),
      tool('Periodic tune-ups', 'Chiropractic and manual care when it supports your goals.', 'service-chiropractic'),
      tool('Therapeutic massage', 'Soft-tissue care for recovery and maintenance.', 'service-massage'),
      tool('Exercise guidance', 'Mobility, stability, and strength work you can do on your own.'),
      tool('Orthotics & foot mechanics', 'Support for the feet when they are part of the picture.'),
      tool('Nutrition support', 'Including omega-3 and vitamin D testing when useful.', 'service-labs'),
    ],
    outcomes: ['Consistency in the activities you care about', 'Mobility and confidence as you age', 'Fewer interruptions from preventable problems', 'A self-care routine that fits your life'],
    whatToExpect: items([
      ['Start with a screen', 'We look at how you move today and what you want to keep doing.'],
      ['Prioritize', 'The few things most worth working on — not a long list.'],
      ['Check in when it is useful', 'Reassessment is scheduled around your goals, not a fixed visit count.'],
    ]),
    faqs: [ref('faq-come-back'), ref('faq-first-visit')],
    primaryCta: cta('Build a Prevention Plan', '/book#booking-new-patient'),
    seo: seo(
      'Active Aging & Injury Prevention in Wayne, PA | IWC',
      'Stay capable for the life you want to keep living. Movement screening, tune-ups, and practical prevention plans for active adults on the Main Line.',
    ),
  },
  {
    _id: 'pathway-functional-health',
    title: 'Functional Health',
    slug: {_type: 'slug', current: 'functional-health'},
    order: 4,
    accent: 'navy',
    patientVoice: 'Help me make my health data useful.',
    cardSummary: 'You want a clearer plan for nutrition, labs, gut health, energy, recovery, or whole-body health.',
    startHereExplanation:
      'Functional health starts with your history, goals, and any data you already have. Testing is used only when it will change what we do next.',
    nextSteps: [
      step('Functional Health Consultation', 'Talk through symptoms, goals, and any existing labs.', 'Book a consultation', '/book#booking-functional'),
      step('Direct Access Lab Testing', 'Order select lab panels directly.', 'Explore lab testing', '/services/direct-access-lab-testing'),
      step('Holobiome Gut Restoration', 'A structured, phased gut program.', 'Explore the program', '/services/holobiome-gut-restoration'),
    ],
    heroHeadline: 'Make health data useful, not overwhelming.',
    heroIntro:
      "Tired of being tired for no reason? Told your labs are fine when you don't feel fine? We start with your history, goals, and the information you already have — and use testing only when it will change what we do next.",
    recognition: [
      'Ongoing gut symptoms or digestive discomfort',
      'Fatigue or slow recovery without a clear explanation',
      '"I\'m told I\'m fine. So why do I feel bad?"',
      'Uncertainty about nutrition or supplements',
      'Interest in direct-access labs, omega-3, or vitamin D testing',
      'Wanting a structured health reset',
    ],
    approachHeading: 'Start with the person. Test when it changes the plan.',
    approach: pt(
      'Functional health at IWC is a conversation before it is a lab order. We look at your history, symptoms, goals, nutrition, and the data you already have, then decide together what would actually be useful to learn.',
      'We are clear about what testing can and cannot tell you. Results are one input, interpreted in context. They do not replace a medical evaluation — and when something needs a physician, we will say so.',
    ),
    tools: [
      tool('Functional diagnostics & nutrition', 'History, symptoms, and goals first; nutrition guidance that fits your life.'),
      tool('Direct-access lab testing', 'Select panels ordered directly, interpreted in context.', 'service-labs'),
      tool('Holobiome Gut Restoration', 'A phased program for gut health as part of the whole system.', 'service-holobiome'),
      tool('Omega-3 & vitamin D testing', 'Simple markers that can inform nutrition decisions.'),
      tool('Supplement dispensary (Fullscript)', 'Convenient access when supplements are part of the plan — a support tool, not the starting point.'),
    ],
    outcomes: ['Clear decisions about what to test — and what not to', 'A plan you can actually follow', 'Tracking that shows whether changes are helping', 'Retesting only when it is indicated'],
    whatToExpect: items([
      ['A consultation first', 'We review your history, goals, current routine, and any recent labs.'],
      ['A decision about testing', 'If testing would change the plan, we discuss which tests and why.'],
      ['Interpretation in context', 'Results explained in plain language, with next steps and follow-up timing.'],
    ]),
    faqs: [ref('faq-holobiome'), ref('faq-labs-not-necessary'), ref('faq-referral')],
    primaryCta: cta('Book a Functional Health Consultation', '/book#booking-functional'),
    seo: seo(
      'Functional Nutrition & Diagnostic Testing in Wayne, PA | IWC',
      'Make health data useful, not overwhelming. Functional health consultations, direct-access labs, and gut health programs in Wayne, PA.',
    ),
  },
].map((p) => ({_type: 'pathway', ...p}))

/* ------------------------------------------------------------------ services */
export const services = [
  {
    _id: 'service-chiropractic',
    title: 'Chiropractic & Sports Chiropractic',
    slug: {_type: 'slug', current: 'chiropractic-sports-chiropractic'},
    kind: 'service',
    pathways: [ref('pathway-pain-recovery'), ref('pathway-performance'), ref('pathway-prevention')],
    summary: 'Hands-on chiropractic care inside a broader clinical plan — for recurring pain, sports injuries, and people who want to keep moving well.',
    heroHeadline: 'Chiropractic care that considers more than the joint.',
    heroIntro:
      'Adjustments can be useful. They work best as one tool inside a plan that also considers movement, soft tissue, load, and recovery.',
    recognition: [
      'Neck or back pain that keeps returning',
      'A sports or overuse injury',
      'Stiffness that limits training, golf, or daily life',
      'Stiffness after long days at a desk or frequent travel',
      "You've had chiropractic care before, but the results didn't last",
    ],
    whatItIs: pt(
      'Chiropractic care uses hands-on techniques — including spinal and joint manipulation and mobilization — to address pain and restricted movement. Sports chiropractic applies the same skills with a specific understanding of training, load, and return to sport.',
    ),
    howWeUseIt: pt(
      'IWC is not a high-volume, adjustment-only practice. Each visit is guided by assessment: what is moving well, what is not, and what seems to be keeping the problem going. Treatment may combine adjustments with soft-tissue work, Fascial Manipulation, movement exercises, or other tools — only what makes sense for you.',
      "If your history or exam suggests you need imaging, a medical evaluation, or another specialist, we'll tell you and help you get there.",
    ),
    mayFit: [
      'Recurring low back, mid-back, or neck pain',
      'Sports and overuse injuries',
      'Movement restrictions affecting training or golf',
      'Active adults who want periodic tune-ups as part of prevention',
    ],
    boundaries: [
      'Chiropractic care is not a substitute for emergency or medical care',
      "Some conditions call for imaging or a medical referral first — we'll screen for this",
      'We do not recommend open-ended visit schedules; plans are reassessed as you progress',
    ],
    whatToExpect: items([
      ['First visit — about 60 minutes', 'History, assessment, a clear explanation of what we found, and treatment when appropriate.'],
      ['What to wear', 'Comfortable clothing you can move in.'],
      ['Follow-up visits — about 30 minutes', "Progress is reassessed each visit and the plan adjusted to how you're responding."],
    ]),
    rationale: pt(
      'Clinical practice guidelines for low back pain commonly include spinal manipulation among recommended conservative options, alongside exercise and education. We use it in that spirit — as part of an active plan, not a stand-alone fix.',
    ),
    faqs: [ref('faq-adjusted'), ref('faq-first-visit'), ref('faq-come-back')],
    providers: [ref('provider-jenn-hartmann'), ref('provider-irene-londer')],
    visitLength: 'New patient: about 60 minutes · Follow-up: about 30 minutes',
    pricingNote: 'New patient visit $175–275 · Follow-up visit $75–140',
    bookingOption: ref1('booking-new-patient'),
    primaryCta: cta('Book a New Patient Evaluation', '/book#booking-new-patient'),
    seo: seo(
      'Chiropractor & Sports Chiropractic in Wayne, PA | IWC',
      'Assessment-led chiropractic and sports chiropractic in Wayne, PA — one tool inside a plan that considers movement, soft tissue, load, and recovery.',
    ),
  },
  {
    _id: 'service-golf',
    title: 'Golf Performance',
    slug: {_type: 'slug', current: 'golf-performance'},
    kind: 'service',
    pathways: [ref('pathway-performance')],
    summary: 'Golf-specific assessment and care for rotation, comfort, and longevity in the game — from a sports chiropractor and Golf Fitness Instructor.',
    heroHeadline: 'Your body should support your swing — for as many seasons as you want to play.',
    heroIntro:
      'Golf asks a lot of the hips, spine, and shoulders, mostly through rotation. We look at how your body moves, where it is limited, and how that shows up in your swing and your comfort on the course.',
    recognition: [
      'Lost rotation, or a swing that feels restricted',
      'Low back pain during or after a round',
      'Hip, shoulder, or elbow discomfort that flares with practice',
      'Wanting to play more often without paying for it the next day',
      'Returning to golf after an injury or surgery',
    ],
    whatItIs: pt(
      "Golf performance care combines a movement assessment specific to the golf swing with hands-on treatment and targeted exercise. It isn't swing coaching — it addresses the physical side so your body can do what your coach is asking.",
    ),
    howWeUseIt: pt(
      'Dr. Jenn is a Golf Fitness Instructor as well as a sports chiropractor. She assesses mobility, stability, and strength through the positions the swing requires, identifies the limitations that matter most, and builds a plan that may include manual care, Fascial Manipulation, and exercise.',
      "If you work with a coach or trainer, we're glad to collaborate.",
    ),
    mayFit: ['Recreational and competitive golfers of any age', 'Golfers with pain that limits practice or play', 'Players who want to protect their longevity in the game'],
    boundaries: ['This is not swing instruction — we work alongside your coach', 'Acute injuries are evaluated first, and referred on when needed'],
    whatToExpect: items([
      ['A golf-specific assessment', 'Rotation, hip and mid-back mobility, balance, and stability in swing-relevant positions.'],
      ['Clear priorities', 'The two or three limitations most worth addressing first.'],
      ['A plan for the course and the gym', 'Hands-on care where useful, and exercises you can do on your own.'],
    ]),
    rationale: pt(
      'Rotation in the golf swing comes from several regions working together, mainly the hips and the mid-back. When one region is limited, others often compensate — which can affect both performance and comfort. Assessing those regions together helps show where to focus.',
    ),
    faqs: [ref('faq-golf-coach'), ref('faq-train-while-injured')],
    providers: [ref('provider-jenn-hartmann')],
    bookingOption: ref1('booking-performance'),
    primaryCta: cta('Book a Performance or Golf Evaluation', '/book#booking-performance'),
    seo: seo(
      'Golf Performance & Injury Care in Wayne, PA | Dr. Jenn Hartmann',
      'Golf-specific movement assessment and care for rotation, back pain, and longevity in the game. Dr. Jenn Hartmann, sports chiropractor and Golf Fitness Instructor, Wayne, PA.',
    ),
  },
  {
    _id: 'service-massage',
    title: 'Therapeutic Massage',
    slug: {_type: 'slug', current: 'therapeutic-massage'},
    kind: 'service',
    pathways: [ref('pathway-pain-recovery'), ref('pathway-prevention')],
    summary: 'Therapeutic massage tailored to your assessment — for pain, recovery, and maintenance — with a licensed massage therapist.',
    heroHeadline: 'Massage with a clinical purpose.',
    heroIntro: 'Therapeutic massage at IWC is guided by assessment, not a set routine. It can stand on its own or work alongside chiropractic and movement care.',
    recognition: [
      'Muscle tension or soreness that keeps rebuilding',
      'Recovery support during heavy training',
      'Tightness connected to an old injury or surgery',
      'Regular soft-tissue care as part of staying active',
      'Stress showing up as physical tension',
    ],
    whatItIs: pt('Therapeutic massage uses hands-on soft-tissue techniques to reduce tension, ease discomfort, and support recovery. Techniques are chosen for your goals and what the therapist finds.'),
    howWeUseIt: pt(
      'Our lead massage therapist, Amie Hamel, LMT, has more than 20 years of experience and training in postural assessment, myofascial techniques, scar work, trigger point therapy, cupping, gua sha, assisted stretching, and sports and prenatal massage. Sessions begin with a short assessment so the work is focused where it will help most.',
      'When massage is part of a broader plan, your providers coordinate so each visit builds on the last.',
    ),
    mayFit: ['Muscle tension and soreness', 'Athletes in training or recovery', 'Post-surgical tissue and scar work, once cleared', 'Prenatal massage'],
    boundaries: [
      'Massage is not appropriate for some conditions — please tell us about your health history before your session',
      'Post-surgical work begins only when your surgeon has cleared it',
    ],
    whatToExpect: items([
      ['About 60 minutes', 'Including a brief conversation and assessment.'],
      ['Pressure you control', 'The work is adjusted to your comfort throughout.'],
      ['Practical follow-up', 'Simple suggestions for between sessions.'],
    ]),
    faqs: [ref('faq-who-work-with'), ref('faq-first-visit')],
    providers: [ref('provider-amie-hamel')],
    visitLength: 'About 60 minutes',
    pricingNote: 'Initial visit $150',
    bookingOption: ref1('booking-massage'),
    primaryCta: cta('Book a Massage', '/book#booking-massage'),
    seo: seo('Therapeutic Massage in Wayne, PA | IWC', 'Assessment-led therapeutic massage for pain, recovery, and maintenance, with Amie Hamel, LMT, at IWC in Wayne, PA.'),
  },
  {
    _id: 'service-holobiome',
    title: 'Holobiome Gut Restoration',
    slug: {_type: 'slug', current: 'holobiome-gut-restoration'},
    kind: 'program',
    pathways: [ref('pathway-functional-health')],
    summary: 'A structured, phased program that supports gut health as part of a whole system — digestion, immunity, metabolism, and recovery.',
    heroHeadline: 'Gut health is more than the microbiome.',
    heroIntro:
      'The Holobiome Gut Restoration Program is a structured, phased approach to supporting digestion and the systems it communicates with — guided by Dr. Jenn and built around your history and goals.',
    recognition: [
      'Ongoing digestive discomfort, bloating, or irregularity',
      'Low energy or slow recovery alongside gut symptoms',
      "You've lost weight but still don't feel well",
      'Using, considering, or stopping a GLP-1 medication and thinking about long-term health',
      'Wanting a structured reset rather than piecemeal supplements',
    ],
    whatItIs: pt(
      'Your "holobiome" describes your genetics and your microbiome working together as one interconnected system. The microbiome communicates with many parts of the body — including the brain, immune system, skin, and liver — so gut health can influence how you feel well beyond digestion.',
      'The program follows the Holobiome Roadmap, a phased framework — Prepare, Purify, Promote, and Protect — designed to support healthier communication between digestion, immunity, metabolism, and the body’s other systems.',
    ),
    howWeUseIt: pt(
      "We start with a consultation: your symptoms, history, nutrition, medications, and goals. If the program is a good fit, Dr. Jenn guides you through each phase, checks in on how you're responding, and adjusts the plan. Supplements used in the program are tools within that plan — not the plan itself.",
      'The program supports health and wellbeing. It is not a treatment for any disease, and it does not replace care from your physician.',
    ),
    mayFit: [
      'Adults with persistent gut symptoms who have had a medical evaluation',
      'People who want a structured, guided reset',
      'Anyone curious how gut health connects to energy and recovery',
    ],
    boundaries: [
      'Red-flag symptoms — unexplained weight loss, blood in the stool, severe or worsening pain, or difficulty swallowing — need a medical evaluation first',
      "If you are pregnant, nursing, or managing a medical condition or medications, we'll coordinate with your physician before starting",
    ],
    whatToExpect: items([
      ['Consultation first', 'We confirm the program is a good fit before you commit.'],
      ['Phased, guided steps', 'Each phase has a clear purpose, with check-ins along the way.'],
      ['Practical support', 'Nutrition guidance and adjustments as you go.'],
    ]),
    faqs: [ref('faq-holobiome'), ref('faq-labs-not-necessary')],
    providers: [ref('provider-jenn-hartmann')],
    pricingNote: 'Program fee: $1,997',
    bookingOption: ref1('booking-functional'),
    primaryCta: cta('Book a Functional Health Consultation', '/book#booking-functional'),
    disclaimer:
      'The Holobiome Roadmap is a wellness program. Statements on this page have not been evaluated by the Food and Drug Administration, and the program is not intended to diagnose, treat, cure, or prevent any disease.',
    seo: seo('Gut Health & Holobiome Restoration Program | IWC Wayne', 'A structured, phased gut health program guided by Dr. Jenn Hartmann — supporting digestion, immunity, metabolism, and recovery. Wayne, PA.'),
  },
  {
    _id: 'service-scar',
    title: 'Scar Release + Functional Restoration',
    slug: {_type: 'slug', current: 'scar-release-functional-restoration'},
    kind: 'program',
    pathways: [ref('pathway-pain-recovery')],
    summary: 'Hands-on care for surgical and injury scars that affect how you move — focused on function, not appearance.',
    heroHeadline: 'The surgery fixed one thing. Now let’s help you feel like yourself again.',
    heroIntro:
      'Scars and the tissue around them can affect how you move, sometimes long after the incision has healed. Scar Release + Functional Restoration addresses that tissue as part of a broader plan to restore function.',
    recognition: [
      'Tightness, pulling, or restriction near a surgical scar',
      'Movement that has not returned to normal after surgery',
      'Compensation patterns that developed during recovery',
      'An old scar you suspect is linked to a newer problem',
      'C-section, abdominal, joint, or orthopedic surgery scars',
    ],
    whatItIs: pt(
      'Scar tissue forms as the body heals. Sometimes it — and the fascia around it — becomes less mobile than the surrounding tissue, which can affect how nearby muscles and joints move. Scar-focused manual therapy uses gentle, specific techniques to improve how that tissue moves, and how you move around it.',
    ),
    howWeUseIt: pt(
      'We look at the scar in context: how you move, how you have compensated, and what you want to get back to. Care may combine hands-on scar and fascial work, Fascial Manipulation, photobiomodulation (laser) as a supporting tool, and exercises to restore movement. We coordinate with your surgeon when appropriate.',
    ),
    mayFit: ['Healed surgical scars that feel restricted', 'Post-surgical patients cleared for soft-tissue work', "People whose movement hasn't fully returned after surgery"],
    boundaries: [
      'Scar work begins only after the incision has fully healed and your surgeon has cleared you',
      'We do not make cosmetic promises — the focus is function and comfort',
      'Signs of infection or new, unexplained changes need your surgeon or physician first',
    ],
    whatToExpect: items([
      ['Assessment', 'The history of the surgery, how the scar feels and moves, and how you move overall.'],
      ['Gentle, specific work', 'Techniques are adjusted to your comfort.'],
      ['Movement to keep the gains', 'Simple exercises to support your progress.'],
    ]),
    faqs: [ref('faq-referral'), ref('faq-first-visit')],
    providers: [ref('provider-jenn-hartmann'), ref('provider-amie-hamel')],
    bookingOption: ref1('booking-new-patient'),
    primaryCta: cta('Book an Evaluation', '/book#booking-new-patient'),
    seo: seo('Post-Surgical Scar & Fascial Restoration | IWC Wayne', 'Hands-on scar and fascial work to restore movement after surgery or injury — focused on function, coordinated with your surgeon. Wayne, PA.'),
  },
  {
    _id: 'service-labs',
    title: 'Direct Access Lab Testing',
    slug: {_type: 'slug', current: 'direct-access-lab-testing'},
    kind: 'service',
    pathways: [ref('pathway-functional-health'), ref('pathway-prevention')],
    summary: 'Order select lab tests directly through the IWC Fullscript dispensary — then use the results to make clearer decisions.',
    heroHeadline: 'Know your numbers. Then know what to do with them.',
    heroIntro:
      'Direct-access testing lets you order select labs without the usual runaround. Getting labs done is easy; knowing what to do with the results is where most people get stuck. That is where we help.',
    recognition: [
      'Wanting a baseline before a new training or nutrition plan',
      'Checking omega-3 or vitamin D status',
      'Monitoring changes over time',
      'Results in hand, but no clear next step',
    ],
    whatItIs: pt(
      'Through Journeys Direct Access Lab Testing in the IWC Fullscript dispensary, you can order select laboratory panels online and complete them at a local Quest or Labcorp location, or with an in-home option where available.',
    ),
    howWeUseIt: pt(
      'Testing is most useful when it answers a question that will change what you do next. In a functional health consultation, we can help you decide which tests are worth ordering, interpret results in the context of your history and goals, and plan sensible follow-up.',
    ),
    mayFit: ['Adults who want objective information to guide nutrition, training, or prevention', 'IWC patients who need targeted follow-up testing'],
    boundaries: [
      'Lab testing is for informational purposes. It does not replace a medical evaluation, diagnosis, or treatment by your physician',
      'Results that may need medical attention will be directed to your physician',
    ],
    whatToExpect: items([
      ['Choose tests', 'On your own, or with guidance in a consultation.'],
      ['Complete the draw', 'At Quest, Labcorp, or in-home where available.'],
      ['Review with context', 'Bring results to a consultation for interpretation and next steps.'],
    ]),
    faqs: [ref('faq-labs-not-necessary')],
    providers: [ref('provider-jenn-hartmann')],
    pricingNote: 'Price varies by panel',
    bookingOption: ref1('booking-functional'),
    primaryCta: cta('Book a Functional Health Consultation', '/book#booking-functional'),
    seo: seo('Direct Access Lab Testing in Wayne, PA | IWC', 'Order select lab panels directly, then make sense of the results with a functional health consultation in Wayne, PA.'),
  },
].map((s) => ({_type: 'service', ...s}))

export {ctaRef, h3, ul}

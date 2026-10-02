// Seed content: FAQs, articles, page singletons, legal pages, assistant knowledge.
import {callout, cta, h2, h3, items, keyed, pt, ref, ref1, seo, ul} from './pt.mjs'

/* ---------------------------------------------------------------------- FAQs */
const faq = (_id, category, order, question, ...answer) => ({_id, _type: 'faq', category, order, question, answer: pt(...answer), includeInChat: true})

export const faqs = [
  faq(
    'faq-first-visit',
    'first-visit',
    1,
    'What happens at my first visit?',
    "Your first visit is a conversation and an assessment. We'll talk through your history, what you've already tried, and what you want to get back to; examine what is relevant; explain what we think matters; and agree on a plan.",
    'Treatment often begins at the first visit when it is appropriate. New patient evaluations typically take about an hour.',
  ),
  faq(
    'faq-what-to-bring',
    'first-visit',
    2,
    'What should I bring?',
    'Wear comfortable clothing you can move in. Bring a list of current medications and supplements, and any relevant imaging reports, surgical notes, or recent lab results. Notes about your training or activity schedule help too.',
  ),
  faq(
    'faq-who-work-with',
    'first-visit',
    3,
    'Who will I work with?',
    'That depends on what you need. Dr. Jenn Hartmann and Dr. Irene Londer provide chiropractic care, and Amie Hamel, LMT, provides therapeutic massage. Functional health consultations and programs are with Dr. Jenn.',
    "If you're not sure, use [Start Here](/start-here) or call the office and we'll help you book with the right person. IWC practitioners are independent, and we coordinate when your care involves more than one of us.",
  ),
  faq(
    'faq-which-service',
    'first-visit',
    4,
    'Do I need to know which service to book?',
    'No. Choose the path that sounds most like you on [Start Here](/start-here), or call the office. The evaluation is where we decide together what makes sense.',
  ),
  faq(
    'faq-come-back',
    'approach',
    1,
    'If my problem keeps coming back, will I have to keep coming back?',
    'We aim for better function and fewer interruptions, so you need us less over time. We build each plan around your goals and recheck it as you progress.',
    "Many people learn what to watch for and what to do on their own; some choose periodic check-ins as part of staying active. Either way, you'll know why a visit is recommended.",
  ),
  faq(
    'faq-referral',
    'approach',
    2,
    'Will you refer me elsewhere if I need it?',
    "Yes. If your history or assessment suggests you need imaging, a medical evaluation, or another specialist, we'll say so and help you take that step. We work alongside physicians, surgeons, physical therapists, and coaches.",
  ),
  faq(
    'faq-adjusted',
    'approach',
    3,
    'Does every patient get adjusted?',
    'No. Recommendations are individualized. Some plans include chiropractic adjustments; others focus on soft-tissue work, movement, or another tool. We use the tools that make sense for you.',
  ),
  faq(
    'faq-how-schedule',
    'scheduling',
    1,
    'How do I schedule?',
    "Call [610-298-5873](tel:+16102985873), email [info@iwcmainline.com](mailto:info@iwcmainline.com), or choose your visit type on the [Book a Visit](/book) page. If you're not sure which visit to book, we'll help.",
  ),
  faq(
    'faq-insurance',
    'payment',
    1,
    'Do you take insurance?',
    'Please contact the office for current payment and insurance information before your visit. We are glad to explain fees and what to expect.',
  ),
  faq(
    'faq-cost',
    'payment',
    2,
    'How much does a visit cost?',
    'Current fees are listed by visit type on the [Book a Visit](/book) page. For questions about a specific service or program, contact the office.',
  ),
  faq(
    'faq-holobiome',
    'functional-health',
    1,
    'What is the Holobiome Gut Restoration Program?',
    'A structured, phased program that supports gut health as part of a larger system: digestion, immunity, metabolism, and recovery. It starts with a consultation to make sure it is a good fit. [Learn more about the program](/services/holobiome-gut-restoration).',
  ),
  faq(
    'faq-labs-not-necessary',
    'functional-health',
    2,
    'When is lab testing not necessary?',
    "When the result wouldn't change what we do next. We'd rather start with your history and goals, and recommend testing only when it will make a decision clearer.",
  ),
  faq(
    'faq-train-while-injured',
    'performance',
    1,
    'Can I keep training while I recover?',
    "Often, yes, with some changes. We look at what you can do safely now and how to progress. Some injuries need rest or a medical evaluation first; if so, we'll tell you.",
  ),
  faq(
    'faq-golf-coach',
    'performance',
    2,
    'Do you replace my golf coach or trainer?',
    'No. We handle the physical side: mobility, stability, strength, and comfort. We are glad to work with your coach or trainer.',
  ),
  faq(
    'faq-refer-patient',
    'providers',
    1,
    'How do I refer a patient?',
    "Use the professional contact form on [For Providers](/for-providers) or call the office. Please don't send patient health information through the website; we'll arrange a secure method.",
  ),
]

/* ------------------------------------------------------------------ articles */
export const articles = [
  {
    _id: 'article-back-pain-returns',
    _type: 'article',
    title: 'Why does my back pain keep coming back?',
    slug: {_type: 'slug', current: 'why-does-my-back-pain-keep-coming-back'},
    excerpt:
      'Back pain often settles and then comes back. Why that happens so often, and what helps more than treating the same spot again.',
    topic: 'persistent-pain',
    publishedAt: '2026-09-15T09:00:00Z',
    featured: true,
    pathway: ref1('pathway-pain-recovery'),
    services: [ref('service-chiropractic')],
    body: pt(
      'If your back settles down for a few weeks or months and then flares again, you are not unusual. Recurrence is one of the most common features of low back pain. The frustrating part is that each episode can feel like starting over.',
      'It usually isn’t. Recurring pain tends to follow a pattern, and you can learn to read it.',
      h2('When pain settles, the problem may still be there'),
      'Pain is a signal, and it can quiet down while the conditions that produced it are still there. The irritated tissue calms, you return to normal life, and the same mix of demands builds back up until the next flare.',
      'Common contributors include:',
      ul([
        '**Load versus capacity.** A busy training block, a long trip, a move, or weeks of extra sitting can ask more of your back than it is currently prepared for.',
        '**Movement that has quietly changed.** After an injury, people often protect an area without realizing it. Those workarounds can stick around long after the original pain is gone.',
        '**Neighbors in the chain.** Stiff hips, a limited upper back, or foot mechanics can shift more work to the lower back.',
        '**Recovery.** Sleep, stress, and overall training load all influence how quickly tissue adapts.',
      ]),
      'Not every factor matters for every person. The painful spot is only part of the story.',
      h2('What tends to help'),
      h3('An assessment that looks beyond the spot'),
      "A useful evaluation asks where it hurts. It also asks how you move, what your days and training demand, what happened before the first episode, and what has or hasn't helped since. That is how you find the few things worth working on.",
      h3('Treatment that builds capacity'),
      'Hands-on care can ease pain and restore movement in the short term. On its own, it rarely changes the pattern. Studies find that exercise, combined with education about the condition, lowers the risk of future episodes. Good plans use both.',
      h3('A plan for the next flare'),
      'Part of a good outcome is knowing what to do when your back tightens up: which movements to keep, what to scale back, and when it is worth checking in. Confidence matters. People who understand their pain tend to manage it better.',
      h2('When back pain needs a medical evaluation first'),
      'Most back pain is not dangerous. Seek prompt medical care if back pain comes with any of the following:',
      ul([
        'Numbness in the groin or inner thighs, or new problems controlling your bladder or bowels',
        'Weakness in a leg that is getting worse',
        'Fever, unexplained weight loss, or a history of cancer',
        'Pain after a significant fall or accident',
        'Severe pain at night that does not change with position',
      ]),
      callout('In an emergency', 'If you have sudden loss of bladder or bowel control, or rapidly worsening weakness, call 911 or go to the nearest emergency department.'),
      h2('How we approach it at IWC'),
      'We start by listening, then assess the painful area and the larger movement, tissue, and load picture. We explain what we think matters and what probably doesn’t, then build a plan around your goals. If imaging or another specialist is the better next step, we say so.',
      'If your back keeps sending the same message, it may be time to look at the whole picture. [Start with an evaluation](/how-we-help/pain-recovery).',
    ),
    seo: seo('Why Does My Back Pain Keep Coming Back? | IWC Wayne, PA', 'Back pain that settles and returns usually follows a pattern. What drives recurrence, what helps, and when to see a physician first.'),
  },
  {
    _id: 'article-golf-mobility-stability',
    _type: 'article',
    title: 'Mobility vs. stability for the golf swing',
    slug: {_type: 'slug', current: 'mobility-vs-stability-golf-swing'},
    excerpt:
      'Losing rotation or feeling your back after a round? Stretching more is rarely the whole answer. Mobility and stability have to work together in the swing.',
    topic: 'golf',
    publishedAt: '2026-09-08T09:00:00Z',
    featured: true,
    pathway: ref1('pathway-performance'),
    services: [ref('service-golf')],
    body: pt(
      'Golfers often ask whether they need more flexibility. Sometimes they do. The swing depends on two qualities working together: mobility, the range you can reach, and stability, the control to use that range at speed.',
      h2('Where rotation comes from'),
      'The swing looks like one big turn, but rotation is shared across several regions. The hips and the mid-back (thoracic spine) are built to rotate. The lower back is built more for stability and contributes comparatively little rotation.',
      'When the hips or mid-back are stiff, the body still finds a way to make the turn, often by asking more of the lower back, shoulders, or elbows. That can show up as lost distance, inconsistency, or soreness the day after a round.',
      h2('Mobility creates options'),
      'If a region cannot reach the positions the swing requires, no amount of practice will fully fix it. Restoring hip rotation or mid-back extension and rotation gives you more ways to make a good swing.',
      h2('Stability creates control'),
      'Range you cannot control is hard to use. Stability lets you turn into the trail hip without swaying, hold your posture through impact, and slow down without strain afterward. Golfers with plenty of flexibility but limited control can struggle as much as stiff golfers.',
      h2('Strength creates capacity'),
      'Once mobility and control are in place, strength helps you produce speed and handle the volume of practice and play, round after round and season after season.',
      callout('The order matters', 'Mobility, then stability, then strength. Each depends on the one before it.'),
      h2('What a golf-specific assessment looks for'),
      ul([
        'Hip rotation on each side, and how it compares',
        'Mid-back rotation and extension',
        'Balance and control in swing-relevant positions',
        'How your body handles speed and repetition',
        'Past injuries or surgeries that may have changed how you move',
      ]),
      'You come away with the two or three limitations most worth working on, instead of a generic stretching routine.',
      h2('When to get it looked at'),
      'If you have lost rotation, if your back or hips complain after playing, or if you are returning to golf after an injury or surgery, a movement assessment can help you play more comfortably and for longer. It works alongside your coach’s instruction.',
      '[Explore golf performance at IWC](/services/golf-performance).',
    ),
    seo: seo('Mobility vs. Stability for the Golf Swing | IWC Golf Performance', 'Why golfers lose rotation, why the lower back takes the strain, and how mobility, stability, and strength work together in the swing.'),
  },
  {
    _id: 'article-useful-labs',
    _type: 'article',
    title: 'Which labs are useful, and when is testing not necessary?',
    slug: {_type: 'slug', current: 'which-labs-are-useful'},
    excerpt:
      'Direct-access testing makes ordering labs easy. Deciding which tests are worth it, and what to do with the results, is the harder part.',
    topic: 'functional-health',
    publishedAt: '2026-09-01T09:00:00Z',
    featured: true,
    pathway: ref1('pathway-functional-health'),
    services: [ref('service-labs')],
    body: pt(
      'Ordering your own lab work has never been easier. That helps, but it can also leave you with a stack of numbers and no clear next step. Before you ask "what should I test?", ask "what decision am I trying to make?"',
      h2('Test when the answer will change the plan'),
      'Testing is most valuable when a result would change what you do: how you eat, how you train, what you supplement, or whether you should see a physician. If every possible result would lead to the same plan, the test may not be worth it right now.',
      h2('Start with your history'),
      'Your symptoms, history, medications, nutrition, sleep, and goals usually say more than a single lab value. They also tell us which tests are likely to be informative for you, rather than ordering everything at once.',
      h2('Panels people commonly ask about'),
      'Depending on the situation, conversations often include markers such as vitamin D, an omega-3 index, iron status, a lipid panel, blood sugar markers, or a basic metabolic panel and blood count. Whether any of these make sense depends on you, and some belong in a conversation with your physician.',
      h2('When testing is probably not necessary'),
      ul([
        'When the result would not change what you do next',
        'When the same test was done recently and nothing has changed',
        'When it is being used to chase a perfect number rather than to answer a question',
        'When symptoms need a medical evaluation first, since testing would only delay care',
      ]),
      h2('What testing cannot do'),
      'Lab results are one input, interpreted in context. Direct-access testing is informational. It does not replace a medical evaluation, diagnosis, or treatment by your physician, and results that may need medical attention should go to your physician.',
      callout('Bring your results', 'If you already have recent labs, bring them to your consultation. Many people need interpretation more than another test.'),
      h2('How we use testing at IWC'),
      'In a functional health consultation, we start with your history and goals, decide together whether testing would be useful, and explain results in plain language with clear next steps. [Learn about direct-access lab testing](/services/direct-access-lab-testing).',
    ),
    seo: seo('Which Labs Are Useful, and When Is Testing Unnecessary? | IWC', 'How to decide which lab tests are worth ordering, what direct-access testing can and cannot tell you, and when testing is not necessary.'),
  },
]

/* ---------------------------------------------------------------- home page */
export const homePage = {
  _id: 'homePage',
  _type: 'homePage',
  heroEyebrow: 'Pain | Performance | Prevention',
  heroHeadline: 'When the same problem keeps coming back, it may be time to look at the whole picture.',
  heroSubhead:
    'IWC helps active people make sense of persistent pain, stalled recovery, performance limitations, and conflicting health advice, then builds a practical plan around the person, not just the symptom.',
  heroPrimaryCta: cta('Start Here', '/start-here'),
  heroSecondaryCta: cta('Book a Visit', '/book'),
  mapFactors: ['Pain', 'Movement', 'Tissue', 'Recovery', 'Training load', 'Sleep', 'Nutrition', 'Past injury', 'Stress'],
  mapHighlighted: ['Movement', 'Training load', 'Past injury'],
  trustItems: items([
    ['25+ years', 'across health, sports medicine, manual therapy, nutrition, movement, and performance'],
    ['Wayne · Main Line', 'A wellness collective on Bloomingdale Avenue in Wayne, Pennsylvania'],
    ['Collaborative', 'Evidence-informed care that works alongside your other clinicians'],
  ]),
  recognitionHeading: 'You do not need more random treatment. You need a clearer picture.',
  recognitionCards: [
    'The pain settles, then returns.',
    'You have seen multiple providers, but the pieces still feel disconnected.',
    'You want to stay active while you recover.',
    'You are functioning, but not performing or recovering like yourself.',
  ],
  recognitionCoda: 'Start understanding why. Stop chasing symptoms.',
  reframeHeading: 'The body does not work in isolated parts. Your care should not either.',
  reframeBody: pt(
    'Pain, movement, recovery, tissue health, nutrition, sleep, training load, past injury, surgery, and stress can overlap. The goal is not to chase every possible variable. It is to identify the pieces that matter for you.',
    "That takes breadth, plus the judgment to know what to leave out. Dr. Jenn's background in sports chiropractic, manual therapy, movement, nutrition, and functional diagnostics means fewer blind spots and fewer handoffs between people who never talk to each other.",
  ),
  reframePull: 'The tools change. The thinking does not.',
  pathwaysHeading: 'Where would you like to start?',
  pathwaysIntro: "Pick the one that sounds like what you're dealing with. You don't need to know the treatment name.",
  processHeading: 'How care works',
  processSteps: items([
    ['Listen', 'Your story, your goals, and what you have already tried.'],
    ['Assess', 'Movement, tissue, load, and test results when they help.'],
    ['Connect the dots', 'What we think matters, and what probably does not.'],
    ['Build the plan', 'Based on your goals, not our bottom line.'],
    ['Measure progress', 'Reassess, adjust, and work toward independence.'],
  ]),
  processNote:
    'The plan may include hands-on care, movement, diagnostics, nutrition, home strategies, or referral. The goal is not to use everything. It is to use what makes sense.',
  drJennHeading: 'Experienced enough to see patterns. Practical enough to explain them.',
  drJennBody: pt(
    'Dr. Jenn Hartmann brings more than 25 years across sports medicine, manual therapy, nutrition, movement, and performance to one question: what is going on, and what should we do about it?',
    'She takes on complicated, "I have tried everything" cases without making big promises, and she works with physicians, surgeons, and coaches when someone else is the better next step.',
  ),
  drJennProvider: ref1('provider-jenn-hartmann'),
  drJennHighlights: [
    'Sports chiropractor & Golf Fitness Instructor',
    'Licensed massage therapist & dietitian',
    'Functional Movement Specialist',
    'Trusted by physicians, neurosurgeons, and orthopedists',
  ],
  drJennCta: cta('Meet Dr. Jenn', '/about'),
  proofHeading: 'Trusted for thoughtful, personalized care',
  proofPoints: items([
    ['Professional athletes', 'Experience caring for professional athletes in baseball, basketball, football, golf, cycling, and triathlon.'],
    ['Referral relationships', 'Trusted by physicians, neurosurgeons, and orthopedists, with specialists to refer you to when you need one.'],
    ['Young athletes', 'A particular commitment to helping young athletes reduce injuries and pursue their goals.'],
  ]),
  toolsHeading: 'A deep toolbox. Used selectively.',
  toolsIntro: "A wide toolbox makes for better judgment. You'll only use the tools that fit your plan.",
  toolGroups: keyed([
    {_type: 'toolGroup', title: 'Manual care', body: 'Hands-on treatment, guided by assessment.', items: ['Chiropractic & sports chiropractic', 'Fascial Manipulation', 'Therapeutic massage', 'Scar release']},
    {_type: 'toolGroup', title: 'Movement', body: 'How you move, and what your life asks of it.', items: ['Functional movement assessment', 'Golf performance', 'Postural assessment', 'Exercise guidance']},
    {_type: 'toolGroup', title: 'Recovery technology', body: 'Supporting tools, used when they fit.', items: ['Photobiomodulation (LZ30 laser)', 'Orthotics & foot mechanics', 'Body Blueprint Scan']},
    {_type: 'toolGroup', title: 'Functional diagnostics & nutrition', body: 'Data that changes the plan.', items: ['Functional health consultations', 'Direct-access lab testing', 'Holobiome Gut Restoration', 'Omega-3 & vitamin D testing']},
  ]),
  toolsCta: cta('See how we help', '/how-we-help'),
  expectHeading: 'What to expect at your first visit',
  expectItems: items([
    ['You will be listened to first', 'Before any plan is recommended, we want your history, your goals, and what you have already tried.'],
    ['About an hour', 'New patient evaluations typically run about 60 minutes. Wear clothing you can move in.'],
    ['A plan built for you', 'Recommendations are individualized. Not every patient receives the same services.'],
    ['Clear next steps', 'You will leave knowing what we think matters, what we are watching, and what happens next.'],
    ['Referral when it is right', 'If another provider or a diagnostic step is the better move, we will tell you.'],
  ]),
  expectCta: cta('Read the FAQ', '/faq'),
  educationHeading: 'Questions we answer every week',
  educationArticles: [ref('article-back-pain-returns'), ref('article-golf-mobility-stability'), ref('article-useful-labs')],
  finalHeading: 'You do not need to know the perfect service. You just need the right starting point.',
  finalBody: 'Ready to understand what your body has been trying to tell you?',
  finalPrimaryCta: cta('Start Here', '/start-here'),
  finalSecondaryCta: cta('Book a Visit', '/book'),
  seo: seo(
    'Integrative Chiropractic & Performance Care in Wayne, PA | IWC',
    'Whole-person, evidence-informed care for pain, performance, and prevention in Wayne, PA on the Main Line. Start with what you are trying to solve.',
  ),
}

/* ------------------------------------------------------------- other pages */
export const startHerePage = {
  _id: 'startHerePage',
  _type: 'startHerePage',
  eyebrow: 'Start Here',
  headline: 'You do not need to know which service to book. Start with what you are trying to solve.',
  intro: "Choose the path that sounds most like you. We'll help you determine the most appropriate evaluation, treatment, program, or referral from there.",
  selectorPrompt: 'Which sounds most like you?',
  reassurance:
    "This page won't diagnose you or quiz you. It points you to the right first conversation, and your evaluation is where we decide what makes sense.",
  unsureHeading: 'Still not sure?',
  unsureBody: "Call the office or send a short note and we'll help you choose. You don't need to share health details.",
  seo: seo('Start Here | Find Your Starting Point at IWC in Wayne, PA', "Not sure which service you need? Choose what you're trying to solve, whether pain, performance, prevention, or functional health, and we'll point you to the right first visit."),
}

export const aboutPage = {
  _id: 'aboutPage',
  _type: 'aboutPage',
  eyebrow: 'About Dr. Jenn',
  headline: 'A clinician who connects the dots without making your health more complicated.',
  intro:
    'Dr. Jenn Hartmann combines sports chiropractic, manual therapy, movement, nutrition, and functional diagnostics to help active people understand what matters and choose a practical next step.',
  provider: ref1('provider-jenn-hartmann'),
  sections: keyed([
    {
      _type: 'storySection',
      kicker: 'Why she practices this way',
      heading: 'Pain is only part of the story.',
      body: pt(
        "Most people who find Dr. Jenn have already tried something, often several things. The pain settles and returns, the recovery stalls, or the advice conflicts. What they're missing is someone who takes the time to put the pieces together.",
        'In the room, that means listening before recommending, examining what is relevant, and explaining what she sees in plain language. Patients should leave with more clarity, not more confusion.',
      ),
    },
    {
      _type: 'storySection',
      kicker: 'The interdisciplinary advantage',
      heading: 'Depth without the disconnect.',
      body: pt(
        "Dr. Jenn's path runs through athletics, nutrition, manual therapy, chiropractic and sports medicine, movement and golf fitness, and functional diagnostics. Each one sharpens her assessment, which means fewer blind spots and better calls about what to do first.",
        'Curated, high-touch, individualized care is the norm here. When so much of healthcare feels cookie-cutter, that is a deliberate choice.',
      ),
    },
    {
      _type: 'storySection',
      kicker: 'The athlete perspective',
      heading: 'She understands what it means to want to keep playing.',
      body: pt(
        "Dr. Jenn's love of sport began at five years old, and it still shapes her work. She has cared for professional athletes in baseball, basketball, football, golf, cycling, and triathlon, and top-level amateurs in tennis, squash, and golf. She puts extra time into young athletes working toward their goals, including playing at the Division 1 level.",
      ),
    },
  ]),
  philosophy: items([
    ['Mobility creates options.', ''],
    ['Stability creates control.', ''],
    ['Strength creates capacity.', ''],
    ['Good care knows when to collaborate.', 'Or refer, or get more information.'],
  ]),
  benefitsHeading: 'The benefits of choosing IWC',
  benefits: [
    'Understand what may be driving the problem, instead of treating the same symptom in isolation.',
    'Decide what matters now, what can wait, and when you need another specialist.',
    'Recover without unnecessarily giving up the activities that matter to you.',
    'Bridge the gap between "not injured" and performing well, whether that means training, golfing, working, or daily life.',
    'Stay ahead of recurrence as you age, train, travel, compete, or manage a demanding schedule.',
    'Make functional health and testing useful rather than overwhelming.',
  ],
  collaboration: pt(
    'Dr. Jenn is trusted by physicians, neurosurgeons, orthopedists, and other practitioners, and keeps strong connections with specialists and allied health professionals across the country. When you need another set of eyes, such as imaging, a surgical opinion, or a different discipline, she helps you get there.',
  ),
  closing:
    "If you're tired of piecing it together on your own, start here. Bring your questions, your history, and what you want to get back to. We'll take it from there.",
  seo: seo(
    'Dr. Jenn Hartmann | Sports Chiropractor & Functional Health',
    'Meet Dr. Jenn Hartmann: 25+ years across sports medicine, manual therapy, nutrition, movement, and performance, and the judgment to connect them. Wayne, PA.',
  ),
}

export const teamPage = {
  _id: 'teamPage',
  _type: 'teamPage',
  eyebrow: 'Team',
  headline: 'Independent practitioners. One coordinated approach.',
  intro:
    "IWC is a collective of experienced, independent clinicians. Each profile says who that person helps and how they work. If another IWC provider or an outside specialist is a better fit, we'll say so.",
  collectiveNote: 'When your care involves more than one of us, we coordinate so each visit builds on the last.',
  seo: seo('Our Team | Integrative Wellbeing & Chiropractic, Wayne PA', 'Meet the chiropractic physicians and massage therapist of the IWC collective in Wayne, PA.'),
}

export const resourcesPage = {
  _id: 'resourcesPage',
  _type: 'resourcesPage',
  eyebrow: 'Resources',
  headline: 'Clinical updates, practical insight, and education.',
  intro: 'Straight answers to questions patients ask in the room about pain, recovery, sport, golf, functional health, and staying active.',
  newsletterHeading: 'Practical insight, occasionally',
  newsletterBody: 'Clinical updates and practical insight from IWC. No spam, and you can unsubscribe at any time.',
  substackUrl: 'https://substack.com/@thewellbeingfix',
  seo: seo('Resources & Articles | IWC Wayne, PA', 'Practitioner-led answers about recurring pain, recovery, sport, golf, functional health, labs, and active aging.'),
}

export const providersPage = {
  _id: 'providersPage',
  _type: 'providersPage',
  eyebrow: 'For Providers',
  headline: 'A collaborative resource for patients who need another set of clinical eyes.',
  intro: 'IWC evaluates within scope, communicates when appropriate, avoids duplicating care, and refers onward when another specialist is needed.',
  audience: [
    'Orthopedists and surgeons',
    'Primary care and concierge physicians',
    'Physical therapists',
    'Athletic trainers, coaches, and strength staff',
    'Agents for professional athletes',
    'Chiropractors, massage therapists, and allied health professionals',
  ],
  promise: "We aim to be the colleague you'd want: thorough within our scope, clear in our communication, and quick to say when something belongs with someone else.",
  clinicalFit: [
    'Musculoskeletal complexity and recurring pain',
    'Sports injury and return to play',
    'Post-surgical and scar-related restriction',
    'Performance and golf-specific limitations',
    'Foot-to-hip chain issues',
    'Conservative-care questions',
    'Functional health collaboration, where appropriate',
  ],
  whatWeDo: items([
    ['Assessment', "A thorough history and examination focused on what's relevant."],
    ['Selective tools', 'Manual care, movement, and recovery tools chosen for the individual.'],
    ['Patient education', 'Clear explanations so patients understand and take part in the plan.'],
    ['A functional plan', 'Goals, milestones, and reassessment, with referral when needed.'],
  ]),
  whatWeDoNot: [
    'We do not overstate diagnosis, testing, or medical scope.',
    'We do not replace physician oversight of medical conditions.',
    'We do not keep patients in open-ended care plans.',
    'IWC practitioners are independent; each practices within their own license and scope.',
  ],
  communication: pt(
    "With the patient's consent, we share relevant findings and updates with referring clinicians and coordinate on next steps. Let us know how you prefer to receive updates.",
  ),
  referralNotice:
    "Please don't include patient names, dates of birth, or clinical details in this form. Use it to introduce yourself and request a call. We'll arrange a secure way to share patient information.",
  seo: seo('Refer a Patient | Integrative Wellbeing & Chiropractic', 'For physicians, surgeons, therapists, and coaches: collaborative musculoskeletal, performance, and functional health care in Wayne, PA.'),
}

export const bookingPage = {
  _id: 'bookingPage',
  _type: 'bookingPage',
  eyebrow: 'Book a Visit',
  headline: "Choose the visit that fits why you're coming in.",
  intro: "Not sure which to choose? Use Start Here or call the office, and we'll help you book the right first visit.",
  firstVisitNote: pt(
    'New patient evaluations typically take about an hour. Wear comfortable clothing, and bring a list of medications and any relevant imaging reports, surgical notes, or recent labs.',
  ),
  formIntro: "Send a short note and we'll get back to you. Please leave out personal health details. We'll go over those in person.",
  seo: seo('Book a Visit | Integrative Wellbeing & Chiropractic, Wayne PA', 'Book a new patient evaluation, athlete or golf evaluation, functional health consultation, or massage at IWC in Wayne, PA.'),
}

export const faqPage = {
  _id: 'faqPage',
  _type: 'faqPage',
  eyebrow: 'FAQ / What to Expect',
  headline: 'What to expect before, during, and after your first visit.',
  intro: "Good care is as much about certainty and communication as anything else. Here's what you can count on, and answers to the questions people ask before booking.",
  expectations: [
    'You will be listened to before a plan is recommended.',
    'Your history, movement, symptoms, goals, and relevant data are considered together.',
    'Recommendations are individualized; not every patient receives the same services.',
    'You will understand what we think matters, what we are watching, and what the next step is.',
    'When another provider or diagnostic step is appropriate, we will say so.',
    'Progress is reassessed. The plan can change based on your response and goals.',
    'The goal is to help you take part in your health, not make the process feel mysterious.',
  ],
  firstVisitSteps: items([
    ['Before', 'Choose your visit type or call us. Wear clothing you can move in, and bring medications, imaging reports, surgical notes, or recent labs.'],
    ['During', 'A conversation, a focused assessment, and a clear explanation. Treatment often begins the same day when appropriate.'],
    ['After', 'A plan you understand, what to do on your own, and whether you need to come back.'],
  ]),
  seo: seo('FAQ & What to Expect | IWC Wayne, PA', 'What happens at your first visit, what to bring, who you will see, and how scheduling and payment work.'),
}

/* ------------------------------------------------------------- legal pages */
const legal = (_id, title, slug, intro, body, description) => ({
  _id,
  _type: 'legalPage',
  title,
  slug: {_type: 'slug', current: slug},
  intro,
  body,
  lastUpdated: '2026-10-01',
  reviewStatus: 'draft-template',
  seo: seo(`${title} | Integrative Wellbeing & Chiropractic`, description),
})

export const legalPages = [
  legal(
    'legal-privacy',
    'Website Privacy Policy',
    'privacy',
    'How this website collects and uses information.',
    pt(
      h2('Scope'),
      'This policy covers information collected through this website. It does not govern the clinical records of patients, which are handled separately under the policies we provide to patients at the practice.',
      h2('Information you choose to send us'),
      'When you use a contact, referral, or newsletter form, we collect what you enter, such as your name, email address, phone number, and message. We use it only to respond to you or send what you asked for. Please do not send health information, insurance numbers, or other sensitive details through website forms.',
      h2('Website assistant'),
      'The website assistant sends the messages you type to our AI service provider (OpenAI) to generate a response, along with approved information from this website. We do not store assistant conversations by default, and we ask our provider not to retain them for training. Please do not enter personal health information. The assistant cannot provide medical advice.',
      h2('Analytics and cookies'),
      'We use analytics, such as Google Analytics, to see how visitors use the site, for example which pages they visit and which buttons they click. Analytics events never include the content of forms or assistant messages. You can limit cookies through your browser settings.',
      h2('How we share information'),
      'We do not sell personal information. We share it only with service providers that help us operate the website (for example, hosting, email delivery, and analytics), or when required by law.',
      h2('Security and retention'),
      'We use reasonable safeguards to protect information sent through this website and keep it only as long as needed to respond to you or as required by law.',
      h2('Contact'),
      'Questions about this policy: [info@iwcmainline.com](mailto:info@iwcmainline.com) or [610-298-5873](tel:+16102985873).',
    ),
    'How the IWC website collects and uses information from contact forms, analytics, and the website assistant.',
  ),
  legal(
    'legal-terms',
    'Terms of Use',
    'terms',
    'The terms for using this website.',
    pt(
      h2('Educational information only'),
      'Content on this website is for general education. It is not medical advice, does not create a provider–patient relationship, and is not a substitute for an individual evaluation.',
      h2('No emergency use'),
      'Do not use this website, its forms, or its assistant for urgent or emergency needs. In an emergency, call 911.',
      h2('Website assistant'),
      'The website assistant provides general information about the practice using approved website content. It can make mistakes, cannot diagnose or recommend treatment, and does not replace speaking with our team.',
      h2('Third-party links'),
      'We may link to other websites, such as our supplement dispensary or scheduling tools. We are not responsible for their content or practices.',
      h2('Intellectual property'),
      'Text, images, and design on this website belong to Integrative Wellbeing & Chiropractic or are used with permission.',
      h2('Changes'),
      'We may update these terms. The date at the top of this page shows the latest version.',
    ),
    'Terms of use for the Integrative Wellbeing & Chiropractic website.',
  ),
  legal(
    'legal-accessibility',
    'Accessibility Statement',
    'accessibility',
    'Our commitment to an accessible website.',
    pt(
      'We want everyone to be able to use this website. We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2, Level AA.',
      h2('What we do'),
      ul([
        'Clear headings, labels, and keyboard-accessible navigation and forms',
        'Visible focus indicators and sufficient color contrast',
        'Descriptive text for meaningful images',
        'Respect for reduced-motion settings',
      ]),
      h2('Feedback'),
      'If anything on this site is difficult to use, please tell us. We will fix it and help you get the information another way. Call [610-298-5873](tel:+16102985873) or email [info@iwcmainline.com](mailto:info@iwcmainline.com).',
    ),
    'Our commitment to WCAG 2.2 AA accessibility, and how to report a barrier on the IWC website.',
  ),
  legal(
    'legal-disclaimer',
    'Clinical Disclaimer',
    'disclaimer',
    'Important information about the content on this website.',
    pt(
      h2('Not medical advice'),
      'Information on this website is general education. It is not a diagnosis or treatment recommendation for any individual. Always consult a qualified healthcare provider about your situation.',
      h2('Individual results vary'),
      'Patient experiences shared on this website reflect individual circumstances. They are not promises or guarantees of a particular outcome.',
      h2('Lab testing and programs'),
      'Direct-access lab testing is informational and does not replace a medical evaluation. Wellness programs and supplements discussed on this site are not intended to diagnose, treat, cure, or prevent any disease.',
      h2('Emergencies'),
      'If you are experiencing a medical emergency, call 911. If you are in crisis, call or text 988.',
    ),
    'Clinical and educational disclaimer for the Integrative Wellbeing & Chiropractic website.',
  ),
]

/* ------------------------------------------------------ assistant knowledge */
const know = (_id, title, body, relatedPath) => ({_id, _type: 'chatKnowledge', title, body, relatedPath, active: true})

export const chatKnowledge = [
  know(
    'know-about',
    'About IWC',
    'Integrative Wellbeing & Chiropractic (IWC) is a wellness collective of independent practitioners in Wayne, Pennsylvania, on the Philadelphia Main Line. The brand spine is Pain | Performance | Prevention, with Functional Health as a connected pathway. Care is individualized and evidence-informed; IWC collaborates with other clinicians and refers when another specialist is the better next step. The goal is better function and fewer interruptions, not dependence on care.',
    '/about',
  ),
  know(
    'know-booking',
    'How to book',
    'Visitors can book by calling 610-298-5873, emailing info@iwcmainline.com, or choosing a visit type on the Book a Visit page (/book). Visit types: New Patient Comprehensive Evaluation (new pain or musculoskeletal problem), Athlete Injury Evaluation, Performance or Golf Evaluation, Functional Health Consultation, Therapeutic Massage: Initial Visit, and Existing Patient Visit. If a visitor is unsure, suggest Start Here (/start-here) or calling the office.',
    '/book',
  ),
  know(
    'know-location',
    'Location and contact',
    'IWC is located at 123 Bloomingdale Ave, Suite 302, Wayne, PA 19087. Phone: 610-298-5873. Email: info@iwcmainline.com. Office hours and parking details are not yet published on the website; visitors should call the office for current hours.',
    '/book',
  ),
  know(
    'know-providers',
    'Referring professionals',
    'Physicians, surgeons, physical therapists, coaches, trainers, and other professionals can introduce themselves through the professional contact form on the For Providers page (/for-providers) or by calling the office. Patient health information should never be sent through the website; IWC arranges a secure method.',
    '/for-providers',
  ),
  know(
    'know-safety',
    'Emergencies and medical questions',
    'The website assistant does not provide medical advice, diagnosis, or treatment recommendations. For emergencies, call 911. For a mental health crisis, call or text 988. Questions about a specific health situation are best discussed with the IWC team directly by phone or at a visit.',
  ),
]

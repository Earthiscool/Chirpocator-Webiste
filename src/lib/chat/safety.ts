/**
 * Server-side safety screen for the website assistant.
 * Runs BEFORE anything is sent to the model.
 */

// Possible emergencies → answer immediately with emergency guidance; never call the model.
const EMERGENCY = [
  /\b(chest (pain|pressure|tightness))\b/i,
  /\b(can'?t|cannot|unable to|hard to|trouble|difficulty) breath/i,
  /\bheart attack\b/i,
  /\bstroke\b/i,
  /\b(face|arm) (is )?droop/i,
  /\b(suicid|kill myself|end my life|want to die|self[- ]harm|hurt myself)\b/i,
  /\boverdose\b/i,
  /\b(unconscious|passed out|fainted)\b/i,
  /\bsevere bleeding\b|\bbleeding (heavily|won'?t stop)\b/i,
  /\b(loss of|lost|can'?t control (my )?)(bladder|bowel)/i,
  /\bnumb(ness)? .{0,30}(groin|saddle|inner thigh)/i,
  /\b(sudden|worst) (severe )?headache\b/i,
]

export function isEmergency(text: string) {
  return EMERGENCY.some((re) => re.test(text))
}

export function emergencyReply(phone: string) {
  return [
    "If this could be an emergency, please **call 911** or go to the nearest emergency department now. If you're thinking about harming yourself, call or text **988** (Suicide & Crisis Lifeline). It's free and available 24/7.",
    '',
    `I'm a website assistant and can't help with urgent medical situations. For non-urgent questions, you can reach the IWC office at [${phone}](tel:${phone.replace(/[^\d+]/g, '')}).`,
  ].join('\n')
}

// Sensitive identifiers → redacted before the text leaves our server.
const REDACTIONS: [RegExp, string][] = [
  [/\b\d{3}[- ]?\d{2}[- ]?\d{4}\b/g, '[redacted number]'], // SSN-like
  [/\b(?:\d[ -]?){13,19}\b/g, '[redacted number]'], // card-like
  // ID-like tokens: 6+ characters, letters mixed with 4+ digits (member/policy/MRN numbers).
  // Leaves ordinary terms like "omega-3", "B12", "GLP-1" or "LZ30" alone.
  [/\b(?=(?:[A-Z-]*\d){4})(?=[A-Z0-9-]*[A-Z])[A-Z0-9-]{6,}\b/gi, '[redacted id]'],
  [/\b\d{7,}\b/g, '[redacted number]'], // long digit runs
  [/\b(0?[1-9]|1[0-2])[/-](0?[1-9]|[12]\d|3[01])[/-](19|20)?\d{2}\b/g, '[redacted date]'],
  [/\b(born|dob|date of birth)\b[^.,\n]{0,30}/gi, '[redacted date of birth]'],
  [/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted email]'],
  [/(\+?1[ .-]?)?\(?\d{3}\)?[ .-]?\d{3}[ .-]?\d{4}\b/g, '[redacted phone]'],
]

export function redactSensitive(text: string) {
  let out = text
  let redacted = false
  for (const [re, label] of REDACTIONS) {
    const next = out.replace(re, label)
    if (next !== out) redacted = true
    out = next
  }
  return {text: out, redacted}
}

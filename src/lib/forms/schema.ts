import {z} from 'zod'

const name = z.string().trim().min(2, 'Please enter your name.').max(100, 'Please shorten your name.')
const email = z.string().trim().email('Please enter a valid email address.').max(200)
const phone = z
  .string()
  .trim()
  .max(30)
  .refine((v) => !v || /^[\d\s()+.-]{7,}$/.test(v), 'Please enter a valid phone number, or leave it blank.')
  .optional()
  .default('')

export const contactTopics = [
  'A question before booking',
  'Scheduling or rescheduling',
  'Functional health or programs',
  'Existing patient',
  'Media, speaking, or partnership',
  'Something else',
] as const

export const ContactSchema = z.object({
  name,
  email,
  phone,
  topic: z.enum(contactTopics, {message: 'Please choose a topic.'}),
  preferred: z.enum(['email', 'phone']).default('email'),
  message: z.string().trim().min(5, 'Please add a short message.').max(1000, 'Please keep your message under 1,000 characters.'),
  consent: z.literal('on', {message: 'Please confirm you have read the note about health information.'}),
})

export const providerReasons = ['Refer a patient — please call me', 'Discuss collaboration', 'Something else'] as const

export const ProviderSchema = z.object({
  name,
  role: z.string().trim().min(2, 'Please add your role or credentials.').max(120),
  organization: z.string().trim().max(160).optional().default(''),
  email,
  phone,
  reason: z.enum(providerReasons, {message: 'Please choose a reason.'}),
  preferred: z.enum(['email', 'phone']).default('phone'),
  note: z.string().trim().max(600, 'Please keep your note under 600 characters.').optional().default(''),
  consent: z.literal('on', {message: 'Please confirm you have not included patient health information.'}),
})

export const NewsletterSchema = z.object({email})

export type FieldErrors = Partial<Record<string, string>>
export interface FormState {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: FieldErrors
  /** Echo non-sensitive values back so the form keeps them after an error. */
  values?: Record<string, string>
}

export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form')
    if (!out[key]) out[key] = issue.message
  }
  return out
}

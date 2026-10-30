import emailjs from '@emailjs/browser'

// EmailJS keys come from .env.local (see .env.example). The public key is meant to ship to the browser.
const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export const emailConfigured = Boolean(serviceId && templateId && publicKey)

export type HireMessage = {
  name: string
  email: string
  company: string
  role: string
  message: string
}

// Field names match the variables used in the EmailJS template: {{from_name}}, {{reply_to}}, etc.
export async function sendHireMessage(msg: HireMessage) {
  if (!emailConfigured) throw new Error('Email is not configured')
  await emailjs.send(
    serviceId,
    templateId,
    {
      from_name: msg.name,
      reply_to: msg.email,
      company: msg.company || '—',
      role: msg.role,
      message: msg.message,
    },
    { publicKey, limitRate: { throttle: 10_000 } },
  )
}

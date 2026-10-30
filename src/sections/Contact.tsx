import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { CheckIcon, RunningIcon } from '../components/icons'
import { Reveal } from '../components/Reveal'
import { Section, SectionHeading } from '../components/SectionHeading'
import { profile } from '../data/portfolio'
import { emailConfigured, sendHireMessage, type HireMessage } from '../lib/email'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const roles = ['Full-time DevOps / Platform role', 'Contract or freelance', 'Software engineering role', 'Just saying hi']

const empty: HireMessage = { name: '', email: '', company: '', role: roles[0], message: '' }

const inputClass =
  'w-full rounded-md border border-line bg-bg px-3.5 py-3 font-mono text-sm text-ink placeholder:text-dim transition-colors focus:border-accent focus:outline-none'

function Field({ flag, hint, id, children }: { flag: string; hint: string; id: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-mono text-[13px]">
        <span className="text-accent">--{flag}</span> <span className="text-faint">{hint}</span>
      </label>
      {children}
    </div>
  )
}

function mailtoFor(msg: HireMessage) {
  const body = `${msg.message}\n\n— ${msg.name}${msg.company ? `, ${msg.company}` : ''}\n${msg.email}`
  return `mailto:${profile.email}?subject=${encodeURIComponent(`[${msg.role}] from ${msg.name}`)}&body=${encodeURIComponent(body)}`
}

export function Contact() {
  const id = useId()
  const [form, setForm] = useState(empty)
  const [status, setStatus] = useState<Status>('idle')
  // Bots fill every field; people never see this one.
  const [trap, setTrap] = useState('')

  const update = (key: keyof HireMessage) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (trap) return setStatus('sent')
    if (!emailConfigured) {
      window.location.href = mailtoFor(form)
      return setStatus('sent')
    }
    setStatus('sending')
    try {
      await sendHireMessage(form)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <Section id="contact">
      <SectionHeading crumb="hire-me" title="Let's ship something together." />
      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-12">
        <Reveal className="flex flex-col gap-5">
          <p className="text-lg leading-relaxed text-muted">
            Hiring for a DevOps, platform or cloud role? Or need someone who can write the app <em>and</em> the pipeline
            that ships it? Send a message and it lands straight in my inbox.
          </p>
          <ul className="flex flex-col gap-2.5 font-mono text-sm text-soft">
            {['replies within 24 hours', 'open to remote and hybrid', 'AWS · Docker · CI/CD · Terraform'].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <CheckIcon className="size-4 shrink-0 text-accent" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-2 font-mono text-sm text-faint">
            prefer email? <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="overflow-hidden rounded-[10px] border border-line bg-panel shadow-[0_0_80px_-30px] shadow-accent/40">
            <div className="flex items-center gap-2 border-b border-line px-4.5 py-3 font-mono text-[13px] text-faint">
              <span className="size-2.75 rounded-full bg-line-strong" />
              <span className="size-2.75 rounded-full bg-line-strong" />
              <span className="size-2.75 rounded-full bg-accent" />
              <span className="ml-2">hire-me.sh</span>
            </div>

            {status === 'sent' ? (
              <div role="status" className="flex flex-col gap-2 p-6 font-mono text-sm leading-relaxed">
                <p className="text-faint">$ ./hire-me.sh --send</p>
                <p className="text-soft motion-safe:animate-pop">→ connecting to mail relay … ok</p>
                <p className="text-soft motion-safe:animate-pop">→ delivering message … ok</p>
                <p className="text-accent motion-safe:animate-pop">
                  ✓ 250 OK. thanks{form.name ? `, ${form.name.split(' ')[0]}` : ''}! I'll reply to{' '}
                  {form.email || 'you'} soon.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForm(empty)
                    setStatus('idle')
                  }}
                  className="mt-4 w-fit cursor-pointer rounded border border-line-strong px-3 py-1.5 text-xs text-soft transition-colors hover:border-accent hover:text-accent"
                >
                  ↻ send another
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-5 p-6">
                <Field flag="name" hint="<string>" id={`${id}-name`}>
                  <input
                    id={`${id}-name`}
                    required
                    autoComplete="name"
                    placeholder="Ada Lovelace"
                    value={form.name}
                    onChange={update('name')}
                    className={inputClass}
                  />
                </Field>
                <Field flag="email" hint="<reply-to>" id={`${id}-email`}>
                  <input
                    id={`${id}-email`}
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="ada@company.com"
                    value={form.email}
                    onChange={update('email')}
                    className={inputClass}
                  />
                </Field>
                <Field flag="company" hint="[optional]" id={`${id}-company`}>
                  <input
                    id={`${id}-company`}
                    autoComplete="organization"
                    placeholder="Acme Cloud"
                    value={form.company}
                    onChange={update('company')}
                    className={inputClass}
                  />
                </Field>
                <Field flag="role" hint="<type>" id={`${id}-role`}>
                  <select id={`${id}-role`} value={form.role} onChange={update('role')} className={inputClass}>
                    {roles.map((role) => (
                      <option key={role}>{role}</option>
                    ))}
                  </select>
                </Field>
                <Field flag="message" hint="<text>" id={`${id}-message`}>
                  <textarea
                    id={`${id}-message`}
                    required
                    minLength={10}
                    rows={5}
                    placeholder="Tell me about the role, the team and the stack…"
                    value={form.message}
                    onChange={update('message')}
                    data-lenis-prevent
                    className={`${inputClass} resize-y`}
                  />
                </Field>
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={trap}
                  onChange={(e) => setTrap(e.target.value)}
                  className="hidden"
                />

                {status === 'error' && (
                  <p role="alert" className="font-mono text-sm text-accent">
                    ✗ send failed. try again, or{' '}
                    <a href={mailtoFor(form)} className="underline">
                      email me directly
                    </a>
                    .
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-md bg-accent px-5 py-3.5 font-mono text-[15px] font-semibold text-bg transition hover:-translate-y-0.5 hover:bg-accent-hover disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {status === 'sending' ? (
                    <>
                      <RunningIcon className="size-4" /> sending…
                    </>
                  ) : (
                    '$ ./hire-me.sh --send'
                  )}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

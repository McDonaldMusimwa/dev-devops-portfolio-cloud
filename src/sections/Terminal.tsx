import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Reveal } from '../components/Reveal'
import { Section, SectionHeading } from '../components/SectionHeading'
import { certification, engineer, jobs, profile, projects, sections } from '../data/portfolio'
import { setTheme, toggleTheme } from '../hooks/useTheme'
import { scrollToId } from '../lib/scroll'

type Line = { id: number; node: ReactNode }
type Command = { description: string; run: (args: string[]) => ReactNode }

const Prompt = () => (
  <>
    <span className="text-accent">visitor@mcdonald</span>:<span className="text-soft">~</span>$
  </>
)

const sectionIds = sections.map((s) => s.id).filter((id) => id !== 'terminal')

function list(values: string | string[]) {
  return Array.isArray(values) ? values.join(', ') : values
}

const commands: Record<string, Command> = {
  help: {
    description: 'list available commands',
    run: () => (
      <div className="grid grid-cols-[auto_1fr] gap-x-6">
        {Object.entries(commands).map(([name, cmd]) => (
          <div key={name} className="contents">
            <span className="text-accent">{name}</span>
            <span className="text-muted">{cmd.description}</span>
          </div>
        ))}
      </div>
    ),
  },
  whoami: {
    description: 'who is McDonald?',
    run: () => (
      <>
        <div className="font-semibold text-ink">{profile.name}</div>
        <div className="text-muted">{profile.summary}</div>
      </>
    ),
  },
  skills: {
    description: 'what I work with',
    run: () => (
      <div className="grid grid-cols-[auto_1fr] gap-x-6">
        {(['cloud', 'ship', 'code', 'data', 'learning'] as const).map((key) => (
          <div key={key} className="contents">
            <span className="text-accent">{key}</span>
            <span>{list(engineer[key] ?? [])}</span>
          </div>
        ))}
      </div>
    ),
  },
  projects: {
    description: 'things I built',
    run: () => (
      <ul className="flex flex-col gap-1">
        {projects.map((p) => (
          <li key={p.repo}>
            <span className="text-ink">{p.title}</span> <span className="text-faint">[{p.kind}]</span>{' '}
            {p.links.map((link) => (
              <a key={link.label} href={link.href} className="mr-3" target="_blank" rel="noreferrer">
                {link.label}↗
              </a>
            ))}
          </li>
        ))}
      </ul>
    ),
  },
  experience: {
    description: 'where I have worked',
    run: () => (
      <ul className="flex flex-col gap-1">
        {jobs.map((job) => (
          <li key={job.rev}>
            <span className="text-accent">rev {job.rev}</span> <span className="text-faint">{job.period}</span>{' '}
            {job.role} @ {job.company}
          </li>
        ))}
      </ul>
    ),
  },
  certs: {
    description: 'certifications',
    run: () => (
      <>
        <span className="text-ink">{certification.title}</span>{' '}
        <a href={certification.href} target="_blank" rel="noreferrer">
          verify↗
        </a>
      </>
    ),
  },
  contact: {
    description: 'how to reach me',
    run: () => (
      <div className="flex flex-wrap gap-x-4">
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        {profile.socials.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
            {s.label}↗
          </a>
        ))}
      </div>
    ),
  },
  ls: {
    description: 'list the sections of this site',
    run: () => (
      <div className="flex flex-wrap gap-x-5">
        {sections
          .filter((s) => s.id !== 'terminal')
          .map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.file}
            </a>
          ))}
      </div>
    ),
  },
  cd: {
    description: `jump to a section: cd ${sectionIds.join('|')}`,
    run: ([target]) => {
      const id = sectionIds.find((s) => s === target?.replace(/^[./~]+|\/$/g, ''))
      if (!id) return <span className="text-muted">usage: cd {sectionIds.join(' | ')}</span>
      window.setTimeout(() => scrollToId(id), 250)
      return <span className="text-muted">→ jumping to #{id}</span>
    },
  },
  theme: {
    description: 'switch theme: theme [light|dark]',
    run: ([mode]) => {
      if (mode === 'light' || mode === 'dark') setTheme(mode)
      else toggleTheme()
      return <span className="text-muted">theme updated ✓</span>
    },
  },
  resume: {
    description: 'open my résumé',
    run: () => (
      <a href={profile.resume} target="_blank" rel="noreferrer">
        resume.pdf↗
      </a>
    ),
  },
  'sudo hire-me': {
    description: 'you know you want to',
    run: () => {
      window.setTimeout(() => scrollToId('contact'), 900)
      return (
        <>
          <div className="text-faint">[sudo] password for recruiter: ********</div>
          <div className="text-accent">✓ access granted. excellent decision.</div>
          <div>
            → opening <a href="#contact">hire-me.sh</a> ·{' '}
            <a href={profile.resume} target="_blank" rel="noreferrer">
              résumé↗
            </a>
          </div>
        </>
      )
    },
  },
  clear: { description: 'clear the screen', run: () => null },
}

const suggestions = ['help', 'whoami', 'skills', 'projects', 'cd blog', 'theme', 'sudo hire-me']

const welcome: Line = {
  id: 0,
  node: (
    <span className="text-muted">
      Welcome to McDonald's shell. Type <span className="text-accent">help</span> or click a command below.
    </span>
  ),
}

function resolve(input: string): ReactNode {
  const [name = '', ...args] = input.split(/\s+/)
  if (input === 'sudo hire-me') return commands['sudo hire-me'].run([])
  if (name === 'sudo') return <span className="text-muted">nice try. the only sudo command here is: sudo hire-me</span>
  if (name === 'hire-me') return <span className="text-muted">permission denied. try: sudo hire-me</span>
  const command = commands[name]
  if (!command) {
    return (
      <span className="text-muted">
        command not found: {name}. Type <span className="text-accent">help</span> for options.
      </span>
    )
  }
  return command.run(args)
}

export function Terminal() {
  const [lines, setLines] = useState<Line[]>([welcome])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const nextId = useRef(1)
  const output = useRef<HTMLDivElement>(null)
  const field = useRef<HTMLInputElement>(null)

  useEffect(() => {
    output.current?.scrollTo({ top: output.current.scrollHeight, behavior: 'smooth' })
  }, [lines])

  const run = (raw: string) => {
    const command = raw.trim().replace(/\s+/g, ' ')
    setInput('')
    setHistoryIndex(-1)
    if (!command) return
    setHistory((h) => [command, ...h].slice(0, 50))

    if (command === 'clear') {
      setLines([])
      return
    }
    const echo: Line = {
      id: nextId.current++,
      node: (
        <>
          <Prompt /> <span className="text-ink">{command}</span>
        </>
      ),
    }
    const result: Line = { id: nextId.current++, node: resolve(command) }
    setLines((current) => [...current, echo, result])
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      run(input)
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      const next = Math.max(-1, Math.min(history.length - 1, historyIndex + (event.key === 'ArrowUp' ? 1 : -1)))
      setHistoryIndex(next)
      setInput(next === -1 ? '' : (history[next] ?? ''))
    } else if (event.key === 'Tab' && input) {
      const match = Object.keys(commands).find((name) => name.startsWith(input))
      if (match) {
        event.preventDefault()
        setInput(match)
      }
    } else if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault()
      setLines([])
    }
  }

  return (
    <Section id="terminal">
      <SectionHeading crumb="cloud-shell" title="Don't just read it. Run it." />
      <Reveal>
        <div className="overflow-hidden rounded-[10px] border border-line bg-panel font-mono text-sm">
          <div className="flex items-center gap-2 border-b border-line px-4 py-3">
            <span className="size-2.75 rounded-full bg-line-strong" />
            <span className="size-2.75 rounded-full bg-line-strong" />
            <span className="size-2.75 rounded-full bg-accent" />
            <span className="ml-2 text-[13px] text-faint">bash — visitor@mcdonald</span>
          </div>
          {/* Clicking anywhere in the body focuses the prompt, like a real terminal. */}
          <div onClick={() => field.current?.focus({ preventScroll: true })} className="cursor-text px-5 pt-4 pb-5">
            <div
              ref={output}
              data-lenis-prevent
              role="log"
              aria-live="polite"
              className="flex h-72 flex-col gap-2 overflow-y-auto pr-2 leading-relaxed text-soft sm:h-80"
            >
              {lines.map((line) => (
                <div key={line.id}>{line.node}</div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
              <label htmlFor="terminal-input" className="shrink-0">
                <Prompt />
                <span className="sr-only">Terminal command</span>
              </label>
              <input
                id="terminal-input"
                ref={field}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder="type a command…"
                className="min-w-0 flex-1 bg-transparent text-ink caret-accent outline-none placeholder:text-dim"
              />
            </div>
          </div>
        </div>
      </Reveal>
      <Reveal delay={150} className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => run(s)}
            className="cursor-pointer rounded-md border border-line bg-panel px-3.5 py-2.5 font-mono text-[13px] text-soft transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            $ {s}
          </button>
        ))}
      </Reveal>
    </Section>
  )
}

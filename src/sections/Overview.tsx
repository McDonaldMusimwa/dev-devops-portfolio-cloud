import { useEffect, useState } from 'react'
import { CheckIcon, QueuedIcon, RunningIcon } from '../components/icons'
import { Reveal } from '../components/Reveal'
import { ScrambleText, Typewriter } from '../components/TextEffects'
import { pipeline, profile, skills, stats, type PipelineStep } from '../data/portfolio'
import { prefersReducedMotion } from '../lib/motion'

// Eases a number up from zero once, after `delay` ms.
function CountUp({ value, delay }: { value: number; delay: number }) {
  const [shown, setShown] = useState(() => (prefersReducedMotion() ? value : 0))

  useEffect(() => {
    if (prefersReducedMotion()) return
    let frame = 0
    const start = performance.now() + delay
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / 900))
      setShown(Math.round(value * (1 - (1 - t) ** 3)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, delay])

  return <>{shown}</>
}

function SkillHealth() {
  const healthy = skills.filter((s) => s.status === 'production').length

  return (
    <div className="h-full overflow-hidden rounded-[10px] border border-line bg-panel">
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <h2 className="text-[15px] font-bold">Skill health</h2>
        <span className="font-mono text-xs text-faint">
          {healthy}/{skills.length} healthy
        </span>
      </div>
      <ul className="font-mono text-[13px]">
        {skills.map((skill, i) => {
          const live = skill.status === 'production'
          return (
            <li
              key={skill.name}
              className="flex items-center gap-3 border-b border-line-soft px-5 py-2.75 transition-colors last:border-b-0 hover:bg-raised"
            >
              {live ? (
                <span className="relative flex size-2 shrink-0">
                  <span
                    className="absolute inline-flex size-full rounded-full bg-accent opacity-60 motion-safe:animate-ping"
                    style={{ animationDelay: `${i * 300}ms`, animationDuration: '2.4s' }}
                  />
                  <span className="relative inline-flex size-2 rounded-full bg-accent" />
                </span>
              ) : (
                <span className="size-2 shrink-0 rounded-full border-2 border-faint" />
              )}
              <span className="min-w-0 flex-1 truncate">{skill.name}</span>
              {live ? (
                <span className="text-accent">Production</span>
              ) : (
                <span className="relative overflow-hidden text-muted">
                  Provisioning
                  <span className="absolute inset-x-0 bottom-0 h-px overflow-hidden bg-line-strong">
                    <span className="block h-full w-1/3 bg-accent motion-safe:animate-shimmer" />
                  </span>
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// The pipeline "runs" up to the step marked running in the data, then stays there.
const stopAt = pipeline.findIndex((step) => step.status === 'running')

function statusAt(index: number, cursor: number): PipelineStep['status'] {
  if (index < cursor) return 'passed'
  if (index === cursor) return 'running'
  return 'queued'
}

const statusLabel = { passed: 'Passed', running: 'Running', queued: 'Pending' }

function CareerPipeline() {
  const [cursor, setCursor] = useState(() => (prefersReducedMotion() ? stopAt : -1))

  useEffect(() => {
    if (cursor >= stopAt) return
    const timer = window.setTimeout(() => setCursor((c) => c + 1), cursor < 0 ? 1200 : 600)
    return () => window.clearTimeout(timer)
  }, [cursor])

  const running = cursor < stopAt

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[10px] border border-line bg-panel">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <h2 className="text-[15px] font-bold">Career pipeline</h2>
        <button
          type="button"
          onClick={() => setCursor(-1)}
          disabled={running}
          className="cursor-pointer rounded border border-line-strong px-2.5 py-1 font-mono text-xs text-soft transition-colors hover:border-accent hover:text-accent disabled:cursor-default disabled:border-transparent disabled:text-accent"
        >
          {running ? '● executing' : '↻ re-run'}
        </button>
      </div>
      <ol className="flex flex-1 flex-col gap-2.5 p-5 text-sm">
        {pipeline.map((step, i) => {
          const status = statusAt(i, cursor)
          return (
            <li
              key={step.name}
              className={`group relative flex items-center gap-3.5 overflow-hidden rounded-lg border px-3.5 py-3 transition duration-300 hover:translate-x-1 ${
                status === 'running'
                  ? 'border-accent bg-accent/10'
                  : status === 'passed'
                    ? 'border-transparent bg-raised hover:border-line-strong'
                    : 'border-dashed border-line-strong hover:border-accent'
              }`}
            >
              <span
                className={`w-16 shrink-0 font-mono text-xs tracking-wide uppercase ${
                  status === 'running' ? 'text-accent' : 'text-faint'
                }`}
              >
                {step.name}
              </span>
              <span className={`min-w-0 flex-1 ${status === 'queued' ? 'text-soft' : ''}`}>{step.detail}</span>
              <span
                className={`flex shrink-0 items-center gap-1.5 text-[13px] ${
                  status === 'running' ? 'text-accent' : 'text-muted'
                }`}
              >
                {status === 'passed' && <CheckIcon className="size-3.5 motion-safe:animate-pop" />}
                {status === 'running' && <RunningIcon className="size-3.5" />}
                {status === 'queued' && <QueuedIcon className="size-3.5" />}
                <span className="hidden sm:inline">{statusLabel[status]}</span>
              </span>
              {status === 'running' && (
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden">
                  <span className="block h-full w-1/3 bg-accent motion-safe:animate-shimmer" />
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export function Overview() {
  const [first, last] = profile.name.split(' ')

  return (
    <section id="home" className="flex flex-col gap-6 pt-8">
      <p className="font-mono text-[13px] text-faint">
        console › {profile.handle} › <span className="text-ink">overview</span>
      </p>
      <div className="flex max-w-215 flex-col gap-5">
        <h1 className="text-[clamp(40px,5.5vw,68px)] leading-[1.02] font-extrabold tracking-[-0.03em]">
          <ScrambleText text={`${first} ${last}`} delay={300} />
          <br />
          <span className="text-accent">
            <Typewriter text={profile.title} delay={900} speed={55} />
          </span>
        </h1>
        <Reveal delay={600}>
          <p className="text-lg leading-relaxed text-muted sm:text-[19px]">{profile.summary}</p>
        </Reveal>
        <Reveal delay={750} className="flex flex-wrap gap-3">
          <a
            href="#contact"
            className="group relative overflow-hidden rounded-lg bg-accent px-5.5 py-3.5 text-[15px] font-bold text-bg shadow-[0_0_40px_-12px] shadow-accent transition hover:-translate-y-0.5 hover:bg-accent-hover hover:text-bg"
          >
            Hire me →
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/40 opacity-0 transition-[left,opacity] duration-700 group-hover:left-[120%] group-hover:opacity-100"
            />
          </a>
          <a
            href="#projects"
            className="rounded-lg border border-line-strong bg-panel px-5.5 py-3.5 text-[15px] font-semibold text-ink transition hover:-translate-y-0.5 hover:border-accent hover:text-ink"
          >
            View workloads
          </a>
          <a
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-line-strong bg-panel px-5.5 py-3.5 text-[15px] font-semibold text-ink transition hover:-translate-y-0.5 hover:border-accent hover:text-ink"
          >
            Download résumé
          </a>
        </Reveal>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal
            key={stat.label}
            delay={900 + i * 90}
            className="group flex flex-col gap-1 rounded-[10px] border border-line bg-panel px-5 py-4.5 transition-colors hover:border-accent"
          >
            <span className="text-[13px] text-muted">{stat.label}</span>
            <span
              className={`text-[32px] font-extrabold tabular-nums ${typeof stat.value === 'string' ? 'text-accent' : ''}`}
            >
              {typeof stat.value === 'number' ? <CountUp value={stat.value} delay={1000 + i * 90} /> : stat.value}
            </span>
          </Reveal>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Reveal delay={200}>
          <SkillHealth />
        </Reveal>
        <Reveal delay={300}>
          <CareerPipeline />
        </Reveal>
      </div>
    </section>
  )
}

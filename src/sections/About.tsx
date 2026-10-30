import { Fragment, useEffect, useState, type ReactNode } from 'react'
import { Headshot } from '../components/Headshot'
import { Reveal } from '../components/Reveal'
import { Section, SectionHeading } from '../components/SectionHeading'
import { about, describe } from '../data/portfolio'
import { useInView } from '../hooks/useInView'
import { prefersReducedMotion } from '../lib/motion'

const lines: ReactNode[] = [
  ...describe.fields.map(([key, value], i) => (
    <Fragment key={i}>
      <span className="text-accent">{key ? `${key}:` : ''}</span>
      {' '.repeat(14 - (key ? key.length + 1 : 0))}
      {value}
    </Fragment>
  )),
  <span key="events" className="mt-2 inline-block text-accent">Events:</span>,
  <span key="head" className="text-faint">{'  TYPE     REASON      FROM'}</span>,
  ...describe.events.map(([type, reason, from]) => `  ${type.padEnd(9)}${reason.padEnd(12)}${from}`),
]

// Prints `kubectl describe` output a line at a time once it scrolls into view.
function Describe() {
  const [ref, inView] = useInView<HTMLDivElement>()
  const [shown, setShown] = useState(() => (prefersReducedMotion() ? lines.length : 0))

  useEffect(() => {
    if (!inView || shown >= lines.length) return
    const timer = window.setTimeout(() => setShown((n) => n + 1), shown === 0 ? 500 : 90)
    return () => window.clearTimeout(timer)
  }, [inView, shown])

  return (
    <div
      ref={ref}
      className="h-full overflow-x-auto rounded-[10px] border border-line bg-sunken px-5.5 py-5 font-mono text-[13px] leading-[1.85]"
    >
      <div className="whitespace-pre text-faint">
        $ kubectl describe engineer mcdonald
        {shown < lines.length && <span className="text-accent motion-safe:animate-blink">▌</span>}
      </div>
      {/* Every line is rendered so the panel keeps its height; unrevealed ones stay invisible. */}
      {lines.map((line, i) => (
        <div
          key={i}
          className={`whitespace-pre transition-opacity duration-200 ${i < shown ? 'opacity-100' : 'opacity-0'}`}
        >
          {line}
        </div>
      ))}
    </div>
  )
}

export function About() {
  return (
    <Section id="about">
      <SectionHeading crumb="about" title="About me" />
      <div className="grid gap-4 xl:grid-cols-2">
        <Reveal>
          <Describe />
        </Reveal>
        <Reveal delay={120}>
          <div className="flex h-full flex-col gap-5 rounded-[10px] border border-line bg-panel p-7">
            <Headshot />
            <h3 className="text-[26px] leading-tight font-extrabold">{about.title}</h3>
            {about.paragraphs.map((p) => (
              <p key={p} className="leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

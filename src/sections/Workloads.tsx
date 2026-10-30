import { Fragment, type PointerEvent } from 'react'
import { Reveal } from '../components/Reveal'
import { Section, SectionHeading } from '../components/SectionHeading'
import { projects, type Project } from '../data/portfolio'

// Tracks the pointer so the card's glow follows it.
function trackPointer(event: PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty('--x', `${event.clientX - rect.left}px`)
  event.currentTarget.style.setProperty('--y', `${event.clientY - rect.top}px`)
}

// On hover the request "travels" through the architecture: each hop lights up in turn.
function Flow({ nodes }: { nodes: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-line bg-sunken p-3.5 font-mono text-xs">
      {nodes.map((node, i) => {
        const last = i === nodes.length - 1
        const delay = { transitionDelay: `${i * 140}ms` }
        return (
          <Fragment key={node}>
            {i > 0 && (
              <span
                aria-hidden="true"
                style={delay}
                className="text-dim transition-colors duration-200 group-hover:text-accent"
              >
                →
              </span>
            )}
            <span
              style={delay}
              className={`rounded-md border px-2.5 py-1.5 transition-colors duration-200 ${
                last
                  ? 'border-accent text-accent group-hover:bg-accent group-hover:text-bg'
                  : 'border-line-strong group-hover:border-accent group-hover:text-accent'
              }`}
            >
              {node}
            </span>
          </Fragment>
        )
      })}
    </div>
  )
}

function WorkloadCard({ project }: { project: Project }) {
  return (
    <article
      onPointerMove={trackPointer}
      className="group relative flex h-full flex-col gap-3.5 overflow-hidden rounded-[10px] border border-line bg-panel p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/60"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--x, 50%) var(--y, 0%), color-mix(in oklab, var(--color-accent) 12%, transparent), transparent 70%)',
        }}
      />
      <div className="relative flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-[22px] font-extrabold">{project.title}</h3>
        <span
          className={`rounded border px-2 py-0.5 font-mono text-xs ${
            project.featured ? 'border-accent text-accent' : 'border-line-strong text-muted'
          }`}
        >
          {project.kind}
        </span>
      </div>
      <p className="relative leading-relaxed text-muted">{project.description}</p>
      <div className="relative">
        <Flow nodes={project.flow} />
      </div>
      <div className="relative mt-auto flex items-center gap-5 text-sm font-bold">
        {project.links.map((link) => (
          <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="py-2">
            {link.label} ↗
          </a>
        ))}
        <span className="ml-auto flex items-center gap-2 font-mono text-xs font-normal text-faint">
          <span className="size-1.5 rounded-full bg-accent" />
          healthy
        </span>
      </div>
    </article>
  )
}

export function Workloads() {
  return (
    <Section id="projects">
      <SectionHeading crumb="workloads" title="Projects" />
      <div className="grid gap-4 xl:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.repo} delay={(i % 2) * 120}>
            <WorkloadCard project={project} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

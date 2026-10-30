import { Reveal } from '../components/Reveal'
import { Section, SectionHeading } from '../components/SectionHeading'
import { jobs } from '../data/portfolio'

const head = 'border-b border-line px-5 py-3.5 font-medium'

export function Deployments() {
  return (
    <Section id="experience">
      <SectionHeading crumb="deployments" title="Experience · deployment history" />
      <Reveal>
        <div className="overflow-x-auto rounded-[10px] border border-line bg-panel">
          <table className="w-full min-w-190 border-collapse text-sm">
            <thead>
              <tr className="text-left font-mono text-xs tracking-wider text-faint uppercase">
                <th className={head}>Rev</th>
                <th className={head}>Release</th>
                <th className={head}>Change notes</th>
                <th className={head}>Period</th>
                <th className={head}>Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.rev}
                  className="group border-b border-line align-top transition-colors last:border-b-0 hover:bg-raised"
                >
                  <td
                    className={`relative p-5 font-mono ${job.active ? 'text-accent' : 'text-muted'}`}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 w-0.5 bg-accent opacity-0 transition-opacity group-hover:opacity-100"
                    />
                    {job.rev}
                  </td>
                  <td className="p-5">
                    <div className="font-extrabold">{job.role}</div>
                    <div className="text-muted">{job.company}</div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-wrap gap-1.5">
                      {job.notes.map((note) => (
                        <span
                          key={note}
                          className="rounded border border-line-strong px-2 py-1 text-[13px] text-muted transition-colors group-hover:border-accent/50 group-hover:text-soft"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-5 font-mono text-[13px] whitespace-nowrap">{job.period}</td>
                  <td className="p-5">
                    {job.active ? (
                      <span className="inline-flex items-center gap-1.5 rounded bg-accent px-2 py-1 font-mono text-xs font-semibold text-bg">
                        <span className="size-1.5 rounded-full bg-bg motion-safe:animate-pulse" />
                        Active
                      </span>
                    ) : (
                      <span className="rounded border border-line-strong px-2 py-1 font-mono text-xs text-soft">
                        Superseded
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </Section>
  )
}

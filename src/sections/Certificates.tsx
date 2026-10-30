import { ShieldCheckIcon } from '../components/icons'
import { Reveal } from '../components/Reveal'
import { Section, SectionHeading } from '../components/SectionHeading'
import { certification, degree } from '../data/portfolio'

const card = 'flex h-full flex-col gap-3 rounded-[10px] border bg-panel p-6 transition duration-300 hover:-translate-y-1'

export function Certificates() {
  return (
    <Section id="education">
      <SectionHeading crumb="certificates" title="Education & certificates" />
      <div className="grid gap-4 xl:grid-cols-2">
        <Reveal>
          <div className={`${card} border-accent hover:shadow-[0_0_60px_-25px] hover:shadow-accent`}>
            <div className="flex justify-between gap-3 font-mono text-xs">
              <span className="text-faint">TYPE: certification</span>
              <span className="flex items-center gap-1.5 text-accent">
                <ShieldCheckIcon className="size-4" /> ISSUED
              </span>
            </div>
            <h3 className="text-[22px] leading-tight font-extrabold">{certification.title}</h3>
            <p className="leading-relaxed text-muted">{certification.description}</p>
            <a href={certification.href} target="_blank" rel="noreferrer" className="mt-auto py-2 text-sm font-bold">
              Verify on Credly ↗
            </a>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className={`${card} border-line hover:border-line-strong`}>
            <div className="flex justify-between gap-3 font-mono text-xs">
              <span className="text-faint">TYPE: degree</span>
              <span className="text-soft">● COMPLETED</span>
            </div>
            <h3 className="text-[22px] leading-tight font-extrabold">{degree.title}</h3>
            <p className="leading-relaxed text-muted">{degree.description}</p>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

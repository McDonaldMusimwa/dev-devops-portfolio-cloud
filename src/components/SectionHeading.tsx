import type { ReactNode } from 'react'
import { profile } from '../data/portfolio'
import { Reveal } from './Reveal'

type Props = {
  crumb: string
  title: string
  aside?: ReactNode
}

// Console-style breadcrumb above each section title.
export function SectionHeading({ crumb, title, aside }: Props) {
  return (
    <Reveal className="flex flex-wrap items-end justify-between gap-3">
      <div className="flex flex-col gap-2">
        <p className="font-mono text-[13px] text-faint">
          console › {profile.handle} › <span className="text-ink">{crumb}</span>
        </p>
        <h2 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">{title}</h2>
      </div>
      {aside}
    </Reveal>
  )
}

export function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-20 flex-col gap-5 pt-18 first:pt-8">
      {children}
    </section>
  )
}

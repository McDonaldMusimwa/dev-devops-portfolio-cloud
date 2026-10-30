import { useEffect, useState } from 'react'
import { profile, sections, type SectionId } from '../data/portfolio'
import { SectionIcon } from './SectionIcon'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

// Counts up from page load, like a console session timer.
function SessionTimer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <span>
      session: {pad(Math.floor(seconds / 3600))}:{pad(Math.floor(seconds / 60) % 60)}:{pad(seconds % 60)}
    </span>
  )
}

export function Sidebar({ active }: { active: SectionId }) {
  return (
    <aside className="sticky top-15.25 hidden h-[calc(100dvh-61px)] w-60 shrink-0 flex-col overflow-y-auto border-r border-line bg-sunken px-3 py-6 lg:flex">
      <p className="mb-2 px-3 font-mono text-xs tracking-widest text-faint uppercase">Resources</p>
      <nav aria-label="Main" className="flex flex-col gap-0.5 text-[15px] font-medium">
        {sections.map(({ id, label }) => {
          const isActive = id === active
          return (
            <a
              key={id}
              href={`#${id}`}
              aria-current={isActive ? 'location' : undefined}
              className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                isActive ? 'bg-accent/10 text-accent hover:text-accent' : 'text-soft hover:bg-raised hover:text-ink'
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent transition-opacity ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <SectionIcon id={id} className="size-4.5" />
              {label}
            </a>
          )
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-1.5 border-t border-line px-3 pt-4 font-mono text-xs text-faint">
        <span>account: {profile.account}</span>
        <span>cert: aws-saa</span>
        <span>region: remote</span>
        <SessionTimer />
      </div>
    </aside>
  )
}

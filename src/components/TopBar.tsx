import { profile, sections, type SectionId } from '../data/portfolio'
import { useTheme } from '../hooks/useTheme'
import { CubeIcon, MoonIcon, SearchIcon, SunIcon } from './icons'
import { ScrollProgress } from './ScrollProgress'
import { SectionIcon } from './SectionIcon'

type Props = {
  active: SectionId
  onSearch: () => void
}

export function TopBar({ active, onSearch }: Props) {
  const { theme, toggle } = useTheme()
  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-panel/90 backdrop-blur-md">
      <div className="flex h-15 items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <a href="#home" className="flex shrink-0 items-center gap-2.5 font-extrabold text-ink hover:text-ink">
          <CubeIcon className="size-6 text-accent" />
          {profile.handle}
          <span className="-ml-2 font-medium text-faint">/console</span>
        </a>

        <button
          type="button"
          onClick={onSearch}
          className="group ml-auto flex cursor-pointer items-center gap-2.5 rounded-md border border-line bg-sunken px-3 py-2 font-mono text-[13px] text-faint transition-colors hover:border-accent hover:text-ink md:ml-6 md:w-72"
        >
          <SearchIcon className="size-4" />
          <span className="hidden md:inline">Search resources…</span>
          <kbd className="ml-auto hidden rounded border border-line-strong px-1.5 text-[11px] md:inline">Ctrl K</kbd>
          <span className="sr-only md:hidden">Search</span>
        </button>

        <span className="ml-auto hidden items-center gap-2 rounded-md border border-line px-3 py-1.5 font-mono text-[13px] text-faint xl:flex">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full rounded-full bg-accent opacity-75 motion-safe:animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          status: {profile.availability}
        </span>

        <button
          type="button"
          onClick={toggle}
          aria-label={`Switch to ${nextTheme} mode`}
          title={`Switch to ${nextTheme} mode`}
          className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-md border border-line text-muted transition-colors hover:border-accent hover:text-accent md:ml-auto xl:ml-0"
        >
          {theme === 'dark' ? <SunIcon className="size-4.5" /> : <MoonIcon className="size-4.5" />}
        </button>
        <a
          href="#contact"
          className="shrink-0 rounded-md bg-accent px-4 py-2.5 text-sm font-bold text-bg transition hover:bg-accent-hover hover:text-bg"
        >
          Hire me
        </a>
      </div>

      {/* The sidebar takes over navigation on large screens. */}
      <nav
        aria-label="Sections"
        className="flex overflow-x-auto border-t border-line px-2 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
      >
        {sections.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={id === active ? 'location' : undefined}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-[13px] font-semibold ${
              id === active ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            <SectionIcon id={id} className="size-3.5" />
            {label}
          </a>
        ))}
      </nav>
      <ScrollProgress />
    </header>
  )
}

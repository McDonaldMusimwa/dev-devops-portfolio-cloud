import { profile, sections, type SectionId } from '../data/portfolio'
import { useMobileMenu } from '../hooks/useMobileMenu'
import { useTheme } from '../hooks/useTheme'
import { CloseIcon, CubeIcon, MenuIcon, MoonIcon, SearchIcon, SunIcon } from './icons'
import { ScrollProgress } from './ScrollProgress'
import { SectionIcon } from './SectionIcon'

type Props = {
  active: SectionId
  onSearch: () => void
}

const iconButton =
  'grid size-10 shrink-0 cursor-pointer place-items-center rounded-md border border-line text-muted transition-colors hover:border-accent hover:text-accent'

export function TopBar({ active, onSearch }: Props) {
  const { theme, toggle } = useTheme()
  const nextTheme = theme === 'dark' ? 'light' : 'dark'
  // The sidebar takes over navigation from lg up; below that the sections live in this menu.
  const { headerRef, ...menu } = useMobileMenu('(min-width: 64rem)')

  return (
    <header ref={headerRef} className="sticky top-0 z-30 border-b border-line bg-panel/90 backdrop-blur-md">
      <div className="flex h-15 items-center gap-2 px-4 sm:gap-4 sm:px-6">
        <a href="#home" className="flex min-w-0 items-center gap-2.5 font-extrabold text-ink hover:text-ink">
          <CubeIcon className="size-6 shrink-0 text-accent" />
          <span className="truncate">{profile.handle}</span>
          <span className="-ml-2 hidden font-medium text-faint sm:inline">/console</span>
        </a>

        <button
          type="button"
          onClick={onSearch}
          className="group ml-auto flex size-10 shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-md border border-line bg-sunken font-mono text-[13px] text-faint transition-colors hover:border-accent hover:text-ink md:ml-6 md:size-auto md:w-72 md:justify-start md:px-3 md:py-2"
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
          className={`${iconButton} md:ml-auto xl:ml-0`}
        >
          {theme === 'dark' ? <SunIcon className="size-4.5" /> : <MoonIcon className="size-4.5" />}
        </button>
        <a
          href="#contact"
          className="hidden shrink-0 rounded-md bg-accent px-4 py-2.5 text-sm font-bold text-bg transition hover:bg-accent-hover hover:text-bg sm:block"
        >
          Hire me
        </a>
        <button
          type="button"
          onClick={menu.toggle}
          aria-label={menu.open ? 'Close menu' : 'Open menu'}
          aria-expanded={menu.open}
          aria-controls="mobile-menu"
          className={`${iconButton} lg:hidden ${menu.open ? 'border-accent text-accent' : ''}`}
        >
          {menu.open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
        </button>
      </div>

      {menu.open && (
        <nav
          id="mobile-menu"
          aria-label="Sections"
          data-lenis-prevent
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-b border-line bg-sunken px-3 py-4 shadow-lg lg:hidden"
        >
          <p className="mb-2 px-3 font-mono text-xs tracking-widest text-faint uppercase">Resources</p>
          <ul className="flex flex-col gap-0.5 text-[15px] font-medium">
            {sections.map(({ id, label }) => {
              const isActive = id === active
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={menu.close}
                    aria-current={isActive ? 'location' : undefined}
                    className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                      isActive ? 'bg-accent/10 text-accent hover:text-accent' : 'text-soft hover:bg-raised hover:text-ink'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent ${isActive ? 'opacity-100' : 'opacity-0'}`}
                    />
                    <SectionIcon id={id} className="size-4.5" />
                    {label}
                  </a>
                </li>
              )
            })}
          </ul>
          <p className="mt-3 flex items-center gap-2 border-t border-line px-3 pt-4 font-mono text-xs text-faint">
            <span className="size-2 rounded-full bg-accent" />
            status: {profile.availability}
          </p>
        </nav>
      )}
      <ScrollProgress />
    </header>
  )
}

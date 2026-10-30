import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { profile, sections } from '../data/portfolio'
import { toggleTheme } from '../hooks/useTheme'
import { scrollToId } from '../lib/scroll'
import { MoonIcon, SearchIcon, SendIcon } from './icons'
import { SectionIcon } from './SectionIcon'

type Item = { id: string; group: string; label: string; hint: string; icon: ReactNode; run: () => void }

const external = (href: string) => () => window.open(href, '_blank', 'noopener')

const items: Item[] = [
  ...sections.map(({ id, label, crumb }) => ({
    id: `go-${id}`,
    group: 'Go to',
    label,
    hint: `console › ${crumb}`,
    icon: <SectionIcon id={id} className="size-4" />,
    run: () => scrollToId(id),
  })),
  {
    id: 'theme',
    group: 'Actions',
    label: 'Toggle light / dark',
    hint: 'theme',
    icon: <MoonIcon className="size-4" />,
    run: toggleTheme,
  },
  {
    id: 'resume',
    group: 'Actions',
    label: 'Open résumé',
    hint: 'resume.pdf ↗',
    icon: <SendIcon className="size-4" />,
    run: external(profile.resume),
  },
  ...profile.socials.map((social) => ({
    id: social.label,
    group: 'Links',
    label: social.label,
    hint: social.href.replace(/^https:\/\/(www\.)?/, ''),
    icon: <span className="grid size-4 place-items-center text-[10px] font-bold">↗</span>,
    run: external(social.href),
  })),
]

type Props = { open: boolean; onClose: () => void; onOpen: () => void }

// Ctrl/⌘+K jump-to-anything search, like a cloud console's resource search.
export function CommandPalette({ open, onClose, onOpen }: Props) {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const field = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      const typing = event.target instanceof HTMLElement && event.target.closest('input, textarea, select')
      if ((event.key === 'k' && (event.metaKey || event.ctrlKey)) || (event.key === '/' && !typing)) {
        event.preventDefault()
        if (open) onClose()
        else onOpen()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpen, onClose])

  useEffect(() => {
    if (open) field.current?.focus()
  }, [open])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? items.filter((item) => `${item.group} ${item.label} ${item.hint}`.toLowerCase().includes(q)) : items
  }, [query])

  useEffect(() => {
    list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [index])

  if (!open) return null

  const close = () => {
    setQuery('')
    setIndex(0)
    onClose()
  }

  const choose = (item: Item | undefined) => {
    if (!item) return
    close()
    item.run()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const step = event.key === 'ArrowDown' ? 1 : -1
      setIndex((i) => (i + step + results.length) % Math.max(results.length, 1))
    } else if (event.key === 'Enter') {
      choose(results[index])
    } else if (event.key === 'Escape') {
      close()
    }
  }


  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center px-4 pt-[12vh]" role="presentation">
      <div className="absolute inset-0 bg-bg/70 backdrop-blur-sm" onClick={close} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search resources"
        className="relative w-full max-w-xl overflow-hidden rounded-xl border border-line-strong bg-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] motion-safe:animate-pop"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <SearchIcon className="size-4.5 shrink-0 text-faint" />
          <input
            ref={field}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIndex(0)
            }}
            onKeyDown={onKeyDown}
            placeholder="Search sections, actions and links…"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-activedescendant={results[index] ? `palette-${results[index].id}` : undefined}
            className="min-w-0 flex-1 bg-transparent py-4 text-[15px] text-ink outline-none placeholder:text-dim"
          />
          <kbd className="rounded border border-line-strong px-1.5 font-mono text-[11px] text-faint">esc</kbd>
        </div>
        <ul ref={list} id="palette-results" role="listbox" data-lenis-prevent className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-faint">No resources match “{query}”</li>}
          {results.map((item, i) => {
            const header = item.group !== results[i - 1]?.group
            const selected = i === index
            return (
              <li key={item.id} role="none">
                {header && (
                  <p className="px-3 pt-2 pb-1 font-mono text-[11px] tracking-widest text-faint uppercase">{item.group}</p>
                )}
                <div
                  id={`palette-${item.id}`}
                  role="option"
                  aria-selected={selected}
                  onPointerMove={() => setIndex(i)}
                  onClick={() => choose(item)}
                  className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm ${
                    selected ? 'bg-accent/10 text-accent' : 'text-soft'
                  }`}
                >
                  {item.icon}
                  <span className="flex-1 font-semibold">{item.label}</span>
                  <span className="font-mono text-xs text-faint">{item.hint}</span>
                </div>
              </li>
            )
          })}
        </ul>
        <div className="flex gap-4 border-t border-line px-4 py-2.5 font-mono text-[11px] text-faint">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>/ or Ctrl K toggle</span>
        </div>
      </div>
    </div>
  )
}

import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

// index.html sets data-theme before React loads; this store reads and flips it
// so the header button and the terminal's `theme` command stay in sync.
const listeners = new Set<() => void>()

function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function setTheme(next: Theme) {
  document.documentElement.dataset.theme = next
  try {
    localStorage.setItem('theme', next)
  } catch {
    // Storage can be blocked (private mode); the change still applies for this visit.
  }
  listeners.forEach((listener) => listener())
}

export function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark')
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme)
  return { theme, toggle: toggleTheme, setTheme }
}

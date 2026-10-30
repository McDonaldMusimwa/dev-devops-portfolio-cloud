import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { prefersReducedMotion } from './motion'

let lenis: Lenis | null = null

// The sticky header is taller on mobile (tabs wrap to a second row), so measure it each time.
function headerOffset(): number {
  return (document.querySelector('header')?.offsetHeight ?? 0) + 8
}

export function scrollToId(id: string) {
  const target = document.getElementById(id)
  if (!target) return
  history.replaceState(null, '', `#${id}`)

  if (lenis) {
    lenis.scrollTo(target, { offset: -headerOffset() })
    return
  }
  window.scrollTo({
    top: target.getBoundingClientRect().top + window.scrollY - headerOffset(),
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  })
}

// Inertia scrolling (skipped for reduced motion) plus smooth in-page anchor links.
export function startSmoothScroll(): () => void {
  if (!prefersReducedMotion()) {
    lenis = new Lenis({ autoRaf: true, lerp: 0.085, wheelMultiplier: 0.9 })
  }

  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return
    const link = (event.target as Element | null)?.closest('a[href^="#"]')
    const id = link?.getAttribute('href')?.slice(1)
    if (!id || !document.getElementById(id)) return
    event.preventDefault()
    scrollToId(id)
  }

  document.addEventListener('click', onClick)
  return () => {
    document.removeEventListener('click', onClick)
    lenis?.destroy()
    lenis = null
  }
}

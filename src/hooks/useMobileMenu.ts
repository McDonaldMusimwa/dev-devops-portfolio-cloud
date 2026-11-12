import { useEffect, useRef, useState } from 'react'

// Open/closed state for the phone menu. It closes on Escape, on a tap outside the header,
// and when the screen grows past `query`, where the full nav shows again.
export function useMobileMenu(query: string) {
  const [open, setOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const wide = window.matchMedia(query)
    const onResize = () => wide.matches && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    wide.addEventListener('change', onResize)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
      wide.removeEventListener('change', onResize)
    }
  }, [open, query])

  return { open, toggle: () => setOpen((o) => !o), close: () => setOpen(false), headerRef }
}

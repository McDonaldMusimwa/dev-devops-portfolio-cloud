import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '../lib/motion'

// True once the element has scrolled into view. Starts true for reduced motion.
export function useInView<T extends Element>() {
  const [node, setNode] = useState<T | null>(null)
  const [inView, setInView] = useState(prefersReducedMotion)

  useEffect(() => {
    if (!node || inView) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -15% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [node, inView])

  return [setNode, inView] as const
}

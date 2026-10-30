import { useEffect, useState, type ReactNode } from 'react'
import { prefersReducedMotion } from '../lib/motion'

type Props = {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'li'
}

// Fades and lifts its children in the first time they scroll into view.
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }: Props) {
  const [node, setNode] = useState<HTMLElement | null>(null)
  const [shown, setShown] = useState(prefersReducedMotion)

  useEffect(() => {
    if (!node || shown) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [node, shown])

  return (
    <Tag
      ref={setNode}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-[opacity,translate] duration-700 ease-out ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      } ${className}`}
    >
      {children}
    </Tag>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/motion'

const GLYPHS = '!<>-_\\/[]{}=+*^?#01$%&'

// Decodes text from random glyphs, left to right. Replays on hover.
export function ScrambleText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [reduced] = useState(prefersReducedMotion)
  const [display, setDisplay] = useState(reduced ? text : text.replace(/\S/g, ' '))
  const timer = useRef<number | undefined>(undefined)

  const run = useCallback(() => {
    if (reduced) return
    window.clearInterval(timer.current)
    let frame = 0
    timer.current = window.setInterval(() => {
      frame += 1
      const resolved = Math.floor(frame / 2)
      setDisplay(
        Array.from(text, (char, i) =>
          i < resolved || char === ' ' ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        ).join(''),
      )
      if (resolved >= text.length) window.clearInterval(timer.current)
    }, 35)
  }, [text, reduced])

  useEffect(() => {
    const start = window.setTimeout(run, delay)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(timer.current)
    }
  }, [run, delay])

  return (
    <span onMouseEnter={run}>
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{text}</span>
    </span>
  )
}

// Types text out one character at a time.
export function Typewriter({ text, delay = 0, speed = 60 }: { text: string; delay?: number; speed?: number }) {
  const [reduced] = useState(prefersReducedMotion)
  const [count, setCount] = useState(reduced ? text.length : 0)

  useEffect(() => {
    if (reduced) return
    let interval: number | undefined
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setCount((n) => {
          if (n + 1 >= text.length) window.clearInterval(interval)
          return Math.min(n + 1, text.length)
        })
      }, speed)
    }, delay)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(interval)
    }
  }, [text, delay, speed, reduced])

  return (
    <>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      <span className="sr-only">{text}</span>
    </>
  )
}

import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '../lib/motion'
import { PromptIcon } from './icons'

const COMMAND = 'kubectl apply -f portfolio.yaml'

const steps = [
  'namespace/mcdonald created',
  'deployment.apps/portfolio configured',
  'service/portfolio-svc created',
  'rollout status: 3/3 replicas ready',
  'ingress healthy: 200 OK',
]

const BAR_WIDTH = 24

type Props = {
  // Set by the parent once the page is mounted underneath; triggers the fade-out.
  leaving: boolean
  onFinish: () => void
  onExited: () => void
}

// Full-screen terminal shown on first load, in place of a spinner.
export function BootLoader({ leaving, onFinish, onExited }: Props) {
  const [reduced] = useState(prefersReducedMotion)
  const [typed, setTyped] = useState(reduced ? COMMAND.length : 0)
  const [shown, setShown] = useState(reduced ? steps.length : 0)

  const commandDone = typed >= COMMAND.length
  const stepsDone = shown >= steps.length

  // Type the command, then reveal one step at a time.
  useEffect(() => {
    if (stepsDone) return
    const timer = window.setTimeout(
      () => (commandDone ? setShown((n) => n + 1) : setTyped((n) => Math.min(n + 3, COMMAND.length))),
      commandDone ? 170 : 28,
    )
    return () => window.clearTimeout(timer)
  }, [typed, shown, commandDone, stepsDone])

  // Hand over once every step has printed and the web fonts are ready.
  useEffect(() => {
    if (!stepsDone) return
    let cancelled = false
    const pause = new Promise((resolve) => window.setTimeout(resolve, reduced ? 150 : 450))
    void Promise.all([pause, document.fonts.ready]).then(() => {
      if (!cancelled) onFinish()
    })
    return () => {
      cancelled = true
    }
  }, [stepsDone, reduced, onFinish])

  // Any key or click skips straight to the site.
  useEffect(() => {
    const skip = () => onFinish()
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [onFinish])

  useEffect(() => {
    if (!leaving) return
    const timer = window.setTimeout(onExited, reduced ? 0 : 500)
    return () => window.clearTimeout(timer)
  }, [leaving, reduced, onExited])

  const filled = Math.round((shown / steps.length) * BAR_WIDTH)

  return (
    <div
      role="status"
      aria-label="Loading McDonald Musimwa's portfolio"
      className={`fixed inset-0 z-50 grid place-items-center bg-bg px-4 transition-[opacity,scale] duration-500 ease-out ${
        leaving ? 'pointer-events-none scale-[1.02] opacity-0' : 'opacity-100'
      }`}
    >
      <div className="w-full max-w-160 overflow-hidden rounded-[10px] border border-line bg-panel font-mono text-sm shadow-[0_0_120px_-40px] shadow-accent/50">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="size-2.75 rounded-full bg-line-strong" />
          <span className="size-2.75 rounded-full bg-line-strong" />
          <span className="size-2.75 rounded-full bg-accent" />
          <span className="ml-2 flex items-center gap-2 text-[13px] text-faint">
            <PromptIcon className="size-3.5 text-accent" />
            cloud-shell — boot
          </span>
        </div>
        <div className="flex min-h-64 flex-col gap-1.5 px-5 py-5 leading-relaxed sm:px-6">
          <p className="break-all">
            <span className="text-accent">visitor@mcdonald</span>:<span className="text-soft">~</span>${' '}
            <span className="text-ink">{COMMAND.slice(0, typed)}</span>
            {!commandDone && <span className="text-accent motion-safe:animate-blink">▌</span>}
          </p>
          {steps.slice(0, shown).map((step) => (
            <p key={step} className="text-muted motion-safe:animate-pop">
              <span className="text-accent">✓</span> {step}
            </p>
          ))}
          {commandDone && (
            <p className="mt-2 text-faint" aria-hidden="true">
              [<span className="text-accent">{'#'.repeat(filled)}</span>
              {'-'.repeat(BAR_WIDTH - filled)}] {Math.round((shown / steps.length) * 100)}%
            </p>
          )}
          {stepsDone && (
            <p className="text-accent motion-safe:animate-pop">
              console ready. welcome, visitor.
              <span className="motion-safe:animate-blink">▌</span>
            </p>
          )}
          <p className="mt-auto pt-4 text-xs text-dim">press any key to skip</p>
        </div>
      </div>
    </div>
  )
}

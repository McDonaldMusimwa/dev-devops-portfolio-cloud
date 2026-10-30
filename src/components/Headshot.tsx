import { useState } from 'react'
import { profile } from '../data/portfolio'

const initials = profile.name
  .split(' ')
  .map((part) => part[0])
  .join('')

// Framed like an image preview in the editor: corner brackets, scan line on hover, initials if the photo is missing.
export function Headshot() {
  const [failed, setFailed] = useState(false)

  return (
    <div className="flex flex-wrap items-center gap-5">
      <figure className="group relative size-32 shrink-0 p-1.5">
        <span aria-hidden="true" className="absolute top-0 left-0 size-4 border-t-2 border-l-2 border-accent" />
        <span aria-hidden="true" className="absolute top-0 right-0 size-4 border-t-2 border-r-2 border-accent" />
        <span aria-hidden="true" className="absolute bottom-0 left-0 size-4 border-b-2 border-l-2 border-accent" />
        <span aria-hidden="true" className="absolute right-0 bottom-0 size-4 border-r-2 border-b-2 border-accent" />
        <div className="relative size-full overflow-hidden rounded-md bg-line">
          {failed ? (
            <div className="grid size-full place-items-center font-mono text-3xl font-extrabold text-accent">{initials}</div>
          ) : (
            <img
              src={profile.headshot}
              alt={`Headshot of ${profile.name}`}
              onError={() => setFailed(true)}
              className="size-full object-cover grayscale-[35%] transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
            />
          )}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1/3 -translate-y-full bg-linear-to-b from-transparent via-accent/25 to-transparent opacity-0 group-hover:opacity-100 motion-safe:group-hover:animate-scan"
          />
        </div>
      </figure>
      <div className="flex flex-col gap-1.5">
        <p className="text-xl font-bold">{profile.name}</p>
        <p className="font-mono text-sm text-faint">{profile.headshot.split('/').pop()} · 800×800</p>
        <p className="mt-1 inline-flex w-fit items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-xs text-soft">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full rounded-full bg-accent opacity-75 motion-safe:animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          {profile.availability}
        </p>
      </div>
    </div>
  )
}

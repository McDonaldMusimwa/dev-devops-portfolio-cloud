import { profile } from '../data/portfolio'

const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-sm text-muted">
      <span>
        © {year} {profile.name} · <span className="font-mono text-xs text-faint">all systems operational</span>
      </span>
      <div className="flex flex-wrap gap-x-2 font-semibold">
        <a href={`mailto:${profile.email}`} className="p-2.5">
          Email
        </a>
        {profile.socials.map((social) => (
          <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="p-2.5 text-soft">
            {social.label}
          </a>
        ))}
      </div>
    </footer>
  )
}

import { useState } from 'react'
import { Reveal } from '../components/Reveal'
import { Section, SectionHeading } from '../components/SectionHeading'
import { blog, type Post } from '../data/portfolio'

const filters = ['all', 'medium', 'linkedin'] as const
type Filter = (typeof filters)[number]

export function Logs() {
  const [filter, setFilter] = useState<Filter>('all')
  const posts: Post[] = filter === 'all' ? blog.posts : blog.posts.filter((p) => p.source === filter)

  return (
    <Section id="blog">
      <SectionHeading
        crumb="logs"
        title="Blog · log stream"
        aside={
          <a href={blog.allPosts.href} target="_blank" rel="noreferrer" className="py-2.5 text-sm font-bold">
            {blog.allPosts.label} ↗
          </a>
        }
      />
      <Reveal>
        <div className="overflow-hidden rounded-[10px] border border-line bg-sunken font-mono text-[13px]">
          <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-3">
            <span className="mr-2 flex items-center gap-2 text-faint">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full rounded-full bg-accent opacity-75 motion-safe:animate-ping" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              tail -f
            </span>
            <div role="group" aria-label="Filter by source" className="flex gap-1.5">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                  className={`cursor-pointer rounded px-2.5 py-1 text-xs transition-colors ${
                    filter === f ? 'bg-accent/15 text-accent' : 'text-muted hover:bg-raised hover:text-ink'
                  }`}
                >
                  source={f}
                </button>
              ))}
            </div>
            <span className="ml-auto text-xs text-faint">{posts.length} entries</span>
          </div>
          <ul>
            {posts.map((post) => (
              <li key={post.href + post.date} className="border-b border-line-soft last:border-b-0 motion-safe:animate-pop">
                <a
                  href={post.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-wrap gap-x-4.5 gap-y-1 px-5 py-4 text-ink transition-colors hover:bg-raised hover:text-ink"
                >
                  <time dateTime={post.date} className="text-faint">
                    {post.date}
                  </time>
                  <span className="w-12 text-accent">INFO</span>
                  <span className="w-18 text-faint">{post.source}</span>
                  <span className="min-w-60 flex-1 transition-colors group-hover:text-accent">{post.title}</span>
                  <span
                    aria-hidden="true"
                    className="-translate-x-2 text-accent opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  >
                    open ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  )
}

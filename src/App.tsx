import { useCallback, useEffect, useState } from 'react'
import { BootLoader } from './components/BootLoader'
import { CommandPalette } from './components/CommandPalette'
import { Footer } from './components/Footer'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { sections } from './data/portfolio'
import { useActiveSection } from './hooks/useActiveSection'
import { scrollToId, startSmoothScroll } from './lib/scroll'
import { About } from './sections/About'
import { Certificates } from './sections/Certificates'
import { Contact } from './sections/Contact'
import { Deployments } from './sections/Deployments'
import { Logs } from './sections/Logs'
import { Overview } from './sections/Overview'
import { Terminal } from './sections/Terminal'
import { Workloads } from './sections/Workloads'

const ids = sections.map((s) => s.id)

function Console() {
  const active = useActiveSection(ids)
  const [searching, setSearching] = useState(false)
  const openSearch = useCallback(() => setSearching(true), [])
  const closeSearch = useCallback(() => setSearching(false), [])

  return (
    <>
      <TopBar active={active} onSearch={openSearch} />
      <div className="flex items-start">
        <Sidebar active={active} />
        <main className="min-w-0 flex-1 px-4 pb-10 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-300">
            <Overview />
            <Terminal />
            <About />
            <Workloads />
            <Deployments />
            <Certificates />
            <Logs />
            <Contact />
            <Footer />
          </div>
        </main>
      </div>
      <CommandPalette open={searching} onOpen={openSearch} onClose={closeSearch} />
    </>
  )
}

export default function App() {
  // The console mounts once the boot terminal finishes, so the overview's intro animations play in view.
  const [booted, setBooted] = useState(false)
  const [loaderGone, setLoaderGone] = useState(false)
  const finishBoot = useCallback(() => setBooted(true), [])
  const removeLoader = useCallback(() => setLoaderGone(true), [])

  useEffect(() => startSmoothScroll(), [])

  // The browser's own jump to #section fires before the page exists, so redo it after boot.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (booted && id) window.setTimeout(() => scrollToId(id), 50)
  }, [booted])

  return (
    <>
      {!loaderGone && <BootLoader leaving={booted} onFinish={finishBoot} onExited={removeLoader} />}
      {booted && <Console />}
    </>
  )
}

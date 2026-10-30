import type { SVGProps } from 'react'
import type { SectionId } from '../data/portfolio'
import { ClockIcon, GridIcon, LayersIcon, ListIcon, PromptIcon, SendIcon, ShieldIcon, UserIcon } from './icons'

const icons = {
  home: GridIcon,
  terminal: PromptIcon,
  about: UserIcon,
  projects: LayersIcon,
  experience: ClockIcon,
  education: ShieldIcon,
  blog: ListIcon,
  contact: SendIcon,
} satisfies Record<SectionId, unknown>

export function SectionIcon({ id, ...props }: { id: SectionId } & SVGProps<SVGSVGElement>) {
  const Icon = icons[id]
  return <Icon {...props} />
}

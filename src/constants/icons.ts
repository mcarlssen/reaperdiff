import { Sparkle, Backspace, ArrowsLeftRight, CirclesThree, SpeakerSimpleX } from "@phosphor-icons/react"
import { IconProps } from "@phosphor-icons/react"

interface ChangeIcon {
  icon: React.ForwardRefExoticComponent<IconProps>
  color: string
  label: string
  class: string
}

export const changeIcons: Record<string, ChangeIcon> = {
  added: {
    icon: Sparkle,
    color: 'var(--added-clip-color)',
    label: 'Added',
    class: 'added'
  },
  deleted: {
    icon: Backspace,
    color: 'var(--deleted-clip-color)',
    label: 'Deleted',
    class: 'deleted'
  },
  modified: {
    icon: ArrowsLeftRight,
    color: 'var(--modified-clip-color)',
    label: 'Modified',
    class: 'modified'
  },
  unchanged: {
    icon: CirclesThree,
    color: 'var(--unchanged-clip-color)',
    label: 'Static',
    class: 'unchanged'
  },
  silence: {
    icon: SpeakerSimpleX,
    color: 'var(--silence-clip-color)',
    label: 'Silence',
    class: 'silence'
  }
}

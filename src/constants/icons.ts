import { Sparkle, Backspace, ArrowsLeftRight, CirclesThree, SpeakerSimpleX } from "@phosphor-icons/react"
import { IconProps } from "@phosphor-icons/react"

interface ChangeIcon {
  icon: React.ForwardRefExoticComponent<IconProps>
  color: string
  label: string
  class: string
  alt: string
}

export const changeIcons: Record<string, ChangeIcon> = {
  added: {
    icon: Sparkle,
    color: 'var(--added-clip-color)',
    label: 'Added',
    class: 'added',
    alt: 'Added'
  },
  deleted: {
    icon: Backspace,
    color: 'var(--deleted-clip-color)',
    label: 'Deleted',
    class: 'deleted',
    alt: 'Deleted'
  },
  modified: {
    icon: ArrowsLeftRight,
    color: 'var(--modified-clip-color)',
    label: 'Modified',
    class: 'modified',
    alt: 'Modified'
  },
  unchanged: {
    icon: CirclesThree,
    color: 'var(--unchanged-clip-color)',
    label: 'Static',
    class: 'unchanged',
    alt: 'Static'
  },
  silence: {
    icon: SpeakerSimpleX,
    color: 'var(--silence-clip-color)',
    label: 'Silence',
    class: 'silence',
    alt: 'Silence'
  }
}

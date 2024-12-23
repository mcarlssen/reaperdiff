import { ArrowFatLineDown, ArrowFatLineUp } from "@phosphor-icons/react"

interface CollapseHeaderProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function CollapseHeader({ isCollapsed, onToggle }: CollapseHeaderProps) {
  return (
    <button 
      className="collapse-header"
      onClick={onToggle}
      aria-expanded={!isCollapsed}
      data-state={isCollapsed ? 'collapsed' : 'expanded'}
    >
      {isCollapsed ? (
        <>
          <ArrowFatLineDown size={20} />
          <span>Open Uploader</span>
        </>
      ) : (
        <>
          <ArrowFatLineUp size={20} />
          <span>Close Uploader</span>
        </>
      )}
    </button>
  )
} 
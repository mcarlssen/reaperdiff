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
    >
      {isCollapsed ? (
        <>
          <ArrowFatLineDown size={24} />
          <span>Show Controls</span>
        </>
      ) : (
        <>
          <ArrowFatLineUp size={24} />
          <span>Hide Controls</span>
        </>
      )}
    </button>
  )
} 
import { Clip, Change } from '../../types'

interface TooltipData {
  revisedPosition: number
  revisedLength: number
  revisedOffset: number
  controlPosition?: number
  controlLength?: number
  controlOffset?: number
  status: string
}

function getTooltipData(clip: Clip, changes: Change[]): TooltipData {
  const change = changes.find(c => c.revisedPosition === clip.POSITION)
  const status = change ? change.type : 'unchanged'
  
  const tooltipData: TooltipData = {
    revisedPosition: clip.POSITION,
    revisedLength: clip.LENGTH,
    revisedOffset: clip.OFFSET || 0,
    status
  }

  if (status !== 'added') {
    tooltipData.controlPosition = change?.controlPosition ?? clip.POSITION
    tooltipData.controlLength = change?.controlLength ?? clip.LENGTH
    tooltipData.controlOffset = change?.controlOffset ?? (clip.OFFSET || 0)
  }

  return tooltipData
}

export function generateTooltip(clip: Clip, changes: Change[]): string {
  const data = getTooltipData(clip, changes)
  const formatNumber = (n: number | undefined) => n?.toFixed(3) ?? 'N/A'
  
  const lines = [
    `Status: ${data.status}`,
    `Revised Position: ${formatNumber(data.revisedPosition)}`,
    `Control Position: ${formatNumber(data.controlPosition)}`,
    `Revised Length: ${formatNumber(data.revisedLength)}`,
    `Control Length: ${formatNumber(data.controlLength)}`,
    `Revised Offset: ${formatNumber(data.revisedOffset)}`,
    `Control Offset: ${formatNumber(data.controlOffset)}`

  ]
  
  return lines.join('\n')
} 
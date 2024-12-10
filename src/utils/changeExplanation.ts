import { Clip, Change } from '../types'
import { TOLERANCE } from '../constants'
import { formatDuration } from './duration'

function getMethodName(method: Change['detectionMethod']): string {
  const methodMap: Record<Change['detectionMethod'], string> = {
    'overlap': 'detectOverlaps',
    'fingerprint': 'detectFingerprint',
    'position': 'detectPositions',
    'length': 'detectLengths',
    'addsdeletes': 'detectAddsDeletes',
    'offset': 'detectOffset',
    'moved': 'detectMovedClips',
    'silence': 'detectSilentGaps',
    'split': 'detectSplitClips',
    'file': 'detectFileChanges'
  }
  return methodMap[method]
}

export function generateChangeExplanation(change: Change, controlClip?: Clip, revisedClip?: Clip): string {
  const details: string[] = []
  
  // Handle basic cases without needing clip data
  switch (change.detectionMethod) {
    case 'silence':
      details.push('Silent gap detected')
      break
    case 'split':
      if (controlClip && revisedClip) {
        details.push(`Original clip (${formatDuration(controlClip.LENGTH)}) was split`)
      } else {
        details.push('Clip was split')
      }
      break
    case 'moved':
      if (controlClip && revisedClip) {
        details.push(`Moved from position ${formatDuration(controlClip.POSITION)} to ${formatDuration(revisedClip.POSITION)}`)
      } else {
        details.push('Clip was moved to a new position')
      }
      break
  }

  // If we have both clips, we can provide more detailed explanations
  if (controlClip && revisedClip) {
    // Check file change
    if (controlClip.FILE !== revisedClip.FILE) {
      details.push(`Source media changed from "${controlClip.FILE}" to "${revisedClip.FILE}"`)
    }

    // Check length change
    const lengthDiff = Math.abs(controlClip.LENGTH - revisedClip.LENGTH)
    if (lengthDiff > TOLERANCE) {
      const action = controlClip.LENGTH > revisedClip.LENGTH ? 'shortened' : 'lengthened'
      details.push(`Clip ${action} from ${formatDuration(controlClip.LENGTH)} to ${formatDuration(revisedClip.LENGTH)}`)
    }

    // Check offset change
    const offsetDiff = Math.abs((controlClip.OFFSET || 0) - (revisedClip.OFFSET || 0))
    if (offsetDiff > TOLERANCE) {
      details.push(`Start offset changed from ${formatDuration(controlClip.OFFSET || 0)} to ${formatDuration(revisedClip.OFFSET || 0)}`)
    }

    // Check position change if not already covered by 'moved'
    if (change.detectionMethod !== 'moved') {
      const positionDiff = Math.abs(controlClip.POSITION - revisedClip.POSITION)
      if (positionDiff > TOLERANCE) {
        details.push(`Position shifted from ${formatDuration(controlClip.POSITION)} to ${formatDuration(revisedClip.POSITION)}`)
      }
    }
  }

  // If we found specific changes, return them
  if (details.length > 0) {
    return details.join('\n')
  }

  // Fallback explanations based on type
  switch (change.type) {
    case 'added':
      return 'New clip inserted'
    case 'deleted':
      if (controlClip) {
        return `Clip removed (was ${formatDuration(controlClip.LENGTH)} at position ${formatDuration(controlClip.POSITION)})`
      }
      return 'Clip was removed'
    case 'changed':
      return 'Clip was modified'
    default:
      return 'No changes detected'
  }
}

export { getMethodName } 
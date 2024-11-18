import { TOLERANCE } from '../constants'
import { Clip } from '../types'
import { findPositionalMatch } from './clipMatching'

export function detectDeletedClips(
  controlClips: Clip[],
  revisedClips: Clip[],
): { deletedClips: Clip[], changedClips: Clip[] } {
  const deletedClips: Clip[] = []
  const changedClips: Clip[] = []

  controlClips.forEach(controlClip => {
    const match = findPositionalMatch(controlClip, revisedClips)
    
    switch (match.type) {
      case 'none':
        // Only mark as deleted if surrounding clips exist
        const surroundingControlClips = controlClips.filter(clip => 
          Math.abs(clip.POSITION - controlClip.POSITION) < controlClip.LENGTH * 2
        )

        const surroundingMatches = surroundingControlClips
          .map(clip => findPositionalMatch(clip, revisedClips))
          .filter(m => m.type !== 'none')

        if (surroundingMatches.length >= 1) {
          deletedClips.push(controlClip)
        }
        break

      case 'changed':
        changedClips.push({
          ...controlClip,
          OFFSET: match.matchedClip!.OFFSET
        })
        break

      case 'exact':
        // No change needed
        break
    }
  })

  return { deletedClips, changedClips }
} 
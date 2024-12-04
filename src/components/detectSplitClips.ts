import { Clip, Change } from '../types'
import { TOLERANCE } from '../constants'

interface SplitClipMatch {
  originalClip: Clip
  splitParts: Clip[]
}

export function detectSplitClips(
  controlClips: Clip[],
  revisedClips: Clip[]
): Map<number, Change> {
  const changes = new Map<number, Change>()
  
  // Group potential split clips by their file source and source offset
  const splitGroups = revisedClips.reduce((groups, clip) => {
    if (!clip.FILE || clip.OFFSET === undefined) return groups
    
    const key = `${clip.FILE}_${clip.OFFSET}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(clip)
    return groups
  }, new Map<string, Clip[]>())

  splitGroups.forEach((potentialSplits, key) => {
    if (potentialSplits.length < 2) return

    // Sort splits by position
    potentialSplits.sort((a, b) => a.POSITION - b.POSITION)
    
    const [fileSource, offset] = key.split('_')
    const offsetNum = Number(offset)
    
    // Find the original clip that matches the file and offset
    const originalClip = controlClips.find(clip => 
      clip.FILE === fileSource &&
      Math.abs((clip.OFFSET || 0) - offsetNum) < TOLERANCE &&
      // Check if the total length of splits approximately matches original
      Math.abs(
        potentialSplits.reduce((sum, split) => sum + split.LENGTH, 0) - 
        clip.LENGTH
      ) < TOLERANCE
    )

    if (!originalClip) return

    // Mark all split parts as modifications of the original
    potentialSplits.forEach((splitClip, index) => {
      changes.set(splitClip.POSITION, {
        revisedPosition: splitClip.POSITION,
        type: 'changed',
        controlPosition: originalClip.POSITION,
        controlLength: originalClip.LENGTH,
        controlOffset: originalClip.OFFSET || 0,
        detectionMethod: 'split'
      })
    })
  })

  return changes
}

function findRelatedSplitClips(
  originalClip: Clip,
  revisedClips: Clip[]
): Clip[] {
  // Find all clips that:
  // 1. Have the same source file
  // 2. Start within the bounds of the original clip
  return revisedClips.filter(clip => 
    clip.FILE === originalClip.FILE &&
    clip.POSITION >= originalClip.POSITION &&
    clip.POSITION <= (originalClip.POSITION + originalClip.LENGTH)
  )
} 
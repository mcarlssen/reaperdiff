import { TOLERANCE } from '../constants'
import { Clip } from '../types'

export function detectOverlaps(clips: Clip[]): number[] {
  const overlapPositions: number[] = []
  
  // First, deduplicate clips and remove deleted clips
  const uniqueClips = clips.reduce((acc, clip) => {
    if (!clip.isDeleted && // Skip deleted clips
        !acc.some(c => Math.abs(c.POSITION - clip.POSITION) < TOLERANCE)) {
      acc.push(clip)
    }
    return acc
  }, [] as Clip[])
  
  // Sort by position
  uniqueClips.sort((a, b) => a.POSITION - b.POSITION)
  
  /*
  console.log('Checking overlaps for unique clips (excluding deleted):', 
    uniqueClips.map(c => ({
      start: c.POSITION,
      end: c.POSITION + c.LENGTH
    }))
  )
  */
  
  for (let i = 0; i < uniqueClips.length - 1; i++) {
    const currentClip = uniqueClips[i]
    const nextClip = uniqueClips[i + 1]
    const currentEnd = currentClip.POSITION + currentClip.LENGTH
    
    // Use TOLERANCE for overlap detection
    if (currentEnd - nextClip.POSITION > TOLERANCE) {
      overlapPositions.push(nextClip.POSITION)
      /*
      console.log('Overlap found:', {
        clip1: {
          position: currentClip.POSITION,
          end: currentEnd,
          length: currentClip.LENGTH
        },
        clip2: {
          position: nextClip.POSITION,
          length: nextClip.LENGTH
        },
        overlap: currentEnd - nextClip.POSITION
      })
      */
    }
  }
  
  /*    
  console.log('Final overlap positions:', overlapPositions)
  */
  return overlapPositions
} 
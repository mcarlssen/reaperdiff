import { Clip, Change } from '../types'
import { TOLERANCE, verbose } from '../constants'

interface MovedClipResult {
  movedClips: Map<number, Change>
  silentGaps: Map<number, Change>
}

export function detectMovedClips(
  controlClips: Clip[],
  revisedClips: Clip[]
): MovedClipResult {
  const movedClips = new Map<number, Change>()
  const silentGaps = new Map<number, Change>()
  
  // First pass: Detect moved clips only
  controlClips.forEach(controlClip => {
    const potentialMatch = revisedClips.find(revisedClip => 
      Math.abs(revisedClip.LENGTH - controlClip.LENGTH) < TOLERANCE &&
      (!controlClip.OFFSET || !revisedClip.OFFSET || 
       Math.abs(revisedClip.OFFSET - controlClip.OFFSET) < TOLERANCE)
    )

    if (potentialMatch && 
        Math.abs(potentialMatch.POSITION - controlClip.POSITION) > TOLERANCE) {
      /*
      console.log('Found moved clip:', {
        from: controlClip.POSITION,
        to: potentialMatch.POSITION
      })
      */
     
      // This is a moved clip
      movedClips.set(potentialMatch.POSITION, {
        revisedPosition: potentialMatch.POSITION,
        type: 'changed',
        controlPosition: controlClip.POSITION,
        controlLength: controlClip.LENGTH,
        controlOffset: controlClip.OFFSET || 0,
        detectionMethod: 'moved'
      })
    }
  })

  // Second pass: Detect all silences in a single pass
  const sortedRevisedClips = [...revisedClips].sort((a, b) => a.POSITION - b.POSITION)

  for (let i = 0; i < sortedRevisedClips.length - 1; i++) {
    const currentClip = sortedRevisedClips[i]
    const nextClip = sortedRevisedClips[i + 1]

    const gapStart = currentClip.POSITION + currentClip.LENGTH
    const gapEnd = nextClip.POSITION

    if (gapEnd - gapStart > TOLERANCE) {
      /*
      console.log('Analyzing gap:', {
        gapStart,
        gapEnd,
        currentClip: currentClip.POSITION,
        nextClip: nextClip.POSITION
      })
      */

      // Find the last control clip before this gap
      const lastControlClip = controlClips
        .filter(clip => clip.POSITION <= gapStart)
        .sort((a, b) => b.POSITION - a.POSITION)[0]

      // Find the first control clip after this gap
      const nextControlClip = controlClips
        .filter(clip => clip.POSITION >= gapEnd)
        .sort((a, b) => a.POSITION - b.POSITION)[0]

      // Check if this gap was previously covered by a control clip
      // or if it's in a completely new section of the timeline
      const wasControlled = controlClips.some(controlClip => {
        const clipStart = controlClip.POSITION
        const clipEnd = controlClip.POSITION + controlClip.LENGTH
        return (clipStart <= gapStart && clipEnd >= gapStart) ||
               (clipStart <= gapEnd && clipEnd >= gapEnd) ||
               (clipStart >= gapStart && clipEnd <= gapEnd)
      })

      // Mark as silence if it was either controlled or in a new timeline section
      if (wasControlled || !lastControlClip || !nextControlClip) {
        /*
        console.log('New silence detected:', { gapStart, gapEnd })
        */

        const silenceLength = gapEnd - gapStart
        const silentClip: Clip = {
          POSITION: gapStart,
          LENGTH: silenceLength,
          OFFSET: 0
        }

        silentGaps.set(gapStart, {
          revisedPosition: gapStart,
          type: 'added',
          controlPosition: gapStart,
          controlLength: silenceLength,
          detectionMethod: 'silence'
        })

        // Insert the silence clip and update our sorted array
        sortedRevisedClips.splice(i + 1, 0, silentClip)
        revisedClips.splice(
          revisedClips.findIndex(clip => clip.POSITION > gapStart),
          0,
          silentClip
        )
      }
    }
  }

  if (verbose) {
    console.log('Finished detectMovedClips:', {
      movedClips: movedClips.size,
      silentGaps: silentGaps.size,
      revisedClips: revisedClips.length
    })
  }

  return { movedClips, silentGaps }
} 
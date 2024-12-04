import { TOLERANCE } from '../constants'
import { Clip } from '../types'
import { findMatchingClip } from './detectFingerprint'

/**
 * Determines if a clip is truly new by checking the context of surrounding clips
 */
export function detectAddedClips(
  controlClips: Clip[],
  revisedClips: Clip[],
): number[] {
  const newClipPositions: number[] = []

  // Skip first and last clips since we need context on both sides
  for (let i = 1; i < revisedClips.length - 1; i++) {
    const currentClip = revisedClips[i]
    const priorClip = revisedClips[i - 1]
    const nextClip = revisedClips[i + 1]

    // If current clip has no fingerprint match in control
    const currentMatch = findMatchingClip(currentClip, controlClips)
    if (currentMatch.type === 'none') {
      // Find matches for surrounding clips
      const priorMatch = findMatchingClip(priorClip, controlClips)
      const nextMatch = findMatchingClip(nextClip, controlClips)

      if (priorMatch.match && nextMatch.match) {
        // Calculate expected position of next clip in control file
        const expectedNextPosition = priorMatch.match.POSITION + priorMatch.match.LENGTH

        // If next clip's position matches (accounting for tolerance)
        if (Math.abs(nextMatch.match.POSITION - expectedNextPosition) < TOLERANCE) {
          // This is definitely a new clip
          newClipPositions.push(currentClip.POSITION)
        }
      }
    }
  }

  return newClipPositions
} 
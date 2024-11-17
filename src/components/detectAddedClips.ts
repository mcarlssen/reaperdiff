import { Clip } from '../types'
import { findMatchingClip } from './detectFingerprint'

const POSITION_TOLERANCE = 0.005 // 5ms tolerance for position comparisons

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
    if (!findMatchingClip(currentClip, controlClips)) {
      // Find matches for surrounding clips
      const priorMatch = findMatchingClip(priorClip, controlClips)
      const nextMatch = findMatchingClip(nextClip, controlClips)

      if (priorMatch && nextMatch) {
        // Calculate expected position of next clip in control file
        const expectedNextPosition = priorMatch.POSITION + priorMatch.LENGTH

        // If next clip's position matches (accounting for tolerance)
        if (Math.abs(nextMatch.POSITION - expectedNextPosition) < POSITION_TOLERANCE) {
          // This is definitely a new clip
          newClipPositions.push(currentClip.POSITION)
        }
      }
    }
  }

  return newClipPositions
} 
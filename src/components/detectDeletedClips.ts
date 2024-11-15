import { Clip } from '../types'
import { findMatchingClip } from './detectFingerprint'

const POSITION_TOLERANCE = 0.005 // 5ms tolerance for position comparisons

/**
 * Determines if a clip was truly deleted by checking the context of surrounding clips
 * Returns positions from the control file where clips were deleted
 */
export function detectDeletedClips(
  controlClips: Clip[],
  revisedClips: Clip[],
): number[] {
  const deletedClipPositions: number[] = []

  // Skip first and last clips since we need context on both sides
  for (let i = 1; i < controlClips.length - 1; i++) {
    const currentClip = controlClips[i]
    const priorClip = controlClips[i - 1]
    const nextClip = controlClips[i + 1]

    // If current clip has no fingerprint match in revised
    if (!findMatchingClip(currentClip, revisedClips)) {
      // Find matches for surrounding clips
      const priorMatch = findMatchingClip(priorClip, revisedClips)
      const nextMatch = findMatchingClip(nextClip, revisedClips)

      if (priorMatch && nextMatch) {
        // Calculate expected position of next clip in revised file
        // (if current clip was just deleted and nothing else changed)
        const expectedNextPosition = priorMatch.POSITION + priorMatch.LENGTH

        // If next clip's position matches (accounting for tolerance)
        if (Math.abs(nextMatch.POSITION - expectedNextPosition) < POSITION_TOLERANCE) {
          // This clip was definitely deleted
          deletedClipPositions.push(currentClip.POSITION)
        }
      }
    }
  }

  return deletedClipPositions
} 
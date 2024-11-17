import { TOLERANCE } from '../constants'
import { Clip } from '../types'
import { findMatchingClip } from './detectFingerprint'

interface DeletedClip extends Clip {
  isDeleted: true
}

/**
 * Detects clips that have been deleted from the revised project by comparing against the control project.
 * 
 * Detection Strategy:
 * 1. Examines each clip from the control project
 * 2. If a clip has no match in the revised project, it's a candidate for deletion
 * 3. Validates deletions by checking for at least one matching surrounding clip
 *    within a window of 2x the clip's length
 * 4. Returns deleted clips with their original properties plus isDeleted flag
 * 
 * Advantages over strict position-based detection:
 * - Handles multiple consecutive deletions
 * - Resilient to position shifts caused by other edits
 * - Works with deletions at sequence boundaries
 * - Doesn't require exact position matching
 * 
 * @param controlClips - Array of clips from the control (original) project
 * @param revisedClips - Array of clips from the revised project
 * @returns Array of deleted clips with isDeleted flag
 */
export function detectDeletedClips(
  controlClips: Clip[],
  revisedClips: Clip[],
): DeletedClip[] {
  const deletedClips: DeletedClip[] = []

  // Check each control clip to see if it exists in revised
  controlClips.forEach(controlClip => {
    const matchInRevised = findMatchingClip(controlClip, revisedClips)
    
    if (!matchInRevised) {
      // Find the clips that should surround this one in revised
      // Uses a window of 2x the clip length to account for position shifts
      const surroundingControlClips = controlClips.filter(clip => 
        Math.abs(clip.POSITION - controlClip.POSITION) < controlClip.LENGTH * 2
      )

      // Verify deletion by checking if surrounding clips still exist
      const surroundingMatches = surroundingControlClips
        .map(clip => findMatchingClip(clip, revisedClips))
        .filter(Boolean)

      // If we find at least one surrounding clip match, this is a valid deletion
      if (surroundingMatches.length >= 1) {
        console.log('Found deleted clip:', controlClip)
        deletedClips.push({
          ...controlClip,
          isDeleted: true as const
        })
      }
    }
  })

  console.log('All deleted clips:', deletedClips)
  return deletedClips
} 
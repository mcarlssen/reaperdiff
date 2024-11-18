import { Clip } from '../types'
import { TOLERANCE } from '../constants'

interface ClipMatch {
  type: 'exact' | 'changed' | 'none'
  matchedClip?: Clip
}

/**
 * Matches clips based on position and length
 * Returns match type and matched clip if found
 */
export function findPositionalMatch(
  clip: Clip,
  clipArray: Clip[]
): ClipMatch {
  const match = clipArray.find(c => 
    Math.abs(c.POSITION - clip.POSITION) < TOLERANCE &&
    Math.abs(c.LENGTH - clip.LENGTH) < TOLERANCE
  )

  if (!match) return { type: 'none' }

  // If we found a positional match, check if SOFFS changed
  const clipOffset = clip.OFFSET ?? 0
  const matchOffset = match.OFFSET ?? 0
  
  if (Math.abs(matchOffset - clipOffset) > TOLERANCE) {
    return { 
      type: 'changed',
      matchedClip: match
    }
  }

  return { 
    type: 'exact',
    matchedClip: match
  }
} 
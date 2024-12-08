import { Clip, ClipFingerprint } from '../types';
import { TOLERANCE, verbose } from '../constants'

// Calculate decimal places based on TOLERANCE
const DECIMAL_PLACES = Math.abs(Math.floor(Math.log10(TOLERANCE)));

function getClipFingerprint(clip: Clip, isControl: boolean = false): ClipFingerprint {
  return {
    revisedLength: isControl ? undefined : clip.LENGTH,
    revisedOffset: isControl ? undefined : (clip.OFFSET || 0),
    controlLength: isControl ? clip.LENGTH : undefined,
    controlOffset: isControl ? (clip.OFFSET || 0) : undefined
  };
}

function isSplitClip(controlClip: Clip, revisedClip: Clip): boolean {
  // A split clip should have:
  // 1. Same start position (within tolerance)
  // 2. Same source file
  // 3. Same offset (within tolerance)
  // 4. Different length
  return Math.abs(controlClip.POSITION - revisedClip.POSITION) < TOLERANCE &&
         controlClip.FILE === revisedClip.FILE &&
         Math.abs((controlClip.OFFSET || 0) - (revisedClip.OFFSET || 0)) < TOLERANCE &&
         Math.abs(controlClip.LENGTH - revisedClip.LENGTH) >= TOLERANCE
}

export function findMatchingClip(clip: Clip, clipArray: Clip[]): {
  match?: Clip,
  type: 'exact' | 'split' | 'none'
} {
  // First try to find an exact match
  const exactMatch = clipArray.find(c => {
    const lengthMatch = Math.abs(c.LENGTH - clip.LENGTH) < TOLERANCE
    const offsetMatch = Math.abs((c.OFFSET || 0) - (clip.OFFSET || 0)) < TOLERANCE
    const fileMatch = c.FILE === clip.FILE
    return lengthMatch && offsetMatch && fileMatch
  })

  if (exactMatch) return { match: exactMatch, type: 'exact' }

  // Then look for split candidates
  const splitMatch = clipArray.find(c => isSplitClip(c, clip))
  if (splitMatch) return { match: splitMatch, type: 'split' }

  return { type: 'none' }
}

export function compareClips(
  controlClip: Clip, 
  revisedClip: Clip,
  _controlClips: Clip[],  // Prefixed with _ to indicate unused
  _revisedClips: Clip[],  // Prefixed with _ to indicate unused
  _currentIndex: number,  // Prefixed with _ to indicate unused
): boolean {
  // Return false if fingerprints match within tolerance (indicating no change)
  const controlFingerprint = getClipFingerprint(controlClip, true)
  const revisedFingerprint = getClipFingerprint(revisedClip)
  
  const lengthDiff = Math.abs(roundToTolerance(controlFingerprint.controlLength!) - roundToTolerance(revisedFingerprint.revisedLength!))
  const offsetDiff = Math.abs(roundToTolerance(controlFingerprint.controlOffset!) - roundToTolerance(revisedFingerprint.revisedOffset!))
  const fileChanged = controlClip.FILE !== revisedClip.FILE
  
  if (verbose && fileChanged) {
    console.log('File change detected:', {
      position: revisedClip.POSITION,
      oldFile: controlClip.FILE,
      newFile: revisedClip.FILE
    })
  }
  
  return lengthDiff >= TOLERANCE || 
         offsetDiff >= TOLERANCE || 
         fileChanged
}

/**
 * Rounds a number to the appropriate decimal places based on TOLERANCE
 * Example: 
 * - If TOLERANCE is 0.01, rounds to 2 decimal places
 * - If TOLERANCE is 0.001, rounds to 3 decimal places
 */
function roundToTolerance(value: number): number {
  return Number(value.toFixed(DECIMAL_PLACES));
}

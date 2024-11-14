import { Clip, ClipFingerprint } from '../types';

const TOLERANCE = 0.005; // 5 millisecond tolerance for position and length comparisons

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

function findMatchingClip(clip: Clip, clipArray: Clip[]): Clip | undefined {
  const controlFingerprint = getClipFingerprint(clip, true);
  return clipArray.find(c => {
    const revisedFingerprint = getClipFingerprint(c);
    return Math.abs(roundToTolerance(revisedFingerprint.revisedLength!) - roundToTolerance(controlFingerprint.controlLength!)) < TOLERANCE &&
           Math.abs(roundToTolerance(revisedFingerprint.revisedOffset!) - roundToTolerance(controlFingerprint.controlOffset!)) < TOLERANCE;
  });
}

export function compareClips(
  controlClip: Clip, 
  revisedClip: Clip,
  _controlClips: Clip[],  // Prefixed with _ to indicate unused
  _revisedClips: Clip[],  // Prefixed with _ to indicate unused
  _currentIndex: number,  // Prefixed with _ to indicate unused
): boolean {
  // Return false if fingerprints match within tolerance (indicating no change)
  const controlFingerprint = getClipFingerprint(controlClip, true);
  const revisedFingerprint = getClipFingerprint(revisedClip);
  
  const lengthDiff = Math.abs(roundToTolerance(controlFingerprint.controlLength!) - roundToTolerance(revisedFingerprint.revisedLength!));
  const offsetDiff = Math.abs(roundToTolerance(controlFingerprint.controlOffset!) - roundToTolerance(revisedFingerprint.revisedOffset!));
  
  return lengthDiff >= TOLERANCE || offsetDiff >= TOLERANCE

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

export { findMatchingClip }; 

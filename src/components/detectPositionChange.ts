import { Clip, ClipFingerprint } from '../types';

function getClipFingerprint(clip: Clip): ClipFingerprint {
  return {
    length: clip.LENGTH,
    offset: clip.OFFSET || 0
  };
}

function findMatchingClip(clip: Clip, clipArray: Clip[]): Clip | undefined {
  const fingerprint = getClipFingerprint(clip);
  return clipArray.find(c => {
    const compareFingerprint = getClipFingerprint(c);
    return Math.abs(compareFingerprint.length - fingerprint.length) < 0.001 &&
           Math.abs(compareFingerprint.offset - fingerprint.offset) < 0.001;
  });
}

export function compareClips(
  controlClip: Clip, 
  revisedClip: Clip, 
  cumulativeShift: number,
): boolean {
  const TOLERANCE = 0.001;
  const expectedPosition = controlClip.POSITION + cumulativeShift;
  const positionDiff = Math.abs(revisedClip.POSITION - expectedPosition);
  
  console.log('Comparing clip positions:', {
    controlFingerprint: getClipFingerprint(controlClip),
    revisedFingerprint: getClipFingerprint(revisedClip),
    controlPosition: controlClip.POSITION,
    revisedPosition: revisedClip.POSITION,
    expectedPosition,
    cumulativeShift,
    positionDiff,
    TOLERANCE
  });
  
  return positionDiff > TOLERANCE;
}

export { findMatchingClip }; 
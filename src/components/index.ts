import { Clip, Change } from '../types';
import { parseRppFile } from './parseRppFile';
import { compareClips, findMatchingClip } from './detectFingerprint';
import { detectOverlaps } from './detectOverlaps';
import { detectLengthChanges } from './detectLengthChanges';

interface DetectionOptions {
  detectOverlaps: boolean;
  detectPositions: boolean;
  detectLengths: boolean;
  detectFingerprint: boolean;
}

export async function detectChanges(
  controlFile: File, 
  revisedFile: File, 
  verbose: boolean,
  options: DetectionOptions
): Promise<{
  changedPositions: number[],
  controlClips: Clip[],
  revisedClips: Clip[],
  changes: Change[]
}> {
  const controlClips = await parseRppFile(controlFile, verbose);
  const revisedClips = await parseRppFile(revisedFile, verbose);
  const changes: Change[] = [];
  
  let cumulativeShift = 0;
  
  // First pass: detect changed and deleted clips
  controlClips.forEach(controlClip => {
    const revisedClip = findMatchingClip(controlClip, revisedClips);
    
    if (!revisedClip) {
      // Clip exists in control but not in revised -> deleted
      changes.push({
        revisedPosition: controlClip.POSITION,
        type: 'deleted',
        controlPosition: controlClip.POSITION,
        controlLength: controlClip.LENGTH,
        controlOffset: controlClip.OFFSET || 0,
        detectionMethod: 'fingerprint'
      });
    } else if (
      // Check fingerprints if enabled
      (options.detectFingerprint && compareClips(controlClip, revisedClip, controlClips, revisedClips, controlClips.indexOf(controlClip))) ||
      // Check positions if enabled
      (options.detectPositions && controlClip.POSITION !== revisedClip.POSITION)
    ) {
      changes.push({
        revisedPosition: revisedClip.POSITION,
        type: 'changed',
        controlPosition: controlClip.POSITION,
        controlLength: controlClip.LENGTH,
        controlOffset: controlClip.OFFSET || 0,
        detectionMethod: options.detectFingerprint ? 'fingerprint' : 'position'
      });
      
      // Only update cumulative shift if length detection is enabled
      if (options.detectLengths && detectLengthChanges(controlClip, revisedClip)) {
        cumulativeShift += (revisedClip.LENGTH - controlClip.LENGTH);
      }
    }
  });
  
  // Second pass: detect added clips
  revisedClips.forEach(revisedClip => {
    const controlClip = findMatchingClip(revisedClip, controlClips);
    if (!controlClip) {
      // Clip exists in revised but not in control -> added
      changes.push({
        revisedPosition: revisedClip.POSITION,
        type: 'added',
        detectionMethod: 'fingerprint'
      });
    }
  });

  if (verbose) {
    console.log('Detected changes:', {
      changes,
      cumulativeShift,
      overlaps: options.detectOverlaps ? detectOverlaps(revisedClips) : []
    });
  }

  return {
    changedPositions: changes.map(change => change.revisedPosition),
    controlClips,
    revisedClips,
    changes
  };
}

// Export all the components
export { parseRppFile } from './parseRppFile';
export { compareClips, findMatchingClip } from './detectFingerprint';
export { detectOverlaps } from './detectOverlaps';
export { detectLengthChanges } from './detectLengthChanges';
  
import { Clip, Change } from '../types';
import { parseRppFile } from './parseRppFile';
import { compareClips, findMatchingClip } from './detectPositionChange';
import { detectOverlaps } from './detectOverlaps';
import { detectLengthChanges } from './detectLengthChanges';

interface DetectionOptions {
  detectOverlaps: boolean;
  detectPositions: boolean;
  detectLengths: boolean;
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
  
  if (options.detectPositions) {
    // First pass: detect changed and deleted clips
    controlClips.forEach(controlClip => {
      const revisedClip = findMatchingClip(controlClip, revisedClips);
      
      if (!revisedClip) {
        // Clip exists in control but not in revised -> deleted
        changes.push({
          position: controlClip.POSITION,
          type: 'deleted',
          originalPosition: controlClip.POSITION
        });
      } else if (compareClips(controlClip, revisedClip, cumulativeShift)) {
        // Clip exists in both but has changed position
        changes.push({
          position: revisedClip.POSITION,
          type: 'changed',
          originalPosition: controlClip.POSITION
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
          position: revisedClip.POSITION,
          type: 'added'
        });
      }
    });
  }

  if (verbose) {
    console.log('Detected changes:', {
      changes,
      cumulativeShift,
      overlaps: options.detectOverlaps ? detectOverlaps(revisedClips) : []
    });
  }

  return {
    changedPositions: changes.map(change => change.position),
    controlClips,
    revisedClips,
    changes
  };
}

// Export all the components
export { parseRppFile } from './parseRppFile';
export { compareClips, findMatchingClip } from './detectPositionChange';
export { detectOverlaps } from './detectOverlaps';
export { detectLengthChanges } from './detectLengthChanges';
  
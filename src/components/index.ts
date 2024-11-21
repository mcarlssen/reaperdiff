import { Clip, Change, DetectionOptions } from '../types';
import { parseRppFile } from './parseRppFile';
import { compareClips, findMatchingClip } from './detectFingerprint';
import { detectOverlaps } from './detectOverlaps';
import { detectLengthChanges } from './detectLengthChanges';
import { detectAddedClips } from './detectAddedClips';
import { detectDeletedClips } from './detectDeletedClips';
import { detectMovedClips } from './detectMovedClips';
import { TOLERANCE } from '../constants'

interface DetectionResult {
  changedPositions: number[];
  controlClips: Clip[];
  revisedClips: Clip[];
  changes: Change[];
  overlappingClips: number[];
}

export async function detectChanges(
  controlFile: File | string,
  revisedFile: File | string,
  verbose: boolean,
  options: DetectionOptions
): Promise<DetectionResult> {
  const controlClips = await parseRppFile(controlFile, verbose);
  let revisedClips = await parseRppFile(revisedFile, verbose);
  const changes = new Map<number, Change>();
  
  // First detect moved clips
  const { movedClips, silentGaps } = detectMovedClips(controlClips, revisedClips);
  
  // Add moved clips and silent gaps to changes
  movedClips.forEach((change, position) => changes.set(position, change));
  silentGaps.forEach((change, position) => changes.set(position, change));

  // Then detect remaining deletions and offset changes
  if (options.detectAddsDeletes) {
    const { deletedClips, changedClips } = detectDeletedClips(
      controlClips.filter(clip => 
        !Array.from(movedClips.values())
          .some(change => change.controlPosition === clip.POSITION)
      ),
      revisedClips
    );
    
    // Add remaining changes
    deletedClips.forEach(clip => {
      if (!changes.has(clip.POSITION))
        changes.set(clip.POSITION, {
          revisedPosition: clip.POSITION,
          type: 'deleted',
          controlPosition: clip.POSITION,
          controlLength: clip.LENGTH,
          controlOffset: clip.OFFSET || 0,
          detectionMethod: 'position'
        });
    });

    changedClips.forEach(clip => {
      if (!changes.has(clip.POSITION))
        changes.set(clip.POSITION, {
          revisedPosition: clip.POSITION,
          type: 'changed',
          controlPosition: clip.POSITION,
          controlLength: clip.LENGTH,
          controlOffset: clip.OFFSET || 0,
          detectionMethod: 'offset'
        });
    });
  }

  // Then detect added clips
  revisedClips.forEach(revisedClip => {
    // Skip if we already detected a change at this position
    if (changes.has(revisedClip.POSITION)) return;
    
    // Skip deleted clips
    if (revisedClip.isDeleted) return;

    // Check if this clip exists in control
    const controlClip = findMatchingClip(revisedClip, controlClips);
    if (!controlClip) {
      changes.set(revisedClip.POSITION, {
        revisedPosition: revisedClip.POSITION,
        type: 'added',
        detectionMethod: 'fingerprint'
      });
    }
  });

  if (verbose) {
    console.log('Final changes:', Array.from(changes.values()));
  }

  const overlappingClips = detectOverlaps(revisedClips)

  return {
    changedPositions: Array.from(changes.values()).map(change => change.revisedPosition),
    controlClips,
    revisedClips,
    changes: Array.from(changes.values()),
    overlappingClips
  };
}

// Export all the components
export { parseRppFile } from './parseRppFile';
export { compareClips, findMatchingClip } from './detectFingerprint';
export { detectOverlaps } from './detectOverlaps';
export { detectLengthChanges } from './detectLengthChanges';
export { detectAddedClips } from './detectAddedClips';
export { detectDeletedClips } from './detectDeletedClips';
export { detectMovedClips } from './detectMovedClips';
  
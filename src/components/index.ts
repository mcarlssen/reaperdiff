import { Clip, Change, DetectionOptions } from '../types';
import { parseRppFile } from './parseRppFile';
import { compareClips, findMatchingClip } from './detectFingerprint';
import { detectOverlaps } from './detectOverlaps';
import { detectLengthChanges } from './detectLengthChanges';
import { detectAddedClips } from './detectAddedClips';
import { detectDeletedClips } from './detectDeletedClips';
import { TOLERANCE } from '../constants'

export async function detectChanges(
  controlFile: File | string,
  revisedFile: File | string,
  verbose: boolean,
  options: DetectionOptions
): Promise<{
  changedPositions: number[];
  controlClips: Clip[];
  revisedClips: Clip[];
  changes: Change[];
}> {
  const controlClips = await parseRppFile(controlFile, verbose);
  let revisedClips = await parseRppFile(revisedFile, verbose);
  const changes: Change[] = [];
  
  // Only run adds/deletes detection if enabled
  if (options.detectAddsDeletes) {
    const newClipPositions = detectAddedClips(controlClips, revisedClips);
    const deletedClips = detectDeletedClips(controlClips, revisedClips);
    
    console.log('Deleted clips found:', deletedClips);
    
    // Create full clips for deleted items
    const deletedClipsWithMetadata = controlClips
      .filter(clip => 
        deletedClips.some(
          deletedClip => Math.abs(deletedClip.POSITION - clip.POSITION) < TOLERANCE
        )
      )
      .map(clip => ({
        ...clip,
        isDeleted: true as const
      }));
    
    console.log('Deleted clips with metadata:', deletedClipsWithMetadata);
    
    // Add deleted clips to the revised clips array and sort by position
    revisedClips = [...revisedClips, ...deletedClipsWithMetadata]
      .sort((a, b) => a.POSITION - b.POSITION);
    
    // Add changes for new clips
    newClipPositions.forEach(position => {
      changes.push({
        revisedPosition: position,
        type: 'added',
        detectionMethod: 'addsdeletes'
      });
    });
    
    // Add changes for deleted clips
    deletedClips.forEach(clip => {
      changes.push({
        revisedPosition: clip.POSITION,
        type: 'deleted',
        controlPosition: clip.POSITION,
        controlLength: clip.LENGTH,
        controlOffset: clip.OFFSET || 0,
        detectionMethod: 'addsdeletes'
      });
    });
  }
  
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

  console.log('Revised clips after adding deleted:', revisedClips.filter(clip => clip.isDeleted));

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
export { detectAddedClips } from './detectAddedClips';
export { detectDeletedClips } from './detectDeletedClips';
  
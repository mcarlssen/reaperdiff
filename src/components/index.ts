import { Clip, Change, DetectionOptions } from '../types';
import { parseRppFile } from './parseRppFile';
import { compareClips, findMatchingClip } from './detectFingerprint';
import { detectOverlaps } from './detectOverlaps';
import { detectLengthChanges } from './detectLengthChanges';
import { detectAddedClips } from './detectAddedClips';
import { detectDeletedClips } from './detectDeletedClips';
import { detectMovedClips } from './detectMovedClips';
import { ignoreMute, TOLERANCE } from '../constants'
import { detectSplitClips } from './detectSplitClips'

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
  let controlClips = await parseRppFile(controlFile, verbose)
  let revisedClips = await parseRppFile(revisedFile, verbose)

  // Filter out muted clips if ignoreMute is enabled
  if (ignoreMute) {
    controlClips = controlClips.filter(clip => !clip.MUTE)
    revisedClips = revisedClips.filter(clip => !clip.MUTE)
  }

  const changes = new Map<number, Change>();
  
  // First detect moved clips
  const { movedClips, silentGaps } = detectMovedClips(controlClips, revisedClips)
  
  // Track all positions that have been processed
  const processedPositions = new Set<number>()
  
  // Add moved clips and silent gaps to changes
  movedClips.forEach((change, position) => {
    changes.set(position, change)
    if (change.controlPosition !== undefined)
      processedPositions.add(change.controlPosition)
  })
  silentGaps.forEach((change, position) => {
    changes.set(position, change)
    if (change.controlPosition !== undefined)
      processedPositions.add(change.controlPosition)
  })

  // Detect split clips before deletions
  const splitClipChanges = detectSplitClips(controlClips, revisedClips)
  splitClipChanges.forEach((change, position) => {
    changes.set(position, change)
    // Add both the control and revised positions to processed set
    if (change.controlPosition !== undefined)
      processedPositions.add(change.controlPosition)
    if (change.revisedPosition !== undefined)
      processedPositions.add(change.revisedPosition)
  })

  // Then detect remaining deletions and offset changes
  if (options.detectAddsDeletes) {
    const { deletedClips, changedClips } = detectDeletedClips(
      // Filter out any clips that have already been processed
      controlClips.filter(clip => !processedPositions.has(clip.POSITION)),
      revisedClips
    )

    // Add remaining changes
    deletedClips.forEach(clip => {
      if (!processedPositions.has(clip.POSITION))
        changes.set(clip.POSITION, {
          revisedPosition: clip.POSITION,
          type: 'deleted',
          controlPosition: clip.POSITION,
          controlLength: clip.LENGTH,
          controlOffset: clip.OFFSET || 0,
          detectionMethod: 'position'
        })
    })

    changedClips.forEach(clip => {
      if (!processedPositions.has(clip.POSITION))
        changes.set(clip.POSITION, {
          revisedPosition: clip.POSITION,
          type: 'changed',
          controlPosition: clip.POSITION,
          controlLength: clip.LENGTH,
          controlOffset: clip.OFFSET || 0,
          detectionMethod: 'offset'
        })
    })
  }

  // Then detect added clips
  revisedClips.forEach(revisedClip => {
    // Skip if we already detected a change at this position
    if (changes.has(revisedClip.POSITION)) return
    
    // Skip deleted clips
    if (revisedClip.isDeleted) return

    // Check if this clip exists in control
    const matchResult = findMatchingClip(revisedClip, controlClips)
    
    switch (matchResult.type) {
      case 'exact':
        // No change needed
        break
        
      case 'split':
        changes.set(revisedClip.POSITION, {
          revisedPosition: revisedClip.POSITION,
          type: 'changed',
          controlPosition: matchResult.match!.POSITION,
          controlLength: matchResult.match!.LENGTH,
          controlOffset: matchResult.match!.OFFSET || 0,
          detectionMethod: 'split'
        })
        break
        
      case 'none':
        changes.set(revisedClip.POSITION, {
          revisedPosition: revisedClip.POSITION,
          type: 'added',
          detectionMethod: 'fingerprint'
        })
        break
    }
  })

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
  
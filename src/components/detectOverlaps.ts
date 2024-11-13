import { Clip } from '../types';

export function detectOverlaps(clips: Clip[]): number[] {
  const overlapPositions: number[] = [];
  
  for (let i = 0; i < clips.length - 1; i++) {
    const currentClip = clips[i];
    const nextClip = clips[i + 1];
    const currentEnd = currentClip.POSITION + currentClip.LENGTH;
    
    if (currentEnd > nextClip.POSITION) {
      overlapPositions.push(currentClip.POSITION);
    }
  }
  
  return overlapPositions;
} 
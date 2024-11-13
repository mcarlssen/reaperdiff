import { Clip } from '../types';

export function detectLengthChanges(
  controlClip: Clip,
  revisedClip: Clip,
): boolean {
  const TOLERANCE = 0.001; // 1 millisecond tolerance
  const lengthDiff = Math.abs(revisedClip.LENGTH - controlClip.LENGTH);
  
  return lengthDiff > TOLERANCE;
} 
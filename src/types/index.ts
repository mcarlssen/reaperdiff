export interface Clip {
  POSITION: number;
  LENGTH: number;
  OFFSET?: number;
  isDeleted?: boolean;
  MUTE?: boolean;
  NAME?: string;
  FILE?: string;
}

export interface Change {
  revisedPosition: number;
  type: 'added' | 'deleted' | 'changed';
  controlPosition?: number;
  controlLength?: number;
  controlOffset?: number;
  detectionMethod: 'overlap' | 'fingerprint' | 'position' | 'length' | 'addsdeletes' | 'offset' | 'moved' | 'silence' | 'split' | 'file';
}

export interface ClipFingerprint {
  revisedLength?: number;
  revisedOffset?: number;
  controlLength?: number;
  controlOffset?: number;
}

export interface DetectionOptions {
  detectOverlaps: boolean
  detectPositions: boolean
  detectLengths: boolean
  detectFingerprint: boolean
  detectAddsDeletes: boolean
} 

export interface TestDataset {
    id: string
    name: string
    description: string
    controlData: string
    revisedData: string
  }
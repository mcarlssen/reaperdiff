export interface Clip {
  POSITION: number;
  LENGTH: number;
  OFFSET?: number;
  NAME?: string;
  IGUID?: string;
}

export interface Change {
  revisedPosition: number;
  type: 'added' | 'deleted' | 'changed';
  controlPosition?: number;
  controlLength?: number;
  controlOffset?: number;
  detectionMethod: 'overlap' | 'fingerprint' | 'position' | 'length';
}

export interface ClipFingerprint {
  revisedLength?: number;
  revisedOffset?: number;
  controlLength?: number;
  controlOffset?: number;
} 
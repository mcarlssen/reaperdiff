export interface Clip {
  POSITION: number;
  LENGTH: number;
  OFFSET?: number;
  NAME?: string;
  IGUID?: string;
}

export interface Change {
  position: number;
  type: 'changed' | 'added' | 'deleted';
  originalPosition?: number;
}

export interface ClipFingerprint {
  length: number;
  offset: number;
} 
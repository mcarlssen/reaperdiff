import { Clip } from '../types'
import { ignoreMute } from '../constants'

export function filterMutedClips(clips: Clip[]): Clip[] {
  if (!ignoreMute) return clips
  return clips.filter(clip => !clip.MUTE)
} 
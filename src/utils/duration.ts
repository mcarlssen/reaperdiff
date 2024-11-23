import { Clip } from '../types'

export function calculateTotalDuration(clips: Clip[]): number {
  return clips.reduce((total, clip) => {
    const clipEnd = clip.POSITION + clip.LENGTH
    return Math.max(total, clipEnd)
  }, 0)
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(Math.abs(seconds) / 60)
  const remainingSeconds = Math.floor(Math.abs(seconds) % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
} 
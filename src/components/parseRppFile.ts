import { Clip } from '../types';
import { TOLERANCE, verbose } from '../constants';

interface TrackState {
  isMuted: boolean
  isInTrack: boolean
}

export async function parseRppFile(
  input: File | string,
  label: string = 'file', // Default label if none provided
): Promise<Clip[]> {
  const isTestData = typeof input === 'string'
  const filename = isTestData ? 'test data' : (input as File).name

  if (verbose) {
    console.log(`Parsing ${label} (${filename}) in interactive mode`)
  }

  const data = typeof input === 'string' ? input : await input.text()
  const lines = data.split('\n')
  const clips: Clip[] = []
  let currentClip: Partial<Clip> = {}
  
  // Track parsing state
  const trackState: TrackState = {
    isMuted: false,
    isInTrack: false
  }

  // Detect if this is a full RPP file or just a test dataset
  const isFullRPP = data.includes('<TRACK')
  
  if (verbose) {
    console.log(`Running in ${isFullRPP ? 'interactive mode, using uploaded RPP file' : 'test mode, using test dataset'}`)
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Track handling (only for full RPP files)
    if (isFullRPP) {
      if (line.startsWith('<TRACK')) {
        trackState.isInTrack = true
        trackState.isMuted = false
      } else if (line === '>') {
        if (trackState.isInTrack) {
          trackState.isInTrack = false
          trackState.isMuted = false
        } else if (currentClip.POSITION !== undefined && currentClip.LENGTH !== undefined) {
          // Only add clip if we're not in a muted track
          if (!trackState.isMuted && !currentClip.MUTE) {
            clips.push(currentClip as Clip)
          }
          currentClip = {}
        }
      } else if (line.startsWith('MUTESOLO')) {
        // Check if track is muted (MUTESOLO 1 indicates muted)
        const parts = line.split(' ')
        if (parts[1] === '1') {
          trackState.isMuted = true
          if (verbose) console.log('Found muted track')
        }
      }
    }

    // Clip handling
    const shouldProcessClip = isFullRPP ? !trackState.isMuted : true
    if (shouldProcessClip) {
      if (line.startsWith('<ITEM')) {
        currentClip = {}
      } else if (line.startsWith('MUTE 1 0')) {
        currentClip.MUTE = true
      } else if (line.startsWith('POSITION')) {
        currentClip.POSITION = parseFloat(line.split(' ')[1])
      } else if (line.startsWith('LENGTH')) {
        currentClip.LENGTH = parseFloat(line.split(' ')[1])
      } else if (line.startsWith('NAME')) {
        currentClip.NAME = line.split('"')[1]
      } else if (line.startsWith('FILE')) {
        // Extract file path from FILE line
        const match = line.match(/FILE\s+"([^"]+)"/)
        if (match) currentClip.FILE = match[1]
      } else if (line === '>' && !trackState.isInTrack) {
        if (currentClip.POSITION !== undefined && currentClip.LENGTH !== undefined) {
          if (!currentClip.MUTE) {
            clips.push(currentClip as Clip)
          }
          currentClip = {}
        }
      }
    }
  }

  const sortedClips = clips.sort((a, b) => a.POSITION - b.POSITION)

  if (verbose) {
    console.log(`Parsed ${clips.length} clips from ${label} (excluding muted tracks/clips)`)
  }
  
  if (verbose) {
    console.log(`Parsed clips with files from ${label}:`, clips.map(c => ({
      position: c.POSITION,
      file: c.FILE
    })))
  }
  
  return sortedClips
} 
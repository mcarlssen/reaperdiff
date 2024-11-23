import { Clip } from '../types';

export async function parseRppFile(file: File | string, verbose: boolean): Promise<Clip[]> {
  const data = typeof file === 'string' ? file : await file.text()
  const lines = data.split('\n')
  const clips: Clip[] = []
  let currentClip: Partial<Clip> = {}

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
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
    } else if (line === '>') {
      if (currentClip.POSITION !== undefined && currentClip.LENGTH !== undefined) {
        clips.push(currentClip as Clip)
      }
      currentClip = {}
    }
  }

  const sortedClips = clips.sort((a, b) => a.POSITION - b.POSITION);
  /*
  if (verbose) {
    console.log('Parsed Clips:', sortedClips);
  }
  */

  return sortedClips;
} 
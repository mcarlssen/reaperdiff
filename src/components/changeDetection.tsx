interface Clip {
  POSITION: number;
  LENGTH: number;
  OFFSET?: number;
  NAME: string;
  IGUID: string;
}

export async function parseRppFile(file: File, verbose: boolean): Promise<Clip[]> {
  const data = await file.text();
  const lines = data.split('\n');
  const clips: Clip[] = [];
  let currentClip: Partial<Clip> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('<ITEM')) {
      currentClip = {};
    } else if (line.startsWith('IGUID')) {
      currentClip.IGUID = line.split(' ')[1];
    } else if (line.startsWith('POSITION')) {
      currentClip.POSITION = parseFloat(line.split(' ')[1]);
    } else if (line.startsWith('LENGTH')) {
      currentClip.LENGTH = parseFloat(line.split(' ')[1]);
    } else if (line.startsWith('>')) {
      if (currentClip.IGUID && currentClip.POSITION !== undefined && currentClip.LENGTH !== undefined) {
        clips.push(currentClip as Clip);
      }
    }
  }

  const uniqueClips = clips.reduce((acc, current) => {
    const x = acc.find(item => item.IGUID === current.IGUID);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, [] as Clip[]);

  verbose && console.log('Parsed Clips (unique):', uniqueClips);

  return uniqueClips;
}

export async function detectChanges(
  controlFile: File, 
  revisedFile: File, 
  verbose: boolean
): Promise<{
  changedPositions: number[],
  controlClips: Clip[],
  revisedClips: Clip[]
}> {
  const controlClips = await parseRppFile(controlFile, verbose);
  const revisedClips = await parseRppFile(revisedFile, verbose);

  const changedIGUIDs = new Set<string>();

  controlClips.forEach(controlClip => {
    const revisedClip = revisedClips.find(r => r.IGUID === controlClip.IGUID);
    if (revisedClip && revisedClip.POSITION !== controlClip.POSITION) {
      changedIGUIDs.add(controlClip.IGUID);
      
      verbose && console.log(`Change detected for clip ${controlClip.IGUID}:`, {
        controlPosition: controlClip.POSITION,
        revisedPosition: revisedClip.POSITION
      });
    }
  });

  const changedPositions = Array.from(changedIGUIDs)
    .map(iguid => {
      const clip = controlClips.find(c => c.IGUID === iguid);
      return clip!.POSITION;
    });

  return {
    changedPositions,
    controlClips,
    revisedClips
  };
} 
import { promises as fs } from 'fs';

interface Clip {
  POSITION: number;
  LENGTH: number;
  OFFSET?: number;
  NAME: string;
  IGUID: string;
}

async function parseRppFile(filePath: string): Promise<Clip[]> {
  const data = await fs.readFile(filePath, 'utf-8');
  const lines = data.split('\n');
  const clips: Clip[] = [];
  let itemBlock = false;
  let clip: Partial<Clip> = {};

  for (const line of lines) {
    if (line.trim() === "<ITEM") {
      itemBlock = true;
      clip = {};
    } else if (line.trim() === ">") {
      if (itemBlock && clip.POSITION !== undefined && clip.LENGTH !== undefined && clip.NAME && clip.IGUID) {
        clips.push(clip as Clip);
      }
      itemBlock = false;
    } else if (itemBlock) {
      if (line.includes("POSITION")) {
        clip.POSITION = parseFloat(line.split(" ")[1]);
      } else if (line.includes("LENGTH")) {
        clip.LENGTH = parseFloat(line.split(" ")[1]);
      } else if (line.includes("SOFFS")) {
        clip.OFFSET = parseFloat(line.split(" ")[1]);
      } else if (line.includes("NAME")) {
        clip.NAME = line.split(" ", 2)[1].trim();
      } else if (line.includes("IGUID")) {
        clip.IGUID = line.split(" ", 2)[1].trim();
      }
    }
  }

  return clips;
}

async function detectChanges(controlFilePath: string, revisedFilePath: string): Promise<number[]> {
  const controlClips = await parseRppFile(controlFilePath);
  const revisedClips = await parseRppFile(revisedFilePath);
  const changedTimecodes: number[] = [];
  let cumulativeShift = 0;

  for (let i = 0; i < controlClips.length; i++) {
    const controlClip = controlClips[i];
    const revisedClip = revisedClips[i];

    if (revisedClip) {
      const positionDiff = Math.abs(controlClip.POSITION + cumulativeShift - revisedClip.POSITION);
      const lengthDiff = controlClip.LENGTH !== revisedClip.LENGTH;
      const offsetDiff = controlClip.OFFSET !== revisedClip.OFFSET;
      const contentDiff = controlClip.NAME !== revisedClip.NAME;

      if (positionDiff > 0.01 || lengthDiff || offsetDiff || contentDiff) {
        changedTimecodes.push(revisedClip.POSITION);
      }

      if (lengthDiff) {
        cumulativeShift += revisedClip.LENGTH - controlClip.LENGTH;
      }
    }
  }

  return changedTimecodes;
}

// Example usage
const controlPath = 'path/to/Chapter 18.rpp';
const revisedPath = 'path/to/Chapter 18-b.rpp';

detectChanges(controlPath, revisedPath).then(changedTimecodes => {
  console.log("Changed timecodes:", changedTimecodes);
}).catch(error => {
  console.error("Error detecting changes:", error);
});

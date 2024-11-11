import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from './fontawesome';
import { Switch, FormControlLabel } from '@mui/material';
import './App.css';
import { Timeline } from './components/Timeline';

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

export async function detectChanges(controlFile: File, revisedFile: File, verbose: boolean): Promise<number[]> {
  const controlClips = await parseRppFile(controlFile, verbose);
  const revisedClips = await parseRppFile(revisedFile, verbose);

  // Create a Set to store unique IGUIDs that have changed
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

  // Only return one position for each changed clip
  return Array.from(changedIGUIDs)
    .map(iguid => {
      const clip = controlClips.find(c => c.IGUID === iguid);
      return clip!.POSITION;
    });
}

export default function App() {
  const [verbose, setVerbose] = useState<boolean>(true);
  const [controlFile, setControlFile] = useState<File | null>(null);
  const [revisedFile, setRevisedFile] = useState<File | null>(null);
  const [results, setResults] = useState<number[] | null>(null);
  const [controlClips, setControlClips] = useState<Clip[]>([]);
  const [revisedClips, setRevisedClips] = useState<Clip[]>([]);

  const onDropControl = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 1) {
      setControlFile(acceptedFiles[0]);
    }
  }, []);

  const onDropRevised = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 1) {
      setRevisedFile(acceptedFiles[0]);
    }
  }, []);

  const compareFiles = async () => {
    if (!controlFile || !revisedFile) {
      alert('Please select both files first');
      return;
    }

    try {
      const control = await parseRppFile(controlFile, verbose);
      const revised = await parseRppFile(revisedFile, verbose);
      console.log('Setting clips:', { control, revised });
      setControlClips(control);
      setRevisedClips(revised);
      
      const changedTimecodes = await detectChanges(controlFile, revisedFile, verbose);
      setResults(changedTimecodes);
      console.log("Changed timecodes:", changedTimecodes);
    } catch (error) {
      console.error("Error detecting changes:", error);
    }
  };

  const { getRootProps: getControlRootProps, getInputProps: getControlInputProps, isDragActive: isControlDragActive } = useDropzone({
    onDrop: onDropControl,
    accept: {
      'application/x-reaper-project': ['.rpp']
    },
    multiple: false
  });

  const { getRootProps: getRevisedRootProps, getInputProps: getRevisedInputProps, isDragActive: isRevisedDragActive } = useDropzone({
    onDrop: onDropRevised,
    accept: {
      'application/x-reaper-project': ['.rpp']
    },
    multiple: false
  });

    return (
    <div className="app-container">
        <div className="top-banner">
            <div className="banner-left">
                <div className="app-title">
                    <FontAwesomeIcon icon="code-compare" /> rpp.app
                </div>
                <div className="header-links">
                    <h2>
                        about&nbsp;&nbsp;&nbsp;&nbsp;how to
                    </h2>
                </div>
            </div>
            <div className="banner-right">
                <FormControlLabel
                    control={
                        <Switch
                            checked={verbose}
                            onChange={(e) => {
                                setVerbose(e.target.checked);
                                console.log('Verbose logging:', e.target.checked);
                            }}
                            color="primary"
                        />
                    }
                    label="Console logging"
                />
            </div>
        </div>
        
        <div className="main-content">
            <div className="container">
            <h1>Diff-style .RPP File Comparison</h1>
            
            <div {...getControlRootProps()} className="dropzone">
                <input {...getControlInputProps()} />
                {isControlDragActive ? (
                <p>Drop the control file here...</p>
                ) : (
                <div>
                    <p>Drop control .rpp file here, or click to select</p>
                    {controlFile && <p>Selected: {controlFile.name}</p>}
                </div>
                )}
            </div>

            <div {...getRevisedRootProps()} className="dropzone">
                <input {...getRevisedInputProps()} />
                {isRevisedDragActive ? (
                <p>Drop the revised file here...</p>
                ) : (
                <div>
                    <p>Drop revised .rpp file here, or click to select</p>
                    {revisedFile && <p>Selected: {revisedFile.name}</p>}
                </div>
                )}
            </div>

            <button 
                onClick={compareFiles}
                disabled={!controlFile || !revisedFile}
                className="compare-button"
            >
                Compare Files
            </button>

            {results !== null && (
                <div className="results-container">
                    <h2>Results</h2>
                    <Timeline 
                      controlClips={controlClips}
                      revisedClips={revisedClips}
                      width={1000}
                      height={120}
                    />
                    {results.length > 0 ? (
                        <div className="results-list">
                            <p>Found {results.length} changed position{results.length !== 1 ? 's' : ''}:</p>
                            <ul>
                                {results.map((position, index) => (
                                    <li key={index}>Position: {position}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>No changes detected !</p>
                    )}
                </div>
            )}
            </div>
        </div>
    </div>
  );
}
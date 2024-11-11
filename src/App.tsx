import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from './fontawesome';
import { Switch, FormControlLabel } from '@mui/material';
import './App.css';

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
    } else if (line.startsWith('>')) {
      if (currentClip.IGUID && currentClip.POSITION !== undefined) {
        clips.push(currentClip as Clip);
      }
    }
  }

  verbose && console.log('Parsed Clips:');
  verbose && clips.forEach(clip => {
    console.log(`IGUID: ${clip.IGUID}, Position: ${clip.POSITION}`);
  });

  return clips;
}

export async function detectChanges(controlFile: File, revisedFile: File, verbose: boolean): Promise<number[]> {
  const controlClips = await parseRppFile(controlFile, verbose);
  const revisedClips = await parseRppFile(revisedFile, verbose);

  verbose && console.log('\nComparing Files:');
  verbose && console.log('Control File Clips:', controlClips.length);
  verbose && console.log('Revised File Clips:', revisedClips.length);

  const changedTimecodes = controlClips
    .filter((clip, index) => {
      const revisedClip = revisedClips.find(r => r.IGUID === clip.IGUID);
      const hasChanged = revisedClip && revisedClip.POSITION !== clip.POSITION;
      
      verbose && revisedClip && console.log(`Comparing clip ${clip.IGUID}:`, {
        controlPosition: clip.POSITION,
        revisedPosition: revisedClip.POSITION,
        changed: hasChanged
      });
      
      return hasChanged;
    })
    .map(clip => clip.POSITION);

  return changedTimecodes;
}

export default function App() {
  const [verbose, setVerbose] = useState<boolean>(true);
  const [controlFile, setControlFile] = useState<File | null>(null);
  const [revisedFile, setRevisedFile] = useState<File | null>(null);
  const [results, setResults] = useState<number[] | null>(null);

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
                        yep
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
                        <p>No changes detected</p>
                    )}
                </div>
            )}
            </div>
        </div>
    </div>
  );
}
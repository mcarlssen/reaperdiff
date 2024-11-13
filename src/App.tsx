import { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from './fontawesome';
import { Switch, FormControlLabel } from '@mui/material';
import './App.css';
import { Timeline } from './components/Timeline';
import { detectChanges } from './components';
import { Clip, Change } from './types';

export default function App() {
  const [verbose, setVerbose] = useState<boolean>(true);
  const [controlFile, setControlFile] = useState<File | null>(null);
  const [revisedFile, setRevisedFile] = useState<File | null>(null);
  const [results, setResults] = useState<number[] | null>(null);
  const [controlClips, setControlClips] = useState<Clip[]>([]);
  const [revisedClips, setRevisedClips] = useState<Clip[]>([]);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const [isCompared, setIsCompared] = useState<boolean>(false);
  const [changes, setChanges] = useState<Change[]>([]);
  const [detectOverlapsEnabled, setDetectOverlapsEnabled] = useState<boolean>(false);
  const [detectPositionsEnabled, setDetectPositionsEnabled] = useState<boolean>(true);
  const [detectLengthsEnabled, setDetectLengthsEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (resultsContainerRef.current) {
      // Immediate measurement when the container is available
      setContainerWidth(resultsContainerRef.current.clientWidth - 0);

      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          // Get the available width from the container
          const availableWidth = entry.contentRect.width - 0; // 40px for padding
          setContainerWidth(availableWidth);
        }
      });

      resizeObserver.observe(resultsContainerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [results]);

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
      const { changedPositions, controlClips: control, revisedClips: revised, changes } = 
        await detectChanges(controlFile, revisedFile, verbose, {
          detectOverlaps: detectOverlapsEnabled,
          detectPositions: detectPositionsEnabled,
          detectLengths: detectLengthsEnabled
        });
      
      setControlClips(control);
      setRevisedClips(revised);
      setResults(changedPositions);
      setChanges(changes);
      setIsCompared(true);
    } catch (error) {
      console.error("Error detecting changes:", error);
    }
  };

  const clearAll = () => {
    setControlFile(null);
    setRevisedFile(null);
    setResults(null);
    setControlClips([]);
    setRevisedClips([]);
    setContainerWidth(null);
    setIsCompared(false);
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
                    <FontAwesomeIcon icon="code-compare" /> reaperdiff.app
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
            <h2>Diff-style .RPP Comparison</h2>
            
            <div className="dropzone-container">
                <div {...getControlRootProps()} className="dropzone">
                    <input {...getControlInputProps()} />
                    {isControlDragActive ? (
                    <p>Drop the control file here...</p>
                    ) : (
                    <div>
                        <p>Drop <b>control</b> .rpp file here, or click to select</p>
                        {controlFile && <p>Selected: {controlFile.name}</p>}
                    </div>
                    )}
                </div>

                <div {...getRevisedRootProps()} className="dropzone">
                    <input {...getRevisedInputProps()} />
                    {isRevisedDragActive ? (
                    <p>Drop the <b>revised</b> .rpp file here...</p>
                    ) : (
                    <div>
                        <p>Drop revised .rpp file here, or click to select</p>
                        {revisedFile && <p>Selected: {revisedFile.name}</p>}
                    </div>
                    )}
                </div>
            </div>

            <div className="button-container">
                <div className="detection-options">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={detectOverlapsEnabled}
                                onChange={(e) => setDetectOverlapsEnabled(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Detect Overlaps"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={detectPositionsEnabled}
                                onChange={(e) => setDetectPositionsEnabled(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Detect Positions"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={detectLengthsEnabled}
                                onChange={(e) => setDetectLengthsEnabled(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Detect Lengths"
                    />
                </div>
                <button 
                    onClick={isCompared ? clearAll : compareFiles}
                    disabled={!isCompared && (!controlFile || !revisedFile)}
                    className={`compare-button ${isCompared ? 'clear-button' : ''}`}
                >
                    {isCompared ? 'Clear' : 'Compare Files'}
                </button>
            </div>

            {results !== null && (
                <div className="results-container" ref={resultsContainerRef}>
                    <>
                        <h2>Results</h2>
                        {console.log('Render conditions:', {
                            controlClipsLength: controlClips.length,
                            revisedClipsLength: revisedClips.length,
                            containerWidth,
                            shouldRenderTimeline: controlClips.length > 0 && revisedClips.length > 0 && containerWidth
                        })}
                        {controlClips.length > 0 && revisedClips.length > 0 && containerWidth ? (
                          <Timeline 
                            controlClips={controlClips}
                            revisedClips={revisedClips}
                            width={containerWidth}
                            height={220}
                            changes={changes}
                          />
                        ) : (
                          <p>Loading timeline...</p>
                        )}
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
                    </>
                </div>
            )}
            </div>
        </div>
    </div>
  );
}
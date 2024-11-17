import { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from './fontawesome';
import { Switch, FormControlLabel, Tooltip, Radio, RadioGroup } from '@mui/material';
import './App.css';
import { Timeline } from './components/Timeline';
import { detectChanges } from './components';
import { Clip, Change } from './types';
import { generateAlgorithmTooltip } from './components/helpers/generateAlgorithmTooltip';
import { testDatasets, getDatasetById } from './testData/index';

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
  const [detectPositionsEnabled, setDetectPositionsEnabled] = useState<boolean>(false);
  const [detectLengthsEnabled, setDetectLengthsEnabled] = useState<boolean>(false);
  const [detectFingerprintEnabled, setDetectFingerprintEnabled] = useState<boolean>(false);
  const [detectAddsDeletesEnabled, setDetectAddsDeletesEnabled] = useState<boolean>(true);
  const [hoveredPosition, setHoveredPosition] = useState<number | null>(null);
  const [hasFiles, setHasFiles] = useState<boolean>(false);
  const [testMode, setTestMode] = useState<boolean>(false);
  const [showDropzones, setShowDropzones] = useState(true);
  const [showTestMode, setShowTestMode] = useState(false);
  const [fadeOutDropzones, setFadeOutDropzones] = useState(false);
  const [fadeOutTestMode, setFadeOutTestMode] = useState(false);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('')
  const [datasetError, setDatasetError] = useState<string | null>(null)

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
      setHasFiles(!!revisedFile);
    }
  }, [revisedFile]);

  const onDropRevised = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 1) {
      setRevisedFile(acceptedFiles[0]);
      setHasFiles(!!controlFile);
    }
  }, [controlFile]);

  const compareFiles = async () => {
    let controlInput: File | string | null = controlFile;
    let revisedInput: File | string | null = revisedFile;

    if (testMode) {
      const dataset = getDatasetById(selectedDatasetId)
      if (!dataset) {
        alert('Please select a test dataset')
        return
      }
      controlInput = dataset.controlData
      revisedInput = dataset.revisedData
    }

    if (!controlInput || !revisedInput) {
      alert('Please select both files first');
      return;
    }

    try {
      const { changedPositions, controlClips: control, revisedClips: revised, changes } = 
        await detectChanges(controlInput, revisedInput, verbose, {
          detectOverlaps: detectOverlapsEnabled,
          detectPositions: detectPositionsEnabled,
          detectLengths: detectLengthsEnabled,
          detectFingerprint: detectFingerprintEnabled,
          detectAddsDeletes: detectAddsDeletesEnabled
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
    setHasFiles(false);
    setChanges([]);
  };

  const { getRootProps: getControlRootProps, getInputProps: getControlInputProps, isDragActive: isControlDragActive } = useDropzone({
    onDrop: onDropControl,
    accept: {
      'application/x-reaper-project': ['.rpp']
    },
    multiple: false,
    disabled: testMode,
  });

  const { getRootProps: getRevisedRootProps, getInputProps: getRevisedInputProps, isDragActive: isRevisedDragActive } = useDropzone({
    onDrop: onDropRevised,
    accept: {
      'application/x-reaper-project': ['.rpp']
    },
    multiple: false
  });

  useEffect(() => {
    if (isCompared) {
      setIsCompared(false);
    }
  }, [
    detectOverlapsEnabled,
    detectPositionsEnabled,
    detectLengthsEnabled,
    detectFingerprintEnabled,
    detectAddsDeletesEnabled
  ]);

  useEffect(() => {
    if (testMode) {
      // Start fade out of dropzones
      setFadeOutDropzones(true);
      setTimeout(() => {
        setShowDropzones(false);
        setFadeOutDropzones(false);
        setShowTestMode(true);
        // Clear files after transition
        setControlFile(null);
        setRevisedFile(null);
        setIsCompared(false);
      }, 200);
    } else {
      // Start fade out of test mode
      setFadeOutTestMode(true);
      setTimeout(() => {
        setShowTestMode(false);
        setFadeOutTestMode(false);
        setShowDropzones(true);
        setIsCompared(false);
        clearAll();
      }, 200);
    }
  }, [testMode]);

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
                <div className="switch-container">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={verbose}
                                onChange={(e) => setVerbose(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Console Logging"
                    />
                </div>
                <div className="switch-container">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={testMode}
                                onChange={(e) => setTestMode(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Test Mode"
                    />
                </div>
            </div>
        </div>
        
        <div className="main-content">
            <div className="container">
            <h2>Diff-style .RPP Comparison</h2>
            
            {showTestMode ? (
              <div className={`test-mode-indicator ${fadeOutTestMode ? 'fade-out' : ''}`}>
                <div className="test-mode-content">
                  <h3>TEST MODE</h3>
                  {datasetError ? (
                    <div className="dataset-error">
                      Error loading datasets: {datasetError}
                    </div>
                  ) : testDatasets.length === 0 ? (
                    <div className="dataset-error">
                      No test datasets found
                    </div>
                  ) : (
                    <RadioGroup 
                      className="dataset-selector"
                      value={selectedDatasetId}
                      onChange={(e) => {
                        setSelectedDatasetId(e.target.value)
                        setIsCompared(false)
                      }}
                    >
                      {testDatasets.map(dataset => (
                        <Tooltip 
                          key={dataset.id}
                          title={dataset.description}
                          placement="top"
                          PopperProps={{
                            modifiers: [{
                              name: 'offset',
                                options: {
                                  offset: [0, -16],
                                },
                            }],
                          }}
                        >
                          <FormControlLabel
                            value={dataset.id}
                            control={<Radio />}
                            label={dataset.name}
                          />
                        </Tooltip>
                      ))}
                    </RadioGroup>
                  )}
                </div>
              </div>
            ) : showDropzones ? (
              <div className={`dropzone-container ${fadeOutDropzones ? 'fade-out' : ''}`}>
                <div 
                  className={`dropzone ${controlFile ? 'has-file' : ''} ${
                    testMode ? 'disabled' : ''
                  }`} 
                  {...getControlRootProps({ disabled: testMode })}
                >
                    <input {...getControlInputProps()} />
                    {controlFile ? (
                        <p>Selected: <span className="file-type">{controlFile.name}</span></p>
                    ) : (
                        <p>
                            {isControlDragActive ? (
                                <>Drop <span className="dropzone-text-emphasis">control</span> file here</>
                            ) : (
                                <>Drop <span className="file-type">control</span> .rpp file here, or click to select</>
                            )}
                        </p>
                    )}
                </div>

                <div 
                  className={`dropzone ${revisedFile ? 'has-file' : ''} ${
                    testMode ? 'disabled' : ''
                  }`} 
                  {...getRevisedRootProps({ disabled: testMode })}
                >
                    <input {...getRevisedInputProps()} />
                    {revisedFile ? (
                        <p>Selected: <span className="file-type">{revisedFile.name}</span></p>
                    ) : (
                        <p>
                            {isRevisedDragActive ? (
                                <span className="dropzone-text-emphasis">Drop file here</span>
                            ) : (
                                <>Drop <span className="file-type">revised</span> .rpp file here, or click to select</>
                            )}
                        </p>
                    )}
                </div>
              </div>
            ) : null}

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
                        label="Overlaps"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={detectLengthsEnabled}
                                onChange={(e) => setDetectLengthsEnabled(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Lengths"
                    />
                    <Tooltip 
                        title={<div className="algorithm-tooltip">{generateAlgorithmTooltip('fingerprint')}</div>}
                        placement="top"
                        enterDelay={500}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={detectFingerprintEnabled}
                                    onChange={(e) => setDetectFingerprintEnabled(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Fingerprints"
                        />
                    </Tooltip>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={detectPositionsEnabled}
                                onChange={(e) => setDetectPositionsEnabled(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Positions"
                    />
                    <Tooltip 
                        title={<div className="algorithm-tooltip">{generateAlgorithmTooltip('addsdeletes')}</div>}
                        placement="top"
                        enterDelay={500}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={detectAddsDeletesEnabled}
                                    onChange={(e) => setDetectAddsDeletesEnabled(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Adds/Deletes"
                        />
                    </Tooltip>
                </div>
                <div className="compare-button-container">
                    <button 
                        onClick={isCompared ? clearAll : compareFiles}
                        disabled={testMode ? !selectedDatasetId : (!controlFile && !revisedFile)}
                        className={`compare-button ${
                            isCompared ? 'clear-button' : 
                            testMode ? (selectedDatasetId ? 'ready' : '') :
                            (controlFile && revisedFile) ? 'ready' :
                            (controlFile || revisedFile) ? 'partial' : ''
                        }`}
                    >
                        {isCompared ? 'Clear' : 'Compare Files'}
                    </button>
                </div>
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
                            revisedClips={revisedClips}
                            width={containerWidth}
                            height={320}
                            changes={changes}
                            hoveredPosition={hoveredPosition}
                          />
                        ) : (
                          <p>Loading timeline...</p>
                        )}
                        {results.length > 0 ? (
                            <div className="results-list">
                                <p>Found {changes.length} change{changes.length !== 1 ? 's' : ''}:</p>
                                <ul>
                                    {changes
                                        .sort((a, b) => a.revisedPosition - b.revisedPosition)
                                        .map((change, index) => {
                                            const changeDescription = (() => {
                                                const position = change.revisedPosition.toFixed(2)
                                                const method = change.detectionMethod.charAt(0).toUpperCase() + 
                                                      change.detectionMethod.slice(1)
                                                
                                                switch (change.type) {
                                                    case 'added':
                                                        return `Added clip at ${position} (${method})`
                                                    case 'deleted':
                                                        return `Deleted clip at ${position} (${method})`
                                                    case 'changed':
                                                        if (change.detectionMethod === 'fingerprint')
                                                            return `Clip moved to ${position} (${method})`
                                                        if (change.detectionMethod === 'position')
                                                            return `Clip position changed to ${position} (${method})`
                                                        if (change.detectionMethod === 'length')
                                                            return `Clip length changed at ${position} (${method})`
                                                        return `Clip modified at ${position} (${method})`
                                                    default:
                                                        return `Unknown change at ${position} (${method})`
                                                }
                                            })()

                                            return (
                                                <li 
                                                    key={index}
                                                    onMouseEnter={() => setHoveredPosition(change.revisedPosition)}
                                                    onMouseLeave={() => setHoveredPosition(null)}
                                                    className={`result-item ${change.type}`}
                                                >
                                                    {changeDescription}
                                                </li>
                                            )
                                        })}
                                </ul>
                            </div>
                        ) : (
                            <p>No changes detected!</p>
                        )}
                    </>
                </div>
            )}
            </div>
        </div>
    </div>
  );
}
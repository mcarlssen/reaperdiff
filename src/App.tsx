import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Switch, FormControlLabel, Radio, RadioGroup, Tooltip } from '@mui/material'
import { Timeline } from './components/Timeline'
import { Clip, Change, DetectionOptions, ClipDetails } from './types'
import { calculateTotalDuration, formatDuration } from './utils/duration'
import { generateChangeExplanation, getMethodName } from './utils/changeExplanation'
import { FontAwesomeIcon } from './fontawesome'
import './App.css'
import { detectChanges } from './components'
import { generateAlgorithmTooltip } from './components/helpers/generateAlgorithmTooltip'
import { testDatasets, getDatasetById } from './testData/index'
import { chaoticOrbit } from 'ldrs'
import { ClockCountdown, FileCsv } from "@phosphor-icons/react"
import { useVerbose } from './hooks/useVerbose'
import { changeIcons } from './constants/icons'
import { CollapseHeader } from './components/helpers/collapseHeaderControl'
import { TOLERANCE, verbose } from './constants'


chaoticOrbit.register()

export default function App() {
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
  const [overlappingClips, setOverlappingClips] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isScrollable, setIsScrollable] = useState(true)
  const [isFullWidth, setIsFullWidth] = useState(false)
  const [activeClipDetails, setActiveClipDetails] = useState<ClipDetails | null>(null)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const lastPosition = useRef<number | null>(null)
  const [isVerbose, setVerbose] = useVerbose(true)
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(() => {
    return JSON.parse(localStorage.getItem('isControlsCollapsed') ?? 'false')
  })

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

  const calculateLoadingDuration = (clips: Clip[]): number => {
    if (!clips.length) return 0
    const maxPosition = Math.max(...clips.map(clip => clip.POSITION + clip.LENGTH))
    return ((maxPosition / 60) * 250)+2000 // 250ms per 60 units + 2 seconds
  }

  const compareFiles = async () => {
    let controlInput: File | string | null = controlFile
    let revisedInput: File | string | null = revisedFile

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
      alert('Please select both files first')
      return
    }

    try {
      // Start loading state
      setIsLoading(true)

      const result = await detectChanges(
        controlInput,
        revisedInput,
        {
          detectOverlaps: detectOverlapsEnabled,
          detectPositions: detectPositionsEnabled,
          detectLengths: detectLengthsEnabled,
          detectFingerprint: detectFingerprintEnabled,
          detectAddsDeletes: detectAddsDeletesEnabled
        }
      )
      
      // Calculate and apply loading duration
      const loadingDuration = calculateLoadingDuration(revisedClips)
      const minimumDuration = 2000 // 2 seconds minimum
      const totalDuration = Math.max(loadingDuration, minimumDuration)
      
      // Set the state
      setControlClips(result.controlClips)
      setRevisedClips(result.revisedClips)
      setResults(result.changedPositions)
      setChanges(result.changes)
      setOverlappingClips(result.overlappingClips)
      setIsCompared(true)

      // First, start the fade out of the loader
      setTimeout(() => {
        setIsLoading(false)
      }, totalDuration)

    } catch (error) {
      console.error("Error detecting changes:", error)
      setIsLoading(false)
    }
  }

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
    setOverlappingClips([]);
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

  function scrollToResult(position: number | null, forceScroll: boolean = false) {
    if (position === null) return

    const resultsList = document.querySelector('.results-list-content')
    const resultItem = document.querySelector(`.result-item[data-position="${position.toFixed(2)}"]`)
    
    if (resultsList && resultItem) {
        const listRect = resultsList.getBoundingClientRect()
        const itemRect = (resultItem as HTMLElement).getBoundingClientRect()
        
        // Calculate the item's position relative to the viewport
        const itemRelativeTop = itemRect.top - listRect.top
        
        // Check if item is already visible in the viewport
        const isVisible = (
            itemRelativeTop >= 0 &&
            itemRelativeTop <= listRect.height
        )
        
        // Scroll if forced or if item isn't visible
        if (forceScroll || !isVisible) {
            const scrollPosition = Math.max(
                0,
                Math.min(
                    resultsList.scrollTop + itemRelativeTop - 8,
                    resultsList.scrollHeight - listRect.height
                )
            )

            resultsList.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            })
        }
    }
  }

  const handleClipHover = useCallback((position: number | null, change?: Change, shouldScroll: boolean = false) => {
    if (hoverTimeout) {
        clearTimeout(hoverTimeout)
        setHoverTimeout(null)
    }

    if (position !== null && change) {
        // Find the actual clip that corresponds to this change
        const clip = revisedClips.find(c => Math.abs(c.POSITION - change.revisedPosition) < 0.001)
        // Find the control clip if it exists
        const controlClip = change.controlPosition !== undefined ? 
            controlClips.find(c => Math.abs(c.POSITION - change.controlPosition!) < 0.001) : 
            undefined
        
        // Immediate update for hover on
        lastPosition.current = position
        setHoveredPosition(position)
        setActiveClipDetails({
            position: change.revisedPosition,
            length: clip?.LENGTH || 0,
            type: change.type,
            method: change.detectionMethod,
            explanation: generateChangeExplanation(change, controlClip, clip)
        })
        // Force scroll for timeline hovers, check visibility for list hovers
        scrollToResult(position, !shouldScroll)
    } else if (position === null && lastPosition.current !== null) {
        // Start timeout only if we had a previous position
        const timeout = setTimeout(() => {
            // Only clear if we haven't moved to a new position
            if (hoveredPosition === lastPosition.current) {
                console.log('Timeout triggered - clearing details')
                lastPosition.current = null
                setHoveredPosition(null)
                setActiveClipDetails(null)
            }
        }, 200)
        setHoverTimeout(timeout)
    }
  }, [hoverTimeout, hoveredPosition, revisedClips, controlClips])

  useEffect(() => {
    return () => {
        if (hoverTimeout) clearTimeout(hoverTimeout)
    }
  }, [hoverTimeout])

  const addedCount = changes.filter(change => change.type === 'added').length
  const deletedCount = changes.filter(change => change.type === 'deleted').length
  const changedCount = changes.filter(change => change.type === 'changed').length

  useEffect(() => {
    if (results !== null) {
      setTimeout(() => {
        setIsControlsCollapsed(true)
        localStorage.setItem('isControlsCollapsed', 'true')
      }, 300)
    }
  }, [results])

  useEffect(() => {
    localStorage.setItem('isControlsCollapsed', JSON.stringify(isControlsCollapsed))
  }, [isControlsCollapsed])

  function downloadCSV(changes: Change[], filename: string) {
    // Define headers based on available properties from Change interface
    const headers = [
      'type',
      'detectionMethod',
      'revisedPosition',
      'controlPosition',
      'controlLength',
      'controlOffset',
      'revisedLength',
      'FILE'
    ]

    // Convert changes to CSV rows
    const rows = changes.map(change => [
      change.type,
      change.detectionMethod,
      change.revisedPosition,
      change.controlPosition || '',
      change.controlLength || '',
      change.controlOffset || '',
      change.revisedLength || '',
      // We can get the FILE from revisedClips using the revisedPosition
      revisedClips.find(clip => Math.abs(clip.POSITION - change.revisedPosition) < TOLERANCE)?.FILE || ''
    ])

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const timestamp = new Date().toISOString().split('T')[0]
    const fileName = `reaperdiff-${revisedFile?.name || 'results'}-${timestamp}.csv`
    
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div className={`app-container ${isFullWidth ? 'full-width' : ''}`}>
        <div className="top-banner">
            <div className="banner-left bordered">
                <div className="app-title">
                    <FontAwesomeIcon icon="code-compare" /> reaperdiff.app
                    <p>Diff-style .RPP Comparison and sanity checker</p>
                </div>
                <div className="header-links">
                    <h2>
                        about&nbsp;&nbsp;&nbsp;&nbsp;how to
                    </h2>
                </div>
            </div>
            <div className="banner-right bordered">
                <div className="switch-container">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isVerbose}
                                onChange={(e) => setVerbose(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Console Logs"
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
                <div className="switch-container">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isFullWidth}
                                onChange={(e) => setIsFullWidth(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Full Width"
                    />
                </div>
                
                {(isControlsCollapsed || results !== null) && (
                    <CollapseHeader 
                        isCollapsed={isControlsCollapsed}
                        onToggle={() => {
                            setIsControlsCollapsed(!isControlsCollapsed)
                            if (isControlsCollapsed) {
                                setIsCompared(false)
                            }
                        }}
                    />
                )}
            </div>
        </div>
        
        <div className="main-content">
            <div className="container bordered">
                <div className={`controls-wrapper ${isControlsCollapsed ? 'collapsed' : ''}`}>
                    {testMode && (
                        <div className={`test-mode-indicator ${isCompared ? 'fade-out' : ''}`}>
                            <div className="test-mode-content">
                                <h3>TEST MODE</h3>
                                {datasetError ? (
                                    <div className="dataset-error bordered">
                                        Error loading datasets: {datasetError}
                                    </div>
                                ) : testDatasets.length === 0 ? (
                                    <div className="dataset-error bordered">
                                        No test datasets found
                                    </div>
                                ) : (
                                    <RadioGroup 
                                        className="dataset-selector"
                                        value={selectedDatasetId}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                    )}
                    {!testMode && (
                        <div className={`dropzone-container ${isCompared ? 'fade-out' : ''}`}>
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
                    )}

                    <div className="button-container">
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
                </div>

                {results !== null && (
                    <div className="results-container" ref={resultsContainerRef}>
                        <div className={`loader-container ${isLoading ? 'fade-in' : 'fade-out'}`}
                            style={{ display: isLoading ? 'flex' : 'none' }}>
                            <l-chaotic-orbit
                                size="85"
                                speed="2" 
                                color="var(--text-accent-color)"
                            ></l-chaotic-orbit>
                        </div>

                        <div className={`results-content ${!isLoading ? 'fade-in' : 'fade-out'}`}
                            style={{ display: !isLoading ? 'block' : 'none' }}>
                            <div className="timeline-container">
                                {controlClips.length > 0 && revisedClips.length > 0 && containerWidth && (
                                    <Timeline 
                                        revisedClips={revisedClips}
                                        width={containerWidth}
                                        height={360}
                                        changes={changes}
                                        hoveredPosition={hoveredPosition}
                                        overlappingClips={overlappingClips}
                                        onHover={(position) => {
                                            const change = changes.find(c => c.revisedPosition === position)
                                            handleClipHover(position, change, false)
                                        }}
                                        showTooltip={false}
                                    />
                                )}
                            </div>

                            <div className="results-content-wrapper">
                                {changes.length > 10 && (
                                    <div className="results-list-header">
                                        <div className="results-list-switch">
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={isScrollable}
                                                        onChange={(e) => setIsScrollable(e.target.checked)}
                                                        name="scrollable"
                                                    />
                                                }
                                                label="Scrollable List"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="middle-column">
                                    <div className="results-timeline-stats">
                                        <div className="results-duration bordered">
                                            {(() => {
                                                const controlDuration = calculateTotalDuration(controlClips)
                                                const revisedDuration = calculateTotalDuration(revisedClips)
                                                const durationChange = revisedDuration - controlDuration
                                                const percentageChange = ((revisedDuration - controlDuration) / controlDuration * 100).toFixed(1)
                                                const isPositive = durationChange >= 0
                                                
                                                return (
                                                    <div className="duration-change"> {/* duration value and change */ }
                                                        <ClockCountdown size={48} alt="Duration" />
                                                        <p className={`duration-value ${
                                                            durationChange === 0 ? 'unchanged' : 
                                                            durationChange > 0 ? 'positive' : 
                                                            'negative'
                                                        }`}>
                                                            {formatDuration(revisedDuration)}</p>
                                                        <p>
                                                            <span className={`duration-value percentage ${
                                                                durationChange === 0 ? 'unchanged' : 
                                                                durationChange > 0 ? 'positive' : 
                                                                'negative'
                                                            }`}>
                                                                {durationChange === 0 ? (
                                                                    <span className="no-change">(no change)</span>
                                                                ) : (
                                                                    <>
                                                                        <span className="duration-change-time">
                                                                            {`${durationChange > 0 ? '+' : '-'}${formatDuration(durationChange)}`}
                                                                        </span>
                                                                        <span className="duration-change-percent">
                                                                            {`(${percentageChange}%)`}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </span>
                                                        </p>
                                                    </div>
                                                )
                                            })()}
                                        </div>
                                        <div className="results-data bordered">
                                            <div className="stat-row">
                                                <div className="stat-group">
                                                    <changeIcons.added.icon 
                                                        size={48}
                                                        color={changeIcons.added.color }
                                                    />
                                                    <p className={`duration-value ${addedCount > 0 ? 'positive' : ''}`}>
                                                        {addedCount}
                                                    </p>
                                                </div>
                                                <div className="stat-group">
                                                    <changeIcons.deleted.icon 
                                                        size={48}
                                                        color={changeIcons.deleted.color}
                                                    />
                                                    <p className={`duration-value ${deletedCount > 0 ? 'negative' : ''}`}>
                                                        {deletedCount}
                                                    </p>
                                                </div>
                                                <div className="stat-group">
                                                    <changeIcons.modified.icon 
                                                        size={48}
                                                        color={changeIcons.modified.color}
                                                    />
                                                    <p className={`duration-value ${changedCount > 0 ? 'unchanged' : ''}`}>
                                                        {changedCount}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="results-list-details bordered"
                                    onMouseEnter={() => {
                                        // Clear any pending timeout when entering the details panel
                                        if (hoverTimeout) {
                                            clearTimeout(hoverTimeout)
                                            setHoverTimeout(null)
                                        }
                                    }}
                                    onMouseLeave={() => {
                                        // Start the timeout when leaving the details panel
                                        const timeout = setTimeout(() => {
                                            setHoveredPosition(null)
                                            setActiveClipDetails(null)
                                        }, 200)
                                        setHoverTimeout(timeout)
                                    }}
                                >
                                    {/* <h4>Clip Details</h4> */}
                                    <div className={`details-content ${activeClipDetails ? '' : 'transitioning'}`}>
                                        {activeClipDetails ? (
                                            <>
                                                <div className="details-row metrics">
                                                    <div className="metric-column">
                                                        <div className="details-label">Position</div>
                                                        <div className="details-value">
                                                            {formatDuration(activeClipDetails.position)}
                                                        </div>
                                                    </div>
                                                    <div className="metric-column">
                                                        <div className="details-label">Length</div>
                                                        <div className="details-value">
                                                            {formatDuration(activeClipDetails.length)}
                                                        </div>
                                                    </div>
                                                </div>
                                                { /*
                                                <div className="details-row">
                                                    <div className="details-label">Change Type</div>
                                                    <div className="details-value explanation">
                                                        {activeClipDetails.explanation}
                                                    </div>
                                                </div>
                                                */ }
                                                <div className="details-row">
                                                    <div className="details-label">Explanation</div>
                                                    <div className="details-value explanation">
                                                        {activeClipDetails.explanation.split('\n').map((line, i) => (
                                                            <div key={i} className="explanation-line">{line}</div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="details-row">
                                                    <div className="details-label">Algorithm</div>
                                                    <div className="details-value explanation">
                                                        {getMethodName(activeClipDetails.method)}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="details-empty">
                                                <p>&nbsp;</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="results-list">
                                    <div className={`results-list-content ${isScrollable && changes.length > 9 ? 'scrollable' : ''}`}>
                                        <ul>
                                            {changes
                                                .sort((a, b) => a.revisedPosition - b.revisedPosition)
                                                .map((change, index) => {
                                                    const changeDescription = (() => {
                                                        const position = formatDuration(change.revisedPosition)
                                                        
                                                        switch (change.type) {
                                                            case 'added':
                                                                return `Added clip at ${position}`
                                                            case 'deleted':
                                                                return `Deleted clip at ${position}`
                                                            case 'changed':
                                                                if (change.detectionMethod === 'fingerprint')
                                                                    return `Clip moved to ${position}`
                                                                if (change.detectionMethod === 'position')
                                                                    return `Clip position changed to ${position}`
                                                                if (change.detectionMethod === 'length')
                                                                    return `Clip length changed at ${position}`
                                                                return `Modified clip at ${position}`
                                                            default:
                                                                return `Unknown change at ${position}`
                                                        }
                                                    })()

                                                            const IconComponent = changeIcons[change.type === 'changed' ? 'modified' : change.type]?.icon || changeIcons.unchanged.icon

                                                    return (
                                                        <li 
                                                            key={index}
                                                            data-position={change.revisedPosition.toFixed(2)}
                                                            onMouseEnter={() => handleClipHover(change.revisedPosition, change, true)}
                                                            onMouseLeave={() => handleClipHover(null)}
                                                            className={`result-item ${change.type}${
                                                                hoveredPosition === change.revisedPosition ? ' hovered' : ''
                                                            }`}
                                                        >
                                                            <div className="icon-wrapper">
                                                                <IconComponent 
                                                                    size={18} 
                                                                    weight="light"
                                                                    color={changeIcons[change.type === 'changed' ? 'modified' : change.type]?.color || changeIcons.unchanged.color}
                                                                />
                                                            </div>
                                                            {changeDescription}
                                                        </li>
                                                    )
                                                })}
                                        </ul>
                                    </div>
                                </div>
                                <div className="results-divider"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
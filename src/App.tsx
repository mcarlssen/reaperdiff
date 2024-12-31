import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Switch, FormControlLabel, Radio, RadioGroup, Tooltip } from '@mui/material'
import { Timeline } from './components/Timeline'
import { Clip, Change, DetectionOptions, ClipDetails } from './types'
import { calculateTotalDuration, formatDuration } from './utils/duration'
import { generateChangeExplanation, getMethodName } from './utils/changeExplanation'
import './App.css'
import { detectChanges } from './components'
import { generateAlgorithmTooltip } from './components/helpers/generateAlgorithmTooltip'
import { testDatasets, getDatasetById } from './testData/index'
import { chaoticOrbit, newtonsCradle } from 'ldrs'
import { ClockCountdown, FileCsv, Info, Question, Warning, GitDiff } from "@phosphor-icons/react"
import { useVerbose } from './hooks/useVerbose'
import { changeIcons } from './constants/icons'
import { CollapseHeader } from './components/helpers/collapseHeaderControl'
import { TOLERANCE, verbose } from './constants'
import { Toaster } from 'react-hot-toast'
import { InfoModal } from './components/InfoModal'
import { Analytics } from "@vercel/analytics/react"

chaoticOrbit.register()
newtonsCradle.register()

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
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'about' | 'howto' | 'bug' | null>(null)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const MIN_SCREEN_WIDTH = 1080

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

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
    //console.log('compareFiles called. Current isCompared state:', isCompared)
    
    // If comparison has been run, clear everything
    if (isCompared) {
      //console.log('Clearing state because isCompared is true')
      setControlFile(null)
      setRevisedFile(null)
      setControlClips([])
      setRevisedClips([])
      setResults(null)
      setChanges([])
      setOverlappingClips([])
      setIsCompared(false)
      
      // Ensure dropzones are visible and uploader is expanded
      setShowDropzones(true)
      setIsControlsCollapsed(false)
      
      //console.log('State cleared, isCompared set to false')
      return
    }

    let controlInput: File | string | null = controlFile
    let revisedInput: File | string | null = revisedFile

    if (testMode) {
      //console.log('Test mode active, setting up test data')
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
      //console.log('Starting comparison process')
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
      
      //console.log('Comparison completed, updating state')
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
      //console.log('State updated, isCompared set to true')

      // First, start the fade out of the loader
      setTimeout(() => {
        //console.log('Loading timeout complete, setting isLoading to false')
        setIsLoading(false)
      }, totalDuration)
    } catch (error) {
      //console.error("Error detecting changes:", error)
      //console.log('Error occurred, setting isLoading to false')
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
    disabled: testMode || isCompared,
  });

  const { getRootProps: getRevisedRootProps, getInputProps: getRevisedInputProps, isDragActive: isRevisedDragActive } = useDropzone({
    onDrop: onDropRevised,
    accept: {
      'application/x-reaper-project': ['.rpp']
    },
    multiple: false,
    disabled: testMode || isCompared,
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
      //console.log('Test mode effect triggered - testMode is true')
      // Start fade out of dropzones
      setFadeOutDropzones(true)
      setTimeout(() => {
        setShowDropzones(false)
        setFadeOutDropzones(false)
        setShowTestMode(true)
        // Clear files after transition
        setControlFile(null)
        setRevisedFile(null)
        setIsCompared(false)
      }, 200)
    } else {
      //console.log('Test mode effect triggered - testMode is false')
      // Start fade out of test mode
      setFadeOutTestMode(true)
      setTimeout(() => {
        setShowTestMode(false)
        setFadeOutTestMode(false)
        setShowDropzones(true)
        setIsCompared(false)
        clearAll()
      }, 200)
    }
  }, [testMode])

  useEffect(() => {
    if (!testMode) {
      // Show dropzones when controls are expanded, regardless of comparison state
      if (!isControlsCollapsed) {
        //console.log('Controls expanded, showing dropzones')
        setShowDropzones(true)
        setFadeOutDropzones(false)
      }
    }
  }, [isControlsCollapsed, testMode])

  useEffect(() => {
    //console.log('fadeOutDropzones changed to:', fadeOutDropzones)
  }, [fadeOutDropzones])

  useEffect(() => {
    //console.log('fadeOutTestMode changed to:', fadeOutTestMode)
  }, [fadeOutTestMode])

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
    if (results !== null && isCompared) {
      setTimeout(() => {
        setIsControlsCollapsed(true)
      }, 300)
    }
  }, [results, isCompared])

  useEffect(() => {
    //console.log('Controls collapsed state:', isControlsCollapsed)
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

  // Update the button text based on comparison state
  const compareButtonText = isCompared ? 'Clear' : 'Compare Files'

  const handleOpenModal = (type: 'about' | 'howto' | 'bug') => {
    setModalType(type)
    setModalOpen(true)
  }

  return (
    <>
      <Analytics />
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          top: 40,
          right: 40,
        }}
        toastOptions={{
          // Default options for all toasts
          className: '',
          duration: 6000,
          style: {
            background: 'var(--secondary-bg)',
            color: 'var(--text-color)',
            border: '1px solid var(--border-color)',
            padding: '20px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
          // Specific options by type
          success: {
            duration: 10000,
            iconTheme: {
              primary: 'var(--success-color, #4caf50)',
              secondary: 'white',
            },
          },
          error: {
            duration: 10000,
            iconTheme: {
              primary: 'var(--error-color, #f44336)',
              secondary: 'white',
            },
          },
          loading: {
            duration: 3000,
            iconTheme: {
              primary: 'var(--text-accent-color)',
              secondary: 'var(--secondary-bg)',
            },
          },
        }}
      />
      <div className={`app-container ${isFullWidth ? 'full-width' : ''}`}>
        {windowWidth < MIN_SCREEN_WIDTH ? (
          <div className="screen-size-warning bordered">
            <div className="app-title">
              <GitDiff size={40} weight="bold" /> reaperdiff.app
              <p>Diff-style .RPP Comparison and sanity checker</p>
            </div>
            <l-newtons-cradle
              size="100"
              speed="1.4" 
              color="var(--text-color)" 
            ></l-newtons-cradle>
            <p>ReaperDiff is designed for displays with<br /><b>1080px or greater width.</b></p>
            <p className="current-width">Your current display width: {windowWidth}px</p>
          </div>
        ) : (
          <>
            <div className="top-banner">
              <div className="banner-left bordered">
                <div className="app-title">
                  <GitDiff size={40} weight="bold" /> reaperdiff.app
                  <p>Diff-style .RPP Comparison and sanity checker</p>
                </div>
                <div className="header-links">
                  <button 
                    className="header-link" 
                    onClick={() => handleOpenModal('about')}
                  >
                    <Info size={40} weight="fill" />
                  </button>
                  <button 
                    className="header-link" 
                    onClick={() => handleOpenModal('howto')}
                  >
                    <Question size={40} weight="fill" />
                  </button>
                  <button 
                    className="header-link" 
                    onClick={() => handleOpenModal('bug')}
                  >
                    <Warning size={40} weight="fill" />
                  </button>
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
                    }}
                  />
                )}
              </div>
            </div>
            
            <div className="main-content">
              <div className="container bordered">
                <div className={`controls-wrapper ${isControlsCollapsed ? 'collapsed' : ''}`}>
                  {process.env.NODE_ENV === 'development' && (
                    <div style={{ display: 'none' }}>
                      Controls collapsed: {String(isControlsCollapsed)}
                    </div>
                  )}
                  {testMode && (
                    <div className="test-mode-indicator">
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
                    <div className="dropzone-container">
                      <div 
                        className={`dropzone ${controlFile ? 'has-file' : ''} ${
                          testMode || isCompared ? 'disabled' : ''
                        }`} 
                        {...getControlRootProps({ disabled: testMode || isCompared })}
                      >
                        <input {...getControlInputProps()} />
                        {controlFile ? (
                          <div className="dropzone-content">
                            <h2>Original</h2>
                            <p><span className="file-type">{controlFile.name}</span></p>
                          </div>
                        ) : (
                          <div className="dropzone-content">
                            <h2>Original</h2>
                            <p>{isControlDragActive ? 'Drop file here' : 'Drag & drop or click to select'}</p>
                          </div>
                        )}
                      </div>

                      <div 
                        className={`dropzone ${revisedFile ? 'has-file' : ''} ${
                          testMode || isCompared ? 'disabled' : ''
                        }`} 
                        {...getRevisedRootProps({ disabled: testMode || isCompared })}
                      >
                        <input {...getRevisedInputProps()} />
                        {revisedFile ? (
                          <div className="dropzone-content">
                            <h2>Revised</h2>
                            <p><span className="file-type">{revisedFile.name}</span></p>
                          </div>
                        ) : (
                          <div className="dropzone-content">
                            <h2>Revised</h2>
                            <p>{isRevisedDragActive ? 'Drop file here' : 'Drag & drop or click to select'}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="button-container">
                    <div className="compare-button-container">
                      <button 
                        onClick={compareFiles}
                        disabled={isLoading || (!testMode && (!controlFile || !revisedFile))}
                        className={`compare-button ${
                          isCompared ? 'clear-button' : 
                          testMode ? (selectedDatasetId ? 'ready' : '') :
                          (controlFile && revisedFile) ? 'ready' :
                          (controlFile || revisedFile) ? 'partial' : ''
                        }`}
                      >
                        {isLoading ? (
                          <div className="loader-container">
                            <div className="loader"></div>
                          </div>
                        ) : compareButtonText}
                      </button>
                    </div>
                  </div>
                </div>

                {!isCompared && (
                  <div className="features-container">
                    <div className="feature-box large-feature">
                      <h3>Fast and Simple</h3>
                      <p>Get a sanity check on your project files in seconds, and avoid time-consuming audible review.</p>
                    </div>
                    <div className="feature-box">
                      <h3>Smart Detection</h3>
                      <p>ReaperDiff analyzes 5 metadata tags on every clip, running 6 algorithms on each uploaded project file:</p>
                      <ul>
                        <li>Clip fingerprinting</li>
                        <li>Position shifts</li>
                        <li>Length or offset changes</li>
                        <li>Clip splits</li>
                        <li>Overlaps and silence gaps</li>
                      </ul>
                    </div>
                    <div className="feature-box large-feature">
                      <h3>Privacy First</h3>
                      <p>Uploaded project files are never stored or cached, and only the minimum clip data necessary is used for analysis.</p>
                      <p></p>
                    </div>
                  </div>
                )}

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
                            controlClips={controlClips}
                            width={containerWidth}
                            height={300}
                            changes={changes}
                            hoveredPosition={hoveredPosition}
                            overlappingClips={overlappingClips}
                            onHover={(position) => {
                              const change = changes.find(c => c.revisedPosition === position)
                              handleClipHover(position, change, false)
                            }}
                            showTooltip={false}
                            onDownloadCSV={downloadCSV}
                            revisedFileName={revisedFile?.name}
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

            <div className="app-footer">
              <p>Mischief managed by <a href="https://github.com/mcarlssen" target="_blank">Magnus Carlssen</a>. Iconography by <a href="https://phosphoricons.com" target="_blank">PhosphorIcons</a>. Background by <a href="https://www.danield.design/" target="_blank">Photo Gradient/Daniel D.</a>. Loaders by <a href="https://uiball.com/ldrs/" target="_blank">Griffin Johnston</a>.</p>
            </div>
          </>
        )}
      </div>
      <InfoModal 
        open={modalOpen} 
        onClose={() => {
          setModalOpen(false)
          setModalType(null)
        }} 
        type={modalType}
        onTypeChange={(newType) => setModalType(newType)}
      />
    </>
  );
}